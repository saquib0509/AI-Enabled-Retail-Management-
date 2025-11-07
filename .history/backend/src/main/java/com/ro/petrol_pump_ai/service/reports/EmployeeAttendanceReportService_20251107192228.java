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
        List<Employee> allEmployees = employeeRepository.findAll();

        Map<String, Object> report = new HashMap<>();

        // ===== EMPLOYEE ATTENDANCE BREAKDOWN =====
        List<Map<String, Object>> employeeData = allEmployees.stream().map(emp -> {
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
            long totalDays = empAttendance.size();

            double attendancePercentage = totalDays > 0 ? (presentDays * 100.0 / totalDays) : 0;

            Map<String, Object> data = new HashMap<>();
            data.put("employeeId", emp.getId());
            data.put("employeeName", emp.getName());
            data.put("presentDays", presentDays);
            data.put("absentDays", absentDays);
            data.put("leaveDays", leaveDays);
            data.put("totalDays", totalDays);
            data.put("attendancePercentage", attendancePercentage);

            return data;
        }).collect(Collectors.toList());

        report.put("employeeAttendanceData", employeeData);

        // ===== SUMMARY METRICS =====
        double overallAttendance = employeeData.stream()
            .mapToDouble(e -> (double) e.get("attendancePercentage"))
            .average().orElse(0);
        
        long totalEmployees = allEmployees.size();
        long highAttendanceCount = employeeData.stream()
            .filter(e -> (double) e.get("attendancePercentage") >= 90)
            .count();
        long lowAttendanceCount = employeeData.stream()
            .filter(e -> (double) e.get("attendancePercentage") < 80)
            .count();

        report.put("overallAttendance", overallAttendance);
        report.put("totalEmployees", totalEmployees);
        report.put("highAttendanceCount", highAttendanceCount);
        report.put("lowAttendanceCount", lowAttendanceCount);

        // ===== ATTENDANCE STATUS DISTRIBUTION =====
        long totalPresent = employeeData.stream()
            .mapToLong(e -> (long) e.get("presentDays"))
            .sum();
        long totalAbsent = employeeData.stream()
            .mapToLong(e -> (long) e.get("absentDays"))
            .sum();
        long totalLeave = employeeData.stream()
            .mapToLong(e -> (long) e.get("leaveDays"))
            .sum();

        List<Map<String, Object>> statusDistribution = new ArrayList<>();
        statusDistribution.add(Map.of("status", "Present", "count", totalPresent, "percentage", totalPresent > 0 ? (totalPresent * 100.0 / (totalPresent + totalAbsent + totalLeave)) : 0));
        statusDistribution.add(Map.of("status", "Absent", "count", totalAbsent, "percentage", totalAbsent > 0 ? (totalAbsent * 100.0 / (totalPresent + totalAbsent + totalLeave)) : 0));
        statusDistribution.add(Map.of("status", "Leave", "count", totalLeave, "percentage", totalLeave > 0 ? (totalLeave * 100.0 / (totalPresent + totalAbsent + totalLeave)) : 0));
        report.put("statusDistribution", statusDistribution);

        // ===== ENHANCED AI INSIGHTS =====
        report.put("aiInsights", generateEnhancedAIInsights(employeeData, overallAttendance, lowAttendanceCount, totalPresent, totalAbsent, totalLeave));

        return report;
    }

    private Map<String, Object> generateEnhancedAIInsights(
            List<Map<String, Object>> employeeData,
            double overallAttendance,
            long lowAttendanceCount,
            long totalPresent,
            long totalAbsent,
            long totalLeave) {

        Map<String, Object> insights = new HashMap<>();

        // 1. Best Attendee
        Map<String, Object> bestAttendee = employeeData.stream()
            .max(Comparator.comparing(e -> (double) e.get("attendancePercentage")))
            .orElse(null);
        if (bestAttendee != null) {
            insights.put("bestAttendee", bestAttendee.get("employeeName"));
            insights.put("bestAttendeePercentage", bestAttendee.get("attendancePercentage"));
        }

        // 2. Worst Attendee
        Map<String, Object> worstAttendee = employeeData.stream()
            .min(Comparator.comparing(e -> (double) e.get("attendancePercentage")))
            .orElse(null);
        if (worstAttendee != null) {
            insights.put("worstAttendee", worstAttendee.get("employeeName"));
            insights.put("worstAttendeePercentage", worstAttendee.get("attendancePercentage"));
        }

        // 3. Attendance Health
        String attendanceHealth;
        if (overallAttendance >= 95) {
            attendanceHealth = "Excellent";
        } else if (overallAttendance >= 85) {
            attendanceHealth = "Good";
        } else if (overallAttendance >= 75) {
            attendanceHealth = "Fair";
        } else {
            attendanceHealth = "Needs Improvement";
        }
        insights.put("attendanceHealth", attendanceHealth);

        // 4. Low Attendance Employees
        List<String> lowAttendanceEmployees = employeeData.stream()
            .filter(e -> (double) e.get("attendancePercentage") < 80)
            .map(e -> (String) e.get("employeeName"))
            .collect(Collectors.toList());
        insights.put("lowAttendanceEmployees", lowAttendanceEmployees);

        // 5. Absenteeism Alert
        double absenteeismRate = totalPresent > 0 ? (totalAbsent * 100.0 / (totalPresent + totalAbsent + totalLeave)) : 0;
        String absenteeismAlert = absenteeismRate > 10
            ? "HIGH - " + String.format("%.1f", absenteeismRate) + "% absence rate. Take corrective action."
            : absenteeismRate > 5
            ? "⚡ MODERATE - " + String.format("%.1f", absenteeismRate) + "% absence rate. Monitor closely."
            : "✓ LOW - " + String.format("%.1f", absenteeismRate) + "% absence rate. Excellent!";
        insights.put("absenteeismAlert", absenteeismAlert);

        // 6. Summary Insight
        String summary = String.format(
            "🤖 AI ANALYSIS: Overall team attendance is %.1f%%. %s is your most consistent performer with %.1f%% attendance. " +
            "%s has the lowest attendance at %.1f%%. %d employees have attendance below 80%% - consider follow-up. " +
            "Absenteeism rate: %s",
            overallAttendance,
            bestAttendee != null ? bestAttendee.get("employeeName") : "N/A",
            bestAttendee != null ? bestAttendee.get("attendancePercentage") : 0,
            worstAttendee != null ? worstAttendee.get("employeeName") : "N/A",
            worstAttendee != null ? worstAttendee.get("attendancePercentage") : 0,
            lowAttendanceCount,
            absenteeismAlert
        );
        insights.put("summary", summary);

        return insights;
    }
}
