
"use client";
import Structure from "../widthStructre/structure";
import { data } from "../widthData/widthCards";
export default function Sessions() {
  return (<div className=" justify-center pt-10 bg-white items-center">
    <div className="">
      {data.map((item) => (
        <Structure key={item.id} {...item} />
      ))}
    </div>
    </div>
  );
}
