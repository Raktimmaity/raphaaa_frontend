import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl px-6 md:px-12 py-10">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
          Privacy <span className="text-blue-600">Policy</span>
        </h1>

        <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
          <p>
            At <strong>RAPHAAA</strong>, your privacy is important to us. This Privacy Policy outlines
            how we collect, use, and protect your personal information when you visit or make a
            purchase from our site.
          </p>

          <h2 className="text-2xl font-semibold text-blue-600">1. Information We Collect</h2>
          <p>
            We may collect personal details such as your name, email address, phone number,
            shipping address, and payment information when you register, place an order, or contact us.
          </p>

          <h2 className="text-2xl font-semibold text-blue-600">2. How We Use Your Information</h2>
          <p>
            Your information helps us:
            <ul className="list-disc list-inside ml-4 mt-2">
              <li>Process your orders efficiently</li>
              <li>Provide customer service and support</li>
              <li>Send updates about your order or our services</li>
              <li>Improve our website and product offerings</li>
            </ul>
          </p>

          <h2 className="text-2xl font-semibold text-blue-600">3. Protecting Your Data</h2>
          <p>
            We implement industry-standard security measures to safeguard your personal information.
            However, no method of transmission over the internet is 100% secure.
          </p>

          <h2 className="text-2xl font-semibold text-blue-600">4. Cookies</h2>
          <p>
            We use cookies to enhance your browsing experience, understand site traffic, and improve functionality.
            You can manage cookie preferences in your browser settings.
          </p>

          <h2 className="text-2xl font-semibold text-blue-600">5. Third-Party Services</h2>
          <p>
            We may use trusted third-party services (like payment gateways) that also protect your information
            under their privacy policies.
          </p>

          <h2 className="text-2xl font-semibold text-blue-600">6. Your Rights</h2>
          <p>
            You have the right to access, modify, or delete your personal data. To do so, please contact us
            at <span className="text-blue-600 font-medium">support@raphaaa.com</span>.
          </p>

          <h2 className="text-2xl font-semibold text-blue-600">7. Changes to This Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. Any changes will be posted on this page with a revised date.
          </p>

          <p className="text-sm text-gray-500 mt-6">
            Last updated: July 1, 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
