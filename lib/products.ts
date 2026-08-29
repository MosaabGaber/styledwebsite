export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  colors: { name: string; hex: string }[];
  sizes: number[];
  isNewArrival?: boolean;
  isBestseller?: boolean;
  soldOut?: boolean;
}

export const products: Product[] = [
  {
    id: "golden-goose",
    name: "Golden Goose",
    description: "Handcrafted vintage-inspired low-top sneakers featuring the iconic star patch, distressed details, and premium leather lining.",
    price: 3500,
    images: [
      "/golden1.png",
      "/golden2.png",
    ],
    colors: [
      { name: "Silver/White", hex: "#E5E7EB" }
    ],
    sizes: [38, 39, 40, 41, 42, 43, 44, 45, 46],
    isBestseller: true,
    soldOut: true,
  },
  {
    id: "puma-speedcat-ballet-red",
    name: "Puma Speedcat Ballet - Red",
    description: "A chic, feminine silhouette inspired by motorsport heritage, featuring sleek premium leather and classic low-profile racing outsole.",
    price: 2200,
    images: [
      "/puma1.png",
      "/puma2.png",
      "/puma3.png",
    ],
    colors: [
      { name: "Red", hex: "#EF4444" }
    ],
    sizes: [38, 39, 40, 41, 42, 43, 44, 45, 46],
    isBestseller: true,
    soldOut: false,
  },
  {
    id: "puma-speedcat-ballet-black",
    name: "Puma Speedcat Ballet - Black",
    description: "Sleek and low-profile motorsport-inspired design with a ballet-style cross strap, offering lightweight comfort and a minimal aesthetic.",
    price: 2200,
    images: [
      "/puma2_1.png",
      "/puma2_2.png",
      "/puma2_3.png",
    ],
    colors: [
      { name: "Black", hex: "#000000" }
    ],
    sizes: [38, 39, 40, 41, 42, 43, 44, 45, 46],
    isBestseller: true,
    soldOut: false,
  },
  {
    id: "new-balance-530",
    name: "New Balance 530",
    description: "Retro-inspired running shoe with ABZORB cushioning technology, synthetic/mesh upper, and a classic 2000s tech aesthetics.",
    price: 2000,
    images: [
      "/new1.png",
      "/new2.png",
      "/new3.png",
      "/new4.png",
      "/new5.png",
      "/new6.png",
    ],
    colors: [
      { name: "White/Silver", hex: "#E5E7EB" }
    ],
    sizes: [38, 39, 40, 41, 42, 43, 44, 45, 46],
    isBestseller: true,
    soldOut: true,
  },
  {
    id: "boston-birkenstock-clogs-taupe",
    name: "Boston Birkenstock Clogs - Taupe",
    description: "Classic slip-on clogs featuring premium suede, contoured cork-latex footbed, and adjustable strap for the perfect customized fit.",
    price: 2200,
    images: [
      "/birken1.png",
      "/birken2.png",
      "/birken3.png",
      "/birken4.png",
      "/birken5.png",
      "/birken6.png",
    ],
    colors: [
      { name: "Taupe", hex: "#C2B4A4" }
    ],
    sizes: [38, 39, 40, 41, 42, 43, 44, 45, 46],
    isBestseller: true,
  },
  {
    id: "sneaker-01",
    name: "Styled Classic",
    description: "The classic silhouette that started it all. Premium leather upper, minimal branding, and a durable rubber outsole for everyday comfort.",
    price: 120,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2370&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=2312&auto=format&fit=crop"
    ],
    colors: [
      { name: "Forest Green", hex: "#1B3B2F" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Black", hex: "#000000" }
    ],
    sizes: [38, 39, 40, 41, 42, 43, 44, 45, 46],
    isBestseller: true,
  },
  {
    id: "sneaker-02",
    name: "Styled Runner X",
    description: "Designed for motion. Lightweight mesh upper, responsive cushioning, and a sleek profile for those always on the go.",
    price: 145,
    images: [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=2274&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1605340537584-f6fb18a1a367?q=80&w=2400&auto=format&fit=crop"
    ],
    colors: [
      { name: "White/Green", hex: "#f0fdf4" },
      { name: "Grey", hex: "#9ca3af" }
    ],
    sizes: [39, 40, 41, 42, 43, 44],
    isNewArrival: true,
    isBestseller: true,
  },
  {
    id: "sneaker-03",
    name: "Elevate High-Top",
    description: "Take it to the next level. Premium suede and canvas combination with a padded collar for maximum comfort.",
    price: 160,
    images: [
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=2276&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520256862855-398228c41684?q=80&w=2369&auto=format&fit=crop"
    ],
    colors: [
      { name: "Tan", hex: "#d2b48c" },
      { name: "Black", hex: "#000000" }
    ],
    sizes: [40, 41, 42, 43, 44, 45, 46],
    isBestseller: true,
  },
  {
    id: "sneaker-04",
    name: "Eco Trainer",
    description: "Sustainable style. Made with recycled materials, this trainer offers breathability and a low carbon footprint.",
    price: 110,
    images: [
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=2371&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=2360&auto=format&fit=crop"
    ],
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Olive", hex: "#556b2f" }
    ],
    sizes: [38, 39, 40, 41, 42, 43, 44],
    isNewArrival: true,
  }
];
