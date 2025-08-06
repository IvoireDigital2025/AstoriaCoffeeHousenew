import { useState, useEffect } from "react";
import { updateMetaDescription, updatePageTitle, seoData } from "@/utils/seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Clock, Phone, Mail, Instagram, Facebook } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertContactMessageSchema } from "@shared/schema";
import { z } from "zod";
import NewsletterSignup from "@/components/newsletter-signup";

const contactFormSchema = insertContactMessageSchema.extend({
  receiptNumber: z.string().optional(),
}).refine((data) => {
  // If subject is "reward", receipt number is required
  if (data.subject === "reward" && (!data.receiptNumber || data.receiptNumber.trim() === "")) {
    return false;
  }
  return true;
}, {
  message: "Receipt number is required when subject is 'Reward'",
  path: ["receiptNumber"],
});

export default function Contact() {
  useEffect(() => {
    updatePageTitle(seoData.contact.title);
    updateMetaDescription(seoData.contact.description);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    receiptNumber: "",
  });
  const { toast } = useToast();

  const contactMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // Only include receiptNumber if subject is "reward"
      const submitData = data.subject === "reward" 
        ? data 
        : { ...data, receiptNumber: undefined };
      const response = await apiRequest("POST", "/api/contact", submitData);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: "Thank you for your message! We'll get back to you soon.",
      });
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        receiptNumber: "",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      contactFormSchema.parse(formData);
      contactMutation.mutate(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Please check your information",
          description: error.errors[0].message,
          variant: "destructive",
        });
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Location",
      details: ["23-33 Astoria Blvd", "Astoria, NY 11102"],
    },
    {
      icon: Clock,
      title: "Hours",
      details: [
        "Sunday - Thursday: 7:00 AM - 7:30 PM",
        "Friday - Saturday: 7:00 AM - 8:30 PM",
      ],
    },
    {
      icon: Phone,
      title: "Phone",
      details: ["(347) 329-6816", "General inquiries & orders"],
    },
    {
      icon: Mail,
      title: "Email",
      details: ["Coffeepro23@gmail.com", "General inquiries & catering"],
    },
  ];

  const socialLinks = [
    { icon: Instagram, href: "https://www.instagram.com/coffeepronyc/", label: "Instagram" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: FaTiktok, href: "#", label: "TikTok" },
  ];

  return (
    <div className="min-h-screen bg-white py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 md:mb-16" id="contact-top">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-bold text-coffee-dark mb-3 sm:mb-4 leading-tight">
            Contact Coffee Pro
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-coffee-medium px-4">
            Get in touch with our team or visit our Astoria location
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-playfair font-semibold text-coffee-dark mb-6">
                  Contact Information
                </h3>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => {
                    const IconComponent = info.icon;
                    return (
                      <div key={index} className="flex items-start space-x-3">
                        <IconComponent className="text-coffee-accent w-5 h-5 mt-1 flex-shrink-0" />
                        <div>
                          {info.details.map((detail, detailIndex) => (
                            <p
                              key={detailIndex}
                              className={`${
                                detailIndex === 0
                                  ? "text-coffee-dark font-medium"
                                  : "text-coffee-medium"
                              }`}
                            >
                              {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-playfair font-semibold text-coffee-dark mb-4">
                  Follow Us
                </h3>
                <div className="flex space-x-3 sm:space-x-4">
                  {socialLinks.map((social, index) => {
                    const IconComponent = social.icon;
                    return (
                      <a
                        key={index}
                        href={social.href}
                        target={social.href !== "#" ? "_blank" : undefined}
                        rel={social.href !== "#" ? "noopener noreferrer" : undefined}
                        aria-label={social.label}
                        className="w-12 h-12 sm:w-10 sm:h-10 bg-coffee-secondary rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors touch-manipulation"
                      >
                        <IconComponent className="w-5 h-5 sm:w-4 sm:h-4" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-1">
            <Card className="bg-coffee-cream border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-playfair font-semibold text-coffee-dark">
                  Get in Touch
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-coffee-dark font-medium text-sm sm:text-base">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Your name"
                      className="mt-1 h-11 sm:h-12 focus:border-coffee-primary focus:ring-coffee-primary text-base"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-coffee-dark font-medium text-sm sm:text-base">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="Your email"
                      className="mt-1 h-11 sm:h-12 focus:border-coffee-primary focus:ring-coffee-primary text-base"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="subject" className="text-coffee-dark font-medium">
                      Subject
                    </Label>
                    <Select 
                      value={formData.subject} 
                      onValueChange={(value) => handleInputChange("subject", value)}
                      required
                    >
                      <SelectTrigger className="focus:border-coffee-primary focus:ring-coffee-primary">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="catering">Catering Services</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                        <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                        <SelectItem value="employment">Employment Inquiry</SelectItem>
                        <SelectItem value="reward">Reward</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Conditional Receipt Number Field for Reward Subject */}
                  {formData.subject === "reward" && (
                    <div>
                      <Label htmlFor="receiptNumber" className="text-coffee-dark font-medium text-sm sm:text-base">
                        Receipt Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="receiptNumber"
                        type="text"
                        value={formData.receiptNumber}
                        onChange={(e) => handleInputChange("receiptNumber", e.target.value)}
                        placeholder="Enter your receipt number"
                        className="mt-1 h-11 sm:h-12 focus:border-coffee-primary focus:ring-coffee-primary text-base"
                        required={formData.subject === "reward"}
                      />
                      <p className="text-xs text-gray-600 mt-1">
                        Please provide your receipt number to help us process your reward request
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="message" className="text-coffee-dark font-medium">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Your message"
                      rows={4}
                      className="focus:border-coffee-primary focus:ring-coffee-primary resize-none"
                      required
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={contactMutation.isPending}
                    className="w-full bg-coffee-secondary hover:bg-blue-600 text-white font-semibold"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    {contactMutation.isPending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>


        </div>

        {/* Newsletter Signup Section */}
        <div className="mt-16">
          <NewsletterSignup />
        </div>
      </div>
    </div>
  );
}
