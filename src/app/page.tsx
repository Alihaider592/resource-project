"use client";
import Slider from "@/app/(forntend)/components/slider";
import Conection from "@/app/(forntend)/components/form/conection";
import Cando from "@/app/(forntend)/components/cando";
import CardsGrid from "@/app/(forntend)/components/placeCards/displayCards/display";
import Multicards from "@/app/(forntend)/components/malitiCards";
import Source from "@/app/(forntend)/components/sourceImg";
import Features from "@/app/(forntend)/components/features";
import Hero from "@/app/(forntend)/components/hero";
import Technology from "@/app/(forntend)/components/technologyCard";
import Sessions from "@/app/(forntend)/components/widthCards/widthMap/map";
import Frame from "@/app/(forntend)/components/frame/iframe";
import Service from "@/app/(forntend)/components/hrmCards/hrmCards";
export default function Home() {
  return (
    <div>
      <Hero />
      <Slider />
      <div className="rounded-2xl flex flex-col justify-center items-center m-20">
        <Technology />
        <Features />
        <Source />
        <Multicards />
        <CardsGrid />
        <Cando />
        <Sessions />
        <Frame />
        <Service />
      </div>
      <Conection />
    </div>
  );
}
