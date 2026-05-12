import { useRef, useEffect } from "react";
import ApexCharts from "apexcharts";
import type { ExpenseCategory } from "./metricsData";

interface Props {
  data: ExpenseCategory[];
}

export default function ExpenseBreakdownDonut({ data }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ApexCharts | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (chartRef.current) chartRef.current.destroy();

    const labels = data.map((d) => d.label);
    const series = data.map((d) => d.percentage);
    const colors = data.map((d) => d.color);

    const options: ApexCharts.ApexOptions = {
      chart: {
        type: "donut",
        fontFamily: "Inter, system-ui, sans-serif",
      },
      colors,
      labels,
      plotOptions: {
        pie: {
          donut: {
            size: "72%",
            labels: {
              show: true,
              total: {
                show: true,
                showAlways: true,
                label: "100%",
                fontSize: "22px",
                fontWeight: 700,
                color: "#111827",
                formatter: () => "Total",
              },
            },
          },
        },
      },
      dataLabels: { enabled: false },
      legend: {
        position: "bottom",
        horizontalAlign: "center",
        fontSize: "13px",
        fontWeight: 500,
        markers: { size: 6, strokeWidth: 0, shape: "square" },
        itemMargin: { horizontal: 24, vertical: 6 },
        onItemClick: { toggleDataSeries: false },
        onItemHover: { highlightDataSeries: false },
        formatter: (_: string, opts: { w: { globals: { series: number[]; labels: string[] } }; seriesIndex: number }) =>
          `${opts.w.globals.labels[opts.seriesIndex]}: ${opts.w.globals.series[opts.seriesIndex]}%`,
      },
      stroke: { width: 0 },
      tooltip: { enabled: false },
      responsive: [
        {
          breakpoint: 640,
          options: {
            legend: { position: "bottom" },
          },
        },
      ],
      series,
    };

    chartRef.current = new ApexCharts(ref.current, options);
    chartRef.current.render();

    return () => {
      chartRef.current?.destroy();
    };
  }, [data]);

  return <div ref={ref} />;
}
