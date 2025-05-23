
import React from 'react';
import { Lock, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/context/SubscriptionContext';
import { useAuth } from '@/context/AuthContext';

interface FeatureLockProps {
  featureName: keyof Omit<ReturnType<typeof useSubscription>['features'], 'maxEmployees'>;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const FeatureLock: React.FC<FeatureLockProps> = ({ 
  featureName, 
  children, 
  fallback 
}) => {
  const { features, setShowSubscriptionModal } = useSubscription();
  const { userRole } = useAuth();

  // Check if the feature is enabled for the current subscription
  const isFeatureEnabled = features[featureName];

  // Show upgrade prompt only for customers
  const shouldShowUpgrade = userRole === 'customer' && !isFeatureEnabled;

  if (isFeatureEnabled) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-50 border border-gray-200 rounded-lg text-center">
      <div className="p-4 bg-orange-100 rounded-full mb-4">
        <Lock className="h-8 w-8 text-orange-500" />
      </div>
      
      <h3 className="text-xl font-semibold mb-2">Feature Locked</h3>
      
      <p className="text-gray-600 mb-4 max-w-md">
        {shouldShowUpgrade 
          ? `The ${featureName.replace(/([A-Z])/g, ' $1').toLowerCase()} feature is not available in your current plan.` 
          : `This feature is not available in your company's current plan.`}
      </p>
      
      {shouldShowUpgrade && (
        <Button 
          onClick={() => setShowSubscriptionModal(true)}
          className="bg-nexhr-primary hover:bg-nexhr-primary/90 flex items-center gap-2"
        >
          <Unlock className="h-4 w-4" />
          Upgrade Plan
        </Button>
      )}
    </div>
  );
};

export default FeatureLock;
