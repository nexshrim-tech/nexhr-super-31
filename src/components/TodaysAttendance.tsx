
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { Employee } from "@/services/employeeService";

interface TodaysAttendanceProps {
  customerId?: number | null;
  isLoading?: boolean;
}

interface AttendanceRecord {
  employeeid: number;
  checkintime: string;
  checkouttime: string | null;
  status: string;
  employee?: {
    firstname: string;
    lastname: string;
    email: string;
    profilepicturepath: string | null;
  };
}

const TodaysAttendance: React.FC<TodaysAttendanceProps> = ({ 
  customerId, 
  isLoading: parentIsLoading = false 
}) => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const today = new Date();
  const formattedDate = format(today, "EEEE, MMMM d, yyyy");

  useEffect(() => {
    const fetchAttendanceData = async () => {
      if (!customerId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const todayStr = format(today, "yyyy-MM-dd");
        
        // First count total employees
        const { count: empCount, error: empError } = await supabase
          .from('employee')
          .select('employeeid', { count: 'exact' })
          .eq('customerid', customerId);
          
        if (empError) throw empError;
        setTotalEmployees(empCount || 0);
        
        // Fetch today's attendance with employee details
        const { data, error } = await supabase
          .from('attendance')
          .select(`
            attendanceid,
            employeeid,
            checkintime,
            checkouttime,
            status,
            employee:employeeid(
              firstname,
              lastname,
              email,
              profilepicturepath
            )
          `)
          .eq('customerid', customerId)
          .eq('date', todayStr)
          .order('checkintime', { ascending: false })
          .limit(5);
          
        if (error) throw error;
        
        setAttendanceRecords(data || []);
      } catch (error) {
        console.error("Error fetching attendance:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendanceData();
  }, [customerId]);

  // If there's no attendance data yet, use this sample data
  const sampleAttendance = [
    {
      employeeid: 1,
      employee: {
        firstname: "Olivia",
        lastname: "Rhye",
        email: "olivia@nexhr.com",
        profilepicturepath: null
      },
      checkintime: new Date(today.setHours(9, 0, 0)).toISOString(),
      checkouttime: null,
      status: "Present"
    },
    {
      employeeid: 2,
      employee: {
        firstname: "Phoenix",
        lastname: "Baker",
        email: "phoenix@nexhr.com",
        profilepicturepath: null
      },
      checkintime: new Date(today.setHours(8, 45, 0)).toISOString(),
      checkouttime: null,
      status: "Present"
    },
    {
      employeeid: 3,
      employee: {
        firstname: "Lana",
        lastname: "Steiner",
        email: "lana@nexhr.com",
        profilepicturepath: null
      },
      checkintime: new Date(today.setHours(10, 15, 0)).toISOString(),
      checkouttime: null,
      status: "Late"
    }
  ];

  const displayRecords = attendanceRecords.length > 0 ? attendanceRecords : sampleAttendance;
  const totalPresent = attendanceRecords.length;
  const percentPresent = totalEmployees > 0 ? Math.round((totalPresent / totalEmployees) * 100) : 0;

  const isComponentLoading = parentIsLoading || isLoading;

  return (
    <Card className="dashboard-card border-t-2 border-t-green-500">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="bg-green-100 p-2 rounded-full">
              <Clock className="h-4 w-4 text-green-600" />
            </div>
            <CardTitle className="text-base font-medium">Today's Attendance</CardTitle>
          </div>
          {isComponentLoading ? (
            <Skeleton className="h-6 w-32" />
          ) : (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {formattedDate}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          {isComponentLoading ? (
            <>
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-6 w-20" />
            </>
          ) : (
            <>
              <div>
                <span className="text-sm text-gray-500">Today's attendance</span>
                <div className="text-2xl font-bold">
                  {totalPresent} / {totalEmployees} <span className="text-sm text-gray-500">employees</span>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-none">
                {percentPresent}% Present
              </Badge>
            </>
          )}
        </div>

        <div className="space-y-4">
          {isComponentLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            ))
          ) : (
            displayRecords.map((record, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <Avatar>
                    {record.employee?.profilepicturepath ? (
                      <AvatarImage src={record.employee.profilepicturepath} />
                    ) : (
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {record.employee?.firstname.charAt(0)}
                        {record.employee?.lastname.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <div className="font-medium">{record.employee?.firstname} {record.employee?.lastname}</div>
                    <div className="text-sm text-gray-500">{record.employee?.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge 
                    variant="outline" 
                    className={`${
                      record.status === "Present" 
                        ? "bg-green-50 text-green-700 border-green-200" 
                        : record.status === "Late" 
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}
                  >
                    {record.status}
                  </Badge>
                  <div className="text-sm text-gray-500">
                    {format(new Date(record.checkintime), "h:mm a")}
                    {record.checkouttime && (
                      <>
                        <ArrowRight className="inline h-3 w-3 mx-1" />
                        {format(new Date(record.checkouttime), "h:mm a")}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TodaysAttendance;
