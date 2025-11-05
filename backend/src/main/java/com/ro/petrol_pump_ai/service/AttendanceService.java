package com.ro.petrol_pump_ai.service;

import com.ro.petrol_pump_ai.entity.Attendance;
import com.ro.petrol_pump_ai.entity.Employee;
import com.ro.petrol_pump_ai.dto.AttendanceResponse;
import com.ro.petrol_pump_ai.repository.AttendanceRepository;
import com.ro.petrol_pump_ai.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    public AttendanceResponse markAttendance(Long employeeId, String status) {
        Employee employee = employeeRepository.findById(employeeId)
            .orElseThrow(() -> new RuntimeException("Employee not found"));

        LocalDate today = LocalDate.now();

        Optional<Attendance> existingAttendance =
            attendanceRepository.findByEmployeeAndAttendanceDate(employee, today);

        Attendance attendance;
        if (existingAttendance.isPresent()) {
            attendance = existingAttendance.get();
        } else {
            attendance = new Attendance();
            attendance.setEmployee(employee);
            attendance.setAttendanceDate(today);
        }

        attendance.setStatus(status);

        if ("Present".equals(status) && attendance.getCheckInTime() == null) {
            attendance.setCheckInTime(LocalTime.now());
        }

        Attendance savedAttendance = attendanceRepository.save(attendance);
        return convertToResponse(savedAttendance);
    }

    public AttendanceResponse clockOut(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
            .orElseThrow(() -> new RuntimeException("Employee not found"));

        LocalDate today = LocalDate.now();
        Attendance attendance = attendanceRepository.findByEmployeeAndAttendanceDate(employee, today)
            .orElseThrow(() -> new RuntimeException("Attendance record not found"));

        attendance.setCheckOutTime(LocalTime.now());
        Attendance savedAttendance = attendanceRepository.save(attendance);
        return convertToResponse(savedAttendance);
    }

    public List<AttendanceResponse> getTodayAttendance() {
        List<Attendance> attendances = attendanceRepository.findByAttendanceDate(LocalDate.now());
        return attendances.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    public List<AttendanceResponse> getEmployeeAttendanceByDateRange(Long employeeId, LocalDate startDate, LocalDate endDate) {
        Employee employee = employeeRepository.findById(employeeId)
            .orElseThrow(() -> new RuntimeException("Employee not found"));

        List<Attendance> attendances = attendanceRepository.findByEmployeeAndAttendanceDateBetween(employee, startDate, endDate);
        return attendances.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    private AttendanceResponse convertToResponse(Attendance attendance) {
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss");
        return new AttendanceResponse(
            attendance.getId(),
            attendance.getEmployee().getId(),
            attendance.getEmployee().getName(),
            attendance.getAttendanceDate(),
            attendance.getCheckInTime() != null ? attendance.getCheckInTime().format(timeFormatter) : null,
            attendance.getCheckOutTime() != null ? attendance.getCheckOutTime().format(timeFormatter) : null,
            attendance.getStatus(),
            attendance.getRemarks()
        );
    }
}
