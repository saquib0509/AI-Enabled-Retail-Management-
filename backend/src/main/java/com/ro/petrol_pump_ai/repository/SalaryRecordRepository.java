package com.ro.petrol_pump_ai.repository;

import com.ro.petrol_pump_ai.entity.SalaryRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SalaryRecordRepository extends JpaRepository<SalaryRecord, Long> {
    Optional<SalaryRecord> findByEmployeeIdAndSalaryMonth(Long employeeId, String salaryMonth);
    List<SalaryRecord> findBySalaryMonth(String salaryMonth);
    List<SalaryRecord> findByEmployeeId(Long employeeId);
}
