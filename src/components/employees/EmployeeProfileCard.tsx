
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, Mail, User, Edit, Droplet, Accessibility } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface EmployeeProfileCardProps {
  employee: {
    name: string;
    email: string;
    phone: string;
    employeeId: string;
    role: string;
    avatar: string;
    bloodGroup?: string;
    hasDisability?: boolean;
  };
  isEditMode: boolean;
  onEditProfile: () => void;
  onCancelEdit: () => void;
  onSaveProfile: () => void;
  onInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EmployeeProfileCard: React.FC<EmployeeProfileCardProps> = ({
  employee,
  isEditMode,
  onEditProfile,
  onCancelEdit,
  onSaveProfile,
  onInputChange
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
            {isEditMode ? (
              <Input 
                className="mt-4 text-center" 
                name="name" 
                value={employee.name} 
                onChange={onInputChange}
              />
            ) : (
              <h3 className="mt-4 text-lg font-semibold">{employee.name}</h3>
            )}
            
            {isEditMode ? (
              <Input 
                className="mt-1 text-center text-sm" 
                name="role" 
                value={employee.role} 
                onChange={onInputChange}
              />
            ) : (
              <p className="text-sm text-gray-500">{employee.role}</p>
            )}
            
            {employee.bloodGroup && !isEditMode && (
              <Badge variant="outline" className="mt-2 bg-blue-50 text-blue-700 border-blue-200">
                <Droplet className="h-3 w-3 mr-1" /> {employee.bloodGroup}
              </Badge>
            )}
            
            {employee.hasDisability && !isEditMode && (
              <Badge variant="outline" className="mt-2 bg-purple-50 text-purple-700 border-purple-200">
                <Accessibility className="h-3 w-3 mr-1" /> PWD
              </Badge>
            )}
          </div>
          
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              {isEditMode ? (
                <Input 
                  className="text-sm" 
                  name="phone" 
                  value={employee.phone} 
                  onChange={onInputChange}
                />
              ) : (
                <span className="text-sm">{employee.phone}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              {isEditMode ? (
                <Input 
                  className="text-sm" 
                  name="email" 
                  value={employee.email} 
                  onChange={onInputChange}
                />
              ) : (
                <span className="text-sm">{employee.email}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              {isEditMode ? (
                <Input 
                  className="text-sm" 
                  name="employeeId" 
                  value={employee.employeeId} 
                  onChange={onInputChange}
                />
              ) : (
                <span className="text-sm">{employee.employeeId}</span>
              )}
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
