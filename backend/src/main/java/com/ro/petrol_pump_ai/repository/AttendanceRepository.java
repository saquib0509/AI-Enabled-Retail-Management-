package com.ro.petrol_pump_ai.repository;

import com.ro.petrol_pump_ai.entity.Attendance;
import com.ro.petrol_pump_ai.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    
    Optional<Attendance> findByEmployeeAndAttendanceDate(Employee employee, LocalDate date);
    
    List<Attendance> findByEmployeeAndAttendanceDateBetween(Employee employee, LocalDate startDate, LocalDate endDate);
    
    List<Attendance> findByAttendanceDate(LocalDate date);
}
