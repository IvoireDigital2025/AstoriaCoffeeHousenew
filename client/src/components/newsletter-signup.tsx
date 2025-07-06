import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Mail, Gift, Coffee } from "lucide-react";
import { insertMarketingContactSchema } from "@shared/schema";
import { z } from "zod";

const newsletterSchema = insertMarketingContactSchema.pick({
  email: true,
  name: true,
  phone: true
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

interface NewsletterSignupProps {
  variant?: "default" | "compact" | "inline";
  className?: string;
}

export default function NewsletterSignup({ variant = "default", className = "" }: NewsletterSignupProps) {
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
      name: "",
      phone: ""
    }
  });

  const newsletterMutation = useMutation({
    mutationFn: async (data: NewsletterFormData) => {
      const response = await fetch("/api/marketing/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to subscribe");
      }

      return response.json();
    },
    onSuccess: (response) => {
      setIsSuccess(true);
      form.reset();
      toast({
        title: "Welcome to Coffee Pro!",
        description: response.message || "Successfully subscribed to our newsletter!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Subscription Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: NewsletterFormData) => {
    newsletterMutation.mutate(data);
  };

  if (isSuccess && variant !== "inline") {
    return (
      <Card className={`bg-gradient-to-r from-coffee-primary/10 to-amber-100/30 border border-coffee-accent/20 ${className}`}>
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-coffee-dark">Welcome to Coffee Pro!</h3>
              <p className="text-coffee-medium text-sm">You're now subscribed to our newsletter</p>
            </div>
          </div>
          <p className="text-coffee-dark/80">
            Get ready for exclusive offers, cultural insights, and updates from our authentic Egyptian coffee shop!
          </p>
        </CardContent>
      </Card>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`bg-gradient-to-r from-coffee-primary/5 to-amber-100/20 rounded-lg p-4 ${className}`}>
        <div className="flex items-center gap-3 mb-3">
          <Gift className="w-5 h-5 text-coffee-primary" />
          <h4 className="font-bold text-coffee-dark">Stay Connected</h4>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      placeholder="Enter your email" 
                      type="email"
                      className="bg-white/50"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              disabled={newsletterMutation.isPending}
              className="w-full bg-gradient-to-r from-coffee-primary to-amber-600 hover:from-coffee-dark hover:to-amber-700"
            >
              {newsletterMutation.isPending ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
        </Form>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className={`flex flex-col sm:flex-row gap-2 ${className}`}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-2 flex-1">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input 
                      placeholder="Enter your email for exclusive offers" 
                      type="email"
                      className="bg-white/90 border-coffee-accent/30"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              disabled={newsletterMutation.isPending}
              className="bg-gradient-to-r from-coffee-primary to-amber-600 hover:from-coffee-dark hover:to-amber-700 px-6"
            >
              {newsletterMutation.isPending ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
        </Form>
      </div>
    );
  }

  return (
    <Card className={`bg-white/95 backdrop-blur-sm border border-coffee-accent/20 shadow-xl ${className}`}>
      <CardContent className="p-8">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-coffee-primary/10 rounded-full">
              <Mail className="w-6 h-6 text-coffee-primary" />
            </div>
            <h3 className="text-2xl font-bold text-coffee-dark">Stay in the Loop</h3>
            <div className="p-3 bg-amber-100 rounded-full">
              <Coffee className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <p className="text-coffee-medium leading-relaxed">
            Join our community and be the first to know about special offers, cultural events, 
            new menu items, and exclusive insights into Middle Eastern coffee traditions.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-coffee-dark font-medium">Email Address *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="your.email@example.com" 
                      type="email"
                      className="bg-coffee-cream/30 border-coffee-accent/30"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-coffee-dark font-medium">Name (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Your name" 
                      className="bg-coffee-cream/30 border-coffee-accent/30"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-coffee-dark font-medium">Phone (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Your phone number" 
                      type="tel"
                      className="bg-coffee-cream/30 border-coffee-accent/30"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              disabled={newsletterMutation.isPending}
              className="w-full bg-gradient-to-r from-coffee-primary to-amber-600 hover:from-coffee-dark hover:to-amber-700 py-3 text-lg font-semibold"
            >
              {newsletterMutation.isPending ? "Subscribing..." : "Join Our Coffee Community"}
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center">
          <p className="text-xs text-coffee-medium">
            By subscribing, you'll receive exclusive offers and cultural insights. 
            We respect your privacy and you can unsubscribe anytime.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}