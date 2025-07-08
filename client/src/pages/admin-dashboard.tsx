import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Search, Mail, Phone, User, Calendar, Filter, LogOut, MessageSquare, Trash2, Coffee, Gift, Star, QrCode } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import QRCodeComponent from "@/components/QRCode";

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

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const queryClient = useQueryClient();

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
      await apiRequest(`/api/contact/${id}`, {
        method: 'DELETE'
      });
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

  const handleExportCSV = () => {
    if (!filteredContacts.length) return;
    
    const csvContent = [
      ['ID', 'Email', 'Name', 'Phone', 'Source', 'Subscribed', 'Created At'],
      ...filteredContacts.map((contact: MarketingContact) => [
        contact.id,
        contact.email,
        contact.name || '',
        contact.phone || '',
        contact.source,
        contact.subscribed ? 'Yes' : 'No',
        format(new Date(contact.createdAt), 'yyyy-MM-dd HH:mm:ss')
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coffee-pro-contacts-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

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
          <TabsList className="grid w-full grid-cols-3">
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
                      onClick={handleExportCSV}
                      disabled={!filteredContacts.length}
                      className="bg-coffee-primary hover:bg-coffee-medium text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export CSV
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
                        <div className="flex items-center gap-2 text-sm text-coffee-medium">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(contact.createdAt), 'MMM d, yyyy')}
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
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Customer Contact Messages
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="w-5 h-5" />
                  Loyalty Program QR Code
                </CardTitle>
                <p className="text-sm text-coffee-medium">Print and display this QR code in your store for customers to scan</p>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-inner">
                  <QRCodeComponent 
                    value={typeof window !== 'undefined' ? window.location.origin + '/loyalty/checkin' : ''} 
                    size={150} 
                  />
                </div>
                <div className="text-center">
                  <Button 
                    onClick={() => window.open('/loyalty/checkin', '_blank')}
                    className="bg-coffee-primary hover:bg-coffee-medium text-white"
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    Open Check-in Page
                  </Button>
                </div>
              </CardContent>
            </Card>

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

            {/* Loyalty Customers Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coffee className="w-5 h-5" />
                  Loyalty Customers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  {loyaltyCustomersLoading ? (
                    <div className="space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
                      ))}
                    </div>
                  ) : loyaltyCustomers && loyaltyCustomers.length > 0 ? (
                    <div className="space-y-4">
                      {loyaltyCustomers.map((customer: LoyaltyCustomer) => (
                        <div key={customer.id} className="border rounded-lg p-4 hover:bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                            <div>
                              <p className="font-medium text-coffee-dark">{customer.name}</p>
                              <p className="text-sm text-coffee-medium">{customer.email}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-coffee-medium">Phone</p>
                              <p className="text-coffee-dark">{customer.phone}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-coffee-medium">Visits</p>
                              <p className="text-coffee-dark font-bold">{customer.totalVisits}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-coffee-medium">Current Points</p>
                              <Badge variant={customer.currentPoints >= 5 ? "default" : "secondary"}>
                                {customer.currentPoints}
                              </Badge>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-coffee-medium">Total Rewards</p>
                              <p className="text-coffee-dark font-bold">{customer.totalRewards}</p>
                            </div>
                            <div className="text-center">
                              {customer.currentPoints >= 5 && (
                                <Button
                                  size="sm"
                                  onClick={() => redeemRewardMutation.mutate({ customerId: customer.id })}
                                  disabled={redeemRewardMutation.isPending}
                                  className="bg-coffee-primary hover:bg-coffee-medium text-white"
                                >
                                  <Gift className="w-4 h-4 mr-1" />
                                  Redeem
                                </Button>
                              )}
                              {customer.currentPoints < 5 && (
                                <p className="text-xs text-coffee-medium">
                                  {5 - customer.currentPoints} more to reward
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-coffee-medium">
                            Joined: {format(new Date(customer.createdAt), 'MMM dd, yyyy')}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Coffee className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">No loyalty customers yet</p>
                      <p className="text-gray-400 text-sm">
                        Customer loyalty check-ins will appear here
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
        </Tabs>
      </div>
    </div>
  );
}