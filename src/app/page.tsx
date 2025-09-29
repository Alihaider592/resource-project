"use client"
import Slider from "@/components/slider"
import CardsGrid from "@/components/placeCards/displayCards/display"
import Multicards from "@/components/malitiCards"
import Source from "@/components/sourceImg"
import Features from "@/components/features"
import Hero from "@/components/hero"
import Technology from "@/components/technologyCard"
export default function Home() {
  return( 
  <div>
 <Hero/>
 <Slider/>
 <div className="m-20 rounded-2xl bg-gray-100">
 <Technology/>
 <Features/>
 <Source />
 <Multicards/>a
 <CardsGrid/>


 </div>
    </div>
       )
}
