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
    
    @Column(nullable = true)
    private String fuelType;
    
    @Column(nullable = false)
    private Double quantity;
    
    @Column(nullable = false)
    private Double pricePerLiter;
    
    @Column(nullable = false)
    private Double totalAmount;
    
    @Column(nullable = false)
    private String vendorName;
    
    @Column(nullable = true)
    private String challanNumber;
    
    @Column(nullable = true, columnDefinition = "LONGTEXT")
    private String rawText;  // ADD THIS
    
    @Column(nullable = true)
    private Double confidence;  // ADD THIS
    
    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;
    
    @Column(columnDefinition = "TIMESTAMP")
    private LocalDateTime updatedAt;
    
    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
