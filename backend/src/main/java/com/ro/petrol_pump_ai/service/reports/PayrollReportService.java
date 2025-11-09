package com.ro.petrol_pump_ai.service.reports;

import com.ro.petrol_pump_ai.entity.SalaryRecord;
import com.ro.petrol_pump_ai.repository.SalaryRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PayrollReportService {

    @Autowired
    private SalaryRecordRepository salaryRecordRepository;

    public Map<String, Object> generatePayrollReport() {
        List<SalaryRecord> records = salaryRecordRepository.findAll();

        Map<String, Object> report = new HashMap<>();

        double totalSalary = records.stream()
            .mapToDouble(s -> s.getNetSalary() != null ? s.getNetSalary() : 0)
            .sum();
        long pendingCount = records.stream()
            .filter(s -> "Pending".equalsIgnoreCase(s.getStatus()))
            .count();

        List<Map<String, Object>> salaryData = records.stream().map(s -> {
            Map<String, Object> data = new HashMap<>();
            data.put("employeeId", s.getEmployeeId());
            data.put("baseSalary", s.getBaseSalary());
            data.put("netSalary", s.getNetSalary());
            data.put("status", s.getStatus());
            data.put("paymentMethod", s.getPaymentMethod());
            return data;
        }).collect(Collectors.toList());

        report.put("totalSalary", totalSalary);
        report.put("pendingPayments", pendingCount);
        report.put("salaryData", salaryData);

        if (pendingCount > 0) {
            report.put("aiAlert", pendingCount + " pending salary payments. Process immediately!");
        }

        return report;
    }
}
