
import React from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/context/SubscriptionContext";

interface FeatureLockProps {
  title: string;
  description: string;
}

const FeatureLock: React.FC<FeatureLockProps> = ({ title, description }) => {
  const { setShowSubscriptionModal } = useSubscription();
  
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[300px] p-8 text-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50">
      <div className="w-16 h-16 mb-6 rounded-full bg-gray-100 flex items-center justify-center">
        <Lock className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-700">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md">{description}</p>
      <Button 
        onClick={() => setShowSubscriptionModal(true)}
        className="animate-pulse"
      >
        Upgrade to Unlock
      </Button>
    </div>
  );
};

export default FeatureLock;
