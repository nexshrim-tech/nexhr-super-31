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
      assetmanagement: {
        Row: {
          assetid: number
          assetname: string | null
          assetstatus: string | null
          assettype: string | null
          assetvalue: number | null
          billpath: string | null
          customerid: number | null
          employeeid: number | null
          purchasedate: string | null
          serialnumber: string | null
        }
        Insert: {
          assetid?: never
          assetname?: string | null
          assetstatus?: string | null
          assettype?: string | null
          assetvalue?: number | null
          billpath?: string | null
          customerid?: number | null
          employeeid?: number | null
          purchasedate?: string | null
          serialnumber?: string | null
        }
        Update: {
          assetid?: never
          assetname?: string | null
          assetstatus?: string | null
          assettype?: string | null
          assetvalue?: number | null
          billpath?: string | null
          customerid?: number | null
          employeeid?: number | null
          purchasedate?: string | null
          serialnumber?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assetmanagement_employeeid_fkey"
            columns: ["employeeid"]
            isOneToOne: false
            referencedRelation: "employee"
            referencedColumns: ["employeeid"]
          },
        ]
      }
      attendance: {
        Row: {
          checkintimestamp: string | null
          checkouttimestamp: string | null
          customerid: number | null
          employeeid: number | null
          selfieimagepath: string | null
          status: string | null
        }
        Insert: {
          checkintimestamp?: string | null
          checkouttimestamp?: string | null
          customerid?: number | null
          employeeid?: number | null
          selfieimagepath?: string | null
          status?: string | null
        }
        Update: {
          checkintimestamp?: string | null
          checkouttimestamp?: string | null
          customerid?: number | null
          employeeid?: number | null
          selfieimagepath?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_employeeid_fkey"
            columns: ["employeeid"]
            isOneToOne: false
            referencedRelation: "employee"
            referencedColumns: ["employeeid"]
          },
        ]
      }
      attendancesettings: {
        Row: {
          attendancesettingid: number
          customerid: number | null
          employeeid: number | null
          geofencingenabled: boolean | null
          latethreshold: unknown | null
          photoverificationenabled: boolean | null
          workstarttime: string | null
        }
        Insert: {
          attendancesettingid?: never
          customerid?: number | null
          employeeid?: number | null
          geofencingenabled?: boolean | null
          latethreshold?: unknown | null
          photoverificationenabled?: boolean | null
          workstarttime?: string | null
        }
        Update: {
          attendancesettingid?: never
          customerid?: number | null
          employeeid?: number | null
          geofencingenabled?: boolean | null
          latethreshold?: unknown | null
          photoverificationenabled?: boolean | null
          workstarttime?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendancesettings_employeeid_fkey"
            columns: ["employeeid"]
            isOneToOne: false
            referencedRelation: "employee"
            referencedColumns: ["employeeid"]
          },
        ]
      }
      customer: {
        Row: {
          companysize: string | null
          customerid: string
          email: string | null
          name: string | null
          password: string | null
          phonenumber: string | null
          planid: number | null
        }
        Insert: {
          companysize?: string | null
          customerid?: string
          email?: string | null
          name?: string | null
          password?: string | null
          phonenumber?: string | null
          planid?: number | null
        }
        Update: {
          companysize?: string | null
          customerid?: string
          email?: string | null
          name?: string | null
          password?: string | null
          phonenumber?: string | null
          planid?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_planid_fkey"
            columns: ["planid"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["planid"]
          },
        ]
      }
      department: {
        Row: {
          annualbudget: number | null
          customerid: number | null
          departmentid: number
          departmentname: string | null
          departmentstatus: string | null
          managerid: number | null
          numberofemployees: number | null
        }
        Insert: {
          annualbudget?: number | null
          customerid?: number | null
          departmentid?: never
          departmentname?: string | null
          departmentstatus?: string | null
          managerid?: number | null
          numberofemployees?: number | null
        }
        Update: {
          annualbudget?: number | null
          customerid?: number | null
          departmentid?: never
          departmentname?: string | null
          departmentstatus?: string | null
          managerid?: number | null
          numberofemployees?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "department_managerid_fkey"
            columns: ["managerid"]
            isOneToOne: false
            referencedRelation: "employee"
            referencedColumns: ["employeeid"]
          },
        ]
      }
      employee: {
        Row: {
          address: string | null
          bloodgroup: string | null
          city: string | null
          country: string | null
          customerid: number | null
          dateofbirth: string | null
          department: string | null
          disabilitystatus: string | null
          documentpath: string | null
          email: string | null
          employeeid: number
          employeepassword: string | null
          employmentstatus: string | null
          employmenttype: string | null
          fathersname: string | null
          firstname: string | null
          gender: string | null
          jobtitle: string | null
          joiningdate: string | null
          lastname: string | null
          leavebalance: number | null
          maritalstatus: string | null
          monthlysalary: number | null
          nationality: string | null
          phonenumber: number | null
          profilepicturepath: string | null
          state: string | null
          worklocation: string | null
          zipcode: string | null
        }
        Insert: {
          address?: string | null
          bloodgroup?: string | null
          city?: string | null
          country?: string | null
          customerid?: number | null
          dateofbirth?: string | null
          department?: string | null
          disabilitystatus?: string | null
          documentpath?: string | null
          email?: string | null
          employeeid?: never
          employeepassword?: string | null
          employmentstatus?: string | null
          employmenttype?: string | null
          fathersname?: string | null
          firstname?: string | null
          gender?: string | null
          jobtitle?: string | null
          joiningdate?: string | null
          lastname?: string | null
          leavebalance?: number | null
          maritalstatus?: string | null
          monthlysalary?: number | null
          nationality?: string | null
          phonenumber?: number | null
          profilepicturepath?: string | null
          state?: string | null
          worklocation?: string | null
          zipcode?: string | null
        }
        Update: {
          address?: string | null
          bloodgroup?: string | null
          city?: string | null
          country?: string | null
          customerid?: number | null
          dateofbirth?: string | null
          department?: string | null
          disabilitystatus?: string | null
          documentpath?: string | null
          email?: string | null
          employeeid?: never
          employeepassword?: string | null
          employmentstatus?: string | null
          employmenttype?: string | null
          fathersname?: string | null
          firstname?: string | null
          gender?: string | null
          jobtitle?: string | null
          joiningdate?: string | null
          lastname?: string | null
          leavebalance?: number | null
          maritalstatus?: string | null
          monthlysalary?: number | null
          nationality?: string | null
          phonenumber?: number | null
          profilepicturepath?: string | null
          state?: string | null
          worklocation?: string | null
          zipcode?: string | null
        }
        Relationships: []
      }
      employeebankdetails: {
        Row: {
          accountnumber: string | null
          accounttype: string | null
          bankname: string | null
          branchname: string | null
          customerbankid: string | null
          employeeid: number | null
          ifsccode: string | null
        }
        Insert: {
          accountnumber?: string | null
          accounttype?: string | null
          bankname?: string | null
          branchname?: string | null
          customerbankid?: string | null
          employeeid?: number | null
          ifsccode?: string | null
        }
        Update: {
          accountnumber?: string | null
          accounttype?: string | null
          bankname?: string | null
          branchname?: string | null
          customerbankid?: string | null
          employeeid?: number | null
          ifsccode?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employeebankdetails_employeeid_fkey"
            columns: ["employeeid"]
            isOneToOne: false
            referencedRelation: "employee"
            referencedColumns: ["employeeid"]
          },
        ]
      }
      expense: {
        Row: {
          amount: number | null
          billpath: string | null
          category: string | null
          customerid: number | null
          description: string | null
          employeeid: number | null
          expenseid: number
          status: string | null
          submissiondate: string | null
          submittedby: number | null
        }
        Insert: {
          amount?: number | null
          billpath?: string | null
          category?: string | null
          customerid?: number | null
          description?: string | null
          employeeid?: number | null
          expenseid?: never
          status?: string | null
          submissiondate?: string | null
          submittedby?: number | null
        }
        Update: {
          amount?: number | null
          billpath?: string | null
          category?: string | null
          customerid?: number | null
          description?: string | null
          employeeid?: number | null
          expenseid?: never
          status?: string | null
          submissiondate?: string | null
          submittedby?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "expense_employeeid_fkey"
            columns: ["employeeid"]
            isOneToOne: false
            referencedRelation: "employee"
            referencedColumns: ["employeeid"]
          },
          {
            foreignKeyName: "expense_submittedby_fkey"
            columns: ["submittedby"]
            isOneToOne: false
            referencedRelation: "employee"
            referencedColumns: ["employeeid"]
          },
        ]
      }
      helpdesk: {
        Row: {
          attachmentpath: string | null
          customerid: number | null
          employeeid: number | null
          reportedbyemployeeid: number | null
          ticketcategory: string | null
          ticketdescription: string | null
          ticketid: number
          ticketpriority: string | null
          ticketstatus: string | null
          tickettitle: string | null
        }
        Insert: {
          attachmentpath?: string | null
          customerid?: number | null
          employeeid?: number | null
          reportedbyemployeeid?: number | null
          ticketcategory?: string | null
          ticketdescription?: string | null
          ticketid?: never
          ticketpriority?: string | null
          ticketstatus?: string | null
          tickettitle?: string | null
        }
        Update: {
          attachmentpath?: string | null
          customerid?: number | null
          employeeid?: number | null
          reportedbyemployeeid?: number | null
          ticketcategory?: string | null
          ticketdescription?: string | null
          ticketid?: never
          ticketpriority?: string | null
          ticketstatus?: string | null
          tickettitle?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "helpdesk_employeeid_fkey"
            columns: ["employeeid"]
            isOneToOne: false
            referencedRelation: "employee"
            referencedColumns: ["employeeid"]
          },
          {
            foreignKeyName: "helpdesk_reportedbyemployeeid_fkey"
            columns: ["reportedbyemployeeid"]
            isOneToOne: false
            referencedRelation: "employee"
            referencedColumns: ["employeeid"]
          },
        ]
      }
      helpdeskcomment: {
        Row: {
          commentid: number
          commenttext: string | null
          commenttimestamp: string | null
          customerid: number | null
          employeeid: number | null
          ticketid: number | null
        }
        Insert: {
          commentid?: never
          commenttext?: string | null
          commenttimestamp?: string | null
          customerid?: number | null
          employeeid?: number | null
          ticketid?: number | null
        }
        Update: {
          commentid?: never
          commenttext?: string | null
          commenttimestamp?: string | null
          customerid?: number | null
          employeeid?: number | null
          ticketid?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "helpdeskcomment_employeeid_fkey"
            columns: ["employeeid"]
            isOneToOne: false
            referencedRelation: "employee"
            referencedColumns: ["employeeid"]
          },
          {
            foreignKeyName: "helpdeskcomment_ticketid_fkey"
            columns: ["ticketid"]
            isOneToOne: false
            referencedRelation: "helpdesk"
            referencedColumns: ["ticketid"]
          },
        ]
      }
      leave: {
        Row: {
          customerid: number | null
          employeeid: number | null
          employeename: string | null
          enddate: string | null
          leaveid: number
          leavetype: string | null
          startdate: string | null
        }
        Insert: {
          customerid?: number | null
          employeeid?: number | null
          employeename?: string | null
          enddate?: string | null
          leaveid?: never
          leavetype?: string | null
          startdate?: string | null
        }
        Update: {
          customerid?: number | null
          employeeid?: number | null
          employeename?: string | null
          enddate?: string | null
          leaveid?: never
          leavetype?: string | null
          startdate?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leave_employeeid_fkey"
            columns: ["employeeid"]
            isOneToOne: false
            referencedRelation: "employee"
            referencedColumns: ["employeeid"]
          },
        ]
      }
      manageholidays: {
        Row: {
          customerid: number | null
          holidaydate: string | null
          holidayid: number
        }
        Insert: {
          customerid?: number | null
          holidaydate?: string | null
          holidayid?: never
        }
        Update: {
          customerid?: number | null
          holidaydate?: string | null
          holidayid?: never
        }
        Relationships: []
      }
      meetings: {
        Row: {
          customerid: number | null
          custommeetingurl: string | null
          meetingdate: string | null
          meetingdescription: string | null
          meetingid: number
          meetingtitle: string | null
          organizeremployeeid: number | null
          starttime: string | null
        }
        Insert: {
          customerid?: number | null
          custommeetingurl?: string | null
          meetingdate?: string | null
          meetingdescription?: string | null
          meetingid?: never
          meetingtitle?: string | null
          organizeremployeeid?: number | null
          starttime?: string | null
        }
        Update: {
          customerid?: number | null
          custommeetingurl?: string | null
          meetingdate?: string | null
          meetingdescription?: string | null
          meetingid?: never
          meetingtitle?: string | null
          organizeremployeeid?: number | null
          starttime?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meetings_organizeremployeeid_fkey"
            columns: ["organizeremployeeid"]
            isOneToOne: false
            referencedRelation: "employee"
            referencedColumns: ["employeeid"]
          },
        ]
      }
      officelocation: {
        Row: {
          customerid: number | null
          latitude: number | null
          longitude: number | null
          officelocationid: number
          premisesradius: number | null
        }
        Insert: {
          customerid?: number | null
          latitude?: number | null
          longitude?: number | null
          officelocationid?: never
          premisesradius?: number | null
        }
        Update: {
          customerid?: number | null
          latitude?: number | null
          longitude?: number | null
          officelocationid?: never
          premisesradius?: number | null
        }
        Relationships: []
      }
      payslip: {
        Row: {
          amount: number | null
          customerid: number | null
          employeeid: number | null
          generatedtimestamp: string | null
          month: number | null
          payslipid: number
          year: number | null
        }
        Insert: {
          amount?: number | null
          customerid?: number | null
          employeeid?: number | null
          generatedtimestamp?: string | null
          month?: number | null
          payslipid?: never
          year?: number | null
        }
        Update: {
          amount?: number | null
          customerid?: number | null
          employeeid?: number | null
          generatedtimestamp?: string | null
          month?: number | null
          payslipid?: never
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "payslip_employeeid_fkey"
            columns: ["employeeid"]
            isOneToOne: false
            referencedRelation: "employee"
            referencedColumns: ["employeeid"]
          },
        ]
      }
      plans: {
        Row: {
          featurelist: string | null
          planid: number
          planname: string | null
          price: number | null
        }
        Insert: {
          featurelist?: string | null
          planid?: never
          planname?: string | null
          price?: number | null
        }
        Update: {
          featurelist?: string | null
          planid?: never
          planname?: string | null
          price?: number | null
        }
        Relationships: []
      }
      project_assignments: {
        Row: {
          assignment_id: number
          created_at: string | null
          customerid: number | null
          employeeid: number | null
          projectid: number | null
        }
        Insert: {
          assignment_id?: number
          created_at?: string | null
          customerid?: number | null
          employeeid?: number | null
          projectid?: number | null
        }
        Update: {
          assignment_id?: number
          created_at?: string | null
          customerid?: number | null
          employeeid?: number | null
          projectid?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "project_assignments_projectid_fkey"
            columns: ["projectid"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["projectid"]
          },
        ]
      }
      projectcomment: {
        Row: {
          commentid: number
          commenttext: string | null
          commenttimestamp: string | null
          customerid: number | null
          employeeid: number | null
          projectid: number | null
        }
        Insert: {
          commentid?: never
          commenttext?: string | null
          commenttimestamp?: string | null
          customerid?: number | null
          employeeid?: number | null
          projectid?: number | null
        }
        Update: {
          commentid?: never
          commenttext?: string | null
          commenttimestamp?: string | null
          customerid?: number | null
          employeeid?: number | null
          projectid?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "projectcomment_employeeid_fkey"
            columns: ["employeeid"]
            isOneToOne: false
            referencedRelation: "employee"
            referencedColumns: ["employeeid"]
          },
          {
            foreignKeyName: "projectcomment_projectid_fkey"
            columns: ["projectid"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["projectid"]
          },
        ]
      }
      projectdocuments: {
        Row: {
          customerid: number | null
          documentid: number
          employeeid: number | null
          filepath: string | null
          filetype: string | null
          projectid: number | null
          uploadtimestamp: string | null
        }
        Insert: {
          customerid?: number | null
          documentid?: never
          employeeid?: number | null
          filepath?: string | null
          filetype?: string | null
          projectid?: number | null
          uploadtimestamp?: string | null
        }
        Update: {
          customerid?: number | null
          documentid?: never
          employeeid?: number | null
          filepath?: string | null
          filetype?: string | null
          projectid?: number | null
          uploadtimestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projectdocuments_employeeid_fkey"
            columns: ["employeeid"]
            isOneToOne: false
            referencedRelation: "employee"
            referencedColumns: ["employeeid"]
          },
          {
            foreignKeyName: "projectdocuments_projectid_fkey"
            columns: ["projectid"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["projectid"]
          },
        ]
      }
      projects: {
        Row: {
          assignedemployeeid: number | null
          customerid: number | null
          duedate: string | null
          priority: string | null
          projectdescription: string | null
          projectid: number
          projectname: string | null
          projectstatus: string | null
        }
        Insert: {
          assignedemployeeid?: number | null
          customerid?: number | null
          duedate?: string | null
          priority?: string | null
          projectdescription?: string | null
          projectid?: never
          projectname?: string | null
          projectstatus?: string | null
        }
        Update: {
          assignedemployeeid?: number | null
          customerid?: number | null
          duedate?: string | null
          priority?: string | null
          projectdescription?: string | null
          projectid?: never
          projectname?: string | null
          projectstatus?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_assignedemployeeid_fkey"
            columns: ["assignedemployeeid"]
            isOneToOne: false
            referencedRelation: "employee"
            referencedColumns: ["employeeid"]
          },
        ]
      }
      projecttask: {
        Row: {
          customerid: number | null
          employeeid: number | null
          projectid: number | null
          taskdescription: string | null
          taskid: number
          taskname: string | null
          taskstatus: string | null
        }
        Insert: {
          customerid?: number | null
          employeeid?: number | null
          projectid?: number | null
          taskdescription?: string | null
          taskid?: never
          taskname?: string | null
          taskstatus?: string | null
        }
        Update: {
          customerid?: number | null
          employeeid?: number | null
          projectid?: number | null
          taskdescription?: string | null
          taskid?: never
          taskname?: string | null
          taskstatus?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projecttask_employeeid_fkey"
            columns: ["employeeid"]
            isOneToOne: false
            referencedRelation: "employee"
            referencedColumns: ["employeeid"]
          },
          {
            foreignKeyName: "projecttask_projectid_fkey"
            columns: ["projectid"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["projectid"]
          },
        ]
      }
      salary: {
        Row: {
          basicsalary: number | null
          conveyanceallowance: number | null
          customerid: number | null
          employeeid: number | null
          esiemployee: number | null
          hra: number | null
          incometax: number | null
          loandeduction: number | null
          medicalallowance: number | null
          monthlysalary: number | null
          otherallowance: number | null
          otherdeduction: number | null
          pf: number | null
          professionaltax: number | null
          salaryid: number
          specialallowance: number | null
        }
        Insert: {
          basicsalary?: number | null
          conveyanceallowance?: number | null
          customerid?: number | null
          employeeid?: number | null
          esiemployee?: number | null
          hra?: number | null
          incometax?: number | null
          loandeduction?: number | null
          medicalallowance?: number | null
          monthlysalary?: number | null
          otherallowance?: number | null
          otherdeduction?: number | null
          pf?: number | null
          professionaltax?: number | null
          salaryid?: never
          specialallowance?: number | null
        }
        Update: {
          basicsalary?: number | null
          conveyanceallowance?: number | null
          customerid?: number | null
          employeeid?: number | null
          esiemployee?: number | null
          hra?: number | null
          incometax?: number | null
          loandeduction?: number | null
          medicalallowance?: number | null
          monthlysalary?: number | null
          otherallowance?: number | null
          otherdeduction?: number | null
          pf?: number | null
          professionaltax?: number | null
          salaryid?: never
          specialallowance?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "salary_employeeid_fkey"
            columns: ["employeeid"]
            isOneToOne: false
            referencedRelation: "employee"
            referencedColumns: ["employeeid"]
          },
        ]
      }
      track: {
        Row: {
          customerid: number | null
          employeeid: number | null
          latitude: number | null
          longitude: number | null
          timestamp: string | null
          trackid: number
        }
        Insert: {
          customerid?: number | null
          employeeid?: number | null
          latitude?: number | null
          longitude?: number | null
          timestamp?: string | null
          trackid?: never
        }
        Update: {
          customerid?: number | null
          employeeid?: number | null
          latitude?: number | null
          longitude?: number | null
          timestamp?: string | null
          trackid?: never
        }
        Relationships: [
          {
            foreignKeyName: "track_employeeid_fkey"
            columns: ["employeeid"]
            isOneToOne: false
            referencedRelation: "employee"
            referencedColumns: ["employeeid"]
          },
        ]
      }
      tracklist: {
        Row: {
          assignedto: number | null
          comments: string | null
          customerid: number | null
          deadline: string | null
          description: string | null
          employeeid: number | null
          priority: string | null
          resources: string | null
          status: string | null
          tasktitle: string | null
          tracklistid: number
        }
        Insert: {
          assignedto?: number | null
          comments?: string | null
          customerid?: number | null
          deadline?: string | null
          description?: string | null
          employeeid?: number | null
          priority?: string | null
          resources?: string | null
          status?: string | null
          tasktitle?: string | null
          tracklistid?: never
        }
        Update: {
          assignedto?: number | null
          comments?: string | null
          customerid?: number | null
          deadline?: string | null
          description?: string | null
          employeeid?: number | null
          priority?: string | null
          resources?: string | null
          status?: string | null
          tasktitle?: string | null
          tracklistid?: never
        }
        Relationships: [
          {
            foreignKeyName: "tracklist_assignedto_fkey"
            columns: ["assignedto"]
            isOneToOne: false
            referencedRelation: "employee"
            referencedColumns: ["employeeid"]
          },
          {
            foreignKeyName: "tracklist_employeeid_fkey"
            columns: ["employeeid"]
            isOneToOne: false
            referencedRelation: "employee"
            referencedColumns: ["employeeid"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_auth_uid: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_customer_id: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      employment_status:
        | "Active"
        | "Inactive"
        | "On Leave"
        | "Terminated"
        | "Probation"
      user_role: "admin" | "employee"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      employment_status: [
        "Active",
        "Inactive",
        "On Leave",
        "Terminated",
        "Probation",
      ],
      user_role: ["admin", "employee"],
    },
  },
} as const
