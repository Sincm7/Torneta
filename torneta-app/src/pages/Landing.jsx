import HeroSection from '../sections/HeroSection.jsx';
import HowItWorks from '../sections/HowItWorks.jsx';
import StatsSection from '../sections/StatsSection.jsx';
import CTASection from '../sections/CTASection.jsx';

export default function LandingPage() {
  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <HeroSection />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Stats & Testimonial Section */}
      <StatsSection />

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}
