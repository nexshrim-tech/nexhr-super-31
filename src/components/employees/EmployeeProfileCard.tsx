
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, Mail, User, Edit } from "lucide-react";

interface EmployeeProfileCardProps {
  employee: {
    name: string;
    email: string;
    phone: string;
    employeeId: string;
    role: string;
    avatar: string;
  };
  isEditMode: boolean;
  onEditProfile: () => void;
  onCancelEdit: () => void;
  onSaveProfile: () => void;
}

const EmployeeProfileCard: React.FC<EmployeeProfileCardProps> = ({
  employee,
  isEditMode,
  onEditProfile,
  onCancelEdit,
  onSaveProfile
}) => {
  return (
    <Card className="lg:col-span-1">
      <CardContent className="relative overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
        <div className="px-6 pb-6">
          <div className="flex flex-col items-center -mt-12">
            <Avatar className="h-24 w-24 border-4 border-white bg-white">
              <AvatarImage src="" alt={employee.name} />
              <AvatarFallback className="text-lg">{employee.avatar}</AvatarFallback>
            </Avatar>
            <h3 className="mt-4 text-lg font-semibold">{employee.name}</h3>
            <p className="text-sm text-gray-500">{employee.role}</p>
          </div>
          
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{employee.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{employee.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{employee.employeeId}</span>
            </div>
          </div>
          
          <div className="mt-6">
            {isEditMode ? (
              <div className="flex gap-2">
                <Button variant="outline" className="w-1/2" onClick={onCancelEdit}>
                  Cancel
                </Button>
                <Button className="w-1/2" onClick={onSaveProfile}>
                  Save
                </Button>
              </div>
            ) : (
              <Button className="w-full" onClick={onEditProfile}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeProfileCard;
