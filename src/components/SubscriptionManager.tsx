
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Star, Check, ChevronRight } from "lucide-react";
import { useSubscription } from '@/context/SubscriptionContext';

const SubscriptionManager: React.FC = () => {
  const { plan, setShowSubscriptionModal } = useSubscription();

  const getPlanColor = () => {
    switch (plan) {
      case "Starter":
        return "bg-blue-100 text-blue-800";
      case "Professional":
        return "bg-purple-100 text-purple-800";
      case "Business":
        return "bg-amber-100 text-amber-800";
      case "Enterprise":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPlanFeatures = () => {
    switch (plan) {
      case "Starter":
        return ["Employee Management", "Attendance Tracking", "Leave Management"];
      case "Professional":
        return ["Employee Management", "Attendance Tracking", "Leave Management", "Document Generation", "Salary Management", "Asset Management"];
      case "Business":
        return ["Employee Management", "Attendance Tracking", "Leave Management", "Document Generation", "Salary Management", "Asset Management", "Expense Management", "Help Desk", "Project Management"];
      case "Enterprise":
        return ["Employee Management", "Attendance Tracking", "Leave Management", "Document Generation", "Salary Management", "Asset Management", "Expense Management", "Help Desk", "Project Management", "Advanced Analytics"];
      default:
        return ["Limited features available"];
    }
  };

  return (
    <Card className="w-full shadow-md overflow-hidden border-t-4 border-t-nexhr-primary animate-fade-in hover:shadow-lg transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 pb-6">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-nexhr-primary" />
              Subscription
            </CardTitle>
            <CardDescription className="mt-1">
              Manage your current subscription plan
            </CardDescription>
          </div>
          <Badge className={`${getPlanColor()} font-medium px-3 py-1 rounded-full`}>
            {plan === "None" ? "Free Trial" : plan}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {plan === "None" ? (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
              <Star className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-800">You're on a free trial</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Upgrade to unlock premium features and get full access to all NexHR tools.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Plan features:</h4>
              <ul className="space-y-2">
                {getPlanFeatures().map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 flex justify-between border-t">
        <div className="text-sm text-gray-500">
          {plan !== "None" 
            ? "Your subscription renews on the 15th of each month" 
            : "No payment information required for free trial"
          }
        </div>
        <Button 
          onClick={() => setShowSubscriptionModal(true)}
          className="gap-1 group"
        >
          {plan === "None" ? "Upgrade Plan" : "Manage Plan"}
          <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubscriptionManager;
