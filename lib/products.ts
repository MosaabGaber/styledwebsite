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
    isNewArrival: true,
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
    isNewArrival: true,
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
    id: "campus-00s-core-black",
    name: "Campus 00s Core Black",
    description: "Add product description here.",
    price: 2300,
    images: [
      "/campb1.png",
      "/campb2.png",
      "/campb3.png",
    ],
    colors: [
      { name: "Black", hex: "#000000" }
    ],
    sizes: [38, 39, 40, 41, 42, 43, 44, 45, 46],
    isBestseller: true,
    soldOut: true,
  },
  {
    id: "campus-00s-dark-green",
    name: "Campus 00s Dark Green",
    description: "Add product description here.",
    price: 2300,
    images: [
      "/campg1.png",
      "/campg2.png",
      "/campg3.png",
    ],
    colors: [
      { name: "Dark Green", hex: "#1B3B2F" }
    ],
    sizes: [38, 39, 40, 41, 42, 43, 44, 45, 46],
    isBestseller: true,
    soldOut: false,
  },
  {
    id: "arizona-birkenstock-taupe",
    name: "Arizona Birkenstock Taupe",
    description: "Add product description here.",
    price: 2500,
    images: [
      "/ariz1.png",
      "/ariz2.png",
      "/ariz3.png",
    ],
    colors: [
      { name: "Taupe", hex: "#C2B4A4" }
    ],
    sizes: [38, 39, 40, 41, 42, 43, 44, 45, 46],
    isBestseller: true,
    soldOut: true,
  },
  {
    id: "uggs-tazz-ii-chestnut",
    name: "UGGs Tazz II Chestnut",
    description: "Add product description here.",
    price: 4000,
    images: [
      "/tazz1.png",
      "/tazz2.png",
      "/tazz3.png",
    ],
    colors: [
      { name: "Chestnut", hex: "#954535" }
    ],
    sizes: [38, 39, 40, 41, 42, 43, 44, 45, 46],
    isBestseller: true,
    soldOut: true,
  },
  {
    id: "uggs-tazz-ii-portobello-pink",
    name: "UGGs Tazz II Portobello Pink",
    description: "Add product description here.",
    price: 4000,
    images: [
      "/tazzp1.png",
      "/tazzp2.png",
      "/tazzp3.png",
    ],
    colors: [
      { name: "Portobello Pink", hex: "#D8A7A0" }
    ],
    sizes: [38, 39, 40, 41, 42, 43, 44, 45, 46],
    isBestseller: true,
    soldOut: true,
  }
];
