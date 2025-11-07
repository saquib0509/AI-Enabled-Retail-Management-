package com.ro.petrol_pump_ai.entity;

import jakarta.persistence.*;
import java.time.YearMonth;

@Entity
@Table(name = "salary_record", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"employee_id", "salary_month"})
})
public class SalaryRecord {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "employee_id", nullable = false)
    private Long employeeId;
    
    @Column(name = "salary_month", nullable = false)
    private String salaryMonth; // Format: YYYY-MM
    
    @Column(name = "base_salary")
    private Double baseSalary;
    
    @Column(name = "total_allowances")
    private Double totalAllowances;
    
    @Column(name = "total_deductions")
    private Double totalDeductions;
    
    @Column(name = "net_salary")
    private Double netSalary;
    
    @Column(name = "status")
    private String status; // Pending, Paid
    
    @Column(name = "paid_date")
    private java.time.LocalDate paidDate;
    
    @Column(name = "payment_method")
    private String paymentMethod; // Cash, Bank Transfer, Check
    
    @Column(name = "notes")
    private String notes;
    
    @Column(name = "created_at", updatable = false)
    private java.time.LocalDateTime createdAt = java.time.LocalDateTime.now();
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }
    
    public String getSalaryMonth() { return salaryMonth; }
    public void setSalaryMonth(String salaryMonth) { this.salaryMonth = salaryMonth; }
    
    public Double getBaseSalary() { return baseSalary; }
    public void setBaseSalary(Double baseSalary) { this.baseSalary = baseSalary; }
    
    public Double getTotalAllowances() { return totalAllowances; }
    public void setTotalAllowances(Double totalAllowances) { this.totalAllowances = totalAllowances; }
    
    public Double getTotalDeductions() { return totalDeductions; }
    public void setTotalDeductions(Double totalDeductions) { this.totalDeductions = totalDeductions; }
    
    public Double getNetSalary() { return netSalary; }
    public void setNetSalary(Double netSalary) { this.netSalary = netSalary; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public java.time.LocalDate getPaidDate() { return paidDate; }
    public void setPaidDate(java.time.LocalDate paidDate) { this.paidDate = paidDate; }
    
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public java.time.LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(java.time.LocalDateTime createdAt) { this.createdAt = createdAt; }
}
