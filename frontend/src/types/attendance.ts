export interface Attendance {
    id: number;
    employeeId: number;
    employeeName: string;
    attendanceDate: string;
    checkInTime: string | null;
    checkOutTime: string | null;
    status: "Present" | "Absent" | "Late" | "Leave";
    durationHours: number | null;
    notes: string;
  }
  
  export interface AttendanceRequest {
    employeeId: number;
    attendanceDate: string;
    checkInTime: string | null;
    checkOutTime: string | null;
    status: string;
    notes: string;
  }
  