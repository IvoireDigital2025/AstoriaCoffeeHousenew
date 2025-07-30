import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Search, Mail, Phone, User, Calendar, Filter, LogOut, MessageSquare, Trash2, Coffee, Gift, Star, QrCode, Bell, Building, FileSpreadsheet, Globe } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import QRCodeComponent from "@/components/QRCode";
import WebsiteQRCode from "@/components/WebsiteQRCode";
// @ts-ignore - papaparse types not available
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const queryClient = useQueryClient();

  // ALL QUERIES AND MUTATIONS MUST BE DEFINED BEFORE ANY CONDITIONAL RETURNS
  const { data: contacts, isLoading: contactsLoading } = useQuery({
    queryKey: ['/api/marketing/contacts'],
    queryFn: async () => {
      const response = await fetch('/api/marketing/contacts', {
        credentials: 'include'
      });
      if (response.status === 401) {
        setLocation('/admin/login');
        throw new Error('Authentication required');
      }
      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }
      return response.json();
    },
    enabled: isAuthenticated === true
  });

  const { data: contactMessages, isLoading: messagesLoading } = useQuery({
    queryKey: ['/api/contact/messages'],
    queryFn: async () => {
      const response = await fetch('/api/contact/messages', {
        credentials: 'include'
      });
      if (response.status === 401) {
        setLocation('/admin/login');
        throw new Error('Authentication required');
      }
      if (!response.ok) {
        throw new Error('Failed to fetch contact messages');
      }
      return response.json();
    },
    enabled: isAuthenticated === true
  });

  const { data: loyaltyCustomers, isLoading: loyaltyCustomersLoading } = useQuery({
    queryKey: ['/api/admin/loyalty/customers'],
    queryFn: async () => {
      const response = await fetch('/api/admin/loyalty/customers', {
        credentials: 'include'
      });
      if (response.status === 401) {
        setLocation('/admin/login');
        throw new Error('Authentication required');
      }
      if (!response.ok) {
        throw new Error('Failed to fetch loyalty customers');
      }
      return response.json();
    },
    enabled: isAuthenticated === true
  });

  const { data: franchiseApplications, isLoading: franchiseLoading } = useQuery({
    queryKey: ['/api/admin/franchise/applications'],
    queryFn: async () => {
      const response = await fetch('/api/admin/franchise/applications', {
        credentials: 'include'
      });
      if (response.status === 401) {
        setLocation('/admin/login');
        throw new Error('Authentication required');
      }
      if (!response.ok) {
        throw new Error('Failed to fetch franchise applications');
      }
      return response.json();
    },
    enabled: isAuthenticated === true
  });

  // Filter franchise applications (rejected applications are automatically deleted)
  const filteredFranchiseApplications = franchiseApplications?.filter((app: FranchiseApplication) => {
    if (!selectedFranchiseStatus || selectedFranchiseStatus === 'all') return true;
    return app.status === selectedFranchiseStatus;
  }) || [];

  const updateFranchiseStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      await apiRequest('PATCH', `/api/admin/franchise/applications/${id}/status`, { status });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/franchise/applications'] });
      if (variables.status === 'rejected') {
        toast({
          title: "Application Rejected",
          description: "Franchise application has been rejected and removed from the system.",
          variant: "default",
        });
      } else {
        toast({
          title: "Status Updated",
          description: "Franchise application status has been updated successfully.",
          variant: "default",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: `Failed to update application status: ${error.message}`,
        variant: "destructive",
      });
    },
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

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Admin Dashboard: Checking authentication...');
        const response = await fetch('/api/admin/check', {
          credentials: 'include'
        });
        console.log('Admin Dashboard: Auth response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Admin Dashboard: Auth response data:', data);
          setIsAuthenticated(data.authenticated);
        } else {
          console.log('Admin Dashboard: Not authenticated');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.log('Admin Dashboard: Auth check error:', error);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isAuthenticated === false) {
      setLocation('/admin/login');
    }
  }, [isAuthenticated, setLocation]);

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-coffee-cream to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coffee-primary mx-auto mb-4"></div>
          <p className="text-coffee-medium">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return null;
  }

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg">
                <Coffee className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Coffee Pro Admin</h1>
                <span className="text-sm text-gray-600">Dashboard & Analytics</span>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all duration-200"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">Total Contacts</p>
                  <p className="text-3xl font-bold text-white">{totalContacts}</p>
                  <p className="text-blue-100 text-xs mt-1">Marketing database</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <User className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium mb-1">Subscribed</p>
                  <p className="text-3xl font-bold text-white">{subscribedContacts}</p>
                  <p className="text-green-100 text-xs mt-1">Active subscribers</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <Bell className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium mb-1">Messages</p>
                  <p className="text-3xl font-bold text-white">{contactMessages?.length || 0}</p>
                  <p className="text-purple-100 text-xs mt-1">Customer inquiries</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-red-500 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium mb-1">Loyalty Members</p>
                  <p className="text-3xl font-bold text-white">{loyaltyCustomers?.length || 0}</p>
                  <p className="text-orange-100 text-xs mt-1">Registered customers</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <Gift className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <Tabs defaultValue="contacts" className="w-full">
            <div className="border-b border-gray-200">
              <TabsList className="grid w-full grid-cols-5 bg-transparent rounded-none h-auto p-0">
                <TabsTrigger 
                  value="contacts" 
                  className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 border-b-2 border-transparent transition-all duration-200 rounded-none py-4 px-6 font-medium"
                >
                  <User className="w-4 h-4 mr-2" />
                  Marketing Contacts
                </TabsTrigger>
                <TabsTrigger 
                  value="messages" 
                  className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 data-[state=active]:border-b-2 data-[state=active]:border-purple-600 border-b-2 border-transparent transition-all duration-200 rounded-none py-4 px-6 font-medium"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Customer Messages
                </TabsTrigger>
                <TabsTrigger 
                  value="loyalty" 
                  className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700 data-[state=active]:border-b-2 data-[state=active]:border-orange-600 border-b-2 border-transparent transition-all duration-200 rounded-none py-4 px-6 font-medium"
                >
                  <Gift className="w-4 h-4 mr-2" />
                  Loyalty Program
                </TabsTrigger>
                <TabsTrigger 
                  value="franchise" 
                  className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700 data-[state=active]:border-b-2 data-[state=active]:border-green-600 border-b-2 border-transparent transition-all duration-200 rounded-none py-4 px-6 font-medium"
                >
                  <Building className="w-4 h-4 mr-2" />
                  Franchise Applications
                </TabsTrigger>
                <TabsTrigger 
                  value="qr" 
                  className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 border-b-2 border-transparent transition-all duration-200 rounded-none py-4 px-6 font-medium"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  QR Codes
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Marketing Contacts Tab */}
            <TabsContent value="contacts" className="space-y-0">
              <Card className="border-0 shadow-sm bg-white rounded-none rounded-b-xl">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="p-2 bg-blue-500 rounded-lg">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span className="text-gray-900">Marketing Contacts</span>
                        <span className="block text-sm text-gray-600 font-normal mt-1">
                          {filteredContacts.length} contacts • {subscribedContacts} subscribed
                        </span>
                      </div>
                    </CardTitle>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search contacts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full sm:w-64 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <select
                      value={sourceFilter}
                      onChange={(e) => setSourceFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    >
                      <option value="all">All Sources</option>
                      <option value="newsletter">Newsletter</option>
                      <option value="community">Community</option>
                      <option value="loyalty">Loyalty</option>
                      <option value="contact">Contact</option>
                    </select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                <div className="space-y-4">
                  {filteredContacts.map((contact: MarketingContact) => (
                    <div key={contact.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-300 transition-all duration-300 group">
                      <div className="flex justify-between items-start">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <Badge className={`${getSourceColor(contact.source)} px-3 py-1 rounded-full text-xs font-medium`}>
                              {contact.source.charAt(0).toUpperCase() + contact.source.slice(1)}
                            </Badge>
                            {contact.subscribed && (
                              <Badge className="bg-green-100 text-green-700 border-green-200 px-3 py-1 rounded-full text-xs font-medium">
                                ✓ Subscribed
                              </Badge>
                            )}
                          </div>
                          <div className="space-y-2">
                            <p className="font-semibold text-gray-900 text-lg">{contact.name || 'Anonymous User'}</p>
                            <div className="space-y-2">
                              <p className="text-sm text-gray-600 flex items-center gap-2">
                                <div className="p-1 bg-blue-100 rounded">
                                  <Mail className="w-3 h-3 text-blue-600" />
                                </div>
                                <span className="font-medium">{contact.email}</span>
                              </p>
                              {contact.phone && (
                                <p className="text-sm text-gray-600 flex items-center gap-2">
                                  <div className="p-1 bg-green-100 rounded">
                                    <Phone className="w-3 h-3 text-green-600" />
                                  </div>
                                  <span className="font-medium">{contact.phone}</span>
                                </p>
                              )}
                              <p className="text-xs text-gray-500 flex items-center gap-2">
                                <div className="p-1 bg-gray-100 rounded">
                                  <Calendar className="w-3 h-3 text-gray-500" />
                                </div>
                                {format(new Date(contact.createdAt), 'MMM dd, yyyy • HH:mm')}
                              </p>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteMarketingContactMutation.mutate(contact.id)}
                          className="text-red-600 border-red-200 hover:text-white hover:bg-red-500 hover:border-red-500 transition-all duration-200 opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {filteredContacts.length === 0 && (
                    <div className="text-center py-12">
                      <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">No contacts found</p>
                      <p className="text-gray-400 text-sm">Try adjusting your search or filter criteria</p>
                    </div>
                  )}
                </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="messages" className="space-y-0">
              <Card className="border-0 shadow-sm bg-white rounded-none rounded-b-xl">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 border-b border-purple-100">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-purple-500 rounded-lg">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="text-gray-900">Customer Messages</span>
                      <span className="block text-sm text-gray-600 font-normal mt-1">
                        {contactMessages?.length || 0} inquiries received
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                <div className="space-y-4">
                  {contactMessages?.map((message: ContactMessage) => (
                    <div key={message.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-purple-300 transition-all duration-300 group">
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-4">
                            <h3 className="font-semibold text-gray-900 text-lg">{message.name}</h3>
                            <Badge className="bg-purple-100 text-purple-700 border-purple-200 px-3 py-1 rounded-full text-xs font-medium">
                              New Message
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                              <div className="p-1 bg-blue-100 rounded">
                                <Mail className="w-3 h-3 text-blue-600" />
                              </div>
                              <span className="font-medium">{message.email}</span>
                            </p>
                            <p className="text-xs text-gray-500 flex items-center gap-2">
                              <div className="p-1 bg-gray-100 rounded">
                                <Calendar className="w-3 h-3 text-gray-500" />
                              </div>
                              {format(new Date(message.createdAt), 'MMM dd, yyyy • HH:mm')}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteContact(message.id, message.name)}
                          className="text-red-600 border-red-200 hover:text-white hover:bg-red-500 hover:border-red-500 transition-all duration-200 opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-lg border border-purple-100">
                          <p className="text-sm font-semibold text-purple-800 mb-2">Subject</p>
                          <p className="text-gray-700">{message.subject}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p className="text-sm font-semibold text-gray-700 mb-2">Message</p>
                          <p className="text-gray-600 leading-relaxed">{message.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!contactMessages || contactMessages.length === 0) && (
                    <div className="text-center py-12">
                      <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">No messages yet</p>
                      <p className="text-gray-400 text-sm">Customer inquiries will appear here</p>
                    </div>
                  )}
                </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="loyalty" className="space-y-0">
              <Card className="border-0 shadow-sm bg-white rounded-none rounded-b-xl">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b border-orange-100">
                  <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                    <Gift className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-gray-900">Loyalty Program</span>
                    <span className="block text-sm text-gray-600 font-normal mt-1">
                      {loyaltyCustomers?.length || 0} registered members
                    </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                  {loyaltyCustomers?.map((customer: LoyaltyCustomer) => (
                    <div key={customer.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-orange-300 transition-all duration-300 group">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-3">
                            <h3 className="font-semibold text-gray-900 text-lg">{customer.name}</h3>
                            <div className="space-y-2">
                              <p className="text-sm text-gray-600 flex items-center gap-2">
                                <div className="p-1 bg-blue-100 rounded">
                                  <Mail className="w-3 h-3 text-blue-600" />
                                </div>
                                <span className="font-medium">{customer.email}</span>
                              </p>
                              <p className="text-sm text-gray-600 flex items-center gap-2">
                                <div className="p-1 bg-green-100 rounded">
                                  <Phone className="w-3 h-3 text-green-600" />
                                </div>
                                <span className="font-medium">{customer.phone}</span>
                              </p>
                              <p className="text-xs text-gray-500 flex items-center gap-2">
                                <div className="p-1 bg-gray-100 rounded">
                                  <Calendar className="w-3 h-3 text-gray-500" />
                                </div>
                                Member since {format(new Date(customer.createdAt), 'MMM dd, yyyy')}
                              </p>
                            </div>
                          </div>
                          <div className="text-right space-y-3">
                            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-lg shadow-md">
                              <div className="flex items-center gap-2 justify-center">
                                <Star className="w-5 h-5" />
                                <span className="font-bold text-lg">{customer.currentPoints}</span>
                              </div>
                              <p className="text-xs text-yellow-100 mt-1">Points</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-medium text-gray-700">{customer.totalVisits} visits</p>
                              <p className="text-xs text-gray-500">{customer.totalRewards} rewards claimed</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!loyaltyCustomers || loyaltyCustomers.length === 0) && (
                    <div className="text-center py-12">
                      <Gift className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">No loyalty members yet</p>
                      <p className="text-gray-400 text-sm">Customer check-ins will appear here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="qrcodes" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg border-b border-green-100 pb-6">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-3 bg-green-500 rounded-xl shadow-lg">
                      <QrCode className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <span className="text-gray-900">Loyalty Check-in QR</span>
                      <span className="block text-sm text-gray-600 font-normal mt-1">
                        Customer point collection system
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800 leading-relaxed">
                      <strong>📱 For In-Store Use:</strong> Print and display this QR code prominently in your store. 
                      Customers can scan it to check in and earn loyalty points for each visit.
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <div className="bg-white p-4 rounded-2xl shadow-lg border-2 border-green-200">
                      <QRCodeComponent />
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <Badge className="bg-green-500 text-white px-4 py-2 text-sm font-medium rounded-full">
                      ✓ Location Verified • Secure Check-in
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 rounded-t-lg border-b border-orange-100 pb-6">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg">
                      <Coffee className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <span className="text-gray-900">Website QR Code</span>
                      <span className="block text-sm text-gray-600 font-normal mt-1">
                        Direct access to Coffee Pro website
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200">
                    <p className="text-sm text-orange-800 leading-relaxed">
                      <strong>🌐 For Marketing:</strong> Use this QR code on flyers, business cards, or social media. 
                      Customers can quickly access your full menu and information.
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <div className="bg-white p-4 rounded-2xl shadow-lg border-2 border-orange-200">
                      <WebsiteQRCode />
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 text-sm font-medium rounded-full">
                      📱 Mobile Optimized • Easy Access
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-500 rounded-lg">
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">QR Code Usage Tips</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                      <div className="space-y-2">
                        <p><strong>✓ Print Quality:</strong> Use high resolution for clear scanning</p>
                        <p><strong>✓ Size:</strong> Minimum 2x2 inches for optimal scanning</p>
                      </div>
                      <div className="space-y-2">
                        <p><strong>✓ Placement:</strong> Eye-level, well-lit locations work best</p>
                        <p><strong>✓ Testing:</strong> Test scanning from different angles regularly</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="franchise" className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-lg border-b border-indigo-100">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-indigo-500 rounded-lg">
                    <Building className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-gray-900">Franchise Applications</span>
                    <span className="block text-sm text-gray-600 font-normal mt-1">
                      {franchiseApplications?.length || 0} applications received
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {franchiseApplications?.map((app: FranchiseApplication) => (
                    <div key={app.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-indigo-300 transition-all duration-300 group">
                      <div className="space-y-5">
                        <div className="flex justify-between items-start">
                          <div className="space-y-3">
                            <div className="flex items-center gap-4">
                              <h3 className="font-semibold text-gray-900 text-xl">{app.firstName} {app.lastName}</h3>
                              <Badge 
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  app.status === 'approved' 
                                    ? 'bg-green-100 text-green-700 border-green-200' 
                                    : app.status === 'rejected' 
                                    ? 'bg-red-100 text-red-700 border-red-200' 
                                    : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                                }`}
                              >
                                {app.status === 'pending' ? '⏳ Pending Review' : 
                                 app.status === 'approved' ? '✅ Approved' : '❌ Rejected'}
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm text-gray-600 flex items-center gap-2">
                                <div className="p-1 bg-blue-100 rounded">
                                  <Mail className="w-3 h-3 text-blue-600" />
                                </div>
                                <span className="font-medium">{app.email}</span>
                              </p>
                              <p className="text-sm text-gray-600 flex items-center gap-2">
                                <div className="p-1 bg-green-100 rounded">
                                  <Phone className="w-3 h-3 text-green-600" />
                                </div>
                                <span className="font-medium">{app.phone}</span>
                              </p>
                              <p className="text-xs text-gray-500 flex items-center gap-2">
                                <div className="p-1 bg-gray-100 rounded">
                                  <Calendar className="w-3 h-3 text-gray-500" />
                                </div>
                                Applied {format(new Date(app.createdAt), 'MMM dd, yyyy • HH:mm')}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="p-1 bg-green-500 rounded">
                                <Star className="w-3 h-3 text-white" />
                              </div>
                              <span className="text-sm font-semibold text-green-800">Investment & Timeline</span>
                            </div>
                            <div className="space-y-2 text-sm">
                              <p><span className="font-medium text-gray-700">Investment:</span> <span className="text-green-700">{app.investmentCapacity}</span></p>
                              <p><span className="font-medium text-gray-700">Timeline:</span> <span className="text-green-700">{app.timelineToOpen}</span></p>
                            </div>
                          </div>
                          
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="p-1 bg-blue-500 rounded">
                                <Building className="w-3 h-3 text-white" />
                              </div>
                              <span className="text-sm font-semibold text-blue-800">Location & Experience</span>
                            </div>
                            <div className="space-y-2 text-sm">
                              <p><span className="font-medium text-gray-700">Location:</span> <span className="text-blue-700">{app.preferredLocation}</span></p>
                              <p><span className="font-medium text-gray-700">Experience:</span> <span className="text-blue-700">{app.businessExperience}</span></p>
                            </div>
                          </div>
                        </div>
                        
                        {app.additionalInfo && (
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="p-1 bg-gray-500 rounded">
                                <MessageSquare className="w-3 h-3 text-white" />
                              </div>
                              <span className="text-sm font-semibold text-gray-700">Additional Information</span>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">{app.additionalInfo}</p>
                          </div>
                        )}
                        
                        <div className="flex gap-3 pt-2">
                          <Button
                            size="sm"
                            onClick={() => updateFranchiseStatus.mutate({ id: app.id, status: 'approved' })}
                            disabled={app.status === 'approved' || updateFranchiseStatus.isPending}
                            className="bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-300 transition-all duration-200"
                          >
                            {updateFranchiseStatus.isPending ? '...' : '✅ Approve'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateFranchiseStatus.mutate({ id: app.id, status: 'rejected' })}
                            disabled={updateFranchiseStatus.isPending}
                            className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 disabled:border-gray-300 disabled:text-gray-400 transition-all duration-200"
                          >
                            {updateFranchiseStatus.isPending ? '...' : '🗑️ Reject & Remove'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateFranchiseStatus.mutate({ id: app.id, status: 'pending' })}
                            disabled={app.status === 'pending' || updateFranchiseStatus.isPending}
                            className="border-yellow-300 text-yellow-600 hover:bg-yellow-50 hover:border-yellow-400 disabled:border-gray-300 disabled:text-gray-400 transition-all duration-200"
                          >
                            {updateFranchiseStatus.isPending ? '...' : '⏳ Set Pending'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!franchiseApplications || franchiseApplications.length === 0) && (
                    <div className="text-center py-12">
                      <Building className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">No franchise applications yet</p>
                      <p className="text-gray-400 text-sm">Applications will appear here when submitted</p>
                    </div>
                  )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="franchise" className="space-y-0">
              <Card className="border-0 shadow-sm bg-white rounded-none rounded-b-xl">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-green-500 rounded-lg">
                      <Building className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="text-gray-900">Franchise Applications</span>
                      <span className="block text-sm text-gray-600 font-normal mt-1">
                        {filteredFranchiseApplications.length} applications • Status: {selectedFranchiseStatus || 'All'}
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {filteredFranchiseApplications.map((app: FranchiseApplication) => (
                      <div key={app.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-green-300 transition-all duration-300">
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="space-y-3">
                              <div className="flex items-center gap-4">
                                <h3 className="font-semibold text-gray-900 text-xl">{app.firstName} {app.lastName}</h3>
                                <Badge 
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    app.status === 'approved' 
                                      ? 'bg-green-100 text-green-700 border-green-200' 
                                      : app.status === 'rejected' 
                                      ? 'bg-red-100 text-red-700 border-red-200' 
                                      : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                                  }`}
                                >
                                  {app.status === 'pending' ? '⏳ Pending Review' : 
                                   app.status === 'approved' ? '✅ Approved' : '❌ Rejected'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {(!franchiseApplications || franchiseApplications.length === 0) && (
                      <div className="text-center py-12">
                        <Building className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No franchise applications yet</p>
                        <p className="text-gray-400 text-sm">Applications will appear here when submitted</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="qr" className="space-y-0">
              <Card className="border-0 shadow-sm bg-white rounded-none rounded-b-xl">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-indigo-500 rounded-lg">
                      <QrCode className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="text-gray-900">QR Code Management</span>
                      <span className="block text-sm text-gray-600 font-normal mt-1">
                        Generate and manage QR codes for loyalty and website access
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Gift className="w-5 h-5 text-orange-600" />
                        Loyalty Check-in QR Code
                      </h3>
                      <QRCodeComponent />
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-blue-600" />
                        Website Access QR Code
                      </h3>
                      <WebsiteQRCode />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}