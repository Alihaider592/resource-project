"use client";
export interface StructureProps {
  id: string;
  description:string;
  name:string;
}

export default function Cardstructure({
  description,
    name,
}: StructureProps) {

  return (
    <div>  
      <div className={`p-10 flex flex-col shadow-2xl gap-5 rounded-2xl `}>
        <p>{description}</p>
        <p className="text-xl font-bold">{name}</p>
      </div>
    </div>
  );
}
