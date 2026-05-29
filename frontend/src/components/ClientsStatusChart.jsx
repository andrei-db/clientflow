import Chart from "react-apexcharts";

export default function ClientsStatusChart({ stats }) {
  const options = {
    chart: {
      background: "transparent",
      toolbar: { show: false },
    },
    labels: ["Leads", "Contacted", "Clients"],
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
    stats.leads || 0,
    stats.contacted || 0,
    stats.activeClients || 0,
  ];

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <h3 className="text-xl font-semibold">Clients by status</h3>
      <p className="mt-1 text-sm text-neutral-500">
        Distribution of your CRM contacts.
      </p>

      <div className="mt-6">
        <Chart options={options} series={series} type="donut" height={280} />
      </div>
    </div>
  );
}