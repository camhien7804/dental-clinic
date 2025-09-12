// src/pages/Home.jsx
import HomeHero from "../sections/home/HomeHero";
import HomeIconRow from "../sections/home/HomeIconRow";
import HomeServiceGrid from "../sections/home/HomeServiceGrid";
import HomeFavServices from "../sections/home/HomeFavServices";
import HomeBrand from "../sections/home/HomeBrand";
import HomeDoctors from "../sections/home/HomeDoctors";
import HomeBeforeAfter from "../sections/home/HomeBeforeAfter";


export default function Home() {
  return (
    <div className="bg-white">
      <HomeHero />
      <HomeIconRow />
      <HomeServiceGrid />
      <HomeFavServices />
      <HomeBrand />
      <HomeDoctors />
      <HomeBeforeAfter />
      
    </div>
  );
}
