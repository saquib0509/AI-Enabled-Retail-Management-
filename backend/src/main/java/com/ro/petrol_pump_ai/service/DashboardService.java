package com.ro.petrol_pump_ai.service;

import com.ro.petrol_pump_ai.entity.DailyEntry;
import com.ro.petrol_pump_ai.dto.DashboardResponse;
import com.ro.petrol_pump_ai.dto.DashboardResponse.StockCard;
import com.ro.petrol_pump_ai.repository.DailyEntryRepository;
import com.ro.petrol_pump_ai.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class DashboardService {

    @Autowired
    private DailyEntryRepository dailyEntryRepository;

    @Autowired
    private ProductRepository productRepository;

    public DashboardResponse getDashboardData() {
        DashboardResponse response = new DashboardResponse();

        List<DailyEntry> todayEntries = dailyEntryRepository.findByEntryDate(LocalDate.now());
        List<StockCard> stockCards = new ArrayList<>();
        Double totalRevenue = 0.0;

        for (DailyEntry entry : todayEntries) {
            stockCards.add(new StockCard(
                entry.getProduct().getName(),
                entry.getClosingStock(),
                entry.getProduct().getUnit(),
                entry.getDailyRevenue() != null ? entry.getDailyRevenue() : 0.0
            ));
            totalRevenue += entry.getDailyRevenue() != null ? entry.getDailyRevenue() : 0.0;
        }

        response.setStockCards(stockCards);
        response.setTotalRevenue(totalRevenue);
        response.setTodayEntryCount(todayEntries.size());

        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(7);
        List<DailyEntry> last7DaysEntries = dailyEntryRepository.findByEntryDateBetweenOrderByEntryDateDesc(startDate, endDate);

        Map<LocalDate, Double> dailySalesMap = new LinkedHashMap<>();
        for (int i = 6; i >= 0; i--) {
            dailySalesMap.put(endDate.minusDays(i), 0.0);
        }

        for (DailyEntry entry : last7DaysEntries) {
            Double currentRevenue = dailySalesMap.getOrDefault(entry.getEntryDate(), 0.0);
            dailySalesMap.put(entry.getEntryDate(),
                currentRevenue + (entry.getDailyRevenue() != null ? entry.getDailyRevenue() : 0.0));
        }

        response.setLast7DaysSalesData(dailySalesMap);

        return response;
    }
}
