
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, X, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: (plan: string) => void;
  forceOpen?: boolean;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  onSubscribe,
  forceOpen = false
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = React.useState(false);
  
  const handleSubscribe = async (plan: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to subscribe to a plan",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const { data: planData, error: planError } = await supabase
        .from('plans')
        .select('planid')
        .eq('planname', plan)
        .single();
        
      if (planError) throw planError;
      
      // Get current customer ID safely
      const { data: customerId, error: customerIdError } = await supabase.rpc('get_current_customer_id');
      
      if (customerIdError) throw customerIdError;
      
      const { error: updateError } = await supabase
        .from('customer')
        .update({ planid: planData.planid })
        .eq('customerid', customerId);
        
      if (updateError) throw updateError;
      
      toast({
        title: "Subscription activated",
        description: `Your ${plan} plan is now active. Enjoy all premium features!`,
      });
      
      localStorage.setItem("subscription-plan", plan);
      onSubscribe(plan);
    } catch (error) {
      console.error("Subscription error:", error);
      toast({
        title: "Subscription failed",
        description: "There was an error processing your subscription.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open && !forceOpen) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-5xl w-[90vw] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            <span className="bg-gradient-to-r from-nexhr-primary to-purple-600 bg-clip-text text-transparent">
              Unlock All Features
            </span>
          </DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            Choose a subscription plan to access all NexHR features
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all hover:shadow-md hover:border-nexhr-primary/50">
            <div className="p-6">
              <h3 className="text-lg font-bold">Starter</h3>
              <div className="mt-2 flex items-baseline">
                <span className="text-2xl font-bold">₹20,000</span>
                <span className="text-gray-500 ml-1 text-sm">/year</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">For small teams up to 10 employees</p>
              
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Employee Management</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Attendance Tracking</span>
                </li>
                <li className="flex">
                  <X className="h-5 w-5 text-gray-300 mr-2 flex-shrink-0" />
                  <span className="text-gray-400">Document Generation</span>
                </li>
                <li className="flex">
                  <X className="h-5 w-5 text-gray-300 mr-2 flex-shrink-0" />
                  <span className="text-gray-400">Salary Management</span>
                </li>
              </ul>
              
              <Button 
                onClick={() => handleSubscribe("Starter")}
                className="mt-6 w-full" 
                variant="outline"
                disabled={isProcessing}
              >
                Choose Plan
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border-2 border-nexhr-primary shadow-md overflow-hidden transition-all hover:shadow-lg relative">
            <div className="bg-nexhr-primary text-white text-center py-1 text-sm font-medium">
              Most Popular
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold">Professional</h3>
              <div className="mt-2 flex items-baseline">
                <span className="text-2xl font-bold">₹30,000</span>
                <span className="text-gray-500 ml-1 text-sm">/year</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">For growing teams up to 30 employees</p>
              
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Employee Management</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Attendance Tracking</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Document Generation</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Salary Management</span>
                </li>
              </ul>
              
              <Button 
                onClick={() => handleSubscribe("Professional")}
                className="mt-6 w-full"
                disabled={isProcessing}
              >
                Choose Plan
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all hover:shadow-md hover:border-nexhr-primary/50">
            <div className="p-6">
              <h3 className="text-lg font-bold">Business</h3>
              <div className="mt-2 flex items-baseline">
                <span className="text-2xl font-bold">₹50,000</span>
                <span className="text-gray-500 ml-1 text-sm">/year</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">For teams up to 100 employees</p>
              
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>All Professional features</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Advanced Analytics</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Custom Workflows</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Integration Capabilities</span>
                </li>
              </ul>
              
              <Button 
                onClick={() => handleSubscribe("Business")}
                className="mt-6 w-full" 
                variant="outline"
              >
                Choose Plan
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all hover:shadow-md hover:border-nexhr-primary/50">
            <div className="p-6">
              <h3 className="text-lg font-bold">Enterprise</h3>
              <div className="mt-2 flex items-baseline">
                <span className="text-2xl font-bold">Custom</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">For organizations with 100+ employees</p>
              
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>All Business features</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Custom Implementation</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>White-labeling Options</span>
                </li>
                <li className="flex">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Dedicated Account Manager</span>
                </li>
              </ul>
              
              <Button 
                onClick={() => handleSubscribe("Enterprise")}
                className="mt-6 w-full" 
                variant="outline"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-700">
            <p className="font-medium">This is a demo application</p>
            <p className="mt-1">In a production environment, this would connect to a payment processor. For this demo, clicking "Choose Plan" will simulate a successful subscription.</p>
          </div>
        </div>
        
        {!forceOpen && (
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={onClose} disabled={isProcessing}>
              Maybe Later
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionModal;
