
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PricingSection from "@/components/PricingSection";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Calendar, 
  DollarSign, 
  FileText, 
  BarChart2, 
  Briefcase,
  Sparkles,
  MapPin,
  MessageSquare,
  Video,
  Shield,
  Clock,
  Laptop
} from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white py-4 px-6 border-b sticky top-0 z-10 backdrop-blur-sm bg-white/80">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2 font-bold text-xl">
            <span className="logo">NEX</span>
            <span>HR</span>
          </div>
          <div className="space-x-2">
            <Button asChild variant="ghost" className="hover:bg-gray-100">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild className="bg-nexhr-primary hover:bg-nexhr-primary/90">
              <Link to="/login">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="animate-float absolute -right-20 top-20 w-72 h-72 bg-nexhr-primary/10 rounded-full blur-3xl"></div>
        <div className="animate-float-delayed absolute -left-20 bottom-20 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-6 relative">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 space-y-6 animate-fade-in">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-nexhr-primary/10 text-nexhr-primary text-sm font-medium mb-2">
                <Sparkles className="w-4 h-4 mr-2" />
                <span>Simplify HR Management</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Modern HR <span className="text-nexhr-primary">Management</span> Solution
              </h1>
              <p className="text-gray-600 text-lg md:text-xl">
                Streamline your HR operations with our comprehensive HR management system. Everything you need in one place.
              </p>
              <div className="pt-4 flex flex-wrap gap-4">
                <Button asChild size="lg" className="group bg-nexhr-primary hover:bg-nexhr-primary/90">
                  <Link to="/login">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="#features">Learn More</a>
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-6 pt-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <CheckCircle2 className="text-nexhr-green h-5 w-5 mr-2" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="text-nexhr-green h-5 w-5 mr-2" />
                  <span>Free plan available</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="text-nexhr-green h-5 w-5 mr-2" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>

            <div className="md:w-1/2 relative animate-scale-in" style={{animationDelay: "0.3s"}}>
              <div className="bg-white p-2 rounded-2xl shadow-xl border border-gray-100 relative z-10 transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                <img
                  src="/placeholder.svg"
                  alt="NexHR Dashboard"
                  className="w-full h-auto rounded-xl"
                />
                <div className="absolute -bottom-4 -right-4 bg-nexhr-primary text-white px-4 py-2 rounded-lg text-sm font-medium">
                  All-in-one solution
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl -z-10 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Highlight */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Employee Management",
                description: "Complete employee profiles with document management",
                icon: <Users className="h-6 w-6 text-nexhr-primary" />,
                delay: 0.1
              },
              {
                title: "Attendance Tracking",
                description: "Track attendance with geofencing and location verification",
                icon: <Clock className="h-6 w-6 text-nexhr-primary" />,
                delay: 0.2
              },
              {
                title: "Real-time Location Tracking",
                description: "Monitor employee locations and optimize field operations",
                icon: <MapPin className="h-6 w-6 text-nexhr-primary" />,
                delay: 0.3
              },
            ].map((feature, index) => (
              <div 
                key={index} 
                className="flex items-start gap-4 p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in"
                style={{animationDelay: `${feature.delay}s`}}
              >
                <div className="bg-nexhr-primary/10 p-3 rounded-lg">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need For HR Management</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              NexHR provides a comprehensive set of tools to help you manage your workforce efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Employee Management",
                description: "Maintain detailed employee profiles with all relevant information in one place.",
                icon: <Users className="h-10 w-10 text-nexhr-primary" />,
                delay: 0.1
              },
              {
                title: "Attendance Tracking",
                description: "Track employee attendance, time-offs, and leaves with ease.",
                icon: <Calendar className="h-10 w-10 text-nexhr-primary" />,
                delay: 0.2
              },
              {
                title: "Payroll Management",
                description: "Streamline your payroll process with automated calculations and payment tracking.",
                icon: <DollarSign className="h-10 w-10 text-nexhr-primary" />,
                delay: 0.3
              },
              {
                title: "Document Management",
                description: "Store and manage important documents securely in the cloud.",
                icon: <FileText className="h-10 w-10 text-nexhr-primary" />,
                delay: 0.4
              },
              {
                title: "Performance Analytics",
                description: "Get insights into employee performance with detailed analytics and reports.",
                icon: <BarChart2 className="h-10 w-10 text-nexhr-primary" />,
                delay: 0.5
              },
              {
                title: "Project Management",
                description: "Assign and track projects, monitor progress, and manage resources efficiently.",
                icon: <Briefcase className="h-10 w-10 text-nexhr-primary" />,
                delay: 0.6
              },
              {
                title: "Location Tracking",
                description: "Monitor field employees' locations in real-time with accurate GPS tracking.",
                icon: <MapPin className="h-10 w-10 text-nexhr-primary" />,
                delay: 0.7
              },
              {
                title: "Team Communication",
                description: "Built-in messaging system for seamless team collaboration and communication.",
                icon: <MessageSquare className="h-10 w-10 text-nexhr-primary" />,
                delay: 0.8
              },
              {
                title: "Video Meetings",
                description: "Host virtual meetings and interviews directly within the platform.",
                icon: <Video className="h-10 w-10 text-nexhr-primary" />,
                delay: 0.9
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in hover:-translate-y-1"
                style={{animationDelay: `${feature.delay}s`}}
              >
                <div className="inline-block p-3 bg-nexhr-primary/10 rounded-xl mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How NexHR Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get started with NexHR in just a few simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Sign Up",
                description: "Create your account and choose your subscription plan",
                icon: <Users className="h-8 w-8 text-white" />,
                delay: 0.1
              },
              {
                step: "2",
                title: "Set Up Your Company",
                description: "Add your company details and configure your preferences",
                icon: <Briefcase className="h-8 w-8 text-white" />,
                delay: 0.2
              },
              {
                step: "3",
                title: "Add Employees",
                description: "Import your employee data or add them manually",
                icon: <Users className="h-8 w-8 text-white" />,
                delay: 0.3
              },
              {
                step: "4",
                title: "Start Managing",
                description: "Use all features based on your subscription plan",
                icon: <Laptop className="h-8 w-8 text-white" />,
                delay: 0.4
              }
            ].map((item, index) => (
              <div 
                key={index} 
                className="relative animate-fade-in"
                style={{animationDelay: `${item.delay}s`}}
              >
                <div className="bg-nexhr-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto">
                  {item.step}
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-6 left-1/2 w-full h-0.5 bg-gray-200">
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-600 text-sm font-medium mb-4">
                <Shield className="w-4 h-4 mr-2" />
                <span>Security & Compliance</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Your Data is Safe With Us</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-lg">End-to-End Encryption</h3>
                    <p className="text-gray-600">All your sensitive data is encrypted both in transit and at rest.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-lg">GDPR Compliant</h3>
                    <p className="text-gray-600">Our platform is fully compliant with GDPR and other privacy regulations.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-lg">Regular Backups</h3>
                    <p className="text-gray-600">Your data is backed up regularly to prevent any loss of information.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-lg">Role-Based Access Control</h3>
                    <p className="text-gray-600">Define who can access what data with granular permission settings.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 z-10 relative">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 bg-gray-50 p-4 rounded-lg flex items-center gap-3">
                      <Shield className="h-8 w-8 text-green-500" />
                      <div>
                        <div className="text-sm font-medium">Security Status</div>
                        <div className="text-green-500 font-semibold">Protected</div>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">Data Encryption</div>
                      <div className="font-medium">Enabled</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">Last Backup</div>
                      <div className="font-medium">Today, 03:45 AM</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">Compliance</div>
                      <div className="font-medium">GDPR, HIPAA</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500 mb-1">Access Control</div>
                      <div className="font-medium">Role-Based</div>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-green-500/10 blur-2xl -z-10 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Trusted by companies of all sizes around the world
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "NexHR has transformed how we manage our employees. The location tracking feature is a game-changer for our field operations.",
                author: "Sarah Johnson",
                role: "HR Director, TechCorp",
                image: "https://github.com/shadcn.png"
              },
              {
                quote: "The attendance system with geofencing is incredibly accurate. We've reduced time theft by 45% since implementing NexHR.",
                author: "Michael Chen",
                role: "Operations Manager, Logistix",
                image: "https://github.com/shadcn.png"
              },
              {
                quote: "What impressed me most is how easy it was to get everyone onboarded. The messaging system has improved our internal communications tremendously.",
                author: "Emily Rodriguez",
                role: "CEO, StartupX",
                image: "https://github.com/shadcn.png"
              }
            ].map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={testimonial.image} alt={testimonial.author} />
                    <AvatarFallback>{testimonial.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{testimonial.author}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-nexhr-primary to-purple-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-fade-in">Ready to Transform Your HR Management?</h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8 text-lg animate-fade-in" style={{animationDelay: "0.2s"}}>
            Join thousands of companies that use NexHR to streamline their HR operations and boost productivity.
          </p>
          <Button asChild size="lg" variant="default" className="bg-white text-nexhr-primary hover:bg-gray-100 animate-fade-in" style={{animationDelay: "0.3s"}}>
            <Link to="/login">Get Started For Free</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center space-x-2 font-bold text-xl">
                <span className="logo">NEX</span>
                <span>HR</span>
              </div>
              <p className="text-gray-400 mt-2">Modern HR Management Solution</p>
            </div>
            <div className="flex flex-wrap gap-8">
              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} NexHR. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
