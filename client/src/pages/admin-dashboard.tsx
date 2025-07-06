import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Search, Mail, Phone, User, Calendar, Filter, LogOut, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

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

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");

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

  if (contactsLoading || messagesLoading) {
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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="marketing" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Marketing Contacts ({totalContacts})
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Customer Messages ({contactMessages?.length || 0})
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
                        <div className="text-sm text-coffee-medium">
                          {format(new Date(message.createdAt), 'MMM d, yyyy HH:mm')}
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
        </Tabs>
      </div>
    </div>
  );
}