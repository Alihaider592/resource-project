"use client"
import Slider from "@/components/slider"
import Cando from "@/components/cando"
import CardsGrid from "@/components/placeCards/displayCards/display"
import Multicards from "@/components/malitiCards"
import Source from "@/components/sourceImg"
import Features from "@/components/features"
import Hero from "@/components/hero"
import Technology from "@/components/technologyCard"
// import Crds from "@/components/widthCards/widthMap/map"
import Sessions from "@/components/widthCards/widthMap/map"
// import {Map}
export default function Home() {
  return( 
  <div>
 <Hero/>
 <Slider/>
 <div className=" rounded-2xl bg-gray-100 flex flex-col justify-center items-center m-20">
 <Technology/>
 <Features/>
 <Source />
 <Multicards/>
 <CardsGrid/>
 <Cando/>
 <Sessions/>
 </div>
    </div>
       )
}
