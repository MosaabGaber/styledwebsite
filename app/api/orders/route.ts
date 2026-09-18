import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { products } from "@/lib/products";

// Initialize Supabase client with no-cache fetch
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  global: {
    fetch: (url, options) => fetch(url, { ...options, cache: "no-store" }),
  },
});

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      email,
      phone,
      address,
      city,
      productName,
      productId: bodyProductId,
      size,
      color,
      price,
      paymentMethod,
    } = await request.json();

    // Basic validation
    if (!name || !email || !phone || !address || !city || !productName || !size || !color || !price || !paymentMethod) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    let bostaTrackingNumber: string | null = null;

    // 1. If payment method is COD, push order to Bosta
    if (paymentMethod === "COD") {
      const bostaApiKey = process.env.BOSTA_API_KEY;
      if (!bostaApiKey) {
        console.error("Bosta API Key is missing in environment variables.");
      } else {
        // Map city to Bosta cityId and set a default district
        let cityId = "FceDyHXwpSYYF9zGW"; // Default to Cairo
        let districtName = "Maadi";

        if (city === "Giza") {
          cityId = "0064Qb0OgcA";
          districtName = "Dokki";
        } else if (city === "Alexandria") {
          cityId = "Jrb6X6ucjiYgMP4T7";
          districtName = "Sidi Gaber";
        }

        const nameParts = name.trim().split(/\s+/);
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || ".";

        const bostaPayload = {
          type: 10, // Delivery
          cod: Number(price),
          receiver: {
            firstName,
            lastName,
            phone,
          },
          dropOffAddress: {
            cityId,
            districtName,
            firstLine: address,
          },
          specs: {
            packageDetails: {
              itemsCount: 1,
              description: `${productName} - Size ${size} - Color ${color}`,
            },
          },
        };

        try {
          const bostaResponse = await fetch("https://app.bosta.co/api/v2/deliveries?apiVersion=1", {
            method: "POST",
            headers: {
              "Authorization": bostaApiKey,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(bostaPayload),
          });

          if (!bostaResponse.ok) {
            const errorText = await bostaResponse.text();
            console.error(`Bosta API returned status ${bostaResponse.status}:`, errorText);
          } else {
            const bostaData = await bostaResponse.json();
            bostaTrackingNumber = bostaData.data?.trackingNumber || bostaData.trackingNumber || null;
            console.log("Successfully pushed to Bosta. Tracking #:", bostaTrackingNumber);
          }
        } catch (bostaErr) {
          console.error("Failed to push to Bosta:", bostaErr);
        }
      }
    }

    // 2. Store order in Supabase
    let supabaseErrorOccurred = false;
    try {
      const { error } = await supabase.from("orders").insert([
        {
          customer_name: name,
          customer_email: email,
          phone,
          address,
          city,
          product_name: productName,
          size,
          color,
          price: Number(price),
          payment_method: paymentMethod,
          bosta_tracking_number: bostaTrackingNumber,
        },
      ]);

      if (error) {
        console.error("Supabase insertion error:", error);
        supabaseErrorOccurred = true;
      } else {
        console.log("Successfully inserted order into Supabase.");

        // Automatically decrement stock by 1 for product/size combination after order is saved
        const targetProductId = bodyProductId || products.find((p) => p.name === productName)?.id;
        if (targetProductId && size) {
          const numSize = Number(size);
          try {
            // Attempt atomic RPC call first
            const { error: rpcError } = await supabase.rpc("decrement_stock", {
              p_product_id: targetProductId,
              p_size: numSize,
            });

            if (rpcError) {
              // Fallback to direct query & update if RPC function does not exist
              const { data: inventoryItem } = await supabase
                .from("inventory")
                .select("stock")
                .eq("product_id", targetProductId)
                .eq("size", numSize)
                .maybeSingle();

              if (inventoryItem) {
                const updatedStock = Math.max(0, inventoryItem.stock - 1);
                await supabase
                  .from("inventory")
                  .update({ stock: updatedStock })
                  .eq("product_id", targetProductId)
                  .eq("size", numSize);
                console.log(`Decremented stock for ${targetProductId} size ${numSize} to ${updatedStock}`);
              }
            } else {
              console.log(`Successfully decremented stock via RPC for ${targetProductId} size ${numSize}`);
            }
          } catch (stockErr) {
            console.error("Error decrementing inventory stock:", stockErr);
          }
        }
      }
    } catch (supabaseErr) {
      console.error("Failed to store order in Supabase:", supabaseErr);
      supabaseErrorOccurred = true;
    }

    // 3. Send email notification via Resend
    const notificationEmail = process.env.NOTIFICATION_EMAIL;
    if (process.env.RESEND_API_KEY && notificationEmail) {
      try {
        const htmlContent = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
            <h2 style="color: #059669; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px; margin-top: 0;">New Order Confirmed</h2>
            <p style="color: #6b7280; font-size: 14px;"><strong>Order Timestamp:</strong> ${new Date().toLocaleString()}</p>
            
            <h3 style="color: #1f2937; border-bottom: 1px solid #f3f4f6; padding-bottom: 5px; margin-top: 25px;">Customer Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; color: #6b7280; width: 140px;">Customer Name:</td>
                <td style="padding: 6px 0; font-weight: bold; color: #111827;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #6b7280;">Phone Number:</td>
                <td style="padding: 6px 0; font-weight: bold; color: #111827;">${phone}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #6b7280;">City:</td>
                <td style="padding: 6px 0; font-weight: bold; color: #111827;">${city}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #6b7280;">Delivery Address:</td>
                <td style="padding: 6px 0; font-weight: bold; color: #111827;">${address}</td>
              </tr>
            </table>

            <h3 style="color: #1f2937; border-bottom: 1px solid #f3f4f6; padding-bottom: 5px; margin-top: 25px;">Product Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; color: #6b7280; width: 140px;">Product Name:</td>
                <td style="padding: 6px 0; font-weight: bold; color: #111827;">${productName}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #6b7280;">Color / Size:</td>
                <td style="padding: 6px 0; font-weight: bold; color: #111827;">${color} / ${size}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #6b7280;">Price:</td>
                <td style="padding: 6px 0; font-weight: bold; color: #111827;">${Number(price).toLocaleString()} EGP</td>
              </tr>
            </table>

            <h3 style="color: #1f2937; border-bottom: 1px solid #f3f4f6; padding-bottom: 5px; margin-top: 25px;">Payment & Shipment</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; color: #6b7280; width: 140px;">Payment Method:</td>
                <td style="padding: 6px 0; font-weight: bold; color: #111827;">${paymentMethod === "COD" ? "Cash on Delivery" : "InstaPay"}</td>
              </tr>
              ${
                bostaTrackingNumber
                  ? `
              <tr>
                <td style="padding: 6px 0; color: #6b7280;">Bosta Tracking AWB:</td>
                <td style="padding: 6px 0; font-weight: bold; color: #059669;">${bostaTrackingNumber}</td>
              </tr>
              `
                  : ""
              }
            </table>
          </div>
        `;

        await resend.emails.send({
          from: "orders@styledeg.com",
          to: notificationEmail,
          subject: `New Order Confirmed - ${name}`,
          html: htmlContent,
        });
        console.log("Successfully sent order notification email.");
      } catch (emailErr) {
        console.error("Failed to send email notification:", emailErr);
      }
    } else {
      console.warn("Resend API Key or Notification Email is missing in environment variables.");
    }

    // 4. Send customer order confirmation email (isolated in its own try/catch)
    if (process.env.RESEND_API_KEY && email) {
      try {
        let paymentNote = "";
        if (paymentMethod === "COD") {
          paymentNote = "<p>Your order will be shipped soon, and you will pay Cash on Delivery upon receiving your package.</p>";
        } else if (paymentMethod === "INSTAPAY") {
          paymentNote = `
            <p style="background-color: #fffbeb; border: 1px solid #fef3c7; padding: 12px; border-radius: 6px; color: #b45309;">
              <strong>Important Payment Step:</strong> Please complete your InstaPay transfer of <strong>${Number(price).toLocaleString()} EGP</strong> to our handle <strong>styled_store@instapay</strong> to confirm and process your order.
            </p>
          `;
        }

        let trackingNote = "";
        if (bostaTrackingNumber) {
          trackingNote = `
            <p>Your order has been registered with Bosta for shipping. Your tracking number is <strong style="color: #059669;">${bostaTrackingNumber}</strong>. You will receive updates on your delivery status.</p>
          `;
        }

        const customerHtmlContent = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
            <h2 style="color: #111827; margin-top: 0;">Thank you for your order with Styled!</h2>
            <p>Hi ${name},</p>
            <p>We've received your order and are getting it ready. Here is a summary of your order details:</p>
            
            <h3 style="color: #374151; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 25px;">Order Summary</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; color: #6b7280; width: 140px;">Product:</td>
                <td style="padding: 6px 0; font-weight: bold; color: #111827;">${productName}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #6b7280;">Color / Size:</td>
                <td style="padding: 6px 0; font-weight: bold; color: #111827;">${color} / ${size}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #6b7280;">Total Price:</td>
                <td style="padding: 6px 0; font-weight: bold; color: #111827;">${Number(price).toLocaleString()} EGP</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #6b7280;">Payment Method:</td>
                <td style="padding: 6px 0; font-weight: bold; color: #111827;">${paymentMethod === "COD" ? "Cash on Delivery" : "InstaPay"}</td>
              </tr>
            </table>

            <h3 style="color: #374151; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 25px;">Delivery Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; color: #6b7280; width: 140px;">City:</td>
                <td style="padding: 6px 0; font-weight: bold; color: #111827;">${city}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #6b7280;">Address:</td>
                <td style="padding: 6px 0; font-weight: bold; color: #111827;">${address}</td>
              </tr>
            </table>

            ${paymentNote}
            ${trackingNote}

            <p style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; font-size: 14px; color: #6b7280;">
              If you have any questions, feel free to reply directly to this email.
            </p>
          </div>
        `;

        await resend.emails.send({
          from: "orders@styledeg.com",
          to: email,
          subject: `Order Confirmation - Thank you for your order!`,
          html: customerHtmlContent,
        });
        console.log("Successfully sent customer confirmation email.");
      } catch (customerEmailErr) {
        console.error("Failed to send customer confirmation email:", customerEmailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Order processed successfully",
      bostaTrackingNumber,
    });
  } catch (error: any) {
    console.error("Error processing order in API route:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
