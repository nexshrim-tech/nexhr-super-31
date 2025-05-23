
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, Mail, MapPin, Calendar, Building, Edit } from "lucide-react";

interface EmployeeInfoCardProps {
  employee: {
    id: string;
    name: string;
    email: string;
    phone: string;
    position: string;
    department: string;
    joiningDate: string;
    status: string;
    avatar: string;
    address: string;
    aadharNumber?: string;
    panNumber?: string;
  };
  onEditAadhar: () => void;
  onEditPan: () => void;
}

const EmployeeInfoCard: React.FC<EmployeeInfoCardProps> = ({
  employee,
  onEditAadhar,
  onEditPan,
}) => {
  return (
    <Card className="h-fit">
      <CardHeader className="text-center pb-4">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={employee.avatar} alt={employee.name} />
            <AvatarFallback className="text-xl">
              {employee.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl">{employee.name}</CardTitle>
            <p className="text-gray-500">{employee.position}</p>
            <Badge variant="outline" className="mt-2">
              {employee.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Mail className="h-4 w-4 text-gray-400" />
            <span className="text-sm">{employee.email}</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Phone className="h-4 w-4 text-gray-400" />
            <span className="text-sm">{employee.phone}</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Building className="h-4 w-4 text-gray-400" />
            <span className="text-sm">{employee.department}</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-sm">Joined {employee.joiningDate}</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="text-sm">{employee.address}</span>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h4 className="font-medium mb-3">Documents</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Aadhar Card</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onEditAadhar}
              >
                <Edit className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">PAN Card</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onEditPan}
              >
                <Edit className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeInfoCard;
