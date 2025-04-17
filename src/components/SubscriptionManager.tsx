
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Star, Check, ChevronRight, Zap, Calendar } from "lucide-react";
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

  // Calculate renewal date (for display purposes)
  const getRenewalDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Card className="w-full shadow-md overflow-hidden border-t-4 border-t-nexhr-primary animate-fade-in hover:shadow-lg transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 pb-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 p-2 rounded-full">
              <CreditCard className="h-5 w-5 text-nexhr-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-medium">Subscription</CardTitle>
              <CardDescription className="mt-1">
                Manage your current subscription plan
              </CardDescription>
            </div>
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
              <div className="rounded-full bg-amber-100 p-1.5 flex-shrink-0">
                <Star className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">You're on a free trial</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Upgrade to unlock premium features and get full access to all NexHR tools.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Calendar className="h-4 w-4" />
                <span>Renews on {getRenewalDate()}</span>
              </div>
              <h4 className="font-medium text-gray-700 flex items-center gap-2">
                <Zap className="h-4 w-4 text-nexhr-primary" /> Plan features:
              </h4>
              <ul className="space-y-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                {getPlanFeatures().map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="bg-green-100 rounded-full p-0.5">
                      <Check className="h-3.5 w-3.5 text-green-600" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 flex justify-between border-t py-4">
        <div className="text-sm text-gray-500">
          {plan !== "None" 
            ? "Your subscription is active and automatically renews" 
            : "No payment information required for free trial"
          }
        </div>
        <Button 
          onClick={() => setShowSubscriptionModal(true)}
          className="gap-1 group bg-nexhr-primary hover:bg-nexhr-primary/90"
        >
          {plan === "None" ? "Upgrade Plan" : "Manage Plan"}
          <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubscriptionManager;
