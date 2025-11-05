package com.ro.petrol_pump_ai.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "challans")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Challan {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private LocalDate date;
    
    @Column(nullable = false)
    private String fuelType;  // Petrol, Diesel, CNG
    
    @Column(nullable = false)
    private Double quantity;  // Liters
    
    @Column(nullable = false)
    private Double pricePerLiter;
    
    @Column(nullable = false)
    private Double totalAmount;
    
    @Column
    private String vendorName;
    
    @Column(unique = true, nullable = false)
    private String challanNumber;
    
    @Column(columnDefinition = "TEXT")
    private String remarks;  // Optional notes
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Automatically set timestamps
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
