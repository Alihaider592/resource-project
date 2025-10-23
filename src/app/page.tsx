"use client";

import { Toaster } from "react-hot-toast";

import Hero from "@/app/(frontend)/components/hero";
import Slider from "@/app/(frontend)/components/slider";
import Technology from "@/app/(frontend)/components/technologyCard";
import Features from "@/app/(frontend)/components/features";
import Source from "@/app/(frontend)/components/sourceImg";
import Multicards from "@/app/(frontend)/components/malitiCards";
import CardsGrid from "@/app/(frontend)/components/placeCards/displayCards/display";
import Cando from "@/app/(frontend)/components/cando";
import Sessions from "@/app/(frontend)/components/widthCards/widthMap/map";
import Frame from "@/app/(frontend)/components/frame/iframe";
import Service from "@/app/(frontend)/components/hrmCards/hrmCards";
import Conection from "@/app/(frontend)/components/form/conection";

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
