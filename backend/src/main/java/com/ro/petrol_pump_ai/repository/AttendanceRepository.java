package com.ro.petrol_pump_ai.repository;

import com.ro.petrol_pump_ai.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    
    // Find attendance for a specific employee on a specific date
    Optional<Attendance> findByEmployeeIdAndAttendanceDate(Long employeeId, LocalDate attendanceDate);
    
    // Find all attendance for a specific date
    List<Attendance> findByAttendanceDate(LocalDate attendanceDate);
    
    // Find attendance for employee within date range
    List<Attendance> findByEmployeeIdAndAttendanceDateBetween(Long employeeId, LocalDate startDate, LocalDate endDate);
    
    // Find all attendance within date range
    List<Attendance> findByAttendanceDateBetween(LocalDate startDate, LocalDate endDate);
}
