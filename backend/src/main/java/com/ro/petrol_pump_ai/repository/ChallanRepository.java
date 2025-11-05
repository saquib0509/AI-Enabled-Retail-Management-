package com.ro.petrol_pump_ai.repository;

import com.ro.petrol_pump_ai.entity.Challan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChallanRepository extends JpaRepository<Challan, Long> {
}
