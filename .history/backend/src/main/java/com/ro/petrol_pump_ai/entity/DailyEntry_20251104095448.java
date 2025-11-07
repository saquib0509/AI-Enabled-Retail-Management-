package com.ro.petrol_pump_ai.entity;

import lombok.*;
import jakarta.persistence.*;
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
    
    @Column(nullable = false)
    private LocalDate entryDate;
    
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    
    @Column(nullable = false)
    private Double openingStock;  // in Lts or Kg
    
    @Column(nullable = false)
    private Double salesToday;  // in Lts or Kg
    
    @Column(name = "under_tank_delivery")
    private Double underTankDelivery;  // in Lts or Kg, optional
    
    @Column(nullable = false)
    private Double closingStock;  // Auto-calculated
    
    @Column(nullable = false)
    private Double pricePerUnit;  // Price per Liter/Kg
    
    @Column(name = "daily_revenue")
    private Double dailyRevenue;  // Auto-calculated: salesToday * pricePerUnit
    
    private Double temperature;  // Optional, in Celsius
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        calculateClosingStock();
        calculateRevenue();
    }
    
    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
        calculateClosingStock();
        calculateRevenue();
    }
    
    public void calculateClosingStock() {
        this.closingStock = this.openingStock - this.salesToday 
            + (this.underTankDelivery != null ? this.underTankDelivery : 0);
    }
    
    public void calculateRevenue() {
        this.dailyRevenue = this.salesToday * this.pricePerUnit;
    }
}
