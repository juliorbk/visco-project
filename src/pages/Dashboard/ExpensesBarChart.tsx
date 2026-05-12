import { useRef, useEffect } from "react";
import ApexCharts from "apexcharts";
import type { MonthlyExpense } from "./metricsData";

interface Props {
  data: MonthlyExpense[];
}

export default function ExpensesBarChart({ data }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ApexCharts | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (chartRef.current) chartRef.current.destroy();

    const categories = data.map((d) => d.month);
    const real = data.map((d) => d.real);
    const projected = data.map((d) => d.projected);

    const options: ApexCharts.ApexOptions = {
      chart: {
        type: "bar",
        stacked: false,
        toolbar: { show: false },
        fontFamily: "Inter, system-ui, sans-serif",
      },
      colors: ["#7B1A1A", "#FCA5A5"],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          borderRadius: 4,
          borderRadiusApplication: "end",
        },
      },
      dataLabels: { enabled: false },
      grid: {
        borderColor: "#F3F4F6",
        strokeDashArray: 3,
        yaxis: { lines: { show: true } },
      },
      xaxis: {
        categories,
        labels: {
          style: { colors: "#9CA3AF", fontSize: "12px", fontWeight: 500 },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        min: 0,
        max: 300000,
        tickAmount: 5,
        labels: {
          style: { colors: "#9CA3AF", fontSize: "12px" },
          formatter: (v: number) => `$${(v / 1000).toFixed(0)}k`,
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        fontSize: "13px",
        fontWeight: 600,
        markers: { size: 6, strokeWidth: 0, shape: "square" },
        itemMargin: { horizontal: 16 },
      },
      tooltip: {
        y: {
          formatter: (v: number) => `$${v.toLocaleString("en-US")}`,
        },
      },
      series: [
        { name: "Real", data: real },
        { name: "Proyectado", data: projected },
      ],
    };

    chartRef.current = new ApexCharts(ref.current, options);
    chartRef.current.render();

    return () => {
      chartRef.current?.destroy();
    };
  }, [data]);

  return <div ref={ref} />;
}
