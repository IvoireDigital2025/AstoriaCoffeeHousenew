import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Download, Search, Mail, Phone, User, Calendar, Filter, LogOut } from "lucide-react";
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

export default function AdminContacts() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");

  const { data: contacts, isLoading, error } = useQuery({
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

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully",
      });
      setLocation('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      setLocation('/admin/login');
    }
  };

  const filteredContacts = contacts?.filter((contact: MarketingContact) => {
    const matchesSearch = !searchTerm || 
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      case 'contact': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalContacts = contacts?.length || 0;
  const subscribedContacts = contacts?.filter((c: MarketingContact) => c.subscribed).length || 0;
  const sourceStats = contacts?.reduce((acc: Record<string, number>, contact: MarketingContact) => {
    acc[contact.source] = (acc[contact.source] || 0) + 1;
    return acc;
  }, {}) || {};

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-coffee-cream to-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-coffee-cream to-white p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-red-800 mb-2">Error Loading Contacts</h2>
              <p className="text-red-600">Unable to fetch marketing contacts. Please try again later.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-coffee-cream to-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-coffee-dark mb-2">Marketing Contacts</h1>
            <p className="text-coffee-medium">Manage and view all customer contact information collected for marketing purposes</p>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-coffee-medium" />
                  <Input
                    placeholder="Search by email, name, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={sourceFilter === "all" ? "default" : "outline"}
                  onClick={() => setSourceFilter("all")}
                  size="sm"
                >
                  All Sources
                </Button>
                <Button
                  variant={sourceFilter === "newsletter" ? "default" : "outline"}
                  onClick={() => setSourceFilter("newsletter")}
                  size="sm"
                >
                  Newsletter
                </Button>
                <Button
                  variant={sourceFilter === "community" ? "default" : "outline"}
                  onClick={() => setSourceFilter("community")}
                  size="sm"
                >
                  Community
                </Button>
                <Button
                  onClick={handleExportCSV}
                  className="bg-coffee-primary hover:bg-coffee-dark"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contacts Table */}
        <Card>
          <CardHeader>
            <CardTitle>Contact List ({filteredContacts.length} contacts)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredContacts.map((contact: MarketingContact) => (
                <div key={contact.id} className="border rounded-lg p-4 hover:bg-coffee-cream/20 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-coffee-primary/10 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-coffee-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-coffee-dark">
                              {contact.name || 'Anonymous'}
                            </h3>
                            <Badge className={getSourceColor(contact.source)}>
                              {contact.source}
                            </Badge>
                            {contact.subscribed && (
                              <Badge variant="outline" className="text-green-600 border-green-200">
                                Subscribed
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-coffee-medium mt-1">
                            <span className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              {contact.email}
                            </span>
                            {contact.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="w-4 h-4" />
                                {contact.phone}
                              </span>
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
      </div>
    </div>
  );
}