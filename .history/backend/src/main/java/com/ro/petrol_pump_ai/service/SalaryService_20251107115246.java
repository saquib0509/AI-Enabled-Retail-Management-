package com.ro.petrol_pump_ai.service;

import com.ro.petrol_pump_ai.service.reports.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.Map;

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

    // Delegating calls to individual services
    public Map<String, Object> getDailySalesReport(LocalDate startDate, LocalDate endDate) {
        return dailySalesReportService.generateDailySalesReport(startDate, endDate);
    }

    public Map<String, Object> getMonthlyPerformanceReport(int year, int month) {
        return monthlyPerformanceReportService.generateMonthlyPerformanceReport(year, month);
    }

    public Map<String, Object> getStockMovementReport(LocalDate startDate, LocalDate endDate) {
        return stockMovementReportService.generateStockMovementReport(startDate, endDate);
    }

    public Map<String, Object> getPriceTrendReport(LocalDate startDate, LocalDate endDate) {
        return priceTrendReportService.generatePriceTrendReport(startDate, endDate);
    }

    public Map<String, Object> getRevenueVsExpenseReport(LocalDate startDate, LocalDate endDate) {
        return revenueVsExpenseReportService.generateRevenueVsExpenseReport(startDate, endDate);
    }

    public Map<String, Object> getEmployeeAttendanceReport(LocalDate startDate, LocalDate endDate) {
        return employeeAttendanceReportService.generateEmployeeAttendanceReport(startDate, endDate);
    }

    public Map<String, Object> getPayrollReport() {
        return payrollReportService.generatePayrollReport();
    }
}
