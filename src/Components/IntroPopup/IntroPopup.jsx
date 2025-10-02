import React, { useState } from "react";
import {
  X,
  Package,
  TrendingUp,
  FileText,
  ShoppingCart,
  BarChart2,
  Image,
  Eye,
  Store,
  IndianRupee,
} from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../../pages/Urls/Urls";

const IntroPopup = ({ onClose, setAdmin }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const steps = [
    {
      icon: <Store className="w-16 h-16 text-purple-500" />,
      title: "Welcome to Your Store Dashboard!",
      description:
        "Everything you need to manage your products, boost sales, and grow your business - all in one place. Let's get you started!",
      gradient: "from-purple-500 to-pink-500",
      features: [],
    },
    {
      icon: <Package className="w-16 h-16 text-blue-500" />,
      title: "Manage Your Products Easily",
      description: "Add and organize your products in minutes",
      gradient: "from-blue-500 to-cyan-500",
      features: [
        {
          icon: <Package className="w-5 h-5" />,
          text: "Add new products with photos and other details",
        },
        {
          icon: <Eye className="w-5 h-5" />,
          text: "Edit product details anytime you want",
        },
        {
          icon: <TrendingUp className="w-5 h-5" />,
          text: "Track how much stock you have left",
        },
        {
          icon: <Image className="w-5 h-5" />,
          text: "Upload product images and thumbnail image separately",
        },
      ],
    },
    {
      icon: <ShoppingCart className="w-16 h-16 text-green-500" />,
      title: "Handle Orders Like a Pro",
      description: "Never miss an order and keep your customers happy!",
      gradient: "from-green-500 to-emerald-500",
      features: [
        {
          icon: <ShoppingCart className="w-5 h-5" />,
          text: "See all your orders in one place",
        },
        {
          icon: <Eye className="w-5 h-5" />,
          text: "View complete order history for each customer",
        },
        {
          icon: <FileText className="w-5 h-5" />,
          text: "Download invoices instantly for any date range",
        },
        {
          icon: <TrendingUp className="w-5 h-5" />,
          text: "Track which products are selling best",
        },
      ],
    },
    {
      icon: <IndianRupee className="w-16 h-16 text-orange-500" />,
      title: "Grow Your Sales with Insights",
      description:
        "Understand your business better and make smarter decisions!",
      gradient: "from-orange-500 to-red-500",
      features: [
        {
          icon: <IndianRupee className="w-5 h-5" />,
          text: "See your total revenue and earnings at a glance",
        },
        {
          icon: <BarChart2 className="w-5 h-5" />,
          text: "Get the full analytics for products, orders and revenue",
        },
        {
          icon: <TrendingUp className="w-5 h-5" />,
          text: "Monitor stock levels to never run out",
        },
        {
          icon: <FileText className="w-5 h-5" />,
          text: "View sales reports for any time period",
        },
      ],
    },
  ];

  const handleFinish = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/mark-intro-seen`,
        {},
        { withCredentials: true }
      );

      if (response.data.status) {
        setAdmin((prev) => ({ ...prev, isIntroSeen: true }));
        onClose();
      }
    } catch (error) {
      console.error("Error marking intro as seen:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleFinish();
  };

  const gradientMap = {
    "from-purple-500 to-pink-500": ["#a78bfa", "#ec4899"],
    "from-blue-500 to-cyan-500": ["#3b82f6", "#06b6d4"],
    "from-green-500 to-emerald-500": ["#22c55e", "#10b981"],
    "from-orange-500 to-red-500": ["#f97316", "#ef4444"],
  };

  const gradientHoverMap = {
    "from-purple-500 to-pink-500": ["#8b5cf6", "#f43f5e"],
    "from-blue-500 to-cyan-500": ["#2563eb", "#06b6d4"],
    "from-green-500 to-emerald-500": ["#16a34a", "#059669"],
    "from-orange-500 to-red-500": ["#f97316", "#dc2626"],
  };

  function getGradientColors(className, hover = false) {
    const map = hover ? gradientHoverMap : gradientMap;
    return map[className]?.join(", ") || "#a78bfa, #ec4899"; // fallback
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[80vh] flex flex-col animate-fadeIn">
        {/* Skip Button */}
        <button
          onClick={handleSkip}
          disabled={loading}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Gradient Background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${steps[currentStep].gradient} opacity-5 pointer-events-none`}
        ></div>

        {/* Content */}
        <div
          className="relative p-8 md:p-10 overflow-y-auto flex-1 custom-scrollbar"
          style={{
            marginRight: "8px",
            marginTop: "5px",
          }}
        >
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-full p-5 md:p-6 shadow-lg">
              {steps[currentStep].icon}
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
              {steps[currentStep].title}
            </h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              {steps[currentStep].description}
            </p>
          </div>

          {/* Features List */}
          {steps[currentStep].features.length > 0 && (
            <div className="mb-6 space-y-2 max-w-xl mx-auto">
              {steps[currentStep].features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 bg-gradient-to-r from-gray-50 to-white p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-all hover:shadow-md"
                >
                  <div
                    className={`bg-gradient-to-br ${steps[currentStep].gradient} p-2 rounded-lg text-white flex-shrink-0`}
                  >
                    {feature.icon}
                  </div>
                  <p className="text-sm text-gray-700 pt-1 leading-relaxed">
                    {feature.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Fixed Bottom Section */}
        <div className="relative p-6 md:p-8 pt-0 border-t border-gray-100">
          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mb-6">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                disabled={loading}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? "w-8 bg-gradient-to-r " + steps[currentStep].gradient
                    : "w-2 bg-gray-300 hover:bg-gray-400"
                } ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
                aria-label={`Go to step ${index + 1}`}
              ></button>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                disabled={loading}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={loading}
              className={`flex-1 px-6 py-3 bg-gradient-to-r ${steps[currentStep].gradient} text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Processing...
                </span>
              ) : currentStep === steps.length - 1 ? (
                "Start Selling!"
              ) : (
                "Next"
              )}
            </button>
          </div>

          {/* Skip Link */}
          {currentStep < steps.length - 1 && (
            <div className="text-center mt-3">
              <button
                onClick={handleSkip}
                disabled={loading}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
              >
                Skip tutorial
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
    
 

   .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #f3f4f6;
      border-radius: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: linear-gradient(to bottom, ${getGradientColors(
        steps[currentStep].gradient
      )});
      border-radius: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(to bottom, ${getGradientColors(
        steps[currentStep].gradient,
        true
      )});

  /* Firefox */
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #a78bfa #f3f4f6;
    margin-right: 8px; 
    margin-top:5px;
  }
    
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default IntroPopup;
