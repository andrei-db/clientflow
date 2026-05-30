import Chart from "react-apexcharts";

export default function InvoicesStatusChart({ stats }) {
  const options = {
    chart: {
      background: "transparent",
      toolbar: { show: false },
    },
    labels: ["Draft", "Sent", "Paid", "Overdue"],
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
    stats.draft || 0,
    stats.sent || 0,
    stats.paid || 0,
    stats.overdue || 0,
  ];

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <h3 className="text-xl font-semibold">Invoices by status</h3>
      <p className="mt-1 text-sm text-neutral-500">
        Billing overview by invoice stage.
      </p>

      <div className="mt-6">
        <Chart options={options} series={series} type="donut" height={280} />
      </div>
    </div>
  );
}