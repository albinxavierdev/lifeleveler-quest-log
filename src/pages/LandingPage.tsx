
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { CheckSquare, Target, Briefcase, ShoppingBag, Star, ArrowRight, Check } from 'lucide-react';

const LandingPage = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <CheckSquare className="h-10 w-10 text-primary" />,
      title: "Daily Quests",
      description: "Complete daily tasks to build consistent habits and earn rewards."
    },
    {
      icon: <Target className="h-10 w-10 text-primary" />,
      title: "Long-term Missions",
      description: "Set ambitious goals and track your progress with milestone-based missions."
    },
    {
      icon: <Briefcase className="h-10 w-10 text-primary" />,
      title: "Side Hustles",
      description: "Track your side projects and monetization efforts for additional growth."
    },
    {
      icon: <ShoppingBag className="h-10 w-10 text-primary" />,
      title: "Reward System",
      description: "Earn XP and gold to unlock real-life rewards and motivation boosters."
    }
  ];

  const pricing = [
    {
      title: "Free",
      price: "$0",
      description: "Basic productivity tracking",
      features: [
        "Up to 5 daily quests",
        "Up to 2 missions",
        "Basic analytics",
        "Community support"
      ],
      cta: "Get Started",
      highlighted: false
    },
    {
      title: "Pro",
      price: "$9.99",
      period: "/month",
      description: "Advanced productivity tools",
      features: [
        "Unlimited daily quests",
        "Unlimited missions",
        "Advanced analytics",
        "Priority support",
        "Custom rewards",
        "Habit streaks and tracking"
      ],
      cta: "Upgrade to Pro",
      highlighted: true
    }
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero section */}
      <header className="bg-gradient-to-r from-background via-background to-background/90">
        <div className="container px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Star className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-primary">Impulze</span>
            </div>
            <nav>
              <ul className="flex items-center space-x-6">
                <li>
                  <a href="#features" className="text-sm text-foreground/80 hover:text-foreground">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-sm text-foreground/80 hover:text-foreground">
                    Pricing
                  </a>
                </li>
                <li>
                  {user ? (
                    <Button asChild>
                      <Link to="/dashboard">Dashboard</Link>
                    </Button>
                  ) : (
                    <Button asChild>
                      <Link to="/auth">Get Started</Link>
                    </Button>
                  )}
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden bg-background py-24">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px] [mask-image:radial-gradient(white,transparent_70%)]" />
          <div className="container relative z-10 px-4 text-center">
            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl">
              Gamify Your Life and <span className="text-primary">Level Up</span> Your Productivity
            </h1>
            <p className="mx-auto mb-10 max-w-3xl text-lg text-muted-foreground md:text-xl">
              Transform your daily tasks into rewarding quests, track your goals as missions, and earn rewards as you progress in your personal development journey.
            </p>
            <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              {user ? (
                <Button size="lg" asChild>
                  <Link to="/dashboard">
                    Continue to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" asChild>
                    <Link to="/auth">
                      Start Your Journey
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <a href="#features">Learn More</a>
                  </Button>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="bg-muted/40 py-20">
          <div className="container px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">Key Features</h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Impulze helps you build better habits and achieve your goals through gamification.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div key={index} className="rounded-lg border bg-card p-6 shadow-sm">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20">
          <div className="container px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">Simple Pricing</h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Choose the plan that fits your productivity needs.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:max-w-4xl lg:mx-auto">
              {pricing.map((plan, index) => (
                <div
                  key={index}
                  className={`rounded-lg border ${
                    plan.highlighted ? 'border-primary shadow-lg' : ''
                  } bg-card p-8`}
                >
                  <h3 className="mb-2 text-2xl font-bold">{plan.title}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                  </div>
                  <p className="mb-6 text-muted-foreground">{plan.description}</p>
                  <ul className="mb-8 space-y-3">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.highlighted ? 'default' : 'outline'}
                    asChild
                  >
                    <Link to="/auth">{plan.cta}</Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Call to action */}
        <section className="bg-primary/5 py-20">
          <div className="container px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to Level Up Your Life?</h2>
            <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
              Join thousands of users who are transforming their productivity through gamification.
            </p>
            <Button size="lg" asChild>
              <Link to="/auth">Get Started for Free</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background py-10">
        <div className="container px-4">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-primary" />
              <span className="text-lg font-bold">Impulze</span>
            </div>
            <div className="text-center text-sm text-muted-foreground md:text-right">
              © {new Date().getFullYear()} Impulze. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
