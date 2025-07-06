import { useState } from "react";
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

const contactFormSchema = insertContactMessageSchema;

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const { toast } = useToast();

  const contactMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/contact", data);
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
      title: "Corporate Office",
      details: ["23-33 Astoria Blvd", "Astoria, NY 11102"],
    },
    {
      icon: Clock,
      title: "Customer Service",
      details: [
        "Monday - Friday: 8:00 AM - 6:00 PM",
        "Saturday - Sunday: 9:00 AM - 5:00 PM",
      ],
    },
    {
      icon: Phone,
      title: "Phone",
      details: ["(212) 555-BREW", "Corporate & Customer Service"],
    },
    {
      icon: Mail,
      title: "Email",
      details: ["corporate@coffeepro.com", "General inquiries & partnerships"],
    },
  ];

  const socialLinks = [
    { icon: Instagram, href: "https://www.instagram.com/coffeeprocorp/tagged/?hl=en", label: "Instagram" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: FaTiktok, href: "#", label: "TikTok" },
  ];

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-playfair font-bold text-coffee-dark mb-4">
            Contact Coffee Pro
          </h1>
          <p className="text-xl text-coffee-medium">
            Get in touch with our corporate team or visit any of our NYC locations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-playfair font-semibold text-coffee-dark mb-6">
                  Corporate Information
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
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => {
                    const IconComponent = social.icon;
                    return (
                      <a
                        key={index}
                        href={social.href}
                        target={social.href !== "#" ? "_blank" : undefined}
                        rel={social.href !== "#" ? "noopener noreferrer" : undefined}
                        aria-label={social.label}
                        className="w-10 h-10 bg-coffee-secondary rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
                      >
                        <IconComponent className="w-4 h-4" />
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
                    <Label htmlFor="name" className="text-coffee-dark font-medium">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Your name"
                      className="focus:border-coffee-primary focus:ring-coffee-primary"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-coffee-dark font-medium">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="Your email"
                      className="focus:border-coffee-primary focus:ring-coffee-primary"
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
                    >
                      <SelectTrigger className="focus:border-coffee-primary focus:ring-coffee-primary">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="catering">Catering Services</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                        <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
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

          {/* Map */}
          <div className="lg:col-span-1">
            <Card className="h-96 overflow-hidden border-none shadow-lg">
              <CardContent className="p-0 h-full">
                <img
                  src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                  alt="Coffee Pro locations across NYC"
                  className="w-full h-full object-cover"
                />
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
