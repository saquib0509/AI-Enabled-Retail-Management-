package com.ro.petrol_pump_ai.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "daily_entries")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DailyEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "entry_date")
    private LocalDate entryDate;

    @Column(name = "opening_stock")
    private Double openingStock;

    @Column(name = "closing_stock")
    private Double closingStock;

    @Column(name = "sales_today")
    private Double salesToday;

    @Column(name = "daily_revenue")
    private Double dailyRevenue;

    @Column(name = "price_per_unit")
    private Double pricePerUnit;

    private Double temperature;

    @Column(name = "under_tank_delivery")
    private Double underTankDelivery;

    private String notes;

    @Column(name = "product_id")
    private Long productId;  // ← MAKE SURE THIS FIELD EXISTS!

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
