import TeamLeadCard from "./teamleadcard";

export default function TeamLeadDashboardContent() {
  const stats = [
    { title: "My Projects", value: 5 },
    { title: "Active Team Members", value: 12 },
    { title: "Pending Tasks", value: 8 },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((s, i) => (
        <TeamLeadCard key={i} title={s.title} value={s.value} />
      ))}
    </div>
  );
}
