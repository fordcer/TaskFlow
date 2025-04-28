"use client";

import { ModeToggle } from "@/components/toggle-theme";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { mockLogin, mockSignup } from "@/lib/auth-service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

interface FormCardProps {
  mode: "login" | "signup";
}

const passwordComplexity = z
  .string()
  .min(8, "Password must be at least 8 characters long.")
  .max(100, "Password must be at most 100 characters long.")
  .regex(/[a-z]/, "Must contain at least one lowercase letter.")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter.")
  .regex(/\d/, "Must contain at least one number.")
  .regex(/[^a-zA-Z0-9]/, "Must contain at least one special character.");

export default function FormCard({ mode }: Readonly<FormCardProps>) {
  const formSchema = z.object({
    email: z.string().email("Please enter a valid email address."),
    password:
      mode === "signup"
        ? passwordComplexity
        : z.string().min(1, "Password is required."),
  });

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      if (mode === "signup") {
        await handleSignup(values);
      } else {
        const success = await mockLogin(values.email, values.password);

        if (success) {
          toast("Login successful", {
            description: "Welcome back to TaskFlow!",
          });
          router.push("/dashboard");
        } else {
          toast.error("Login failed", {
            description: "Please check your credentials and try again.",
          });
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong", {
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSignup(values: z.infer<typeof formSchema>) {
    const success = await mockSignup(values.email, values.password);

    if (success) {
      toast("Account created", {
        description: "Welcome to TaskFlow!",
      });
      router.push("/dashboard");
    } else {
      toast.error("Signup failed", {
        description: "An account with this email might already exist.",
      });
    }
  }

  const btnTextAction = mode === "login" ? "Login" : "Create account";
  const btnTextActionLoading =
    mode === "login" ? "Logging in..." : "Creating account...";

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="absolute top-4 right-4 md:right-8 md:top-8">
        <ModeToggle />
      </div>
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8">
        <Button variant="ghost">← Back</Button>
      </Link>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-[350px]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">
              {mode === "login" ? "Login" : "Signup"}
            </CardTitle>
            <CardDescription>
              {mode === "login"
                ? "Enter your email and password to login to your account"
                : "Create an account to get started with TaskFlow"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="name@example.com"
                          autoCapitalize="none"
                          autoComplete="email"
                          autoCorrect="off"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          autoCapitalize="none"
                          autoComplete="current-password"
                          autoCorrect="off"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? btnTextActionLoading : btnTextAction}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col items-start">
            {mode === "login" ? (
              <div className="flex flex-col justify-center items-center">
                <div className="text-sm text-muted-foreground mt-2">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/signup"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    Sign up
                  </Link>
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  <span className="text-xs text-muted-foreground">
                    Demo credentials: demo@example.com / password
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground mt-2">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Login
                </Link>
              </div>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
