import React, { useState, useEffect } from "react";
import { CheckCircle, Mail, Clock } from "lucide-react";

const Application = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [checkmarkScale, setCheckmarkScale] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    setTimeout(() => setCheckmarkScale(1), 200);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-6">
      <div
        className={`max-w-2xl w-full transition-all duration-700 transform ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 p-12 overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-32 -translate-y-32 animate-pulse"></div>
              <div
                className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48 animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>

            {/* Checkmark Icon */}
            <div className="relative flex justify-center">
              <div
                className="transition-transform duration-500 ease-out"
                style={{ transform: `scale(${checkmarkScale})` }}
              >
                <div className="bg-white rounded-full p-6 shadow-lg">
                  <CheckCircle
                    className="w-20 h-20 text-emerald-500"
                    strokeWidth={2.5}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-12 text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Application Submitted!
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Thank you for applying for a merchant account. Our team will
              review your application and get back to you shortly.
            </p>

            {/* Info Cards */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 text-left transition-transform hover:scale-105 duration-300">
                <div className="flex items-start gap-4">
                  <div className="bg-emerald-500 rounded-xl p-3 flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Check Your Email
                    </h3>
                    <p className="text-sm text-gray-600">
                      You will receive an email confirming that we have received
                      your application.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 text-left transition-transform hover:scale-105 duration-300">
                <div className="flex items-start gap-4">
                  <div className="bg-cyan-500 rounded-xl p-3 flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Review Timeline
                    </h3>
                    <p className="text-sm text-gray-600">
                      Applications are typically reviewed within 24-48 hours
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col items-center flex-1">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center mb-2">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    Submitted
                  </span>
                </div>
                <div className="flex-1 h-1 bg-gradient-to-r from-emerald-500 to-amber-300 mx-2 rounded-full"></div>
                <div className="flex flex-col items-center flex-1">
                  <div className="w-10 h-10 bg-amber-300 rounded-full flex items-center justify-center mb-2 animate-pulse">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    Review
                  </span>
                </div>
                <div className="flex-1 h-1 bg-gray-300 mx-2 rounded-full"></div>
                <div className="flex flex-col items-center flex-1">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mb-2">
                    <span className="text-gray-500 font-bold">3</span>
                  </div>
                  <span className="text-xs font-medium text-gray-500">
                    Approved
                  </span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <p className="text-sm text-gray-500">
              Once approved, you'll receive an email notification. You will be
              automatically logged in and can start using your store
              immediately.
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Need help?{" "}
            <p className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors">
              Contact Support
            </p>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Application;
