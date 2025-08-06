import { Star, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Grace Wanjiku',
      location: 'Nairobi',
      role: 'Mother of 2',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b3a5?w=150&h=150&fit=crop&crop=face',
      quote: 'BimaBora helped me get the surgery I needed for obstetric fistula. The community support was incredible, and I could track every donation. Now I can live with dignity again.',
      impact: 'Received KSh 85,000 in community support'
    },
    {
      name: 'Mary Nyambura',
      location: 'Kisumu',
      role: 'Small Business Owner',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face',
      quote: 'The monthly premium is so affordable, and I love that I can pay through M-Pesa. When my daughter was sick, the claim was processed in just one day. This platform is a blessing.',
      impact: 'Saved over KSh 45,000 on medical bills'
    },
    {
      name: 'Dr. James Mwangi',
      location: 'Mombasa',
      role: 'Healthcare Provider',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
      quote: 'As a doctor, I see how BimaBora is transforming healthcare access. The blockchain transparency builds trust, and patients get the care they need without financial stress.',
      impact: 'Treated 200+ BimaBora patients'
    }
  ];

  return (
    <section className="py-20 bg-highlight/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Stories of Hope and Healing
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Real stories from our community members who have transformed their lives 
            through accessible healthcare and community support.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="card-testimonial">
              {/* Quote Icon */}
              <Quote className="absolute top-4 right-4 w-8 h-8 text-highlight/30" />
              
              {/* Profile */}
              <div className="flex items-center space-x-4 mb-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                  <p className="text-sm text-foreground/60">{testimonial.role}</p>
                  <p className="text-sm text-foreground/60">{testimonial.location}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-foreground mb-4 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>

              {/* Impact */}
              <div className="bg-highlight/20 rounded-lg p-3 border-l-4 border-primary">
                <p className="text-sm font-medium text-primary">
                  Impact: {testimonial.impact}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-primary rounded-2xl p-8 shadow-card">
          <h3 className="text-2xl font-bold text-primary-foreground mb-4">
            Join Our Growing Community
          </h3>
          <p className="text-primary-foreground/90 mb-6 max-w-2xl mx-auto">
            Be part of a movement that's making healthcare accessible to every Kenyan. 
            Your story could be the next one we share.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button className="bg-white text-primary hover:bg-highlight hover:text-primary px-8 py-3 font-semibold">
                Start Your Journey
              </Button>
            </Link>
            <Link to="/donate">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Support Others
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;