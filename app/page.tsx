"use client";

export const dynamic = "force-dynamic";

import HeroSlider from "@/components/HeroSlider";
import Bestsellers from "@/components/Bestsellers";
import NewArrivals from "@/components/NewArrivals";
import BrandStory from "@/components/BrandStory";
import Newsletter from "@/components/Newsletter";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function HomeContent() {
  const searchParams = useSearchParams();
  const rawTab = (searchParams.get("tab") || searchParams.get("category") || searchParams.get("gender"))?.toLowerCase();
  const isAccessories = rawTab === "accessories";

  return (
    <>
      {/* Show the shoes hero for Men/Women. Unmounted when Accessories tab is active so only one hero is mounted and animations don't conflict */}
      {!isAccessories && <HeroSlider />}
      <Bestsellers />
      {!isAccessories && <NewArrivals />}
      <BrandStory />
      <Newsletter />
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
