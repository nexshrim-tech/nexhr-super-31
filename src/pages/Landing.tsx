
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ChevronRight, ArrowRight, Shield, Clock, Users, FileText, Building, Database } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const LandingPage = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col">
      {/* Navigation */}
      <header className="w-full py-4 px-6 flex justify-between items-center border-b bg-white">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-nexhr-primary to-purple-600 bg-clip-text text-transparent">
            NexHR
          </h1>
        </div>
        <div className="space-x-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button>Dashboard</Button>
              </Link>
              <Link to="/logout">
                <Button variant="outline">Log Out</Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="outline">Log In</Button>
              </Link>
              <Link to="/login?tab=signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-6 py-16 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-nexhr-primary to-purple-600 bg-clip-text text-transparent">
            Simplify HR & Payroll Management
          </h1>
          <p className="text-lg text-gray-600">
            An all-in-one HR platform designed to streamline your employee management, 
            attendance tracking, payroll processing, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link to={user ? "/" : "/login?tab=signup"}>
              <Button size="lg" className="gap-2">
                {user ? "Go to Dashboard" : "Get Started"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="#pricing">
              <Button size="lg" variant="outline" className="gap-2">
                View Pricing
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <img 
            src="/lovable-uploads/5f84f812-bedb-480e-ac18-b71a9a3e45e8.png" 
            alt="NexHR Dashboard" 
            className="rounded-lg shadow-xl w-full max-w-xl object-cover"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">All-In-One HR Solution</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              NexHR provides a comprehensive suite of tools to manage your entire HR workflow,
              from hiring to retirement, and everything in between.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="rounded-full bg-blue-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Employee Management</h3>
              <p className="text-gray-600">
                Maintain comprehensive employee profiles with all relevant information in one place.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="rounded-full bg-green-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Attendance Tracking</h3>
              <p className="text-gray-600">
                Track employee attendance with geolocation and photo verification for accuracy.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="rounded-full bg-purple-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Document Management</h3>
              <p className="text-gray-600">
                Generate and manage HR documents, contracts, and employee records securely.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="rounded-full bg-yellow-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Building className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Department Management</h3>
              <p className="text-gray-600">
                Organize employees by department, assign managers, and track budgets.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="rounded-full bg-red-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Database className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Asset Management</h3>
              <p className="text-gray-600">
                Track company assets assigned to employees and manage their lifecycle.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="rounded-full bg-indigo-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Data Security</h3>
              <p className="text-gray-600">
                Enterprise-grade security to protect your sensitive HR data and employee information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="w-full py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Pricing Plans</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your organization's needs and scale as you grow.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle>Starter</CardTitle>
                <div className="mt-2 flex items-baseline">
                  <span className="text-3xl font-bold">₹20,000</span>
                  <span className="text-gray-500 ml-1 text-sm">/year</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">For small teams up to 10 employees</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Employee Management</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Attendance Tracking</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Leave Management</span>
                  </li>
                  <li className="flex items-start opacity-50">
                    <Check className="h-5 w-5 text-gray-300 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Document Generation</span>
                  </li>
                  <li className="flex items-start opacity-50">
                    <Check className="h-5 w-5 text-gray-300 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Salary Management</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link to="/login?tab=signup" className="w-full">
                  <Button className="w-full" variant="outline">
                    Get Started
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            
            <Card className="border-2 border-nexhr-primary shadow-md relative">
              <div className="bg-nexhr-primary text-white text-center py-1 text-sm font-medium">
                Most Popular
              </div>
              <CardHeader>
                <CardTitle>Professional</CardTitle>
                <div className="mt-2 flex items-baseline">
                  <span className="text-3xl font-bold">₹30,000</span>
                  <span className="text-gray-500 ml-1 text-sm">/year</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">For growing teams up to 30 employees</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>All Starter features</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Document Generation</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Salary Management</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Asset Management</span>
                  </li>
                  <li className="flex items-start opacity-50">
                    <Check className="h-5 w-5 text-gray-300 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Help Desk</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link to="/login?tab=signup" className="w-full">
                  <Button className="w-full">
                    Get Started
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle>Business</CardTitle>
                <div className="mt-2 flex items-baseline">
                  <span className="text-3xl font-bold">₹50,000</span>
                  <span className="text-gray-500 ml-1 text-sm">/year</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">For teams up to 100 employees</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>All Professional features</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Expense Management</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Help Desk</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Project Management</span>
                  </li>
                  <li className="flex items-start opacity-50">
                    <Check className="h-5 w-5 text-gray-300 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Advanced Analytics</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link to="/login?tab=signup" className="w-full">
                  <Button className="w-full" variant="outline">
                    Get Started
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <div className="mt-2 flex items-baseline">
                  <span className="text-3xl font-bold">Custom</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">For organizations with 100+ employees</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>All Business features</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Advanced Analytics</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Custom Implementation</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>White-labeling Options</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Dedicated Support</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link to="/login?tab=signup" className="w-full">
                  <Button className="w-full" variant="outline">
                    Contact Sales
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-nexhr-primary py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to streamline your HR operations?
          </h2>
          <p className="text-white text-opacity-90 text-lg mb-8 max-w-3xl mx-auto">
            Join thousands of companies that use NexHR to simplify their HR management
            and focus on what matters most: their people and business.
          </p>
          <Link to="/login?tab=signup">
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white hover:bg-gray-100 text-nexhr-primary border-white"
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">NexHR</h3>
              <p className="text-gray-400">
                Simplifying HR management for businesses of all sizes.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Integrations</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Roadmap</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Support</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Community</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2023 NexHR. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
