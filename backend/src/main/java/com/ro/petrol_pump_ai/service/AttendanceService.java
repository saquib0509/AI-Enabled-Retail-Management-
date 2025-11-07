package com.ro.petrol_pump_ai.service;

import com.ro.petrol_pump_ai.dto.AttendanceRequest;
import com.ro.petrol_pump_ai.dto.AttendanceResponse;
import com.ro.petrol_pump_ai.entity.Attendance;
import com.ro.petrol_pump_ai.entity.Employee;
import com.ro.petrol_pump_ai.repository.AttendanceRepository;
import com.ro.petrol_pump_ai.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AttendanceService {
    
    @Autowired
    private AttendanceRepository attendanceRepository;
    
    @Autowired
    private EmployeeRepository employeeRepository;
    
    // Mark/Create attendance
    public AttendanceResponse markAttendance(AttendanceRequest request) {
        // Check if employee exists
        Employee employee = employeeRepository.findById(request.getEmployeeId())
            .orElseThrow(() -> new RuntimeException("Employee not found"));
        
        // Check if attendance already exists for this date
        Attendance existing = attendanceRepository
            .findByEmployeeIdAndAttendanceDate(request.getEmployeeId(), request.getAttendanceDate())
            .orElse(null);
        
        // If exists, update it
        if (existing != null) {
            existing.setCheckInTime(request.getCheckInTime());
            existing.setCheckOutTime(request.getCheckOutTime());
            existing.setStatus(request.getStatus());
            existing.setNotes(request.getNotes());
            
            // Calculate duration if both check-in and check-out are present
            if (request.getCheckInTime() != null && request.getCheckOutTime() != null) {
                long minutes = ChronoUnit.MINUTES.between(request.getCheckInTime(), request.getCheckOutTime());
                existing.setDurationHours(minutes / 60.0);
            }
            
            attendanceRepository.save(existing);
            return convertToResponse(existing, employee.getName());
        }
        
        // Create new attendance
        Attendance attendance = new Attendance();
        attendance.setEmployeeId(request.getEmployeeId());
        attendance.setAttendanceDate(request.getAttendanceDate());
        attendance.setCheckInTime(request.getCheckInTime());
        attendance.setCheckOutTime(request.getCheckOutTime());
        attendance.setStatus(request.getStatus());
        attendance.setNotes(request.getNotes());
        
        // Calculate duration
        if (request.getCheckInTime() != null && request.getCheckOutTime() != null) {
            long minutes = ChronoUnit.MINUTES.between(request.getCheckInTime(), request.getCheckOutTime());
            attendance.setDurationHours(minutes / 60.0);
        }
        
        attendanceRepository.save(attendance);
        return convertToResponse(attendance, employee.getName());
    }
    
    // Get attendance for specific date
    public List<AttendanceResponse> getAttendanceByDate(LocalDate date) {
        List<Attendance> attendances = attendanceRepository.findByAttendanceDate(date);
        return attendances.stream()
            .map(att -> {
                Employee emp = employeeRepository.findById(att.getEmployeeId()).orElse(null);
                return convertToResponse(att, emp != null ? emp.getName() : "Unknown");
            })
            .collect(Collectors.toList());
    }
    
    // Get attendance for date range
    public List<AttendanceResponse> getAttendanceByDateRange(LocalDate startDate, LocalDate endDate) {
        List<Attendance> attendances = attendanceRepository.findByAttendanceDateBetween(startDate, endDate);
        return attendances.stream()
            .map(att -> {
                Employee emp = employeeRepository.findById(att.getEmployeeId()).orElse(null);
                return convertToResponse(att, emp != null ? emp.getName() : "Unknown");
            })
            .collect(Collectors.toList());
    }
    
    // Get employee attendance for date range
    public List<AttendanceResponse> getEmployeeAttendance(Long employeeId, LocalDate startDate, LocalDate endDate) {
        Employee employee = employeeRepository.findById(employeeId)
            .orElseThrow(() -> new RuntimeException("Employee not found"));
        
        List<Attendance> attendances = attendanceRepository
            .findByEmployeeIdAndAttendanceDateBetween(employeeId, startDate, endDate);
        
        return attendances.stream()
            .map(att -> convertToResponse(att, employee.getName()))
            .collect(Collectors.toList());
    }
    
    // Get attendance by ID
    public AttendanceResponse getAttendanceById(Long id) {
        Attendance attendance = attendanceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Attendance not found"));
        
        Employee emp = employeeRepository.findById(attendance.getEmployeeId()).orElse(null);
        return convertToResponse(attendance, emp != null ? emp.getName() : "Unknown");
    }
    
    // Update attendance
    public AttendanceResponse updateAttendance(Long id, AttendanceRequest request) {
        Attendance attendance = attendanceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Attendance not found"));
        
        Employee employee = employeeRepository.findById(attendance.getEmployeeId()).orElse(null);
        
        attendance.setCheckInTime(request.getCheckInTime());
        attendance.setCheckOutTime(request.getCheckOutTime());
        attendance.setStatus(request.getStatus());
        attendance.setNotes(request.getNotes());
        
        // Recalculate duration
        if (request.getCheckInTime() != null && request.getCheckOutTime() != null) {
            long minutes = ChronoUnit.MINUTES.between(request.getCheckInTime(), request.getCheckOutTime());
            attendance.setDurationHours(minutes / 60.0);
        }
        
        attendanceRepository.save(attendance);
        return convertToResponse(attendance, employee != null ? employee.getName() : "Unknown");
    }
    
    // Delete attendance
    public void deleteAttendance(Long id) {
        attendanceRepository.deleteById(id);
    }
    
    // Helper method to convert to response
    private AttendanceResponse convertToResponse(Attendance attendance, String employeeName) {
        return new AttendanceResponse(
            attendance.getId(),
            attendance.getEmployeeId(),
            employeeName,
            attendance.getAttendanceDate(),
            attendance.getCheckInTime(),
            attendance.getCheckOutTime(),
            attendance.getStatus(),
            attendance.getDurationHours(),
            attendance.getNotes()
        );
    }
}
