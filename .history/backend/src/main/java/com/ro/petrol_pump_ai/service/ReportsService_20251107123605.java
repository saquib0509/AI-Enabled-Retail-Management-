package com.ro.petrol_pump_ai.service;

import com.ro.petrol_pump_ai.service.reports.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.Map;

/**
 * ReportsService - Orchestrator/Facade Service
 * Delegates calls to individual report services
 * Each report has its own dedicated service class
 */
@Service
public class ReportsService {

    @Autowired
    private DailySalesReportService dailySalesReportService;

    @Autowired
    private MonthlyPerformanceReportService monthlyPerformanceReportService;

    @Autowired
    private StockMovementReportService stockMovementReportService;

    @Autowired
    private PriceTrendReportService priceTrendReportService;

    @Autowired
    private RevenueVsExpenseReportService revenueVsExpenseReportService;

    @Autowired
    private EmployeeAttendanceReportService employeeAttendanceReportService;

    @Autowired
    private PayrollReportService payrollReportService;

    // ========== DAILY SALES ==========
    /**
     * Get daily sales report for a date range
     * Shows: Total revenue, sales, avg price, daily trend, product breakdown, pie chart
     */
    public Map<String, Object> getDailySalesReport(LocalDate startDate, LocalDate endDate) {
        return dailySalesReportService.generateDailySalesReport(startDate, endDate);
    }

    // ========== MONTHLY PERFORMANCE ==========
    /**
     * Get monthly performance report
     * Shows: Current month vs previous month, growth %, best/worst day, AI prediction
     */
    public Map<String, Object> getMonthlyPerformanceReport(int year, int month) {
        return monthlyPerformanceReportService.generateMonthlyPerformanceReport(year, month);
    }

    // ========== STOCK MOVEMENT ==========
    /**
     * Get stock movement report
     * Shows: Opening/closing stock, consumption rate, days until empty, reorder alert
     */
    public Map<String, Object> getStockMovementReport(LocalDate startDate, LocalDate endDate) {
        return stockMovementReportService.generateStockMovementReport(startDate, endDate);
    }

    // ========== PRICE TREND ==========
    /**
     * Get price trend report
     * Shows: Average, max, min price, volatility, elasticity analysis
     */
    public Map<String, Object> getPriceTrendReport(LocalDate startDate, LocalDate endDate) {
        return priceTrendReportService.generatePriceTrendReport(startDate, endDate);
    }

    // ========== REVENUE VS EXPENSE ==========
    /**
     * Get revenue vs expense report
     * Shows: Total revenue, expenses, net profit, profit margin, financial insights
     */
    public Map<String, Object> getRevenueVsExpenseReport(LocalDate startDate, LocalDate endDate) {
        return revenueVsExpenseReportService.generateRevenueVsExpenseReport(startDate, endDate);
    }

    // ========== EMPLOYEE ATTENDANCE ==========
    /**
     * Get employee attendance report
     * Shows: Per-employee attendance %, present/absent/leave days, low attendance alerts
     */
    public Map<String, Object> getEmployeeAttendanceReport(LocalDate startDate, LocalDate endDate) {
        return employeeAttendanceReportService.generateEmployeeAttendanceReport(startDate, endDate);
    }

    // ========== PAYROLL ==========
    /**
     * Get payroll report
     * Shows: Total salary, pending payments, employee-wise salary breakdown
     */
    public Map<String, Object> getPayrollReport() {
        return payrollReportService.generatePayrollReport();
    }
}
