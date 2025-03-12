
import React from "react";
import SidebarNav from "@/components/SidebarNav";
import { Button } from "@/components/ui/button";
import { Map, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const employees = [
  {
    id: 1,
    name: "Chisom Chukwukwe",
    avatar: "CC",
    role: "UI/UX Designer",
    phone: "+369 258 147",
    email: "work@email.com",
    employeeId: "5278429811",
    location: { lat: 48.8606, lng: 2.3376 } // Near Louvre Museum in Paris
  },
  {
    id: 2,
    name: "Chisom Chukwukwe",
    avatar: "CC",
    role: "UI/UX Designer",
    phone: "+369 258 147",
    email: "work@email.com",
    employeeId: "5278429811",
    location: { lat: 48.8622, lng: 2.3330 }
  },
  {
    id: 3,
    name: "Chisom Chukwukwe",
    avatar: "CC",
    role: "UI/UX Designer",
    phone: "+369 258 147",
    email: "work@email.com",
    employeeId: "5278429811",
    location: { lat: 48.8599, lng: 2.3409 }
  },
  {
    id: 4,
    name: "Chisom Chukwukwe",
    avatar: "CC",
    role: "UI/UX Designer",
    phone: "+369 258 147",
    email: "work@email.com",
    employeeId: "5278429811",
    location: { lat: 48.8576, lng: 2.3353 }
  }
];

const Track = () => {
  return (
    <div className="flex h-full bg-gray-50">
      <SidebarNav />
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold">Track</h1>
              <p className="text-gray-500">track your employee location</p>
            </div>
            <Link to="/">
              <Button>Back</Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input 
                  type="search" 
                  className="block w-full p-2 pl-10 text-sm border border-gray-300 rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="Search" 
                />
              </div>
              
              {employees.map(employee => (
                <div key={employee.id} className="border rounded-md overflow-hidden bg-white">
                  <div className="h-20 bg-cover bg-center" style={{ backgroundImage: "url('/lovable-uploads/3a6054a9-39e7-4102-a2fe-44732c6d2f92.png')" }}></div>
                  <div className="relative flex justify-center">
                    <Avatar className="h-16 w-16 absolute -top-8 border-4 border-white">
                      <AvatarImage src="" alt={employee.name} />
                      <AvatarFallback>{employee.avatar}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="p-4 pt-10 text-center">
                    <h3 className="font-medium">{employee.name}</h3>
                    <p className="text-sm text-gray-500">{employee.role}</p>
                    
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>phone: {employee.phone}</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>Email: {employee.email}</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                        </svg>
                        <span>{employee.employeeId}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex gap-2 justify-center">
                      <Button size="icon" variant="ghost">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                        </svg>
                      </Button>
                      <Button size="icon" variant="ghost">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                        </svg>
                      </Button>
                      <Button size="icon" variant="ghost">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      </Button>
                      <Button size="icon" variant="ghost">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                        </svg>
                      </Button>
                    </div>
                    
                    <Button className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white" size="sm">
                      <MapPin className="h-4 w-4 mr-2" />
                      Track Location
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="md:col-span-2">
              <div className="bg-white p-4 border rounded-md h-full min-h-[600px] relative">
                <img 
                  src="/lovable-uploads/5f84f812-bedb-480e-ac18-b71a9a3e45e8.png" 
                  alt="Map with employee locations" 
                  className="w-full h-full object-cover rounded-md"
                />
                <div className="absolute bottom-4 right-4">
                  <Button variant="outline" className="bg-white">
                    <Map className="h-4 w-4 mr-2" />
                    View full map
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Track;
