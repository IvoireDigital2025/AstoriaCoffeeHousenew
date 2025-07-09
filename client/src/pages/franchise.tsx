import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Coffee, Users, MapPin, Clock, TrendingUp, Star, DollarSign, Building, Phone, Mail, User } from 'lucide-react';
import { insertFranchiseApplicationSchema, type InsertFranchiseApplication } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import interiorPath from '@assets/IMG_3190_1751760266088.jpg';

export default function FranchisePage() {
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<InsertFranchiseApplication>({
    resolver: zodResolver(insertFranchiseApplicationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      businessExperience: '',
      investmentCapacity: '',
      preferredLocation: '',
      timelineToOpen: '',
      additionalInfo: '',
    },
  });

  const submitApplication = useMutation({
    mutationFn: async (data: InsertFranchiseApplication) => {
      await apiRequest('POST', '/api/franchise/apply', data);
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: "Application Submitted!",
        description: "Thank you for your interest in franchising with Coffee Pro. We'll review your application and get back to you soon.",
        variant: "default",
      });
    },
    onError: (error) => {
      console.error('Form submission error:', error);
      toast({
        title: "Submission Error",
        description: `There was an error submitting your application: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertFranchiseApplication) => {
    console.log('Form data being submitted:', data);
    submitApplication.mutate(data);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-coffee-cream to-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-coffee-dark">Application Submitted Successfully!</h1>
            <p className="text-xl text-coffee-medium">
              Thank you for your interest in franchising with Coffee Pro. Our team will review your application and contact you within 48 hours.
            </p>
            <div className="mt-8">
              <Button 
                onClick={() => window.location.href = '/'}
                className="bg-coffee-primary hover:bg-coffee-medium text-white px-8 py-3"
              >
                Return to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-cream to-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] bg-gradient-to-r from-coffee-dark to-coffee-medium">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center text-white space-y-6">
            <h1 className="text-5xl font-bold mb-4">Join the Coffee Pro Family</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Bring authentic Egyptian coffee culture to your community. Partner with Coffee Pro and become part of our growing franchise network.
            </p>
            <div className="flex items-center justify-center space-x-8 mt-8">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-lg">4.9 Rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="text-lg">Growing Market</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-lg">Strong Community</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Coffee Pro */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-coffee-dark mb-4">Why Choose Coffee Pro Franchise?</h2>
            <p className="text-xl text-coffee-medium">Join a proven concept with authentic Egyptian heritage</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 border-coffee-light hover:border-coffee-medium transition-colors">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-coffee-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Coffee className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-coffee-dark">Authentic Concept</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-coffee-medium text-center">
                  Unique Egyptian coffee experience with Dubai chocolate, Kunafa, and traditional pastries that customers love.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-coffee-light hover:border-coffee-medium transition-colors">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-coffee-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-coffee-dark">Proven Success</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-coffee-medium text-center">
                  4.9-star rating from 223+ customers in our flagship Astoria location shows the market demand for our concept.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-coffee-light hover:border-coffee-medium transition-colors">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-coffee-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-coffee-dark">Full Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-coffee-medium text-center">
                  Complete training, marketing support, and ongoing operational guidance to ensure your success.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Investment Details */}
      <div className="py-16 bg-coffee-cream">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-coffee-dark mb-6">Investment Overview</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-coffee-primary" />
                  <span className="text-coffee-medium">Initial Investment: Flexible</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Building className="w-5 h-5 text-coffee-primary" />
                  <span className="text-coffee-medium">Space Requirements: 800-1,200 sq ft</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-coffee-primary" />
                  <span className="text-coffee-medium">Setup Timeline: 3-6 months</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-coffee-primary" />
                  <span className="text-coffee-medium">Staff Requirements: Flexible</span>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-coffee-dark mb-4">What's Included:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-coffee-medium">Equipment package</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-coffee-medium">Training program</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-coffee-medium">Marketing materials</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-coffee-medium">Ongoing support</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div>
              <img
                src={interiorPath}
                alt="Coffee Pro Interior"
                className="rounded-lg shadow-lg w-full h-auto"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Application Form */}
      <div className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-coffee-dark mb-4">Apply for Franchise</h2>
            <p className="text-xl text-coffee-medium">Take the first step toward owning your Coffee Pro franchise</p>
          </div>

          <Card className="border-2 border-coffee-light">
            <CardHeader>
              <CardTitle className="text-center text-coffee-dark">Franchise Application</CardTitle>
              <CardDescription className="text-center">
                Please provide your information below. Our team will review your application and contact you within 48 hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-coffee-dark mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Personal Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-coffee-dark mb-2">First Name *</label>
                      <Input
                        {...form.register('firstName')}
                        placeholder="Enter your first name"
                        className="border-coffee-light focus:border-coffee-medium"
                      />
                      {form.formState.errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.firstName.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-coffee-dark mb-2">Last Name *</label>
                      <Input
                        {...form.register('lastName')}
                        placeholder="Enter your last name"
                        className="border-coffee-light focus:border-coffee-medium"
                      />
                      {form.formState.errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.lastName.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-coffee-dark mb-4 flex items-center">
                    <Phone className="w-5 h-5 mr-2" />
                    Contact Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-coffee-dark mb-2">Email *</label>
                      <Input
                        {...form.register('email')}
                        type="email"
                        placeholder="Enter your email"
                        className="border-coffee-light focus:border-coffee-medium"
                      />
                      {form.formState.errors.email && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-coffee-dark mb-2">Phone *</label>
                      <Input
                        {...form.register('phone')}
                        type="tel"
                        placeholder="Enter your phone number"
                        className="border-coffee-light focus:border-coffee-medium"
                      />
                      {form.formState.errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.phone.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Business Experience */}
                <div>
                  <label className="block text-sm font-medium text-coffee-dark mb-2">Business Experience *</label>
                  <Textarea
                    {...form.register('businessExperience')}
                    placeholder="Describe your business or management experience..."
                    className="border-coffee-light focus:border-coffee-medium min-h-[100px]"
                  />
                  {form.formState.errors.businessExperience && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.businessExperience.message}</p>
                  )}
                </div>

                {/* Investment Capacity */}
                <div>
                  <label className="block text-sm font-medium text-coffee-dark mb-2">Investment Capacity *</label>
                  <Select onValueChange={(value) => form.setValue('investmentCapacity', value, { shouldValidate: true })}>
                    <SelectTrigger className="border-coffee-light focus:border-coffee-medium">
                      <SelectValue placeholder="Select your investment range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="80k-120k">$80,000 - $120,000</SelectItem>
                      <SelectItem value="120k-150k">$120,000 - $150,000</SelectItem>
                      <SelectItem value="150k-200k">$150,000 - $200,000</SelectItem>
                      <SelectItem value="200k-250k">$200,000 - $250,000</SelectItem>
                      <SelectItem value="250k+">$250,000+</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.investmentCapacity && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.investmentCapacity.message}</p>
                  )}
                </div>

                {/* Preferred Location */}
                <div>
                  <label className="block text-sm font-medium text-coffee-dark mb-2">Preferred Location *</label>
                  <Select onValueChange={(value) => form.setValue('preferredLocation', value, { shouldValidate: true })}>
                    <SelectTrigger className="border-coffee-light focus:border-coffee-medium">
                      <SelectValue placeholder="Select your preferred state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AL">Alabama</SelectItem>
                      <SelectItem value="AK">Alaska</SelectItem>
                      <SelectItem value="AZ">Arizona</SelectItem>
                      <SelectItem value="AR">Arkansas</SelectItem>
                      <SelectItem value="CA">California</SelectItem>
                      <SelectItem value="CO">Colorado</SelectItem>
                      <SelectItem value="CT">Connecticut</SelectItem>
                      <SelectItem value="DE">Delaware</SelectItem>
                      <SelectItem value="FL">Florida</SelectItem>
                      <SelectItem value="GA">Georgia</SelectItem>
                      <SelectItem value="HI">Hawaii</SelectItem>
                      <SelectItem value="ID">Idaho</SelectItem>
                      <SelectItem value="IL">Illinois</SelectItem>
                      <SelectItem value="IN">Indiana</SelectItem>
                      <SelectItem value="IA">Iowa</SelectItem>
                      <SelectItem value="KS">Kansas</SelectItem>
                      <SelectItem value="KY">Kentucky</SelectItem>
                      <SelectItem value="LA">Louisiana</SelectItem>
                      <SelectItem value="ME">Maine</SelectItem>
                      <SelectItem value="MD">Maryland</SelectItem>
                      <SelectItem value="MA">Massachusetts</SelectItem>
                      <SelectItem value="MI">Michigan</SelectItem>
                      <SelectItem value="MN">Minnesota</SelectItem>
                      <SelectItem value="MS">Mississippi</SelectItem>
                      <SelectItem value="MO">Missouri</SelectItem>
                      <SelectItem value="MT">Montana</SelectItem>
                      <SelectItem value="NE">Nebraska</SelectItem>
                      <SelectItem value="NV">Nevada</SelectItem>
                      <SelectItem value="NH">New Hampshire</SelectItem>
                      <SelectItem value="NJ">New Jersey</SelectItem>
                      <SelectItem value="NM">New Mexico</SelectItem>
                      <SelectItem value="NY">New York</SelectItem>
                      <SelectItem value="NC">North Carolina</SelectItem>
                      <SelectItem value="ND">North Dakota</SelectItem>
                      <SelectItem value="OH">Ohio</SelectItem>
                      <SelectItem value="OK">Oklahoma</SelectItem>
                      <SelectItem value="OR">Oregon</SelectItem>
                      <SelectItem value="PA">Pennsylvania</SelectItem>
                      <SelectItem value="RI">Rhode Island</SelectItem>
                      <SelectItem value="SC">South Carolina</SelectItem>
                      <SelectItem value="SD">South Dakota</SelectItem>
                      <SelectItem value="TN">Tennessee</SelectItem>
                      <SelectItem value="TX">Texas</SelectItem>
                      <SelectItem value="UT">Utah</SelectItem>
                      <SelectItem value="VT">Vermont</SelectItem>
                      <SelectItem value="VA">Virginia</SelectItem>
                      <SelectItem value="WA">Washington</SelectItem>
                      <SelectItem value="WV">West Virginia</SelectItem>
                      <SelectItem value="WI">Wisconsin</SelectItem>
                      <SelectItem value="WY">Wyoming</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.preferredLocation && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.preferredLocation.message}</p>
                  )}
                </div>

                {/* Timeline */}
                <div>
                  <label className="block text-sm font-medium text-coffee-dark mb-2">Timeline to Open *</label>
                  <Select onValueChange={(value) => form.setValue('timelineToOpen', value, { shouldValidate: true })}>
                    <SelectTrigger className="border-coffee-light focus:border-coffee-medium">
                      <SelectValue placeholder="Select your preferred timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3-6 months">3-6 months</SelectItem>
                      <SelectItem value="6-12 months">6-12 months</SelectItem>
                      <SelectItem value="1-2 years">1-2 years</SelectItem>
                      <SelectItem value="2+ years">2+ years</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.timelineToOpen && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.timelineToOpen.message}</p>
                  )}
                </div>

                {/* Additional Information */}
                <div>
                  <label className="block text-sm font-medium text-coffee-dark mb-2">Additional Information</label>
                  <Textarea
                    {...form.register('additionalInfo')}
                    placeholder="Any additional information you'd like to share..."
                    className="border-coffee-light focus:border-coffee-medium min-h-[100px]"
                  />
                </div>

                <div className="text-center">
                  <Button
                    type="submit"
                    disabled={submitApplication.isPending}
                    className="bg-coffee-primary hover:bg-coffee-medium text-white px-8 py-3 text-lg"
                  >
                    {submitApplication.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16 bg-coffee-cream">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-coffee-dark mb-6">Have Questions?</h2>
          <p className="text-xl text-coffee-medium mb-8">
            Our franchise team is here to help you every step of the way.
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
            <div className="flex items-center space-x-2">
              <Phone className="w-5 h-5 text-coffee-primary" />
              <span className="text-coffee-dark font-medium">(347) 329-6816</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-coffee-primary" />
              <span className="text-coffee-dark font-medium">Coffeepro23@gmail.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}