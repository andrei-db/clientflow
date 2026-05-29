import Chart from "react-apexcharts";

export default function ProjectsStatusChart({ stats }) {
  const options = {
    chart: {
      background: "transparent",
      toolbar: { show: false },
    },
    labels: ["Planned", "In Progress", "Completed"],
    legend: {
      labels: {
        colors: "#a3a3a3",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      colors: ["#111111"],
    },
  };

  const series = [
    stats.planned || 0,
    stats.inProgress || 0,
    stats.completed || 0,
  ];

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <h3 className="text-xl font-semibold">Projects by status</h3>
      <p className="mt-1 text-sm text-neutral-500">
        Current project pipeline overview.
      </p>

      <div className="mt-6">
        <Chart options={options} series={series} type="donut" height={280} />
      </div>
    </div>
  );
}