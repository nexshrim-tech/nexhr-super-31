
import { useState } from "react";
import { Layout } from "@/components/ui/layout";
import { AttendanceRecord } from "@/types/attendance";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Create attendance record update function
const updateAttendanceRecord = async (record: Partial<AttendanceRecord>) => {
  try {
    if (!record.employeeid || !record.customerid) {
      throw new Error("Employee ID and Customer ID are required");
    }
    
    const { error } = await supabase
      .from('attendance')
      .update({
        status: record.status,
        checkintime: record.checkintime,
        checkouttime: record.checkouttime,
        checkouttimestamp: record.checkouttimestamp,
        checkintimestamp: record.checkintimestamp,
      })
      .eq('employeeid', record.employeeid);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error updating attendance record:", error);
    throw error;
  }
};

const AttendancePage = () => {
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const { toast } = useToast();
  
  const handleEditAttendance = (record: AttendanceRecord) => {
    setEditingRecord({
      ...record
    });
  };
  
  const handleSaveEditedRecord = (updatedRecord: Partial<AttendanceRecord>) => {
    updateAttendanceRecord(updatedRecord)
      .then(() => {
        toast({
          title: "Success",
          description: "Attendance record updated successfully",
        });
        setEditingRecord(null);
      })
      .catch(error => {
        toast({
          title: "Error",
          description: "Failed to update attendance record",
          variant: "destructive",
        });
      });
  };
  
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Attendance Management</h1>
        {/* Add your attendance components here */}
      </div>
    </Layout>
  );
};

export default AttendancePage;
