// src/app/(pages)/teamlead/components/TeamLeadCard.tsx
interface CardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode; // Optional icon
  color?: string; // Background color for icon
}

export default function TeamLeadCard({ title, value, icon, color }: CardProps) {
  return (
    <div className="p-6 bg-white shadow-lg rounded-2xl hover:shadow-xl transition-all border border-gray-100 flex items-center gap-4">
      {icon && (
        <div
          className={`p-3 rounded-lg flex items-center justify-center text-white ${
            color || "bg-teal-500"
          }`}
        >
          {icon}
        </div>
      )}
      <div>
        <h3 className="text-lg font-semibold text-teal-700">{title}</h3>
        <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
      </div>
    </div>
  );
}
