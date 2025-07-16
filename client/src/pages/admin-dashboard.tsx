import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Search, Mail, Phone, User, Calendar, Filter, LogOut, MessageSquare, Trash2, Coffee, Gift, Star, QrCode, Bell, Building, FileSpreadsheet } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import QRCodeComponent from "@/components/QRCode";
import WebsiteQRCode from "@/components/WebsiteQRCode";
import Papa from 'papaparse';

interface MarketingContact {
  id: number;
  email: string;
  name: string | null;
  phone: string | null;
  source: string;
  subscribed: boolean;
  createdAt: string;
}

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

interface LoyaltyCustomer {
  id: number;
  name: string;
  email: string;
  phone: string;
  totalVisits: number;
  currentPoints: number;
  totalRewards: number;
  createdAt: string;
  updatedAt: string;
}

interface LoyaltyVisit {
  id: number;
  customerId: number;
  visitDate: string;
  pointsEarned: number;
}

interface LoyaltyReward {
  id: number;
  customerId: number;
  rewardType: string;
  pointsUsed: number;
  notes: string | null;
  redeemedAt: string;
}

interface Notification {
  id: number;
  phone: string;
  message: string;
  sentAt: string;
  method: string;
  status: 'sent' | 'failed' | 'pending';
}

interface FranchiseApplication {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessExperience: string;
  investmentCapacity: string;
  preferredLocation: string;
  timelineToOpen: string;
  additionalInfo: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [selectedFranchiseStatus, setSelectedFranchiseStatus] = useState<string | null>(null);
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const queryClient = useQueryClient();

  // Franchise application status update mutation
  const updateFranchiseStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      await apiRequest('PATCH', `/api/admin/franchise/applications/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/franchise/applications'] });
      toast({
        title: "Status Updated",
        description: "Franchise application status has been updated successfully.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: `Failed to update application status: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Download functions
  const downloadCSV = (data: any[], filename: string, headers: string[]) => {
    const csv = Papa.unparse({
      fields: headers,
      data: data.map(item => headers.map(header => item[header] || ''))
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Excel export removed due to security vulnerabilities - CSV export available

  const downloadMarketingContacts = () => {
    if (!contacts || contacts.length === 0) {
      toast({
        title: "No Data",
        description: "No marketing contacts available to download.",
        variant: "destructive",
      });
      return;
    }

    const headers = ['id', 'email', 'name', 'phone', 'source', 'subscribed', 'createdAt'];
    const processedData = contacts.map((contact: MarketingContact) => ({
      id: contact.id,
      email: contact.email,
      name: contact.name || '',
      phone: contact.phone || '',
      source: contact.source,
      subscribed: contact.subscribed ? 'Yes' : 'No',
      createdAt: format(new Date(contact.createdAt), 'yyyy-MM-dd HH:mm:ss')
    }));

    const filename = `marketing_contacts_${format(new Date(), 'yyyy-MM-dd')}`;
    downloadCSV(processedData, filename, headers);

    toast({
      title: "Download Complete",
      description: `Marketing contacts exported as ${format.toUpperCase()} successfully.`,
      variant: "default",
    });
  };

  const downloadContactMessages = () => {
    if (!contactMessages || contactMessages.length === 0) {
      toast({
        title: "No Data",
        description: "No contact messages available to download.",
        variant: "destructive",
      });
      return;
    }

    const headers = ['id', 'name', 'email', 'subject', 'message', 'createdAt'];
    const processedData = contactMessages.map((message: ContactMessage) => ({
      id: message.id,
      name: message.name,
      email: message.email,
      subject: message.subject,
      message: message.message,
      createdAt: format(new Date(message.createdAt), 'yyyy-MM-dd HH:mm:ss')
    }));

    const filename = `contact_messages_${format(new Date(), 'yyyy-MM-dd')}`;
    
    // Only CSV export available for security
    downloadCSV(processedData, filename, headers);

    toast({
      title: "Download Complete",
      description: "Contact messages exported as CSV successfully.",
      variant: "default",
    });
  };

  const downloadLoyaltyCustomers = () => {
    if (!loyaltyCustomers || loyaltyCustomers.length === 0) {
      toast({
        title: "No Data",
        description: "No loyalty customers available to download.",
        variant: "destructive",
      });
      return;
    }

    const headers = ['id', 'name', 'email', 'phone', 'totalVisits', 'currentPoints', 'totalRewards', 'createdAt'];
    const processedData = loyaltyCustomers.map((customer: LoyaltyCustomer) => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      totalVisits: customer.totalVisits,
      currentPoints: customer.currentPoints,
      totalRewards: customer.totalRewards,
      createdAt: format(new Date(customer.createdAt), 'yyyy-MM-dd HH:mm:ss')
    }));

    const filename = `loyalty_customers_${format(new Date(), 'yyyy-MM-dd')}`;
    
    // Only CSV export available for security
    downloadCSV(processedData, filename, headers);

    toast({
      title: "Download Complete",
      description: "Loyalty customers exported as CSV successfully.",
      variant: "default",
    });
  };

  const downloadFranchiseApplications = () => {
    if (!franchiseApplications || franchiseApplications.length === 0) {
      toast({
        title: "No Data",
        description: "No franchise applications available to download.",
        variant: "destructive",
      });
      return;
    }

    const headers = ['id', 'firstName', 'lastName', 'email', 'phone', 'businessExperience', 'investmentCapacity', 'preferredLocation', 'timelineToOpen', 'additionalInfo', 'status', 'createdAt'];
    const processedData = franchiseApplications.map((app: FranchiseApplication) => ({
      id: app.id,
      firstName: app.firstName,
      lastName: app.lastName,
      email: app.email,
      phone: app.phone,
      businessExperience: app.businessExperience,
      investmentCapacity: app.investmentCapacity,
      preferredLocation: app.preferredLocation,
      timelineToOpen: app.timelineToOpen,
      additionalInfo: app.additionalInfo || '',
      status: app.status,
      createdAt: format(new Date(app.createdAt), 'yyyy-MM-dd HH:mm:ss')
    }));

    const filename = `franchise_applications_${format(new Date(), 'yyyy-MM-dd')}`;
    
    // Only CSV export available for security
    downloadCSV(processedData, filename, headers);

    toast({
      title: "Download Complete",
      description: "Franchise applications exported as CSV successfully.",
      variant: "default",
    });
  };

  const { data: contacts, isLoading: contactsLoading } = useQuery({
    queryKey: ['/api/marketing/contacts'],
    queryFn: async () => {
      const response = await fetch('/api/marketing/contacts');
      if (response.status === 401) {
        setLocation('/admin/login');
        throw new Error('Authentication required');
      }
      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }
      return response.json();
    }
  });

  const { data: contactMessages, isLoading: messagesLoading } = useQuery({
    queryKey: ['/api/contact/messages'],
    queryFn: async () => {
      const response = await fetch('/api/contact/messages');
      if (response.status === 401) {
        setLocation('/admin/login');
        throw new Error('Authentication required');
      }
      if (!response.ok) {
        throw new Error('Failed to fetch contact messages');
      }
      return response.json();
    }
  });

  // Loyalty program data queries
  const { data: loyaltyCustomers, isLoading: loyaltyCustomersLoading } = useQuery({
    queryKey: ['/api/admin/loyalty/customers'],
    queryFn: async () => {
      const response = await fetch('/api/admin/loyalty/customers');
      if (response.status === 401) {
        setLocation('/admin/login');
        throw new Error('Authentication required');
      }
      if (!response.ok) {
        throw new Error('Failed to fetch loyalty customers');
      }
      return response.json();
    }
  });

  const { data: loyaltyVisits, isLoading: loyaltyVisitsLoading } = useQuery({
    queryKey: ['/api/admin/loyalty/visits'],
    queryFn: async () => {
      const response = await fetch('/api/admin/loyalty/visits');
      if (response.status === 401) {
        setLocation('/admin/login');
        throw new Error('Authentication required');
      }
      if (!response.ok) {
        throw new Error('Failed to fetch loyalty visits');
      }
      return response.json();
    }
  });

  const { data: loyaltyRewards, isLoading: loyaltyRewardsLoading } = useQuery({
    queryKey: ['/api/admin/loyalty/rewards'],
    queryFn: async () => {
      const response = await fetch('/api/admin/loyalty/rewards');
      if (response.status === 401) {
        setLocation('/admin/login');
        throw new Error('Authentication required');
      }
      if (!response.ok) {
        throw new Error('Failed to fetch loyalty rewards');
      }
      return response.json();
    }
  });

  const { data: notifications, isLoading: notificationsLoading } = useQuery({
    queryKey: ['/api/admin/notifications'],
    queryFn: async () => {
      const response = await fetch('/api/admin/notifications');
      if (response.status === 401) {
        setLocation('/admin/login');
        throw new Error('Authentication required');
      }
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      return response.json();
    }
  });

  const { data: franchiseApplications, isLoading: franchiseLoading } = useQuery({
    queryKey: ['/api/admin/franchise/applications'],
    queryFn: async () => {
      const response = await fetch('/api/admin/franchise/applications');
      if (response.status === 401) {
        setLocation('/admin/login');
        throw new Error('Authentication required');
      }
      if (!response.ok) {
        throw new Error('Failed to fetch franchise applications');
      }
      return response.json();
    }
  });

  const deleteMarketingContactMutation = useMutation({
    mutationFn: async (contactId: number) => {
      await apiRequest('DELETE', `/api/admin/marketing/contacts/${contactId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/marketing/contacts'] });
      toast({
        title: "Contact deleted",
        description: "Marketing contact has been successfully removed.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete contact",
        variant: "destructive",
      });
    }
  });

  // Redeem reward mutation
  const redeemRewardMutation = useMutation({
    mutationFn: async ({ customerId, notes }: { customerId: number; notes?: string }) => {
      await apiRequest('/api/admin/loyalty/redeem', {
        method: 'POST',
        body: JSON.stringify({ customerId, notes }),
        headers: { 'Content-Type': 'application/json' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/loyalty/customers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/loyalty/rewards'] });
      toast({
        title: "Reward Redeemed",
        description: "Customer reward has been redeemed successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Redeem Failed",
        description: error.message || "Failed to redeem reward",
        variant: "destructive",
      });
    }
  });

  // Delete contact message mutation
  const deleteContactMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/contact/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contact/messages'] });
      toast({
        title: "Contact Deleted",
        description: "Contact message has been deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete contact message",
        variant: "destructive",
      });
    }
  });

  const handleDeleteContact = async (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete the message from ${name}?`)) {
      deleteContactMutation.mutate(id);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully",
      });
      setLocation('/admin/login');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredContacts = contacts?.filter((contact: MarketingContact) => {
    const matchesSearch = contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.phone?.includes(searchTerm);
    
    const matchesSource = sourceFilter === "all" || contact.source === sourceFilter;
    
    return matchesSearch && matchesSource;
  }) || [];



  const getSourceColor = (source: string) => {
    switch (source) {
      case 'newsletter': return 'bg-blue-100 text-blue-800';
      case 'community': return 'bg-green-100 text-green-800';
      case 'loyalty': return 'bg-purple-100 text-purple-800';
      case 'contact': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalContacts = contacts?.length || 0;
  const subscribedContacts = contacts?.filter((c: MarketingContact) => c.subscribed).length || 0;
  const sourceStats = contacts?.reduce((acc: Record<string, number>, contact: MarketingContact) => {
    acc[contact.source] = (acc[contact.source] || 0) + 1;
    return acc;
  }, {}) || {};

  // Filter franchise applications based on selected status
  const filteredFranchiseApplications = franchiseApplications?.filter((app: FranchiseApplication) => {
    if (selectedFranchiseStatus === null) return true;
    return app.status === selectedFranchiseStatus;
  }) || [];

  if (contactsLoading || messagesLoading || loyaltyCustomersLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-coffee-cream to-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-coffee-cream to-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-coffee-dark mb-2">Coffee Pro Admin Dashboard</h1>
            <p className="text-coffee-medium">Manage marketing contacts and customer messages</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-coffee-accent text-coffee-primary hover:bg-coffee-primary hover:text-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="marketing" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="marketing" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Marketing Contacts ({totalContacts})
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Customer Messages ({contactMessages?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="loyalty" className="flex items-center gap-2">
              <Coffee className="w-4 h-4" />
              Loyalty Program ({loyaltyCustomers?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="franchise" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              Franchise Applications ({franchiseApplications?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications ({notifications?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="marketing" className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-coffee-medium">Total Contacts</p>
                      <p className="text-2xl font-bold text-coffee-dark">{totalContacts}</p>
                    </div>
                    <User className="w-8 h-8 text-coffee-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-coffee-medium">Subscribed</p>
                      <p className="text-2xl font-bold text-green-600">{subscribedContacts}</p>
                    </div>
                    <Mail className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-coffee-medium">Newsletter</p>
                      <p className="text-2xl font-bold text-blue-600">{sourceStats.newsletter || 0}</p>
                    </div>
                    <Mail className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-coffee-medium">Community</p>
                      <p className="text-2xl font-bold text-green-600">{sourceStats.community || 0}</p>
                    </div>
                    <User className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-medium w-4 h-4" />
                      <Input
                        placeholder="Search by email, name, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <select
                      value={sourceFilter}
                      onChange={(e) => setSourceFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-primary"
                    >
                      <option value="all">All Sources</option>
                      <option value="newsletter">Newsletter</option>
                      <option value="community">Community</option>
                      <option value="loyalty">Loyalty</option>
                      <option value="contact">Contact</option>
                    </select>
                    
                    <Button
                      onClick={() => downloadMarketingContacts()}
                      disabled={!filteredContacts.length}
                      className="bg-coffee-primary hover:bg-coffee-medium text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      CSV
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredContacts.map((contact: MarketingContact) => (
                    <div key={contact.id} className="border border-coffee-accent/20 rounded-lg p-4 hover:bg-coffee-cream/30 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-medium text-coffee-dark">
                                  {contact.name || 'No name provided'}
                                </h3>
                                <Badge className={getSourceColor(contact.source)}>
                                  {contact.source}
                                </Badge>
                                {contact.subscribed && (
                                  <Badge className="bg-green-100 text-green-800">Subscribed</Badge>
                                )}
                              </div>
                              <div className="space-y-1 text-sm text-coffee-medium">
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4" />
                                  {contact.email}
                                </div>
                                {contact.phone && (
                                  <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    {contact.phone}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 text-sm text-coffee-medium">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(contact.createdAt), 'MMM d, yyyy')}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteMarketingContactMutation.mutate(contact.id)}
                            disabled={deleteMarketingContactMutation.isPending}
                            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredContacts.length === 0 && (
                    <div className="text-center py-8">
                      <User className="w-12 h-12 text-coffee-medium mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-coffee-dark mb-2">No contacts found</h3>
                      <p className="text-coffee-medium">
                        {searchTerm || sourceFilter !== "all" 
                          ? "Try adjusting your search or filter criteria"
                          : "No marketing contacts have been collected yet"}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Customer Contact Messages
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => downloadContactMessages()}
                      disabled={!contactMessages?.length}
                      size="sm"
                      className="bg-coffee-primary hover:bg-coffee-medium text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      CSV
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contactMessages?.map((message: ContactMessage) => (
                    <div key={message.id} className="border border-coffee-accent/20 rounded-lg p-4 hover:bg-coffee-cream/30 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium text-coffee-dark">{message.name}</h3>
                          <p className="text-sm text-coffee-medium">{message.email}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-sm text-coffee-medium">
                            {format(new Date(message.createdAt), 'MMM d, yyyy HH:mm')}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteContact(message.id, message.name)}
                            disabled={deleteContactMutation.isPending}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <h4 className="font-medium text-coffee-dark text-sm mb-1">Subject:</h4>
                        <p className="text-coffee-medium">{message.subject}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-coffee-dark text-sm mb-1">Message:</h4>
                        <p className="text-coffee-medium whitespace-pre-wrap">{message.message}</p>
                      </div>
                    </div>
                  )) || []}
                  
                  {(!contactMessages || contactMessages.length === 0) && (
                    <div className="text-center py-8">
                      <MessageSquare className="w-12 h-12 text-coffee-medium mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-coffee-dark mb-2">No customer messages</h3>
                      <p className="text-coffee-medium">
                        Customer messages from the contact form will appear here
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loyalty" className="space-y-8">
            {/* QR Code for Staff */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Loyalty Program QR Code */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="w-5 h-5" />
                    Loyalty Program QR Code
                  </CardTitle>
                  <p className="text-sm text-coffee-medium">Print and display this QR code in your store for customers to scan</p>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                  <QRCodeComponent size={150} mode="admin" />
                </CardContent>
              </Card>

              {/* Website QR Code */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="w-5 h-5" />
                    Website QR Code
                  </CardTitle>
                  <p className="text-sm text-coffee-medium">Print and display this QR code for customers to access your website</p>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                  <WebsiteQRCode size={150} />
                </CardContent>
              </Card>
            </div>

            {/* Loyalty Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <User className="w-8 h-8 text-coffee-primary" />
                    <div>
                      <p className="text-sm text-coffee-medium">Total Customers</p>
                      <p className="text-2xl font-bold text-coffee-dark">{loyaltyCustomers?.length || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Coffee className="w-8 h-8 text-coffee-primary" />
                    <div>
                      <p className="text-sm text-coffee-medium">Total Visits</p>
                      <p className="text-2xl font-bold text-coffee-dark">{loyaltyVisits?.length || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Gift className="w-8 h-8 text-coffee-primary" />
                    <div>
                      <p className="text-sm text-coffee-medium">Total Rewards</p>
                      <p className="text-2xl font-bold text-coffee-dark">{loyaltyRewards?.length || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Star className="w-8 h-8 text-coffee-primary" />
                    <div>
                      <p className="text-sm text-coffee-medium">Active Points</p>
                      <p className="text-2xl font-bold text-coffee-dark">
                        {loyaltyCustomers?.reduce((sum, customer) => sum + (customer.currentPoints || 0), 0) || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Individual Customer Folders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Individual Customer Folders
                    </div>
                    <p className="text-sm text-coffee-medium mt-1">
                      Each customer has their own folder with points and visit history tracked by phone number
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => downloadLoyaltyCustomers()}
                      disabled={!loyaltyCustomers?.length}
                      size="sm"
                      className="bg-coffee-primary hover:bg-coffee-medium text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      CSV
                    </Button>
                  </div>
                </CardTitle>
                
                {/* Customer Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-medium w-4 h-4" />
                  <Input
                    placeholder="Search customers by name, phone, or email..."
                    value={customerSearchQuery}
                    onChange={(e) => setCustomerSearchQuery(e.target.value)}
                    className="pl-10 border-coffee-accent/30 focus:border-coffee-primary"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loyaltyCustomersLoading ? (
                    <div className="space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
                      ))}
                    </div>
                  ) : loyaltyCustomers && loyaltyCustomers.length > 0 ? (
                    (() => {
                      const filteredCustomers = loyaltyCustomers.filter((customer: LoyaltyCustomer) => 
                        customerSearchQuery === '' || 
                        customer.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
                        customer.phone.includes(customerSearchQuery) ||
                        customer.email.toLowerCase().includes(customerSearchQuery.toLowerCase())
                      );
                      
                      return (
                        <div className="space-y-4">
                          {customerSearchQuery && (
                            <div className="text-sm text-coffee-medium bg-coffee-cream/30 p-3 rounded-lg">
                              {filteredCustomers.length > 0 ? (
                                <>Showing {filteredCustomers.length} of {loyaltyCustomers.length} customers</>
                              ) : (
                                <>No customers found matching "{customerSearchQuery}"</>
                              )}
                            </div>
                          )}
                          {filteredCustomers.map((customer: LoyaltyCustomer) => (
                            <div key={customer.id} className="border rounded-lg p-4 hover:bg-gray-50">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 bg-coffee-primary rounded-full flex items-center justify-center text-white font-bold">
                                    {customer.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="font-bold text-coffee-dark">{customer.name}</p>
                                    <p className="text-sm text-coffee-medium">{customer.phone}</p>
                                    <p className="text-sm text-coffee-medium">{customer.email}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-coffee-medium">Customer ID: {customer.id}</p>
                                  <p className="text-xs text-coffee-medium">
                                    Joined: {format(new Date(customer.createdAt), 'MMM dd, yyyy')}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-3 bg-coffee-cream/30 rounded-lg">
                                <div className="text-center">
                                  <p className="text-sm text-coffee-medium">Total Visits</p>
                                  <p className="text-2xl font-bold text-coffee-dark">{customer.totalVisits}</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-sm text-coffee-medium">Current Points</p>
                                  <Badge 
                                    variant={customer.currentPoints >= 5 ? "default" : "secondary"}
                                    className="text-lg px-3 py-1"
                                  >
                                    {customer.currentPoints}
                                  </Badge>
                                </div>
                                <div className="text-center">
                                  <p className="text-sm text-coffee-medium">Total Rewards</p>
                                  <p className="text-2xl font-bold text-green-600">{customer.totalRewards}</p>
                                </div>
                                <div className="text-center">
                                  {customer.currentPoints >= 5 ? (
                                    <Button
                                      size="sm"
                                      onClick={() => redeemRewardMutation.mutate({ customerId: customer.id })}
                                      disabled={redeemRewardMutation.isPending}
                                      className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                      <Gift className="w-4 h-4 mr-1" />
                                      Redeem FREE Coffee
                                    </Button>
                                  ) : (
                                    <div>
                                      <p className="text-sm text-coffee-medium">Points to Reward</p>
                                      <p className="text-lg font-bold text-amber-600">{5 - customer.currentPoints}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="mt-3 text-xs text-coffee-medium">
                                <p><strong>Recognition:</strong> System recognizes this customer by phone number {customer.phone}</p>
                                <p><strong>Last Activity:</strong> {format(new Date(customer.updatedAt), 'MMM dd, yyyy HH:mm')}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()
                  ) : (
                    <div className="text-center py-8">
                      <Coffee className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">No loyalty customers yet</p>
                      <p className="text-gray-400 text-sm">
                        When customers check-in using QR codes, their individual folders will appear here
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Visits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Recent Visits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  {loyaltyVisitsLoading ? (
                    <div className="space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
                      ))}
                    </div>
                  ) : loyaltyVisits && loyaltyVisits.length > 0 ? (
                    <div className="space-y-3">
                      {loyaltyVisits.slice(0, 10).map((visit: LoyaltyVisit) => {
                        const customer = loyaltyCustomers?.find((c: LoyaltyCustomer) => c.id === visit.customerId);
                        return (
                          <div key={visit.id} className="flex justify-between items-center border-b pb-2">
                            <div>
                              <p className="font-medium text-coffee-dark">{customer?.name || `Customer ${visit.customerId}`}</p>
                              <p className="text-sm text-coffee-medium">{customer?.phone}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-coffee-dark">+{visit.pointsEarned} points</p>
                              <p className="text-xs text-coffee-medium">
                                {format(new Date(visit.visitDate), 'MMM dd, yyyy h:mm a')}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">No visits recorded yet</p>
                      <p className="text-gray-400 text-sm">
                        Customer check-ins will appear here
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="franchise" className="space-y-8">
            {/* Franchise Applications Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Building className="w-5 h-5" />
                      Franchise Applications
                    </div>
                    <p className="text-sm text-coffee-medium">
                      Manage and review franchise application submissions
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => downloadFranchiseApplications()}
                      disabled={!franchiseApplications?.length}
                      size="sm"
                      className="bg-coffee-primary hover:bg-coffee-medium text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      CSV
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div 
                    onClick={() => setSelectedFranchiseStatus(null)}
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedFranchiseStatus === null 
                        ? 'bg-blue-100 ring-2 ring-blue-500' 
                        : 'bg-blue-50 hover:bg-blue-100'
                    }`}
                  >
                    <h3 className="font-semibold text-blue-800">Total Applications</h3>
                    <p className="text-2xl font-bold text-blue-600">
                      {franchiseApplications?.length || 0}
                    </p>
                  </div>
                  <div 
                    onClick={() => setSelectedFranchiseStatus('pending')}
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedFranchiseStatus === 'pending' 
                        ? 'bg-yellow-100 ring-2 ring-yellow-500' 
                        : 'bg-yellow-50 hover:bg-yellow-100'
                    }`}
                  >
                    <h3 className="font-semibold text-yellow-800">Pending Review</h3>
                    <p className="text-2xl font-bold text-yellow-600">
                      {franchiseApplications?.filter((app: FranchiseApplication) => app.status === 'pending').length || 0}
                    </p>
                  </div>
                  <div 
                    onClick={() => setSelectedFranchiseStatus('approved')}
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedFranchiseStatus === 'approved' 
                        ? 'bg-green-100 ring-2 ring-green-500' 
                        : 'bg-green-50 hover:bg-green-100'
                    }`}
                  >
                    <h3 className="font-semibold text-green-800">Approved</h3>
                    <p className="text-2xl font-bold text-green-600">
                      {franchiseApplications?.filter((app: FranchiseApplication) => app.status === 'approved').length || 0}
                    </p>
                  </div>
                  <div 
                    onClick={() => setSelectedFranchiseStatus('rejected')}
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedFranchiseStatus === 'rejected' 
                        ? 'bg-red-100 ring-2 ring-red-500' 
                        : 'bg-red-50 hover:bg-red-100'
                    }`}
                  >
                    <h3 className="font-semibold text-red-800">Rejected</h3>
                    <p className="text-2xl font-bold text-red-600">
                      {franchiseApplications?.filter((app: FranchiseApplication) => app.status === 'rejected').length || 0}
                    </p>
                  </div>
                </div>

                {/* Filter Header */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-coffee-dark">
                    {selectedFranchiseStatus === null 
                      ? 'All Applications' 
                      : selectedFranchiseStatus === 'pending' 
                        ? 'Pending Applications' 
                        : selectedFranchiseStatus === 'approved' 
                          ? 'Approved Applications' 
                          : 'Rejected Applications'}
                  </h3>
                  <p className="text-sm text-coffee-medium">
                    Showing {filteredFranchiseApplications.length} of {franchiseApplications?.length || 0} applications
                  </p>
                </div>

                {franchiseLoading ? (
                  <div className="text-center py-8">
                    <p className="text-coffee-medium">Loading applications...</p>
                  </div>
                ) : filteredFranchiseApplications && filteredFranchiseApplications.length > 0 ? (
                  <div className="space-y-4">
                    {filteredFranchiseApplications.map((application: FranchiseApplication) => (
                      <Card key={application.id} className="border-l-4 border-l-coffee-primary">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <User className="w-4 h-4 text-coffee-medium" />
                                <span className="font-medium">{application.firstName} {application.lastName}</span>
                                <Badge 
                                  className={`${
                                    application.status === 'approved' ? 'bg-green-100 text-green-800' :
                                    application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  {application.status.toUpperCase()}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                <div>
                                  <p className="text-sm text-coffee-light">Email:</p>
                                  <p className="text-coffee-medium">{application.email}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-coffee-light">Phone:</p>
                                  <p className="text-coffee-medium">{application.phone}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-coffee-light">Investment Capacity:</p>
                                  <p className="text-coffee-medium">{application.investmentCapacity}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-coffee-light">Preferred Location:</p>
                                  <p className="text-coffee-medium">{application.preferredLocation}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-coffee-light">Timeline:</p>
                                  <p className="text-coffee-medium">{application.timelineToOpen}</p>
                                </div>
                              </div>
                              <div className="mb-3">
                                <p className="text-sm text-coffee-light">Business Experience:</p>
                                <p className="text-coffee-medium">{application.businessExperience}</p>
                              </div>
                              {application.additionalInfo && (
                                <div className="mb-3">
                                  <p className="text-sm text-coffee-light">Additional Information:</p>
                                  <p className="text-coffee-medium">{application.additionalInfo}</p>
                                </div>
                              )}
                              <p className="text-sm text-coffee-light">
                                <Calendar className="w-3 h-3 inline mr-1" />
                                Applied: {format(new Date(application.createdAt), "MMM dd, yyyy 'at' h:mm a")}
                              </p>
                            </div>
                            {application.status === 'pending' && (
                              <div className="flex gap-2 mt-4 pt-4 border-t">
                                <Button
                                  onClick={() => updateFranchiseStatus.mutate({ id: application.id, status: 'approved' })}
                                  disabled={updateFranchiseStatus.isPending}
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  Approve
                                </Button>
                                <Button
                                  onClick={() => updateFranchiseStatus.mutate({ id: application.id, status: 'rejected' })}
                                  disabled={updateFranchiseStatus.isPending}
                                  size="sm"
                                  variant="destructive"
                                >
                                  Deny
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">
                      {selectedFranchiseStatus === null 
                        ? 'No franchise applications yet' 
                        : `No ${selectedFranchiseStatus} applications`}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {selectedFranchiseStatus === null 
                        ? 'Applications will appear here when submitted' 
                        : `No applications with ${selectedFranchiseStatus} status found`}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-8">
            {/* Notifications Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Customer Notifications
                </CardTitle>
                <p className="text-sm text-coffee-medium">
                  Track congratulatory messages sent to customers when they earn free coffee rewards
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800">Total Sent</h3>
                    <p className="text-2xl font-bold text-blue-600">
                      {notifications?.filter((n: Notification) => n.status === 'sent').length || 0}
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-yellow-800">Pending</h3>
                    <p className="text-2xl font-bold text-yellow-600">
                      {notifications?.filter((n: Notification) => n.status === 'pending').length || 0}
                    </p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-red-800">Failed</h3>
                    <p className="text-2xl font-bold text-red-600">
                      {notifications?.filter((n: Notification) => n.status === 'failed').length || 0}
                    </p>
                  </div>
                </div>

                {notificationsLoading ? (
                  <div className="text-center py-8">
                    <p className="text-coffee-medium">Loading notifications...</p>
                  </div>
                ) : notifications && notifications.length > 0 ? (
                  <div className="space-y-4">
                    {notifications.map((notification: Notification) => (
                      <Card key={notification.id} className="border-l-4 border-l-coffee-primary">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Phone className="w-4 h-4 text-coffee-medium" />
                                <span className="font-medium">{notification.phone}</span>
                                <Badge 
                                  className={`${
                                    notification.status === 'sent' ? 'bg-green-100 text-green-800' :
                                    notification.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {notification.status.toUpperCase()}
                                </Badge>
                                <Badge variant="outline">{notification.method.toUpperCase()}</Badge>
                              </div>
                              <p className="text-coffee-medium mb-2">"{notification.message}"</p>
                              <p className="text-sm text-coffee-light">
                                <Calendar className="w-3 h-3 inline mr-1" />
                                {format(new Date(notification.sentAt), "MMM dd, yyyy 'at' h:mm a")}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Bell className="w-12 h-12 text-coffee-light mx-auto mb-4" />
                    <p className="text-coffee-medium">No notifications sent yet</p>
                    <p className="text-sm text-coffee-light">
                      Notifications will appear here when customers earn free coffee rewards
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notification Info */}
            <Card>
              <CardHeader>
                <CardTitle>Free SMS Alternatives</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Current Setup</h4>
                    <p className="text-blue-700 text-sm">
                      The system logs all reward notifications for tracking. When customers earn free coffee, 
                      notifications are logged here for your reference.
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Future SMS Options</h4>
                    <p className="text-green-700 text-sm mb-2">
                      To enable actual SMS notifications, you can use free tiers from:
                    </p>
                    <ul className="text-green-700 text-sm space-y-1">
                      <li>• Twilio (Free trial with $15 credit)</li>
                      <li>• EmailJS (200 free emails/month)</li>
                      <li>• SendGrid (100 free emails/day)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}