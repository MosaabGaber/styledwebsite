import HeroSlider from "@/components/HeroSlider";
import Bestsellers from "@/components/Bestsellers";
import NewArrivals from "@/components/NewArrivals";
import BrandStory from "@/components/BrandStory";
import Newsletter from "@/components/Newsletter";

export default function Home() {
  return (
    <>
      <HeroSlider />
      <Bestsellers />
      <NewArrivals />
      <BrandStory />
      <Newsletter />
    </>
  );
}
