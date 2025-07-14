import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  FileText,
  BarChart2,
  Star,
  ArrowRight,
  Check,
  Zap,
  Shield,
  TrendingUp,
  Users,
  Clock,
  Award,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function PremiumStorefrontIntro() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 6);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <ShoppingCart size={48} className="mx-auto mb-4 text-indigo-600" />,
      title: "Smart Inventory",
      desc: "AI-powered stock management with predictive analytics and automated reorder alerts.",
      highlight: "Real-time tracking",
      color: "from-indigo-500 to-purple-600",
    },
    {
      icon: <BarChart2 size={48} className="mx-auto mb-4 text-emerald-600" />,
      title: "Advanced Analytics",
      desc: "Interactive dashboards with customer insights, sales forecasting, and profit optimization.",
      highlight: "Revenue growth",
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: <FileText size={48} className="mx-auto mb-4 text-blue-600" />,
      title: "Order Intelligence",
      desc: "Comprehensive order management with automated workflows and customer communication.",
      highlight: "Workflow automation",
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: <Users size={48} className="mx-auto mb-4 text-pink-600" />,
      title: "Customer Hub",
      desc: "Unified customer profiles with purchase history, preferences, and loyalty tracking.",
      highlight: "Customer retention",
      color: "from-pink-500 to-rose-600",
    },
    {
      icon: <Shield size={48} className="mx-auto mb-4 text-orange-600" />,
      title: "Security Features",
      desc: "Essential security measures with basic fraud detection and secure transaction handling.",
      highlight: "Secure & reliable",
      color: "from-orange-500 to-red-600",
    },
    {
      icon: <Zap size={48} className="mx-auto mb-4 text-yellow-600" />,
      title: "Performance Boost",
      desc: "Lightning-fast loading, optimized checkout, and seamless mobile experience.",
      highlight: "99.9% uptime",
      color: "from-yellow-500 to-orange-600",
    },
  ];

  const stats = [
    {
      number: "10M+",
      label: "Orders Processed",
      icon: <TrendingUp size={24} />,
    },
    { number: "99.9%", label: "Uptime Guarantee", icon: <Shield size={24} /> },
    { number: "24/7", label: "Expert Support", icon: <Clock size={24} /> },
    { number: "5★", label: "Customer Rating", icon: <Star size={24} /> },
  ];

  const benefits = [
    "Start selling in minutes",
    "Accept payments instantly",
    "Manage inventory effortlessly",
    "Track sales and profits",
    "Reach customers worldwide",
    "Mobile-optimized storefront",
    "Expert support included",
    "Scale without limits",
  ];

  return (
    <div className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-slate-900 dark:to-blue-900 min-h-screen overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-1000" />
        <div className="absolute -bottom-20 left-1/3 w-64 h-64 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-16">
        <div
          className={`transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium mb-6 shadow-lg">
            <Award className="w-4 h-4 mr-2" />
            100% Free E-commerce Solution
          </div>

          {/* Main Heading */}
          <h1 className="text-7xl md:text-8xl font-black bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent leading-tight mb-4">
            King Cart
            <br />
            <span className="block text-3xl font-semibold text-gray-700 dark:text-gray-300 mb-1 mt-3">
              Elevate Your Shop Experience
            </span>
            <span className="relative block">
              Shop Experience
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transform scale-x-0 animate-expand" />
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-3xl text-xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
            Start selling online today with our completely free e-commerce
            platform. Everything you need to launch, manage, and grow your
            business - no fees, no limits, no catch.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link to="/login">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-semibold shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-105">
                <span className="relative z-10 flex items-center justify-center">
                  Start Selling Now
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </Link>
            <Link to="/login">
              <button className="group px-8 py-4 border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 rounded-2xl font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-300 hover:scale-105">
                <span className="flex items-center justify-center">
                  Login
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="text-center transform hover:scale-105 transition-transform duration-300"
              >
                <div className="flex justify-center mb-2 text-indigo-600 dark:text-indigo-400">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 px-6 py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Sell
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Powerful tools to help you start selling, manage orders, and grow
              your business online
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <div
                key={i}
                className={`group relative p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-gray-200/50 dark:border-gray-700/50 ${
                  activeFeature === i
                    ? "ring-2 ring-indigo-500 shadow-indigo-500/25"
                    : ""
                }`}
              >
                {/* Gradient Border Effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-300 blur-sm -z-10`}
                />

                {/* Content */}
                <div className="relative z-10 text-center">
                  <div className="transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>

                  <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    {feature.desc}
                  </p>

                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 text-indigo-700 dark:text-indigo-300 text-sm font-medium">
                    <Zap className="w-3 h-3 mr-1" />
                    {feature.highlight}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="relative z-10 px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Why Choose King Cart?
              </h3>
              <div className="space-y-4">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center group">
                    <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-lg text-gray-700 dark:text-gray-300">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
                <div className="text-center">
                  <div className="text-6xl font-bold mb-4">40%</div>
                  <div className="text-xl font-semibold mb-2">
                    Average Sales Increase
                  </div>
                  <div className="text-indigo-100">Within first 30 days</div>
                </div>
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce" />
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-pink-400 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="relative z-10 bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 dark:from-black dark:via-indigo-950 dark:to-purple-950 py-20 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-5xl font-bold text-white mb-6">
            Ready to Start Selling?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join thousands of merchants already selling with King Cart. Launch
            your store today and start making money online.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <button className="group relative px-10 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl text-lg font-bold shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105">
                <span className="relative z-10 flex items-center justify-center">
                  Start Selling Today
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </Link>
            <Link to="/login">
              <button className="px-10 py-5 border-2 border-white text-white rounded-2xl text-lg font-bold hover:bg-white hover:text-gray-900 transition-all duration-300 hover:scale-105">
                Login to Dashboard
              </button>
            </Link>
          </div>

          <div className="mt-8 text-sm text-gray-400">
            No credit card required • Always free • Full feature access
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes expand {
          0% {
            transform: scaleX(0);
          }
          100% {
            transform: scaleX(1);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-expand {
          animation: expand 2s ease-out forwards;
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}
