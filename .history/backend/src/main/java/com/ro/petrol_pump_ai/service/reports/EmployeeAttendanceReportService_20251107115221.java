package com.ro.petrol_pump_ai.service.reports;

import com.ro.petrol_pump_ai.entity.Attendance;
import com.ro.petrol_pump_ai.entity.Employee;
import com.ro.petrol_pump_ai.repository.AttendanceRepository;
import com.ro.petrol_pump_ai.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class EmployeeAttendanceReportService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    public Map<String, Object> generateEmployeeAttendanceReport(LocalDate startDate, LocalDate endDate) {
        List<Attendance> attendances = attendanceRepository.findByAttendanceDateBetween(startDate, endDate);
        List<Employee> employees = employeeRepository.findAll();

        Map<String, Object> report = new HashMap<>();

        List<Map<String, Object>> employeeData = employees.stream().map(emp -> {
            List<Attendance> empAttendance = attendances.stream()
                .filter(a -> a.getEmployeeId().equals(emp.getId()))
                .collect(Collectors.toList());

            long presentDays = empAttendance.stream()
                .filter(a -> "Present".equalsIgnoreCase(a.getStatus()))
                .count();
            long absentDays = empAttendance.stream()
                .filter(a -> "Absent".equalsIgnoreCase(a.getStatus()))
                .count();
            long leaveDays = empAttendance.stream()
                .filter(a -> "Leave".equalsIgnoreCase(a.getStatus()))
                .count();

            double attendancePercentage = empAttendance.size() > 0
                ? (presentDays * 100.0 / empAttendance.size())
                : 0;

            Map<String, Object> data = new HashMap<>();
            data.put("employeeName", emp.getName());
            data.put("presentDays", presentDays);
            data.put("absentDays", absentDays);
            data.put("leaveDays", leaveDays);
            data.put("attendancePercentage", attendancePercentage);

            return data;
        }).collect(Collectors.toList());

        report.put("employeeAttendanceData", employeeData);

        long lowAttendance = employeeData.stream()
            .filter(e -> (Double) e.get("attendancePercentage") < 80)
            .count();

        String alert = lowAttendance > 0
            ? "⚠️ " + lowAttendance + " employees have attendance below 80%"
            : "✓ All employees have good attendance";
        report.put("aiAlert", alert);

        return report;
    }
}
