import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-sm text-gray-600 mb-8">Last Updated: November 11, 2025</p>

        <div className="prose max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Introduction</h2>
            <p>
              Welcome to MeowVerse.ai ("we," "our," or "us"). We are committed to protecting your privacy and personal information.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered
              content generation platform at meowverse.ai (the "Service").
            </p>
            <p className="mt-4">
              By using our Service, you agree to the collection and use of information in accordance with this Privacy Policy.
              If you do not agree with this policy, please do not use our Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Information We Collect</h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.1 Information You Provide to Us</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account Information:</strong> Email address, username, password (encrypted), and optional profile information (avatar, bio)</li>
              <li><strong>Payment Information:</strong> Billing details processed securely through Stripe (we do not store credit card numbers)</li>
              <li><strong>Content Data:</strong> AI generation prompts, parameters, generated images and videos, comments, and other user-generated content</li>
              <li><strong>Communications:</strong> Messages you send us, support requests, and feedback</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.2 Information Collected Automatically</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Usage Data:</strong> Pages viewed, features used, time spent, click patterns, and interaction data</li>
              <li><strong>Device Information:</strong> Browser type, operating system, device type, and user agent</li>
              <li><strong>Log Data:</strong> IP addresses (anonymized), access times, login activity, and error logs</li>
              <li><strong>Cookies:</strong> We use cookies and similar tracking technologies to maintain sessions and improve user experience</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.3 Information from Third Parties</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>OAuth Authentication:</strong> If you sign up via Google, we receive your email address and basic profile information</li>
              <li><strong>Payment Processors:</strong> Transaction data from Stripe for billing purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. How We Use Your Information</h2>
            <p>We use your information for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Provide Services:</strong> Create and manage your account, process AI generation requests, manage subscriptions and billing</li>
              <li><strong>Improve Our Service:</strong> Analyze usage patterns, develop new features, optimize performance, and enhance user experience</li>
              <li><strong>Communication:</strong> Send transactional emails (account verification, password resets, billing notifications) and marketing emails (if you opt in)</li>
              <li><strong>Security:</strong> Detect and prevent fraud, abuse, and security threats; enforce our Terms of Service</li>
              <li><strong>Legal Compliance:</strong> Comply with legal obligations, respond to legal requests, and protect our rights</li>
              <li><strong>Analytics:</strong> Generate aggregate statistics about platform usage (anonymized data)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. How We Share Your Information</h2>
            <p>We do not sell your personal information. We may share your information with:</p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4.1 Third-Party Service Providers</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>AI Services:</strong> OpenAI (DALL-E, Sora), Google (Gemini, Veo), ByteDance (Seedream, Seedance) - your prompts are sent to these providers to generate content</li>
              <li><strong>Payment Processing:</strong> Stripe - for processing payments and managing subscriptions</li>
              <li><strong>Cloud Storage:</strong> Amazon Web Services (AWS S3) - for storing generated images and videos</li>
              <li><strong>Email Services:</strong> Email delivery providers for transactional and marketing emails (if opted in)</li>
              <li><strong>Analytics:</strong> Usage analytics providers (anonymized data only)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4.2 Legal Requirements</h3>
            <p>We may disclose your information if required by law, court order, or government request, or to protect our rights, property, or safety.</p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4.3 Business Transfers</h3>
            <p>If we are involved in a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.</p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4.4 Public Content</h3>
            <p>Content you choose to publish in our public gallery is visible to all users and may be shared publicly.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your information:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Passwords are encrypted using bcrypt hashing</li>
              <li>HTTPS encryption for data transmission</li>
              <li>Secure database access controls</li>
              <li>Regular security audits and monitoring</li>
              <li>Payment information is handled securely by PCI-compliant Stripe</li>
            </ul>
            <p className="mt-4">
              However, no method of transmission over the internet is 100% secure. While we strive to protect your information,
              we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Your Privacy Rights</h2>
            <p>Depending on your location, you may have the following rights:</p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6.1 Access and Data Portability</h3>
            <p>You have the right to request a copy of your personal data in a portable format. Visit your <Link to="/settings/privacy" className="text-purple-600 hover:underline">Privacy Settings</Link> to download your data.</p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6.2 Correction</h3>
            <p>You can update your account information at any time in your account settings.</p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6.3 Deletion</h3>
            <p>You have the right to request deletion of your account and personal data. Visit your <Link to="/settings/privacy" className="text-purple-600 hover:underline">Privacy Settings</Link> to delete your account.</p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6.4 Opt-Out of Marketing</h3>
            <p>You can unsubscribe from marketing emails by clicking the "unsubscribe" link in any email or updating your preferences in account settings.</p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6.5 Cookie Preferences</h3>
            <p>You can manage cookie preferences through our cookie banner or your browser settings.</p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6.6 GDPR Rights (EU Users)</h3>
            <p>If you are in the European Economic Area (EEA), you have additional rights including:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Right to object to processing</li>
              <li>Right to restrict processing</li>
              <li>Right to lodge a complaint with your local data protection authority</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6.7 CCPA Rights (California Users)</h3>
            <p>If you are a California resident, you have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Know what personal information is collected, used, and shared</li>
              <li>Delete personal information held by us</li>
              <li>Opt-out of the sale of personal information (we do not sell your data)</li>
              <li>Non-discrimination for exercising your privacy rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Data Retention</h2>
            <p>
              We retain your information for as long as your account is active or as needed to provide services.
              Specific retention periods:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Account Data:</strong> Retained until account deletion</li>
              <li><strong>Activity Logs:</strong> Automatically deleted after 2 years</li>
              <li><strong>Transaction Records:</strong> Retained for 7 years for tax and legal compliance</li>
              <li><strong>Generated Content:</strong> Retained until you delete it or delete your account</li>
            </ul>
            <p className="mt-4">
              When you delete your account, we permanently delete your personal information within 30 days,
              except for data we must retain for legal obligations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Children's Privacy</h2>
            <p>
              Our Service is intended for users aged 13 and older. We do not knowingly collect information from children under 13.
              If you are under 13, please do not use our Service or provide any personal information.
            </p>
            <p className="mt-4">
              If we learn that we have collected information from a child under 13, we will delete that information immediately.
              If you believe we have information from a child under 13, please contact us at privacy@meowverse.ai.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your country of residence,
              including the United States, where our servers and third-party service providers are located.
            </p>
            <p className="mt-4">
              We ensure appropriate safeguards are in place for international transfers, including Standard Contractual Clauses
              approved by the European Commission for EU data transfers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. Cookies and Tracking Technologies</h2>
            <p>We use the following types of cookies:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Essential Cookies:</strong> Required for authentication, security, and core functionality</li>
              <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how users interact with our Service (anonymized)</li>
            </ul>
            <p className="mt-4">
              For more details, see our <Link to="/legal/cookies" className="text-purple-600 hover:underline">Cookie Policy</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">11. AI-Generated Content</h2>
            <p>
              Your prompts and generation parameters are sent to third-party AI providers (OpenAI, Google, ByteDance) to create content.
              These providers have their own privacy policies:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>OpenAI Privacy Policy: <a href="https://openai.com/privacy" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">openai.com/privacy</a></li>
              <li>Google Privacy Policy: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">policies.google.com/privacy</a></li>
            </ul>
            <p className="mt-4">
              Content you generate is stored on AWS S3 and associated with your account. You retain ownership of your generated content,
              subject to our <Link to="/legal/terms" className="text-purple-600 hover:underline">Terms of Service</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">12. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of material changes by:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Updating the "Last Updated" date at the top of this policy</li>
              <li>Displaying a notice on our website</li>
              <li>Sending an email to your registered email address (for significant changes)</li>
            </ul>
            <p className="mt-4">
              Your continued use of the Service after changes become effective constitutes acceptance of the updated Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">13. Contact Us</h2>
            <p>
              If you have questions, concerns, or requests regarding this Privacy Policy or your personal information, please contact us:
            </p>
            <div className="mt-4 bg-gray-50 p-6 rounded-lg">
              <p><strong>Company:</strong> MeowVerse Ltd.</p>
              <p className="mt-2"><strong>Registered in:</strong> Hong Kong SAR</p>
              <p className="mt-2"><strong>Address:</strong> Room D3, 11/F, Luk Hop Industrial Building, 8 Luk Hop Street, San Po Kong, Kowloon</p>
              <p className="mt-4"><strong>Email:</strong> privacy@meowverse.ai</p>
              <p className="mt-2"><strong>Support:</strong> support@meowverse.ai</p>
              <p className="mt-2"><strong>Data Protection Requests:</strong> <Link to="/settings/privacy" className="text-purple-600 hover:underline">Privacy Settings</Link></p>
            </div>
          </section>

          <section className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Related Policies</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to="/legal/terms" className="block p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition">
                <h3 className="font-semibold text-purple-900">Terms of Service</h3>
                <p className="text-sm text-purple-700 mt-1">User agreement and service terms</p>
              </Link>
              <Link to="/legal/cookies" className="block p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition">
                <h3 className="font-semibold text-pink-900">Cookie Policy</h3>
                <p className="text-sm text-pink-700 mt-1">How we use cookies and tracking</p>
              </Link>
              <Link to="/legal/aup" className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                <h3 className="font-semibold text-blue-900">Acceptable Use Policy</h3>
                <p className="text-sm text-blue-700 mt-1">Guidelines for using our AI services</p>
              </Link>
              <Link to="/legal/refund" className="block p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition">
                <h3 className="font-semibold text-indigo-900">Refund Policy</h3>
                <p className="text-sm text-indigo-700 mt-1">Subscription and payment terms</p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
