package com.ro.petrol_pump_ai.dto;

import lombok.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    
    private List<StockCard> stockCards;
    private Double totalRevenue;
    private Integer todayEntryCount;
    private Map<LocalDate, Double> last7DaysSalesData;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StockCard {
        private String productName;
        private Double currentStock;
        private String unit;
        private Double dailyRevenue;
    }
}
