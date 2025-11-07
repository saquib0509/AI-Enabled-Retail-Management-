package com.ro.petrol_pump_ai.controller;

import com.ro.petrol_pump_ai.service.reports.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(
    origins = "*",
    allowedHeaders = "*",
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS},
    maxAge = 3600
)
public class ReportsController {

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

    // Handle preflight requests
    @RequestMapping(method = RequestMethod.OPTIONS)
    public ResponseEntity<?> handleOptions() {
        return ResponseEntity.ok().build();
    }

    @GetMapping("/daily-sales")
    public ResponseEntity<?> getDailySalesReport(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            Map<String, Object> report = dailySalesReportService.generateDailySalesReport(startDate, endDate);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/monthly-performance")
    public ResponseEntity<?> getMonthlyPerformance(
        @RequestParam int year,
        @RequestParam int month) {
        try {
            Map<String, Object> report = monthlyPerformanceReportService.generateMonthlyPerformanceReport(year, month);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/stock-movement")
    public ResponseEntity<?> getStockMovement(
        @RequestParam @
