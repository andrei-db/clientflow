import Chart from "react-apexcharts";

export default function RevenueChart({ clientRevenue, projectRevenue }) {
  const options = {
    chart: {
      background: "transparent",
      toolbar: { show: false },
    },
    xaxis: {
      categories: ["Client Pipeline", "Project Budget"],
      labels: {
        style: { colors: "#a3a3a3" },
      },
    },
    yaxis: {
      labels: {
        style: { colors: "#a3a3a3" },
      },
    },
    grid: {
      borderColor: "rgba(255,255,255,0.08)",
    },
    dataLabels: {
      enabled: false,
    },
  };

  const series = [
    {
      name: "Revenue",
      data: [clientRevenue || 0, projectRevenue || 0],
    },
  ];

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <h3 className="text-xl font-semibold">Revenue overview</h3>
      <p className="mt-1 text-sm text-neutral-500">
        Estimated value across clients and projects.
      </p>

      <div className="mt-6">
        <Chart options={options} series={series} type="bar" height={300} />
      </div>
    </div>
  );
}