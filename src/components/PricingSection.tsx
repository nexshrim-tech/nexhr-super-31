
import React from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

interface PricingPlanProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

const PricingPlan: React.FC<PricingPlanProps> = ({
  title,
  price,
  description,
  features,
  cta,
  popular = false,
}) => (
  <div className={`bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl ${popular ? "border-2 border-nexhr-primary scale-105" : "border border-gray-100"}`}>
    {popular && (
      <div className="bg-nexhr-primary text-white text-center py-2 rounded-t-lg font-medium">
        Most Popular
      </div>
    )}
    <div className="p-8">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <div className="flex items-baseline mb-4">
        <span className="text-3xl font-extrabold">₹{price}</span>
        <span className="text-gray-500 ml-1">/year</span>
      </div>
      <p className="text-gray-600 mb-6">{description}</p>
      <ul className="mb-8 space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>
      <Link to="/login" className="block">
        <Button 
          className={`w-full py-6 ${popular ? "bg-nexhr-primary hover:bg-nexhr-primary/90" : ""}`}
          variant={popular ? "default" : "outline"}
        >
          {cta}
        </Button>
      </Link>
    </div>
  </div>
);

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl font-bold mb-4 relative inline-block">
            <span className="bg-gradient-to-r from-nexhr-primary to-purple-600 bg-clip-text text-transparent">Simple, Transparent Pricing</span>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-nexhr-primary to-purple-600 rounded-full"></div>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-6">
            Choose the plan that's right for your business
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <PricingPlan
            title="Starter"
            price="20,000"
            description="Perfect for small teams and startups"
            features={[
              "Up to 10 employees",
              "Core HR features",
              "Employee management",
              "Attendance tracking",
              "Basic reporting",
              "Email support"
            ]}
            cta="Get Started"
          />
          
          <PricingPlan
            title="Professional"
            price="30,000"
            description="Great for growing businesses"
            features={[
              "Up to 30 employees",
              "All Starter features",
              "Advanced reporting",
              "Document generation",
              "Salary management",
              "Priority support"
            ]}
            popular={true}
            cta="Get Started"
          />
          
          <PricingPlan
            title="Business"
            price="50,000"
            description="For established organizations"
            features={[
              "Up to 100 employees",
              "All Professional features",
              "Advanced analytics",
              "Custom workflows",
              "Integration capabilities",
              "Dedicated support"
            ]}
            cta="Get Started"
          />
          
          <PricingPlan
            title="Enterprise"
            price="Contact Us"
            description="Custom solutions for large teams"
            features={[
              "100+ employees",
              "All Business features",
              "Custom implementation",
              "White-labeling options",
              "API access",
              "Dedicated account manager"
            ]}
            cta="Contact Us"
          />
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
