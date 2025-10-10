// src/app/(pages)/teamlead/components/TeamLeadCard.tsx
interface CardProps {
  title: string;
  value: number | string;
}

export default function TeamLeadCard({ title, value }: CardProps) {
  return (
    <div className="p-6 bg-white shadow-lg rounded-2xl hover:shadow-xl transition-all border border-gray-100">
      <h3 className="text-lg font-semibold text-teal-700">{title}</h3>
      <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
    </div>
  );
}
