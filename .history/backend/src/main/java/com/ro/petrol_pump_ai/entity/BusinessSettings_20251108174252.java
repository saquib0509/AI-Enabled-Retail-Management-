package com.ro.petrol_pump_ai.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "business_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BusinessSettings {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
}

