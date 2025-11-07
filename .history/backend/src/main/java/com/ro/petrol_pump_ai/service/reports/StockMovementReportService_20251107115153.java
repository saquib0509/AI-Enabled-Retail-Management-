package com.ro.petrol_pump_ai.service.reports;

import com.ro.petrol_pump_ai.entity.DailyEntry;
import com.ro.petrol_pump_ai.repository.DailyEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class StockMovementReportService {

    @Autowired
    private DailyEntryRepository dailyEntryRepository;

    public Map<String, Object> generateStockMovementReport(LocalDate startDate, LocalDate endDate) {
        List<DailyEntry> entries = dailyEntryRepository.findByEntryDateBetween(startDate, endDate);

        Map<String, Object> report = new HashMap<>();

        List<Map<String, Object>> stockData = entries.stream().map(e -> {
            Map<String, Object> day = new HashMap<>();
            day.put("date", e.getEntryDate());
            day.put("openingStock", e.getOpeningStock());
            day.put("closingStock", e.getClosingStock());
            day.put("consumption", e.getOpeningStock() - e.getClosingStock());
            return day;
        }).collect(Collectors.toList());

        report.put("stockData", stockData);

        double avgConsumption = entries.stream()
            .mapToDouble(e -> (e.getOpeningStock() != null && e.getClosingStock() != null)
                ? (e.getOpeningStock() - e.getClosingStock())
                : 0)
            .average().orElse(0);
        report.put("avgDailyConsumption", avgConsumption);

        Optional<DailyEntry> lastEntry = entries.stream()
            .max(Comparator.comparing(DailyEntry::getEntryDate));

        if (lastEntry.isPresent() && avgConsumption > 0) {
            double daysUntilEmpty = lastEntry.get().getClosingStock() / avgConsumption;
            report.put("estimatedDaysUntilStockEmpty", daysUntilEmpty);
            report.put("aiAlert", daysUntilEmpty < 5
                ? "⚠️ REORDER IMMEDIATELY - Stock will finish in " + (int) daysUntilEmpty + " days"
                : "✓ Stock level optimal");
        }

        return report;
    }
}
