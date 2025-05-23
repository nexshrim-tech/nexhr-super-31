
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AtSign, Lock, User, Building2, Phone } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const customerSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  companyName: z.string().min(2, { message: "Company name must be at least 2 characters" }),
  companySize: z.string().optional(),
  phoneNumber: z.string().optional(),
});

const employeeSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  customerEmail: z.string().email({ message: "Please enter a valid customer email address" }).optional(),
});

interface SignUpFormProps {
  onToggleForm: () => void;
  role: 'customer' | 'employee';
}

export const SignUpForm = ({ onToggleForm, role }: SignUpFormProps) => {
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const schema = role === 'customer' ? customerSchema : employeeSchema;
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      companyName: "",
      companySize: "",
      phoneNumber: "",
      customerEmail: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      setError("");

      if (role === 'customer') {
        await signUp(data.email, data.password, {
          role: 'customer',
          full_name: data.fullName,
          company_name: data.companyName,
          company_size: data.companySize,
          phone_number: data.phoneNumber,
        });
        
        // Set flag for new user to show subscription plan selection
        localStorage.setItem("new-user", "true");
      } else {
        // For employee signup
        await signUp(data.email, data.password, {
          role: 'employee',
          full_name: data.fullName,
          customer_email: data.customerEmail,
        });
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md mb-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <AtSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            placeholder="you@example.com"
            className="pl-10"
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="pl-10"
            {...register("password")}
          />
        </div>
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="fullName"
            placeholder="John Doe"
            className="pl-10"
            {...register("fullName")}
          />
        </div>
        {errors.fullName && (
          <p className="text-sm text-red-500">{errors.fullName.message}</p>
        )}
      </div>

      {role === 'customer' ? (
        <>
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="companyName"
                placeholder="ABC Corporation"
                className="pl-10"
                {...register("companyName")}
              />
            </div>
            {errors.companyName && (
              <p className="text-sm text-red-500">{errors.companyName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="companySize">Company Size</Label>
            <select
              id="companySize"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              {...register("companySize")}
            >
              <option value="">Select company size</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="501+">501+ employees</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phoneNumber"
                placeholder="+1 (555) 123-4567"
                className="pl-10"
                {...register("phoneNumber")}
              />
            </div>
          </div>
        </>
      ) : (
        // Employee specific fields
        <div className="space-y-2">
          <Label htmlFor="customerEmail">Customer Email</Label>
          <div className="relative">
            <AtSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="customerEmail"
              placeholder="customer@example.com"
              className="pl-10"
              {...register("customerEmail")}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Enter the email of the customer/company you belong to
          </p>
          {errors.customerEmail && (
            <p className="text-sm text-red-500">{errors.customerEmail.message}</p>
          )}
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-nexhr-primary to-purple-600 hover:from-nexhr-primary/90 hover:to-purple-700"
        disabled={isLoading}
      >
        {isLoading ? "Creating Account..." : "Create Account"}
      </Button>

      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onToggleForm}
            className="text-nexhr-primary hover:underline font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </form>
  );
};
