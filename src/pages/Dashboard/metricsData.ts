export interface MonthlyExpense {
  month: string;
  real: number;
  projected: number;
}

export interface ExpenseCategory {
  label: string;
  percentage: number;
  value: number;
  color: string;
}

export interface DashboardMetrics {
  monthlyExpenses: MonthlyExpense[];
  expenseBreakdown: ExpenseCategory[];
}

export const MOCK_METRICS: DashboardMetrics = {
  monthlyExpenses: [
    { month: "Jul", real: 180000, projected: 200000 },
    { month: "Ago", real: 220000, projected: 210000 },
    { month: "Sep", real: 190000, projected: 230000 },
    { month: "Oct", real: 250000, projected: 240000 },
    { month: "Nov", real: 210000, projected: 260000 },
    { month: "Dic", real: 270000, projected: 280000 },
  ],
  expenseBreakdown: [
    { label: "Componentes", percentage: 45, value: 135000, color: "#7B1A1A" },
    { label: "Equipos", percentage: 30, value: 90000, color: "#F87171" },
    { label: "Logística", percentage: 25, value: 75000, color: "#E5E7EB" },
  ],
};
