
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, X, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/context/SubscriptionContext";

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
  const { plan: currentPlan } = useSubscription();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleSubscribe = async (plan: string) => {
    try {
      setIsProcessing(true);
      
      // In a real app, this would trigger payment processing
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Subscription activated",
        description: `Your ${plan} plan is now active. Enjoy all premium features!`,
      });
      
      onSubscribe(plan);
      
      if (!forceOpen) {
        onClose();
      }
    } catch (error) {
      console.error("Error processing subscription:", error);
      toast({
        title: "Subscription Error",
        description: "There was an error processing your subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const isPlanActive = (plan: string) => plan === currentPlan;

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
          <div className={`bg-white rounded-xl border ${isPlanActive('Starter') ? 'border-2 border-nexhr-primary' : 'border-gray-200'} shadow-sm overflow-hidden transition-all hover:shadow-md hover:border-nexhr-primary/50`}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold">Starter</h3>
                {isPlanActive('Starter') && (
                  <span className="bg-nexhr-primary/10 text-nexhr-primary text-xs font-medium px-2 py-1 rounded-full">Current Plan</span>
                )}
              </div>
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
                variant={isPlanActive('Starter') ? "default" : "outline"}
                disabled={isProcessing || isPlanActive('Starter')}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : isPlanActive('Starter') ? (
                  "Current Plan"
                ) : (
                  "Choose Plan"
                )}
              </Button>
            </div>
          </div>
          
          <div className={`bg-white rounded-xl ${isPlanActive('Professional') ? 'border-2 border-nexhr-primary' : isPlanActive('Professional') ? '' : 'border border-gray-200'} shadow-md overflow-hidden transition-all hover:shadow-lg relative`}>
            {!isPlanActive('Professional') && (
              <div className="bg-nexhr-primary text-white text-center py-1 text-sm font-medium">
                Most Popular
              </div>
            )}
            {isPlanActive('Professional') && (
              <div className="bg-green-500 text-white text-center py-1 text-sm font-medium">
                Current Plan
              </div>
            )}
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
                variant={isPlanActive('Professional') ? "outline" : "default"}
                disabled={isProcessing || isPlanActive('Professional')}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : isPlanActive('Professional') ? (
                  "Current Plan"
                ) : (
                  "Choose Plan"
                )}
              </Button>
            </div>
          </div>
          
          <div className={`bg-white rounded-xl border ${isPlanActive('Business') ? 'border-2 border-nexhr-primary' : 'border-gray-200'} shadow-sm overflow-hidden transition-all hover:shadow-md hover:border-nexhr-primary/50`}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold">Business</h3>
                {isPlanActive('Business') && (
                  <span className="bg-nexhr-primary/10 text-nexhr-primary text-xs font-medium px-2 py-1 rounded-full">Current Plan</span>
                )}
              </div>
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
                variant={isPlanActive('Business') ? "default" : "outline"}
                disabled={isProcessing || isPlanActive('Business')}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : isPlanActive('Business') ? (
                  "Current Plan"
                ) : (
                  "Choose Plan"
                )}
              </Button>
            </div>
          </div>
          
          <div className={`bg-white rounded-xl border ${isPlanActive('Enterprise') ? 'border-2 border-nexhr-primary' : 'border-gray-200'} shadow-sm overflow-hidden transition-all hover:shadow-md hover:border-nexhr-primary/50`}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold">Enterprise</h3>
                {isPlanActive('Enterprise') && (
                  <span className="bg-nexhr-primary/10 text-nexhr-primary text-xs font-medium px-2 py-1 rounded-full">Current Plan</span>
                )}
              </div>
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
                variant={isPlanActive('Enterprise') ? "default" : "outline"}
                disabled={isProcessing || isPlanActive('Enterprise')}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : isPlanActive('Enterprise') ? (
                  "Current Plan"
                ) : (
                  "Contact Sales"
                )}
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
