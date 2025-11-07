package com.ro.petrol_pump_ai.dto;

public class SalaryRecordResponse {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private String salaryMonth;
    private Double baseSalary;
    private Double totalAllowances;
    private Double totalDeductions;
    private Double netSalary;
    private String status;
    private String paidDate;
    private String paymentMethod;
    private String notes;
    
    public SalaryRecordResponse(Long id, Long employeeId, String employeeName, String salaryMonth,
                                Double baseSalary, Double totalAllowances, Double totalDeductions,
                                Double netSalary, String status, String paidDate, String paymentMethod, String notes) {
        this.id = id;
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.salaryMonth = salaryMonth;
        this.baseSalary = baseSalary;
        this.totalAllowances = totalAllowances;
        this.totalDeductions = totalDeductions;
        this.netSalary = netSalary;
        this.status = status;
        this.paidDate = paidDate;
        this.paymentMethod = paymentMethod;
        this.notes = notes;
    }
    
    // Getters
    public Long getId() { return id; }
    public Long getEmployeeId() { return employeeId; }
    public String getEmployeeName() { return employeeName; }
    public String getSalaryMonth() { return salaryMonth; }
    public Double getBaseSalary() { return baseSalary; }
    public Double getTotalAllowances() { return totalAllowances; }
    public Double getTotalDeductions() { return totalDeductions; }
    public Double getNetSalary() { return netSalary; }
    public String getStatus() { return status; }
    public String getPaidDate() { return paidDate; }
    public String getPaymentMethod() { return paymentMethod; }
    public String getNotes() { return notes; }
}
