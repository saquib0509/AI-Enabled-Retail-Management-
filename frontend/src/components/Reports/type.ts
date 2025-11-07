export interface DailyData {
    date: string;
    revenue: number;
    sales: number;
  }
  
  export interface StockData {
    date: string;
    openingStock: number;
    closingStock: number;
    consumption: number;
  }
  
  export interface PriceData {
    date: string;
    pricePerLiter: number;
    salesVolume: number;
  }
  
  export interface EmployeeAttendance {
    employeeName: string;
    presentDays: number;
    absentDays: number;
    leaveDays: number;
    attendancePercentage: number;
  }
  
  export interface ComparisonData {
    category: string;
    amount: number;
  }
  
  export interface DailySalesReport {
    totalRevenue: number;
    totalSales: number;
    avgPricePerLiter: number;
    transactionCount: number;
    dailyData: DailyData[];
    aiInsight: string;
  }
  
  export interface MonthlyReport {
    currentMonthRevenue: number;
    previousMonthRevenue: number;
    growthPercentage: number;
    bestDay: { entryDate: string; dailyRevenue: number };
    worstDay: { entryDate: string; dailyRevenue: number };
    aiPrediction: string;
  }
  
  export interface StockReport {
    stockData: StockData[];
    avgDailyConsumption: number;
    estimatedDaysUntilStockEmpty: number;
    aiAlert: string;
  }
  
  export interface PriceReport {
    priceData: PriceData[];
    avgPrice: number;
    maxPrice: number;
    minPrice: number;
    volatility: number;
    aiElasticityInsight: string;
  }
  
  export interface RevenueExpenseReport {
    totalRevenue: number;
    totalExpense: number;
    netProfit: number;
    profitMargin: number;
    comparisonData: ComparisonData[];
    aiInsight: string;
  }
  
  export interface AttendanceReport {
    employeeAttendanceData: EmployeeAttendance[];
    aiAlert: string;
  }
  
  export interface PayrollReport {
    totalSalary: number;
    pendingPayments: number;
    salaryData: Array<{
      employeeId: number;
      baseSalary: number;
      netSalary: number;
      status: string;
      paymentMethod: string;
    }>;
    aiAlert?: string;
  }
  