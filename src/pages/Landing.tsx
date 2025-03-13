
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  ArrowRight, 
  BarChart2, 
  Calendar, 
  Users, 
  Shield, 
  Zap, 
  FileText, 
  MessageSquare, 
  HelpCircle, 
  DollarSign, 
  Package,
  Mail,
  Phone,
  MapPin,
  Star
} from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Header/Navbar */}
      <header className="bg-white border-b py-4 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-nexhr-primary to-purple-600 bg-clip-text text-transparent animate-fade-in">
            NEX<span className="font-normal">HR</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-nexhr-primary transition-colors duration-300">Features</a>
            <a href="#benefits" className="text-gray-600 hover:text-nexhr-primary transition-colors duration-300">Benefits</a>
            <a href="#testimonials" className="text-gray-600 hover:text-nexhr-primary transition-colors duration-300">Testimonials</a>
            <a href="#contact" className="text-gray-600 hover:text-nexhr-primary transition-colors duration-300">Contact</a>
          </nav>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="outline" className="transition-all duration-300 hover:scale-105">Sign in</Button>
            </Link>
            <Link to="/login">
              <Button className="transition-all duration-300 hover:scale-105 shadow-md">Sign up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-12 md:mb-0 animate-fade-in" style={{animationDelay: "0.2s"}}>
              <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight bg-gradient-to-r from-nexhr-primary to-purple-600 bg-clip-text text-transparent">
                Transform Your HR Management
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Streamline operations, boost productivity, and enhance employee satisfaction with our comprehensive HR solution.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/login">
                  <Button size="lg" className="w-full sm:w-auto transition-all duration-300 hover:scale-105 shadow-md group">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="w-full sm:w-auto transition-all duration-300 hover:scale-105">
                  Request Demo
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 animate-fade-in" style={{animationDelay: "0.4s"}}>
              <div className="relative">
                <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-nexhr-primary to-purple-600 opacity-75 blur"></div>
                <img 
                  src="/placeholder.svg" 
                  alt="HR Dashboard" 
                  className="relative rounded-lg shadow-2xl transform transition-all duration-500 hover:scale-[1.02]"
                  style={{ maxWidth: "600px" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4 relative inline-block">
              <span className="bg-gradient-to-r from-nexhr-primary to-purple-600 bg-clip-text text-transparent">Powerful HR Features</span>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-nexhr-primary to-purple-600 rounded-full"></div>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-6">
              Everything you need to manage your workforce efficiently in one place
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Cards */}
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md hover:transform hover:scale-[1.02] animate-fade-in" style={{animationDelay: "0.1s"}}>
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-7 w-7 text-nexhr-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Employee Management</h3>
              <p className="text-gray-600 mb-4">
                Centralize employee profiles with comprehensive data management, document storage, and performance tracking.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-700">Personnel records</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-700">Document management</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-700">Performance metrics</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md hover:transform hover:scale-[1.02] animate-fade-in" style={{animationDelay: "0.2s"}}>
              <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Calendar className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Attendance Tracking</h3>
              <p className="text-gray-600 mb-4">
                Monitor employee attendance, leaves, and work hours with intuitive dashboards and automated reporting.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-700">Real-time tracking</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-700">Leave management</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-700">Automated reports</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md hover:transform hover:scale-[1.02] animate-fade-in" style={{animationDelay: "0.3s"}}>
              <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <BarChart2 className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Asset Management</h3>
              <p className="text-gray-600 mb-4">
                Keep track of company assets assigned to employees with detailed logs and status updates.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-700">Asset tracking</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-700">Maintenance scheduling</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-700">Depreciation tracking</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md hover:transform hover:scale-[1.02] animate-fade-in" style={{animationDelay: "0.4s"}}>
              <div className="w-14 h-14 bg-yellow-100 rounded-lg flex items-center justify-center mb-6">
                <FileText className="h-7 w-7 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Document Generation</h3>
              <p className="text-gray-600 mb-4">
                Generate HR documents and letters with automated data filling and customizable templates.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-700">Custom templates</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-700">Automated filling</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-700">Bulk generation</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md hover:transform hover:scale-[1.02] animate-fade-in" style={{animationDelay: "0.5s"}}>
              <div className="w-14 h-14 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                <DollarSign className="h-7 w-7 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Salary Management</h3>
              <p className="text-gray-600 mb-4">
                Manage employee compensation, including detailed breakdowns of allowances and deductions.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-700">Pay structure configuration</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-700">Payslip generation</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-700">Tax calculations</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md hover:transform hover:scale-[1.02] animate-fade-in" style={{animationDelay: "0.6s"}}>
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <HelpCircle className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Help Desk</h3>
              <p className="text-gray-600 mb-4">
                Streamline employee assistance with an integrated ticketing system and knowledge base.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-700">Ticket management</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-700">Priority assignment</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-gray-700">Resolution tracking</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4 relative inline-block">
              <span className="bg-gradient-to-r from-nexhr-primary to-purple-600 bg-clip-text text-transparent">Why Choose NexHR</span>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-nexhr-primary to-purple-600 rounded-full"></div>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-6">
              Our platform offers unmatched benefits that transform how you manage your workforce
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in" style={{animationDelay: "0.3s"}}>
              <img 
                src="/placeholder.svg" 
                alt="HR Benefits" 
                className="rounded-lg shadow-xl"
              />
            </div>
            <div className="space-y-8">
              <div className="flex items-start space-x-4 animate-fade-in" style={{animationDelay: "0.4s"}}>
                <div className="bg-nexhr-primary rounded-full p-2 mt-1">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Increased Efficiency</h3>
                  <p className="text-gray-600">Automate routine tasks and reduce manual paperwork by up to 80%, freeing your HR team for strategic initiatives.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 animate-fade-in" style={{animationDelay: "0.5s"}}>
                <div className="bg-purple-600 rounded-full p-2 mt-1">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Enhanced Employee Experience</h3>
                  <p className="text-gray-600">Provide self-service capabilities for employees to access their information, submit requests, and track statuses.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 animate-fade-in" style={{animationDelay: "0.6s"}}>
                <div className="bg-green-600 rounded-full p-2 mt-1">
                  <BarChart2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Data-Driven Decisions</h3>
                  <p className="text-gray-600">Access comprehensive analytics and reports to gain insights into workforce trends and make informed decisions.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 animate-fade-in" style={{animationDelay: "0.7s"}}>
                <div className="bg-yellow-600 rounded-full p-2 mt-1">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Compliance Assurance</h3>
                  <p className="text-gray-600">Stay compliant with labor laws and regulations through automated checks and built-in compliance features.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4 relative inline-block">
              <span className="bg-gradient-to-r from-nexhr-primary to-purple-600 bg-clip-text text-transparent">What Our Clients Say</span>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-nexhr-primary to-purple-600 rounded-full"></div>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-6">
              See how NexHR has transformed HR operations for companies across industries
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm relative animate-fade-in" style={{animationDelay: "0.2s"}}>
              <div className="absolute -top-5 left-8 text-4xl text-nexhr-primary">❝</div>
              <p className="text-gray-600 mb-6 mt-4">
                "NexHR has streamlined our entire HR process. What used to take days now takes minutes, and our team loves the intuitive interface."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-gray-500 text-sm">HR Director, Tech Solutions Inc.</p>
                </div>
              </div>
              <div className="flex mt-4">
                <Star className="h-5 w-5 text-yellow-500" />
                <Star className="h-5 w-5 text-yellow-500" />
                <Star className="h-5 w-5 text-yellow-500" />
                <Star className="h-5 w-5 text-yellow-500" />
                <Star className="h-5 w-5 text-yellow-500" />
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm relative animate-fade-in" style={{animationDelay: "0.3s"}}>
              <div className="absolute -top-5 left-8 text-4xl text-nexhr-primary">❝</div>
              <p className="text-gray-600 mb-6 mt-4">
                "The asset management and salary components have reduced our administrative workload by 60%. A game-changer for our organization."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold">Michael Chen</h4>
                  <p className="text-gray-500 text-sm">CEO, Innovative Startups</p>
                </div>
              </div>
              <div className="flex mt-4">
                <Star className="h-5 w-5 text-yellow-500" />
                <Star className="h-5 w-5 text-yellow-500" />
                <Star className="h-5 w-5 text-yellow-500" />
                <Star className="h-5 w-5 text-yellow-500" />
                <Star className="h-5 w-5 text-yellow-500" />
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm relative animate-fade-in" style={{animationDelay: "0.4s"}}>
              <div className="absolute -top-5 left-8 text-4xl text-nexhr-primary">❝</div>
              <p className="text-gray-600 mb-6 mt-4">
                "The document generation feature alone has saved us countless hours. The entire platform is a must-have for any growing business."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold">Jessica Williams</h4>
                  <p className="text-gray-500 text-sm">HR Manager, Global Retail Corp</p>
                </div>
              </div>
              <div className="flex mt-4">
                <Star className="h-5 w-5 text-yellow-500" />
                <Star className="h-5 w-5 text-yellow-500" />
                <Star className="h-5 w-5 text-yellow-500" />
                <Star className="h-5 w-5 text-yellow-500" />
                <Star className="h-5 w-5 text-yellow-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-nexhr-primary to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 animate-fade-in">Ready to transform your HR operations?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto animate-fade-in" style={{animationDelay: "0.2s"}}>
            Join thousands of companies that have simplified their HR processes with NexHR.
          </p>
          <Link to="/login" className="animate-fade-in" style={{animationDelay: "0.3s"}}>
            <Button size="lg" variant="secondary" className="transition-all duration-300 hover:scale-105 shadow-lg">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4 relative inline-block">
              <span className="bg-gradient-to-r from-nexhr-primary to-purple-600 bg-clip-text text-transparent">Get In Touch</span>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-nexhr-primary to-purple-600 rounded-full"></div>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-6">
              Have questions? Our team is here to help you find the perfect HR solution
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="animate-fade-in" style={{animationDelay: "0.2s"}}>
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-nexhr-primary focus:border-nexhr-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-nexhr-primary focus:border-nexhr-primary" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-nexhr-primary focus:border-nexhr-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-nexhr-primary focus:border-nexhr-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-nexhr-primary focus:border-nexhr-primary"></textarea>
                </div>
                <Button type="submit" className="w-full transition-all duration-300 hover:scale-[1.02]">
                  Send Message
                </Button>
              </form>
            </div>
            
            <div className="space-y-8 animate-fade-in" style={{animationDelay: "0.3s"}}>
              <div>
                <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-nexhr-primary rounded-full p-2 mt-1">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium">Email</h4>
                      <p className="text-gray-600">contact@nexhr.com</p>
                      <p className="text-gray-600">support@nexhr.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-purple-600 rounded-full p-2 mt-1">
                      <Phone className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium">Phone</h4>
                      <p className="text-gray-600">+1 (123) 456-7890</p>
                      <p className="text-gray-600">+1 (987) 654-3210</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-green-600 rounded-full p-2 mt-1">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium">Office</h4>
                      <p className="text-gray-600">123 Business Avenue, Suite 100</p>
                      <p className="text-gray-600">New York, NY 10001</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-semibold mb-6">Business Hours</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday</span>
                    <span className="font-medium">10:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday</span>
                    <span className="font-medium">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="animate-fade-in" style={{animationDelay: "0.1s"}}>
              <div className="text-2xl font-bold text-white mb-4">NEX<span className="font-normal">HR</span></div>
              <p className="mb-4">Powerful HR management solution for modern businesses.</p>
              <div className="flex space-x-4">
                <a href="#" className="bg-gray-800 w-10 h-10 rounded-full flex items-center justify-center hover:bg-nexhr-primary transition-colors duration-300">
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="bg-gray-800 w-10 h-10 rounded-full flex items-center justify-center hover:bg-nexhr-primary transition-colors duration-300">
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="bg-gray-800 w-10 h-10 rounded-full flex items-center justify-center hover:bg-nexhr-primary transition-colors duration-300">
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="bg-gray-800 w-10 h-10 rounded-full flex items-center justify-center hover:bg-nexhr-primary transition-colors duration-300">
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </div>
            </div>
            <div className="animate-fade-in" style={{animationDelay: "0.2s"}}>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="hover:text-white transition-colors duration-300">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">Pricing</a></li>
                <li><a href="#testimonials" className="hover:text-white transition-colors duration-300">Testimonials</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">FAQ</a></li>
              </ul>
            </div>
            <div className="animate-fade-in" style={{animationDelay: "0.3s"}}>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors duration-300">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-300">Terms of Service</a></li>
              </ul>
            </div>
            <div className="animate-fade-in" style={{animationDelay: "0.4s"}}>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>contact@nexhr.com</span>
                </li>
                <li className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>+1 (123) 456-7890</span>
                </li>
                <li className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>123 Main Street, City, Country</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center animate-fade-in" style={{animationDelay: "0.5s"}}>
            <p>&copy; {new Date().getFullYear()} NexHR. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
