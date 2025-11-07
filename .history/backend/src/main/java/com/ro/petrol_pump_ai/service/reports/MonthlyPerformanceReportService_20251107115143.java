package com.ro.petrol_pump_ai.service.reports;

import com.ro.petrol_pump_ai.entity.DailyEntry;
import com.ro.petrol_pump_ai.repository.DailyEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MonthlyPerformanceReportService {

    @Autowired
    private DailyEntryRepository dailyEntryRepository;

    public Map<String, Object> generateMonthlyPerformanceReport(int year, int month) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.plusMonths(1).minusDays(1);

        List<DailyEntry> currentMonthEntries = dailyEntryRepository.findByEntryDateBetween(startDate, endDate);

        LocalDate prevStart = startDate.minusMonths(1);
        LocalDate prevEnd = prevStart.plusMonths(1).minusDays(1);
        List<DailyEntry> prevMonthEntries = dailyEntryRepository.findByEntryDateBetween(prevStart, prevEnd);

        Map<String, Object> report = new HashMap<>();

        double currentMonthRevenue = currentMonthEntries.stream()
            .mapToDouble(e -> e.getDailyRevenue() != null ? e.getDailyRevenue() : 0)
            .sum();
        double prevMonthRevenue = prevMonthEntries.stream()
            .mapToDouble(e -> e.getDailyRevenue() != null ? e.getDailyRevenue() : 0)
            .sum();

        double growthPercentage = prevMonthRevenue > 0 
            ? ((currentMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100 
            : 0;

        report.put("currentMonthRevenue", currentMonthRevenue);
        report.put("previousMonthRevenue", prevMonthRevenue);
        report.put("growthPercentage", growthPercentage);

        Optional<DailyEntry> bestDay = currentMonthEntries.stream()
            .max(Comparator.comparing(e -> e.getDailyRevenue() != null ? e.getDailyRevenue() : 0));
        Optional<DailyEntry> worstDay = currentMonthEntries.stream()
            .min(Comparator.comparing(e -> e.getDailyRevenue() != null ? e.getDailyRevenue() : 0));

        report.put("bestDay", bestDay.orElse(null));
        report.put("worstDay", worstDay.orElse(null));

        String prediction = growthPercentage >= 0
            ? "Positive trend! Expected " + String.format("%.1f", growthPercentage) + "% growth next month."
            : "Sales declining. Consider promotional strategies.";
        report.put("aiPrediction", prediction);

        return report;
    }
}
