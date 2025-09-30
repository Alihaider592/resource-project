"use client"
import Slider from "@/components/slider"
import Cando from "@/components/cando"
import CardsGrid from "@/components/placeCards/displayCards/display"
import Multicards from "@/components/malitiCards"
import Source from "@/components/sourceImg"
import Features from "@/components/features"
import Hero from "@/components/hero"
import Technology from "@/components/technologyCard"
import Sessions from "@/components/widthCards/widthMap/map"
import Frame from "@/components/frame/iframe"
import Service from "@/components/hrmCards/hrmCards"
export default function Home() {
  return( 
  <div>
 <Hero/>
 <Slider/>
 <div className=" rounded-2xl flex flex-col justify-center items-center m-20">
 <Technology/>
 <Features/>
 <Source />
 <Multicards/>
 <CardsGrid/>
 <Cando/>
 <Sessions/>
 <Frame/>
 <Service/>
 </div>
    </div>
       )
}
