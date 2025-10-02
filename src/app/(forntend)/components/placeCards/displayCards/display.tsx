
"use client";

import CardProps from "../cardsPlace/cards";
import { cardsData } from "../cardsdata/cardsData";

export default function CardsGrid() {
  return (<div className="flex flex-col justify-center gap-10 items-center">
        <h1 className="text-3xl font-bold">Everything You Need in One Place</h1>
        <p className="text-md text-gray-500">Pick & Choose module options as per your business needs. Every module complements each other and can work standalone too.</p>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
      {cardsData.map((card) => (
        <CardProps key={card.id} {...card} />
      ))}
    </div>
    </div>
  );
}
