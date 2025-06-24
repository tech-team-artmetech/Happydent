import React from "react";

const Terms = ({ onBack }) => {
  return (
    <div className="min-h-screen flex flex-col px-4 py-8 text-white max-w-[768px] mx-auto">
      {/* Styled Back Button - Same as TAP TO BEGIN */}

      {/* Header */}
      <div className="mb-12 pt-8">
        <h1 className="text-3xl font-bold text-center tracking-wide">
          Terms & Conditions
        </h1>
      </div>

      {/* Content Container */}
      <div className="flex-1 max-w-4xl mx-auto w-full">
        {/* HAPPYDENT Logo */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-white tracking-wider mb-4 sm:text-5xl">
            HAPPYDENT
          </h2>
          <p className="text-xl italic font-light">Chamking Smile Experience</p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto mt-4"></div>
        </div>

        {/* Terms Content */}
        <div className="space-y-8 text-base leading-relaxed">
          <section className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <h3 className="text-xl font-bold mb-4 text-blue-300">
              1. Acceptance of Terms
            </h3>
            <p className="text-white/90">
              By accessing and using the Happydent Chamking Smile AR experience,
              you accept and agree to be bound by the terms and provision of
              this agreement.
            </p>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <h3 className="text-xl font-bold mb-4 text-blue-300">
              2. AR Technology Usage
            </h3>
            <p className="text-white/90">
              The AR experience is powered by advanced technology for
              entertainment purposes. Results may vary based on device
              capabilities and lighting conditions.
            </p>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <h3 className="text-xl font-bold mb-4 text-blue-300">
              3. Personal Information
            </h3>
            <p className="text-white/90">
              Your personal information including name and phone number will be
              used solely for the purpose of this experience and will not be
              shared with third parties without consent.
            </p>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <h3 className="text-xl font-bold mb-4 text-blue-300">
              4. Camera and Media Usage
            </h3>
            <p className="text-white/90">
              This experience may access your device camera for AR
              functionality. No images or videos are stored without your
              explicit permission.
            </p>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <h3 className="text-xl font-bold mb-4 text-blue-300">
              5. Age Restrictions
            </h3>
            <p className="text-white/90">
              This experience is intended for users aged 13 and above. Users
              under 18 should have parental consent.
            </p>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <h3 className="text-xl font-bold mb-4 text-blue-300">
              6. Limitation of Liability
            </h3>
            <p className="text-white/90">
              Happydent and its affiliates shall not be liable for any indirect,
              incidental, special, or consequential damages arising from the use
              of this AR experience.
            </p>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <h3 className="text-xl font-bold mb-4 text-blue-300">
              7. Contact Information
            </h3>
            <p className="text-white/90">
              For questions about these terms, please contact our support team
              through the official Happydent channels.
            </p>
          </section>
        </div>

        {/* Modern Footer */}
        <div className="text-center mt-16 pt-8">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mb-8"></div>

          <div className="space-y-3">
            <p className="text-white/80 text-base italic font-light">
              Powered by advanced AR Technology
            </p>
            <p className="text-white/60 text-sm">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-white/60 text-sm font-medium">
              © 2024 Happydent. All rights reserved.
            </p>
          </div>
        </div>

        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <button
            onClick={onBack}
            className="text-white text-sm font-bold flex items-center justify-center gap-2 pointer-events-auto"
            style={{
              width: "120px",
              height: "38px",
              background:
                "radial-gradient(31% 31% at 50% 50%, #FFFFFF 0%, #0033FF 59%, #000DFF 100%)",
              borderRadius: "4px",
              border: "1px solid rgba(255, 255, 255, 0.52)",
              boxShadow: "2px 2px 4px 0px rgba(0, 0, 0, 0.39)",
              backdropFilter: "blur(20px)",
              opacity: "100%",
            }}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Terms;
