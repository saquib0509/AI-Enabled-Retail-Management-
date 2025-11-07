package com.ro.petrol_pump_ai.service;

import com.ro.petrol_pump_ai.dto.SalaryStructureRequest;
import com.ro.petrol_pump_ai.dto.SalaryRecordResponse;
import com.ro.petrol_pump_ai.entity.SalaryStructure;
import com.ro.petrol_pump_ai.entity.SalaryRecord;
import com.ro.petrol_pump_ai.entity.Employee;
import com.ro.petrol_pump_ai.repository.SalaryStructureRepository;
import com.ro.petrol_pump_ai.repository.SalaryRecordRepository;
import com.ro.petrol_pump_ai.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SalaryService {
    
    @Autowired
    private SalaryStructureRepository salaryStructureRepository;
    
    @Autowired
    private SalaryRecordRepository salaryRecordRepository;
    
    @Autowired
    private EmployeeRepository employeeRepository;
    
    // Create or update salary structure
    public SalaryStructure createOrUpdateSalaryStructure(SalaryStructureRequest request) {
        SalaryStructure structure = salaryStructureRepository
            .findByEmployeeId(request.getEmployeeId())
            .orElse(new SalaryStructure());
        
        structure.setEmployeeId(request.getEmployeeId());
        structure.setBaseSalary(request.getBaseSalary());
        structure.setHra(request.getHra() != null ? request.getHra() : 0.0);
        structure.setDearnessAllowance(request.getDearnessAllowance() != null ? request.getDearnessAllowance() : 0.0);
        structure.setOtherAllowances(request.getOtherAllowances() != null ? request.getOtherAllowances() : 0.0);
        structure.setPfDeduction(request.getPfDeduction() != null ? request.getPfDeduction() : 0.0);
        structure.setTaxDeduction(request.getTaxDeduction() != null ? request.getTaxDeduction() : 0.0);
        structure.setOtherDeductions(request.getOtherDeductions() != null ? request.getOtherDeductions() : 0.0);
        
        return salaryStructureRepository.save(structure);
    }
    
    // Get salary structure for employee
    public SalaryStructure getSalaryStructure(Long employeeId) {
        return salaryStructureRepository.findByEmployeeId(employeeId)
            .orElseThrow(() -> new RuntimeException("Salary structure not found for employee"));
    }
    
    // Generate salary record for a month
    public SalaryRecordResponse generateSalaryRecord(Long employeeId, String salaryMonth) {
        Employee employee = employeeRepository.findById(employeeId)
            .orElseThrow(() -> new RuntimeException("Employee not found"));
        
        SalaryStructure structure = salaryStructureRepository.findByEmployeeId(employeeId)
            .orElseThrow(() -> new RuntimeException("Salary structure not configured"));
        
        // Check if already exists
        SalaryRecord existing = salaryRecordRepository
            .findByEmployeeIdAndSalaryMonth(employeeId, salaryMonth)
            .orElse(null);
        
        if (existing != null) {
            return convertToResponse(existing, employee.getName());
        }
        
        // Calculate totals
        Double totalAllowances = structure.getHra() + structure.getDearnessAllowance() + structure.getOtherAllowances();
        Double totalDeductions = structure.getPfDeduction() + structure.getTaxDeduction() + structure.getOtherDeductions();
        Double netSalary = structure.getBaseSalary() + totalAllowances - totalDeductions;
        
        // Create salary record
        SalaryRecord record = new SalaryRecord();
        record.setEmployeeId(employeeId);
        record.setSalaryMonth(salaryMonth);
        record.setBaseSalary(structure.getBaseSalary());
        record.setTotalAllowances(totalAllowances);
        record.setTotalDeductions(totalDeductions);
        record.setNetSalary(netSalary);
        record.setStatus("Pending");
        
        salaryRecordRepository.save(record);
        return convertToResponse(record, employee.getName());
    }
    
    // Get salary records for a month
    public List<SalaryRecordResponse> getSalaryRecordsByMonth(String salaryMonth) {
        List<SalaryRecord> records = salaryRecordRepository.findBySalaryMonth(salaryMonth);
        return records.stream()
            .map(rec -> {
                Employee emp = employeeRepository.findById(rec.getEmployeeId()).orElse(null);
                return convertToResponse(rec, emp != null ? emp.getName() : "Unknown");
            })
            .collect(Collectors.toList());
    }
    
    // Mark salary as paid
    public SalaryRecordResponse markSalaryAsPaid(Long salaryRecordId, String paymentMethod) {
        SalaryRecord record = salaryRecordRepository.findById(salaryRecordId)
            .orElseThrow(() -> new RuntimeException("Salary record not found"));
        
        record.setStatus("Paid");
        record.setPaidDate(java.time.LocalDate.now());
        record.setPaymentMethod(paymentMethod);
        
        salaryRecordRepository.save(record);
        
        Employee emp = employeeRepository.findById(record.getEmployeeId()).orElse(null);
        return convertToResponse(record, emp != null ? emp.getName() : "Unknown");
    }
    
    // Get salary record by ID
    public SalaryRecordResponse getSalaryRecordById(Long id) {
        SalaryRecord record = salaryRecordRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Salary record not found"));
        
        Employee emp = employeeRepository.findById(record.getEmployeeId()).orElse(null);
        return convertToResponse(record, emp != null ? emp.getName() : "Unknown");
    }
    
    // Helper to convert to response
    private SalaryRecordResponse convertToResponse(SalaryRecord record, String employeeName) {
        return new SalaryRecordResponse(
            record.getId(),
            record.getEmployeeId(),
            employeeName,
            record.getSalaryMonth(),
            record.getBaseSalary(),
            record.getTotalAllowances(),
            record.getTotalDeductions(),
            record.getNetSalary(),
            record.getStatus(),
            record.getPaidDate() != null ? record.getPaidDate().toString() : null,
            record.getPaymentMethod(),
            record.getNotes()
        );
    }
}
