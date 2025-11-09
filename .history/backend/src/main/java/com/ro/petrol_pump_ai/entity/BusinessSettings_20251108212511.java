package com.ro.petrol_pump_ai.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "business_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BusinessSettings {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String companyName;
    
    @Column(nullable = false)
    private String ownerName;
    
    @Column(nullable = false)
    private String businessAddress;
    
    @Column(nullable = false)
    private String gstNumber;
    
    @Column(nullable = false)
    private String emailAddress;
    
    @Column(name = "daily_email_enabled")
    private Boolean dailyEmailEnabled = true;
    
    @Column(name = "email_schedule_time")
    private String emailScheduleTime = "18:00"; // 6 PM default
    
    private String phoneNumber;
    
    private String supportEmail;
    
    private LocalDateTime createdAt;
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
