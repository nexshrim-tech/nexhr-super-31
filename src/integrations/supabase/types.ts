export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      attendance: {
        Row: {
          attendanceid: number
          checkintime: string | null
          checkouttime: string | null
          customerid: number | null
          date: string | null
          employeeid: number | null
          leaveend: string | null
          leavestart: string | null
          leavestatus: string | null
          leavetype: string | null
          location: string | null
          notes: string | null
          status: string | null
          workhours: number | null
        }
        Insert: {
          attendanceid?: number
          checkintime?: string | null
          checkouttime?: string | null
          customerid?: number | null
          date?: string | null
          employeeid?: number | null
          leaveend?: string | null
          leavestart?: string | null
          leavestatus?: string | null
          leavetype?: string | null
          location?: string | null
          notes?: string | null
          status?: string | null
          workhours?: number | null
        }
        Update: {
          attendanceid?: number
          checkintime?: string | null
          checkouttime?: string | null
          customerid?: number | null
          date?: string | null
          employeeid?: number | null
          leaveend?: string | null
          leavestart?: string | null
          leavestatus?: string | null
          leavetype?: string | null
          location?: string | null
          notes?: string | null
          status?: string | null
          workhours?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_customerid_fkey"
            columns: ["customerid"]
            isOneToOne: false
            referencedRelation: "customer"
            referencedColumns: ["customerid"]
          },
          {
            foreignKeyName: "attendance_employeeid_fkey"
            columns: ["employeeid"]
            isOneToOne: false
            referencedRelation: "employee"
            referencedColumns: ["employeeid"]
          },
        ]
      }
      customer: {
        Row: {
          accountcreationdate: string | null
          address: string | null
          contactemail: string | null
          contactperson: string | null
          customerid: number
          name: string
          subscriptionenddate: string | null
          subscriptionplan: string | null
          subscriptionstatus: string | null
        }
        Insert: {
          accountcreationdate?: string | null
          address?: string | null
          contactemail?: string | null
          contactperson?: string | null
          customerid?: number
          name: string
          subscriptionenddate?: string | null
          subscriptionplan?: string | null
          subscriptionstatus?: string | null
        }
        Update: {
          accountcreationdate?: string | null
          address?: string | null
          contactemail?: string | null
          contactperson?: string | null
          customerid?: number
          name?: string
          subscriptionenddate?: string | null
          subscriptionplan?: string | null
          subscriptionstatus?: string | null
        }
        Relationships: []
      }
      department: {
        Row: {
          customerid: number | null
          departmentid: number
          description: string | null
          name: string
        }
        Insert: {
          customerid?: number | null
          departmentid?: number
          description?: string | null
          name: string
        }
        Update: {
          customerid?: number | null
          departmentid?: number
          description?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "department_customerid_fkey"
            columns: ["customerid"]
            isOneToOne: false
            referencedRelation: "customer"
            referencedColumns: ["customerid"]
          },
        ]
      }
      document: {
        Row: {
          documentid: number
          documentnumber: string | null
          employeeid: number | null
          expirydate: string | null
          filepath: string
          issuedate: string | null
          name: string
          notes: string | null
          type: string | null
          uploaddate: string | null
          verificationstatus: string | null
        }
        Insert: {
          documentid?: number
          documentnumber?: string | null
          employeeid?: number | null
          expirydate?: string | null
          filepath: string
          issuedate?: string | null
          name: string
          notes?: string | null
          type?: string | null
          uploaddate?: string | null
          verificationstatus?: string | null
        }
        Update: {
          documentid?: number
          documentnumber?: string | null
          employeeid?: number | null
          expirydate?: string | null
          filepath?: string
          issuedate?: string | null
          name?: string
          notes?: string | null
          type?: string | null
          uploaddate?: string | null
          verificationstatus?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_employeeid_fkey"
            columns: ["employeeid"]
            isOneToOne: false
            referencedRelation: "employee"
            referencedColumns: ["employeeid"]
          },
        ]
      }
      employee: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          customerid: number | null
          dateofbirth: string | null
          department: number | null
          education: string | null
          email: string
          employeeid: number
          employeestatus: string | null
          employeetype: string | null
          employmenthistory: string | null
          firstname: string
          gender: string | null
          jobtitle: string | null
          joiningdate: string | null
          lastname: string
          monthlysalary: number | null
          phonenumber: string | null
          postalcode: string | null
          probationenddate: string | null
          profilepicturepath: string | null
          salary: number | null
          state: string | null
          terminationdate: string | null
          workauthorization: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          customerid?: number | null
          dateofbirth?: string | null
          department?: number | null
          education?: string | null
          email: string
          employeeid?: number
          employeestatus?: string | null
          employeetype?: string | null
          employmenthistory?: string | null
          firstname: string
          gender?: string | null
          jobtitle?: string | null
          joiningdate?: string | null
          lastname: string
          monthlysalary?: number | null
          phonenumber?: string | null
          postalcode?: string | null
          probationenddate?: string | null
          profilepicturepath?: string | null
          salary?: number | null
          state?: string | null
          terminationdate?: string | null
          workauthorization?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          customerid?: number | null
          dateofbirth?: string | null
          department?: number | null
          education?: string | null
          email?: string
          employeeid?: number
          employeestatus?: string | null
          employeetype?: string | null
          employmenthistory?: string | null
          firstname?: string
          gender?: string | null
          jobtitle?: string | null
          joiningdate?: string | null
          lastname?: string
          monthlysalary?: number | null
          phonenumber?: string | null
          postalcode?: string | null
          probationenddate?: string | null
          profilepicturepath?: string | null
          salary?: number | null
          state?: string | null
          terminationdate?: string | null
          workauthorization?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_customerid_fkey"
            columns: ["customerid"]
            isOneToOne: false
            referencedRelation: "customer"
            referencedColumns: ["customerid"]
          },
          {
            foreignKeyName: "employee_department_fkey"
            columns: ["department"]
            isOneToOne: false
            referencedRelation: "department"
            referencedColumns: ["departmentid"]
          },
        ]
      }
      payroll: {
        Row: {
          baseamount: number | null
          bonusamount: number | null
          deductions: number | null
          employeeid: number | null
          netamount: number | null
          paymentdate: string | null
          paymentreference: string | null
          paymentstatus: string | null
          payperiod: string | null
          payrollid: number
          taxes: number | null
        }
        Insert: {
          baseamount?: number | null
          bonusamount?: number | null
          deductions?: number | null
          employeeid?: number | null
          netamount?: number | null
          paymentdate?: string | null
          paymentreference?: string | null
          paymentstatus?: string | null
          payperiod?: string | null
          payrollid?: number
          taxes?: number | null
        }
        Update: {
          baseamount?: number | null
          bonusamount?: number | null
          deductions?: number | null
          employeeid?: number | null
          netamount?: number | null
          paymentdate?: string | null
          paymentreference?: string | null
          paymentstatus?: string | null
          payperiod?: string | null
          payrollid?: number
          taxes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "payroll_employeeid_fkey"
            columns: ["employeeid"]
            isOneToOne: false
            referencedRelation: "employee"
            referencedColumns: ["employeeid"]
          },
        ]
      }
      posts: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company_name: string | null
          company_size: string | null
          created_at: string | null
          customerid: number | null
          full_name: string | null
          id: string
          phone_number: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          company_name?: string | null
          company_size?: string | null
          created_at?: string | null
          customerid?: number | null
          full_name?: string | null
          id: string
          phone_number?: string | null
          role?: string
          updated_at?: string | null
        }
        Update: {
          company_name?: string | null
          company_size?: string | null
          created_at?: string | null
          customerid?: number | null
          full_name?: string | null
          id?: string
          phone_number?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_customerid_fkey"
            columns: ["customerid"]
            isOneToOne: false
            referencedRelation: "customer"
            referencedColumns: ["customerid"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
