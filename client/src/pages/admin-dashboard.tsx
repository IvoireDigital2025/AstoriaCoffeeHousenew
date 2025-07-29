import { useState, useEffect } from "react";
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

  // Show login form if not authenticated
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-coffee-cream to-white flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-coffee-dark mb-4">Access Denied</h2>
          <p className="text-coffee-medium mb-4">Please log in to access the admin dashboard.</p>
          <button 
            onClick={() => setLocation('/admin/login')}
            className="bg-coffee-primary text-white px-6 py-2 rounded-lg hover:bg-coffee-dark transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalContacts}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subscribed</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{subscribedContacts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contactMessages?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loyalty Customers</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loyaltyCustomers?.length || 0}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="contacts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="contacts">Marketing Contacts</TabsTrigger>
            <TabsTrigger value="messages">Customer Messages</TabsTrigger>
            <TabsTrigger value="loyalty">Loyalty Program</TabsTrigger>
            <TabsTrigger value="qrcodes">QR Codes</TabsTrigger>
            <TabsTrigger value="franchise">Franchise Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="contacts" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="w-5 h-5" />
                      Marketing Contacts ({filteredContacts.length})
                    </CardTitle>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search contacts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full sm:w-64"
                      />
                    </div>
                    <select
                      value={sourceFilter}
                      onChange={(e) => setSourceFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md"
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
              <CardContent>
                <div className="space-y-4">
                  {filteredContacts.map((contact) => (
                    <div key={contact.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge className={getSourceColor(contact.source)}>
                              {contact.source}
                            </Badge>
                            {contact.subscribed && (
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                Subscribed
                              </Badge>
                            )}
                          </div>
                          <div className="space-y-1">
                            <p className="font-medium">{contact.name || 'No name provided'}</p>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {contact.email}
                            </p>
                            {contact.phone && (
                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {contact.phone}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {format(new Date(contact.createdAt), 'MMM dd, yyyy HH:mm')}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteMarketingContactMutation.mutate(contact.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Customer Messages ({contactMessages?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contactMessages?.map((message: ContactMessage) => (
                    <div key={message.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div className="space-y-1">
                          <h3 className="font-medium">{message.name}</h3>
                          <p className="text-sm text-gray-600">{message.email}</p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(message.createdAt), 'MMM dd, yyyy HH:mm')}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteContact(message.id, message.name)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Subject: {message.subject}</p>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{message.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loyalty" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  Loyalty Program Customers ({loyaltyCustomers?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loyaltyCustomers?.map((customer: LoyaltyCustomer) => (
                    <div key={customer.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{customer.name}</h3>
                            <p className="text-sm text-gray-600">{customer.email}</p>
                            <p className="text-sm text-gray-600">{customer.phone}</p>
                          </div>
                          <div className="text-right space-y-1">
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm font-medium">{customer.currentPoints} points</span>
                            </div>
                            <p className="text-xs text-gray-500">{customer.totalVisits} visits</p>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          Joined: {format(new Date(customer.createdAt), 'MMM dd, yyyy')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="qrcodes" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="w-5 h-5" />
                    Loyalty Check-in QR Code
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Print this QR code and display it in your store for customers to check in and earn loyalty points.
                  </p>
                  <QRCodeComponent />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coffee className="w-5 h-5" />
                    Website QR Code
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Share this QR code to let customers quickly access the Coffee Pro website.
                  </p>
                  <WebsiteQRCode />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="franchise" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Franchise Applications ({franchiseApplications?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {franchiseApplications?.map((app: FranchiseApplication) => (
                    <div key={app.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{app.firstName} {app.lastName}</h3>
                            <p className="text-sm text-gray-600">{app.email}</p>
                            <p className="text-sm text-gray-600">{app.phone}</p>
                          </div>
                          <Badge variant={app.status === 'approved' ? 'default' : app.status === 'rejected' ? 'destructive' : 'secondary'}>
                            {app.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Investment:</span> {app.investmentCapacity}
                          </div>
                          <div>
                            <span className="font-medium">Timeline:</span> {app.timelineToOpen}
                          </div>
                          <div>
                            <span className="font-medium">Location:</span> {app.preferredLocation}
                          </div>
                          <div>
                            <span className="font-medium">Experience:</span> {app.businessExperience}
                          </div>
                        </div>
                        {app.additionalInfo && (
                          <div className="text-sm">
                            <span className="font-medium">Additional Info:</span>
                            <p className="text-gray-600 mt-1">{app.additionalInfo}</p>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => updateFranchiseStatus.mutate({ id: app.id, status: 'approved' })}
                            disabled={app.status === 'approved'}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateFranchiseStatus.mutate({ id: app.id, status: 'rejected' })}
                            disabled={app.status === 'rejected'}
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}