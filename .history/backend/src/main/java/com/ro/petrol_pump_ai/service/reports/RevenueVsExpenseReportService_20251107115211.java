package com.ro.petrol_pump_ai.service.reports;

import com.ro.petrol_pump_ai.entity.DailyEntry;
import com.ro.petrol_pump_ai.entity.SalaryRecord;
import com.ro.petrol_pump_ai.repository.DailyEntryRepository;
import com.ro.petrol_pump_ai.repository.SalaryRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RevenueVsExpenseReportService {

    @Autowired
    private DailyEntryRepository dailyEntryRepository;

    @Autowired
    private SalaryRecordRepository salaryRecordRepository;

    public Map<String, Object> generateRevenueVsExpenseReport(LocalDate startDate, LocalDate endDate) {
        List<DailyEntry> dailyEntries = dailyEntryRepository.findByEntryDateBetween(startDate, endDate);
        List<SalaryRecord> salaryRecords = salaryRecordRepository.findAll();

        Map<String, Object> report = new HashMap<>();

        double totalRevenue = dailyEntries.stream()
            .mapToDouble(e -> e.getDailyRevenue() != null ? e.getDailyRevenue() : 0)
            .sum();
        double totalSalaryExpense = salaryRecords.stream()
            .mapToDouble(s -> s.getNetSalary() != null ? s.getNetSalary() : 0)
            .sum();

        double netProfit = totalRevenue - totalSalaryExpense;
        double profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

        report.put("totalRevenue", totalRevenue);
        report.put("totalExpense", totalSalaryExpense);
        report.put("netProfit", netProfit);
        report.put("profitMargin", profitMargin);

        List<Map<String, Object>> comparisonData = new ArrayList<>();
        Map<String, Object> revenueItem = new HashMap<>();
        revenueItem.put("category", "Revenue");
        revenueItem.put("amount", totalRevenue);
        comparisonData.add(revenueItem);

        Map<String, Object> expenseItem = new HashMap<>();
        expenseItem.put("category", "Salary Expense");
        expenseItem.put("amount", totalSalaryExpense);
        comparisonData.add(expenseItem);

        report.put("comparisonData", comparisonData);
        report.put("aiInsight", "Profit margin: " + String.format("%.2f", profitMargin) + "%. Net profit: ₹" + netProfit);

        return report;
    }
}
