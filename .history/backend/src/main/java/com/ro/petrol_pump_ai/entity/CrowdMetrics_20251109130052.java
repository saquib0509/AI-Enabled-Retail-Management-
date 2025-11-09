package com.ro.petrol_pump_ai.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "crowd_metrics")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CrowdMetrics {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private LocalDateTime timestamp;
    
    @Column(nullable = false)
    private Integer crowdCount;  // Number of people detected
    
    @Column(nullable = false)
    private LocalTime timeSlot;  // Hour (00:00, 01:00, etc)
    
    @Column(nullable = true)
    private String crowdLevel;  // LOW, MEDIUM, HIGH, PEAK
    
    @Column(nullable = true)
    private Double confidence;  // Detection confidence
    
    @Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;
    
    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.timestamp == null) {
            this.timestamp = LocalDateTime.now();
        }
    }
}
