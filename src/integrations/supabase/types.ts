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
          asset_id: string
          assetname: string | null
          assetstatus: string | null
          assettype: string | null
          assetvalue: number | null
          billpath: string | null
          customer_id: string
          employee_id: string
          purchasedate: string | null
          serialnumber: string | null
        }
        Insert: {
          asset_id?: string
          assetname?: string | null
          assetstatus?: string | null
          assettype?: string | null
          assetvalue?: number | null
          billpath?: string | null
          customer_id: string
          employee_id: string
          purchasedate?: string | null
          serialnumber?: string | null
        }
        Update: {
          asset_id?: string
          assetname?: string | null
          assetstatus?: string | null
          assettype?: string | null
          assetvalue?: number | null
          billpath?: string | null
          customer_id?: string
          employee_id?: string
          purchasedate?: string | null
          serialnumber?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assetmanagement_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: true
            referencedRelation: "customer"
            referencedColumns: ["customerid"]
          },
          {
            foreignKeyName: "assetmanagement_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: true
            referencedRelation: "employee"
            referencedColumns: ["employeeid"]
          },
        ]
      }
      attendance: {
        Row: {
          checkintimestamp: string | null
          checkouttimestamp: string | null
          customerid: string
          employeeid: string
          selfieimagepath: string | null
          status: string | null
        }
        Insert: {
          checkintimestamp?: string | null
          checkouttimestamp?: string | null
          customerid: string
          employeeid: string
          selfieimagepath?: string | null
          status?: string | null
        }
        Update: {
          checkintimestamp?: string | null
          checkouttimestamp?: string | null
          customerid?: string
          employeeid?: string
          selfieimagepath?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_customerid_fkey"
            columns: ["customerid"]
            isOneToOne: true
            referencedRelation: "customer"
            referencedColumns: ["customerid"]
          },
          {
            foreignKeyName: "attendance_employeeid_fkey"
            columns: ["employeeid"]
            isOneToOne: true
            referencedRelation: "employee"
            referencedColumns: ["employeeid"]
          },
        ]
      }
      attendancesettings: {
        Row: {
          attendancesettingid: string
          customerid: string
          employee_id: string
          geofencingenabled: boolean | null
          latethreshold: unknown | null
          photoverificationenabled: boolean | null
          workstarttime: string | null
        }
        Insert: {
          attendancesettingid?: string
          customerid: string
          employee_id: string
          geofencingenabled?: boolean | null
          latethreshold?: unknown | null
          photoverificationenabled?: boolean | null
          workstarttime?: string | null
        }
        Update: {
          attendancesettingid?: string
          customerid?: string
          employee_id?: string
          geofencingenabled?: boolean | null
          latethreshold?: unknown | null
          photoverificationenabled?: boolean | null
          workstarttime?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendancesettings_customerid_fkey"
            columns: ["customerid"]
            isOneToOne: true
            referencedRelation: "customer"
            referencedColumns: ["customerid"]
          },
          {
            foreignKeyName: "attendancesettings_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: true
            referencedRelation: "employee"
            referencedColumns: ["employeeid"]
          },
        ]
      }
      customer: {
        Row: {
          companysize: string | null
          customerauthid: string
          customerid: string
          email: string | null
          name: string | null
          phonenumber: string | null
          planid: number | null
        }
        Insert: {
          companysize?: string | null
          customerauthid?: string
          customerid?: string
          email?: string | null
          name?: string | null
          phonenumber?: string | null
          planid?: number | null
        }
        Update: {
          companysize?: string | null
          customerauthid?: string
          customerid?: string
          email?: string | null
          name?: string | null
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
          customerid: string
          departmentid: string
          departmentname: string | null
          departmentstatus: string | null
          managerid: string
          numberofemployees: number | null
        }
        Insert: {
          annualbudget?: number | null
          customerid: string
          departmentid?: string
          departmentname?: string | null
          departmentstatus?: string | null
          managerid: string
          numberofemployees?: number | null
        }
        Update: {
          annualbudget?: number | null
          customerid?: string
          departmentid?: string
          departmentname?: string | null
          departmentstatus?: string | null
          managerid?: string
          numberofemployees?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "department_customerid_fkey"
            columns: ["customerid"]
            isOneToOne: true
            referencedRelation: "customer"
            referencedColumns: ["customerid"]
          },
        ]
      }
      employee: {
        Row: {
          address: string | null
          bloodgroup: string | null
          city: string | null
          country: string | null
          customerid: string
          dateofbirth: string | null
          department: string | null
          disabilitystatus: string | null
          documentpath: Json | null
          email: string | null
          employeeauthid: string | null
          employeeid: string
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
          customerid: string
          dateofbirth?: string | null
          department?: string | null
          disabilitystatus?: string | null
          documentpath?: Json | null
          email?: string | null
          employeeauthid?: string | null
          employeeid?: string
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
          customerid?: string
          dateofbirth?: string | null
          department?: string | null
          disabilitystatus?: string | null
          documentpath?: Json | null
          email?: string | null
          employeeauthid?: string | null
          employeeid?: string
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
        Relationships: [
          {
            foreignKeyName: "employee_customerid_fkey"
            columns: ["customerid"]
            isOneToOne: true
            referencedRelation: "customer"
            referencedColumns: ["customerid"]
          },
        ]
      }
      employeebankdetails: {
        Row: {
          accountnumber: string | null
          accounttype: string | null
          bankname: string | null
          branchname: string | null
          customerbankid: string | null
          employeeid: string | null
          ifsccode: string | null
        }
        Insert: {
          accountnumber?: string | null
          accounttype?: string | null
          bankname?: string | null
          branchname?: string | null
          customerbankid?: string | null
          employeeid?: string | null
          ifsccode?: string | null
        }
        Update: {
          accountnumber?: string | null
          accounttype?: string | null
          bankname?: string | null
          branchname?: string | null
          customerbankid?: string | null
          employeeid?: string | null
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
          customer_id: string | null
          customerid: number | null
          description: string | null
          employeeid: string | null
          expenseid: string
          status: string | null
          submissiondate: string | null
        }
        Insert: {
          amount?: number | null
          billpath?: string | null
          category?: string | null
          customer_id?: string | null
          customerid?: number | null
          description?: string | null
          employeeid?: string | null
          expenseid?: string
          status?: string | null
          submissiondate?: string | null
        }
        Update: {
          amount?: number | null
          billpath?: string | null
          category?: string | null
          customer_id?: string | null
          customerid?: number | null
          description?: string | null
          employeeid?: string | null
          expenseid?: string
          status?: string | null
          submissiondate?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expense_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: true
            referencedRelation: "customer"
            referencedColumns: ["customerid"]
          },
          {
            foreignKeyName: "expense_employeeid_fkey"
            columns: ["employeeid"]
            isOneToOne: true
            referencedRelation: "employee"
            referencedColumns: ["employeeid"]
          },
        ]
      }
      helpdesk: {
        Row: {
          attachmentpath: string | null
          customerid: string | null
          employeeid: string
          ticketcategory: string | null
          ticketdescription: string | null
          ticketid: string
          ticketpriority: string | null
          ticketstatus: string | null
          tickettitle: string | null
        }
        Insert: {
          attachmentpath?: string | null
          customerid?: string | null
          employeeid?: string
          ticketcategory?: string | null
          ticketdescription?: string | null
          ticketid?: string
          ticketpriority?: string | null
          ticketstatus?: string | null
          tickettitle?: string | null
        }
        Update: {
          attachmentpath?: string | null
          customerid?: string | null
          employeeid?: string
          ticketcategory?: string | null
          ticketdescription?: string | null
          ticketid?: string
          ticketpriority?: string | null
          ticketstatus?: string | null
          tickettitle?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "helpdesk_customerid_fkey"
            columns: ["customerid"]
            isOneToOne: false
            referencedRelation: "customer"
            referencedColumns: ["customerid"]
          },
          {
            foreignKeyName: "helpdesk_employeeid_fkey"
            columns: ["employeeid"]
            isOneToOne: true
            referencedRelation: "employee"
            referencedColumns: ["employeeid"]
          },
        ]
      }
      helpdeskcomment: {
        Row: {
          comment_id: string
          commenttext: string | null
          commenttimestamp: string | null
          customerid: string
          employeeid: string
          ticketid: string
        }
        Insert: {
          comment_id?: string
          commenttext?: string | null
          commenttimestamp?: string | null
          customerid?: string
          employeeid?: string
          ticketid?: string
        }
        Update: {
          comment_id?: string
          commenttext?: string | null
          commenttimestamp?: string | null
          customerid?: string
          employeeid?: string
          ticketid?: string
        }
        Relationships: [
          {
            foreignKeyName: "helpdeskcomment_customerid_fkey"
            columns: ["customerid"]
            isOneToOne: true
            referencedRelation: "customer"
            referencedColumns: ["customerid"]
          },
          {
            foreignKeyName: "helpdeskcomment_employeeid_fkey"
            columns: ["employeeid"]
            isOneToOne: true
            referencedRelation: "employee"
            referencedColumns: ["employeeid"]
          },
          {
            foreignKeyName: "helpdeskcomment_ticketid_fkey"
            columns: ["ticketid"]
            isOneToOne: true
            referencedRelation: "helpdesk"
            referencedColumns: ["ticketid"]
          },
        ]
      }
      leave: {
        Row: {
          customerid: string
          employeeid: string
          employeename: string | null
          enddate: string | null
          leaveid: string
          leavetype: string | null
          startdate: string | null
        }
        Insert: {
          customerid?: string
          employeeid: string
          employeename?: string | null
          enddate?: string | null
          leaveid?: string
          leavetype?: string | null
          startdate?: string | null
        }
        Update: {
          customerid?: string
          employeeid?: string
          employeename?: string | null
          enddate?: string | null
          leaveid?: string
          leavetype?: string | null
          startdate?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leave_customerid_fkey"
            columns: ["customerid"]
            isOneToOne: true
            referencedRelation: "customer"
            referencedColumns: ["customerid"]
          },
          {
            foreignKeyName: "leave_employeeid_fkey"
            columns: ["employeeid"]
            isOneToOne: true
            referencedRelation: "employee"
            referencedColumns: ["employeeid"]
          },
        ]
      }
      manageholidays: {
        Row: {
          customer_id: string
          holiday_id: string
          holidaydate: string | null
        }
        Insert: {
          customer_id?: string
          holiday_id?: string
          holidaydate?: string | null
        }
        Update: {
          customer_id?: string
          holiday_id?: string
          holidaydate?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "manageholidays_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: true
            referencedRelation: "customer"
            referencedColumns: ["customerid"]
          },
        ]
      }
      meetings: {
        Row: {
          customerid: string
          custommeetingurl: string | null
          meetingdate: string | null
          meetingdescription: string | null
          meetingid: string
          meetingtitle: string | null
          organizeremployeeid: string
          starttime: string | null
        }
        Insert: {
          customerid: string
          custommeetingurl?: string | null
          meetingdate?: string | null
          meetingdescription?: string | null
          meetingid: string
          meetingtitle?: string | null
          organizeremployeeid: string
          starttime?: string | null
        }
        Update: {
          customerid?: string
          custommeetingurl?: string | null
          meetingdate?: string | null
          meetingdescription?: string | null
          meetingid?: string
          meetingtitle?: string | null
          organizeremployeeid?: string
          starttime?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meetings_customerid_fkey"
            columns: ["customerid"]
            isOneToOne: true
            referencedRelation: "customer"
            referencedColumns: ["customerid"]
          },
          {
            foreignKeyName: "meetings_organizeremployeeid_fkey"
            columns: ["organizeremployeeid"]
            isOneToOne: true
            referencedRelation: "employee"
            referencedColumns: ["employeeid"]
          },
        ]
      }
      officelocation: {
        Row: {
          coordinates: number[] | null
          customerid: string
          officelocationid: string
          premisesradius: number | null
        }
        Insert: {
          coordinates?: number[] | null
          customerid: string
          officelocationid: string
          premisesradius?: number | null
        }
        Update: {
          coordinates?: number[] | null
          customerid?: string
          officelocationid?: string
          premisesradius?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "officelocation_customerid_fkey"
            columns: ["customerid"]
            isOneToOne: true
            referencedRelation: "customer"
            referencedColumns: ["customerid"]
          },
        ]
      }
      payslip: {
        Row: {
          amount: number | null
          customerid: string
          employeeid: string
          generatedtimestamp: string | null
          payslip_id: string
          payslipdate: string | null
        }
        Insert: {
          amount?: number | null
          customerid: string
          employeeid: string
          generatedtimestamp?: string | null
          payslip_id: string
          payslipdate?: string | null
        }
        Update: {
          amount?: number | null
          customerid?: string
          employeeid?: string
          generatedtimestamp?: string | null
          payslip_id?: string
          payslipdate?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payslip_customerid_fkey"
            columns: ["customerid"]
            isOneToOne: true
            referencedRelation: "customer"
            referencedColumns: ["customerid"]
          },
          {
            foreignKeyName: "payslip_employeeid_fkey"
            columns: ["employeeid"]
            isOneToOne: true
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
      projectcomment: {
        Row: {
          commentid: string
          commenttext: string | null
          commenttimestamp: string | null
          customerid: string
          employeeid: string
          projectid: string
        }
        Insert: {
          commentid: string
          commenttext?: string | null
          commenttimestamp?: string | null
          customerid: string
          employeeid: string
          projectid: string
        }
        Update: {
          commentid?: string
          commenttext?: string | null
          commenttimestamp?: string | null
          customerid?: string
          employeeid?: string
          projectid?: string
        }
        Relationships: [
          {
            foreignKeyName: "projectcomment_customerid_fkey"
            columns: ["customerid"]
            isOneToOne: true
            referencedRelation: "customer"
            referencedColumns: ["customerid"]
          },
          {
            foreignKeyName: "projectcomment_employeeid_fkey"
            columns: ["employeeid"]
            isOneToOne: true
            referencedRelation: "employee"
            referencedColumns: ["employeeid"]
          },
          {
            foreignKeyName: "projectcomment_projectid_fkey"
            columns: ["projectid"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["projectid"]
          },
        ]
      }
      projectdocuments: {
        Row: {
          customerid: string
          document_id: string
          employeeid: string
          filepath: Json | null
          filetype: string | null
          projectid: string
          uploadtimestamp: string | null
        }
        Insert: {
          customerid: string
          document_id: string
          employeeid: string
          filepath?: Json | null
          filetype?: string | null
          projectid: string
          uploadtimestamp?: string | null
        }
        Update: {
          customerid?: string
          document_id?: string
          employeeid?: string
          filepath?: Json | null
          filetype?: string | null
          projectid?: string
          uploadtimestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projectdocuments_customerid_fkey"
            columns: ["customerid"]
            isOneToOne: true
            referencedRelation: "customer"
            referencedColumns: ["customerid"]
          },
          {
            foreignKeyName: "projectdocuments_employeeid_fkey"
            columns: ["employeeid"]
            isOneToOne: true
            referencedRelation: "employee"
            referencedColumns: ["employeeid"]
          },
          {
            foreignKeyName: "projectdocuments_projectid_fkey"
            columns: ["projectid"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["projectid"]
          },
        ]
      }
      projects: {
        Row: {
          assignedemployeeid: string[]
          customerid: string
          duedate: string | null
          priority: string | null
          projectdescription: string | null
          projectid: string
          projectname: string | null
          projectstatus: string | null
        }
        Insert: {
          assignedemployeeid: string[]
          customerid: string
          duedate?: string | null
          priority?: string | null
          projectdescription?: string | null
          projectid: string
          projectname?: string | null
          projectstatus?: string | null
        }
        Update: {
          assignedemployeeid?: string[]
          customerid?: string
          duedate?: string | null
          priority?: string | null
          projectdescription?: string | null
          projectid?: string
          projectname?: string | null
          projectstatus?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_customerid_fkey"
            columns: ["customerid"]
            isOneToOne: true
            referencedRelation: "customer"
            referencedColumns: ["customerid"]
          },
        ]
      }
      projecttask: {
        Row: {
          comments: Json | null
          customerid: string
          employeeid: string
          projectid: string
          task_id: string
          taskdescription: string | null
          taskname: string | null
          taskstatus: string | null
        }
        Insert: {
          comments?: Json | null
          customerid: string
          employeeid: string
          projectid: string
          task_id?: string
          taskdescription?: string | null
          taskname?: string | null
          taskstatus?: string | null
        }
        Update: {
          comments?: Json | null
          customerid?: string
          employeeid?: string
          projectid?: string
          task_id?: string
          taskdescription?: string | null
          taskname?: string | null
          taskstatus?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projecttask_customerid_fkey"
            columns: ["customerid"]
            isOneToOne: true
            referencedRelation: "customer"
            referencedColumns: ["customerid"]
          },
          {
            foreignKeyName: "projecttask_employeeid_fkey"
            columns: ["employeeid"]
            isOneToOne: true
            referencedRelation: "employee"
            referencedColumns: ["employeeid"]
          },
          {
            foreignKeyName: "projecttask_projectid_fkey"
            columns: ["projectid"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["projectid"]
          },
        ]
      }
      salary: {
        Row: {
          basicsalary: number | null
          conveyanceallowance: number | null
          customerid: string
          employeeid: string
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
          salaryid: string
          specialallowance: number | null
        }
        Insert: {
          basicsalary?: number | null
          conveyanceallowance?: number | null
          customerid: string
          employeeid: string
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
          salaryid: string
          specialallowance?: number | null
        }
        Update: {
          basicsalary?: number | null
          conveyanceallowance?: number | null
          customerid?: string
          employeeid?: string
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
          salaryid?: string
          specialallowance?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "salary_customerid_fkey"
            columns: ["customerid"]
            isOneToOne: true
            referencedRelation: "customer"
            referencedColumns: ["customerid"]
          },
          {
            foreignKeyName: "salary_employeeid_fkey"
            columns: ["employeeid"]
            isOneToOne: true
            referencedRelation: "employee"
            referencedColumns: ["employeeid"]
          },
        ]
      }
      tasklist: {
        Row: {
          assignedto: string
          comments: string | null
          customerid: string
          deadline: string | null
          description: string | null
          employeeid: string
          priority: string | null
          resources: string | null
          status: string | null
          tasklistid: string
          tasktitle: string | null
        }
        Insert: {
          assignedto: string
          comments?: string | null
          customerid: string
          deadline?: string | null
          description?: string | null
          employeeid: string
          priority?: string | null
          resources?: string | null
          status?: string | null
          tasklistid: string
          tasktitle?: string | null
        }
        Update: {
          assignedto?: string
          comments?: string | null
          customerid?: string
          deadline?: string | null
          description?: string | null
          employeeid?: string
          priority?: string | null
          resources?: string | null
          status?: string | null
          tasklistid?: string
          tasktitle?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasklist_customerid_fkey"
            columns: ["customerid"]
            isOneToOne: true
            referencedRelation: "customer"
            referencedColumns: ["customerid"]
          },
          {
            foreignKeyName: "tasklist_employeeid_fkey"
            columns: ["employeeid"]
            isOneToOne: true
            referencedRelation: "employee"
            referencedColumns: ["employeeid"]
          },
        ]
      }
      track: {
        Row: {
          coordinates: number[] | null
          customerid: string
          employeeid: string
          timestamp: string | null
          track_id: string
        }
        Insert: {
          coordinates?: number[] | null
          customerid: string
          employeeid: string
          timestamp?: string | null
          track_id: string
        }
        Update: {
          coordinates?: number[] | null
          customerid?: string
          employeeid?: string
          timestamp?: string | null
          track_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "track_customerid_fkey"
            columns: ["customerid"]
            isOneToOne: true
            referencedRelation: "customer"
            referencedColumns: ["customerid"]
          },
          {
            foreignKeyName: "track_employeeid_fkey"
            columns: ["employeeid"]
            isOneToOne: true
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
      get_employee_by_auth_id: {
        Args: { auth_id: string }
        Returns: {
          address: string | null
          bloodgroup: string | null
          city: string | null
          country: string | null
          customerid: string
          dateofbirth: string | null
          department: string | null
          disabilitystatus: string | null
          documentpath: Json | null
          email: string | null
          employeeauthid: string | null
          employeeid: string
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
        }[]
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      register_employee: {
        Args: { p_email: string; p_password: string; p_employee_id: string }
        Returns: string
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
