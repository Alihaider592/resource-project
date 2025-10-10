"use client";

import { Toaster } from "react-hot-toast";

import Hero from "@/app/(forntend)/components/hero";
import Slider from "@/app/(forntend)/components/slider";
import Technology from "@/app/(forntend)/components/technologyCard";
import Features from "@/app/(forntend)/components/features";
import Source from "@/app/(forntend)/components/sourceImg";
import Multicards from "@/app/(forntend)/components/malitiCards";
import CardsGrid from "@/app/(forntend)/components/placeCards/displayCards/display";
import Cando from "@/app/(forntend)/components/cando";
import Sessions from "@/app/(forntend)/components/widthCards/widthMap/map";
import Frame from "@/app/(forntend)/components/frame/iframe";
import Service from "@/app/(forntend)/components/hrmCards/hrmCards";
import Conection from "@/app/(forntend)/components/form/conection";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center relative">
      <Toaster position="top-right" reverseOrder={false} />
      <Hero />
      <Slider />
      <div className="w-full max-w-7xl rounded-2xl flex flex-col items-center justify-center gap-16 my-20 px-4">
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
