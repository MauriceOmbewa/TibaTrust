import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const { submitContactForm, isLoading } = useApp();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await submitContactForm(formData);
    if (success) {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }
  };
  const contactMethods = [
    {
      icon: Phone,
      title: 'Call Us',
      details: '+254 700 123 456',
      description: 'Available Monday to Friday, 8am to 6pm'
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: 'info@bimabora.co.ke',
      description: "We'll respond within 24 hours"
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: 'Nairobi, Kenya',
      description: 'Westlands Business Park, 3rd Floor'
    }
  ];

  const faqs = [
    {
      question: 'How does the insurance payment work?',
      answer: 'You can pay your monthly premiums through M-Pesa or other mobile money services. Simply enter your phone number and follow the prompts to complete the payment.'
    },
    {
      question: 'How quickly are claims processed?',
      answer: 'Most claims are processed within 24 hours. Our blockchain-based system ensures transparent and efficient processing of all claims.'
    },
    {
      question: 'Which healthcare facilities can I visit?',
      answer: 'We have partnerships with over 200 healthcare facilities across Kenya. You can view the full list of partner facilities in your member dashboard.'
    },
    {
      question: 'How do I make a donation to help others?',
      answer: 'You can make a donation through our platform using M-Pesa. You can choose to donate to the general fund or support specific patients in need.'
    }
  ];

  return (
    <PageLayout>
      <section className="py-20 bg-gradient-hero text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-secondary/80" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Have questions or need assistance? We're here to help you with all your healthcare needs.
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
              <p className="text-muted-foreground mb-8">
                Fill out the form below and our team will get back to you as soon as possible.
              </p>
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="Your first name"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="Your last name"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="your.email@example.com"
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="+254 7XX XXX XXX"
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary"
                    required
                    disabled={isLoading}
                  >
                    <option value="">Select a subject</option>
                    <option value="insurance">Insurance Inquiry</option>
                    <option value="claims">Claims Assistance</option>
                    <option value="donation">Donation Information</option>
                    <option value="partnership">Partnership Opportunities</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="How can we help you?"
                    required
                    disabled={isLoading}
                  ></textarea>
                </div>
                
                <Button 
                  type="submit" 
                  className="btn-hero w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
              <p className="text-muted-foreground mb-8">
                You can reach us through any of the following methods or visit our office in Nairobi.
              </p>
              
              <div className="space-y-6 mb-12">
                {contactMethods.map((method, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <method.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{method.title}</h3>
                      <p className="text-primary font-medium">{method.details}</p>
                      <p className="text-muted-foreground text-sm">{method.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-highlight/10 rounded-xl p-6 border border-highlight/20">
                <div className="flex items-center mb-4">
                  <Clock className="w-5 h-5 text-primary mr-2" />
                  <h3 className="font-semibold">Business Hours</h3>
                </div>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span>8:00 AM - 6:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Saturday:</span>
                    <span>9:00 AM - 1:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sunday:</span>
                    <span>Closed</span>
                  </li>
                </ul>
                <div className="mt-4 pt-4 border-t border-highlight/20">
                  <div className="flex items-center">
                    <MessageSquare className="w-5 h-5 text-primary mr-2" />
                    <span className="text-sm">24/7 Emergency Support Available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-highlight/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Find quick answers to common questions about our services.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-card p-6">
                <h3 className="font-semibold text-lg mb-3">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-muted-foreground mb-4">
              Don't see your question here? Contact us directly and we'll be happy to help.
            </p>
            <Button variant="outline">
              View All FAQs
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Contact;