
export interface AttendanceRecord {
  id: number;
  employeeId: string;
  employee: { name: string; avatar: string };
  date: string;
  checkIn: string;
  checkOut: string;
  status: string;
  workHours: string;
  notes: string;
  checkInPhoto?: string;
  checkOutPhoto?: string;
  location?: string;
}

// Sample attendance data
export const attendanceData: AttendanceRecord[] = [
  {
    id: 1,
    employeeId: "EMP001",
    employee: { name: "Olivia Rhye", avatar: "OR" },
    date: "2023-06-01",
    checkIn: "09:05 AM",
    checkOut: "05:30 PM",
    status: "Present",
    workHours: "8h 25m",
    notes: "",
  },
  {
    id: 2,
    employeeId: "EMP002",
    employee: { name: "Phoenix Baker", avatar: "PB" },
    date: "2023-06-01",
    checkIn: "08:55 AM",
    checkOut: "06:15 PM",
    status: "Present",
    workHours: "9h 20m",
    notes: "Worked on Project X deadline",
  },
  {
    id: 3,
    employeeId: "EMP003",
    employee: { name: "Lana Steiner", avatar: "LS" },
    date: "2023-06-01",
    checkIn: "",
    checkOut: "",
    status: "Absent",
    workHours: "-",
    notes: "Sick leave",
  },
  {
    id: 4,
    employeeId: "EMP004",
    employee: { name: "Demi Wilkinson", avatar: "DW" },
    date: "2023-06-01",
    checkIn: "09:30 AM",
    checkOut: "04:45 PM",
    status: "Present",
    workHours: "7h 15m",
    notes: "Left early - doctor appointment",
  },
  {
    id: 5,
    employeeId: "EMP005",
    employee: { name: "Candice Wu", avatar: "CW" },
    date: "2023-06-01",
    checkIn: "10:15 AM",
    checkOut: "06:30 PM",
    status: "Late",
    workHours: "8h 15m",
    notes: "Traffic delay",
  },
  // Today's data
  {
    id: 6,
    employeeId: "EMP001",
    employee: { name: "Olivia Rhye", avatar: "OR" },
    date: new Date().toISOString().split('T')[0],
    checkIn: "08:55 AM",
    checkOut: "05:15 PM",
    status: "Present",
    workHours: "8h 20m",
    notes: "",
  },
  {
    id: 7,
    employeeId: "EMP002",
    employee: { name: "Phoenix Baker", avatar: "PB" },
    date: new Date().toISOString().split('T')[0],
    checkIn: "09:05 AM",
    checkOut: "05:30 PM",
    status: "Present",
    workHours: "8h 25m",
    notes: "",
  },
  {
    id: 8,
    employeeId: "EMP003",
    employee: { name: "Lana Steiner", avatar: "LS" },
    date: new Date().toISOString().split('T')[0],
    checkIn: "",
    checkOut: "",
    status: "Absent",
    workHours: "-",
    notes: "Sick leave",
  },
];
