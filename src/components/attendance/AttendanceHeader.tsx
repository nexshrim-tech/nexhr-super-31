
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, UserPlus, Settings } from "lucide-react";

interface AttendanceHeaderProps {
  handleExportReport: () => void;
  openAddAttendance: () => void;
  openSettings: () => void;
}

const AttendanceHeader = ({ handleExportReport, openAddAttendance, openSettings }: AttendanceHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Attendance Management</h1>
        <p className="text-gray-500">Track employee attendance and hours</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={handleExportReport}
        >
          <Download className="h-4 w-4" />
          Export Report
        </Button>
        <Button 
          variant="outline"
          className="gap-2"
          onClick={openSettings}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Button>
        <Button className="flex items-center gap-2" onClick={openAddAttendance}>
          <UserPlus className="h-4 w-4" />
          Add Attendance
        </Button>
      </div>
    </div>
  );
};

export default AttendanceHeader;
