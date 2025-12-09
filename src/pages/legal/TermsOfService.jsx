import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
        <p className="text-sm text-gray-600 mb-8">Last Updated: January 1, 2026</p>

        <div className="prose max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Agreement to Terms</h2>
            <p>
              Welcome to MeowVerse.ai! These Terms of Service ("Terms") constitute a legal agreement between you ("User," "you," or "your")
              and MeowVerse.ai ("we," "us," or "our") governing your use of our AI-powered content generation platform available at meowverse.ai
              (the "Service").
            </p>
            <p className="mt-4">
              By accessing or using our Service, you agree to be bound by these Terms and our <Link to="/legal/privacy" className="text-purple-600 hover:underline">Privacy Policy</Link>.
              If you do not agree with these Terms, do not use our Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Eligibility</h2>
            <p>
              You must be at least 13 years old to use our Service. If you are under 18, you must have permission from a parent or legal guardian.
              By using the Service, you represent and warrant that:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>You meet the age requirements above</li>
              <li>You have the legal capacity to enter into binding contracts</li>
              <li>You will comply with these Terms and all applicable laws</li>
              <li>All information you provide is accurate and truthful</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Account Registration</h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.1 Account Creation</h3>
            <p>
              To use certain features of our Service, you must create an account. During beta, accounts require an invitation code.
              You agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your information to keep it accurate</li>
              <li>Keep your password secure and confidential</li>
              <li>Notify us immediately of any unauthorized access to your account</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.2 Account Security</h3>
            <p>
              You are responsible for maintaining the security of your account credentials. We are not liable for any loss or damage
              arising from your failure to protect your account information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Service Description</h2>
            <p>MeowVerse.ai provides AI-powered content generation services, including:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Image Generation:</strong> Using models including OpenAI DALL-E, Google Gemini, and ByteDance Seedream</li>
              <li><strong>Video Generation:</strong> Using models including Google Veo, OpenAI Sora, and ByteDance Seedance</li>
              <li><strong>Public Gallery:</strong> Platform to share and discover AI-generated content</li>
              <li><strong>Social Features:</strong> Comments, likes, follows, and engagement tools</li>
              <li><strong>Referral Program:</strong> Earn rewards for inviting new users</li>
            </ul>
            <p className="mt-4">
              We reserve the right to modify, suspend, or discontinue any part of the Service at any time with or without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Subscription Plans and Credits</h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5.1 Free Tier</h3>
            <p>Free accounts receive 10 daily credits with the following limitations:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Generated images include a MeowVerse.ai watermark</li>
              <li>Limited to standard generation features</li>
              <li>Credits reset daily and do not roll over</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5.2 Creator Tier Subscription</h3>
            <p><strong>Price:</strong> $9.99/month</p>
            <p><strong>Benefits:</strong></p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>20 daily credits (resets daily, non-cumulative)</li>
              <li>No watermarks on generated content</li>
              <li>Access to all AI models and features</li>
              <li>Priority generation queue</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5.3 Credit Packages</h3>
            <p>Additional credits can be purchased as one-time packages:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>50 credits: $4.99</li>
              <li>120 credits: $9.99</li>
              <li>300 credits: $19.99</li>
              <li>700 credits: $49.99</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5.4 Credit Terms</h3>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Daily credits reset at midnight UTC and do not accumulate</li>
              <li>Purchased credits do not expire unless your account is terminated</li>
              <li>Credits are non-transferable and have no cash value</li>
              <li>Credits are consumed based on generation complexity and model used</li>
              <li>Unused daily credits are forfeited at the end of each day</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Billing and Payments</h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6.1 Payment Processing</h3>
            <p>
              All payments are processed securely through Stripe. By providing payment information, you authorize us to charge
              your payment method for all fees incurred.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6.2 Recurring Subscriptions</h3>
            <p>
              Creator Tier subscriptions automatically renew monthly unless cancelled. You will be charged at the beginning of
              each billing cycle until you cancel your subscription.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6.3 Price Changes</h3>
            <p>
              We may change subscription prices with 30 days' advance notice. Price changes will apply to your next billing cycle
              after notice is provided. If you do not agree to the new price, you may cancel your subscription.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6.4 Taxes</h3>
            <p>
              Prices do not include applicable taxes. You are responsible for all sales, use, and other taxes associated with
              your purchase.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Cancellation and Refunds</h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">7.1 Cancellation</h3>
            <p>
              You may cancel your Creator Tier subscription at any time through your account settings. Cancellation takes effect
              at the end of your current billing period. You will retain access to paid features until the end of the period.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">7.2 Refund Policy</h3>
            <p>
              Due to the digital nature of our services and immediate delivery of credits:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Credit Purchases:</strong> Non-refundable once purchased and delivered</li>
              <li><strong>Subscriptions:</strong> No refunds for partial months; subscription continues until period ends</li>
              <li><strong>Exceptions:</strong> Refunds may be issued at our discretion for billing errors or technical issues preventing service use</li>
            </ul>
            <p className="mt-4">
              For refund requests, contact support@meowverse.ai within 7 days of the charge. For more details, see our
              <Link to="/legal/refund" className="text-purple-600 hover:underline ml-1">Refund Policy</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Intellectual Property Rights</h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">8.1 Your Content Ownership</h3>
            <p>
              You retain ownership of content you generate using our Service, subject to the license grant below.
              However, AI-generated content may have complex copyright considerations depending on your jurisdiction.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">8.2 License to Us</h3>
            <p>
              By uploading or publishing content on our platform, you grant us a worldwide, non-exclusive, royalty-free license to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Store, display, and distribute your content on our platform</li>
              <li>Display publicly shared content in our gallery and promotional materials</li>
              <li>Use content for service improvement and model training (anonymized)</li>
              <li>Create thumbnails, previews, and derivatives for technical purposes</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">8.3 Our Platform Rights</h3>
            <p>
              All rights in the MeowVerse.ai platform, including design, code, logos, and branding, are owned by us or our licensors.
              You may not copy, modify, or reverse engineer any part of our Service.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">8.4 AI Model Providers</h3>
            <p>
              Content generation is powered by third-party AI models (OpenAI, Google, ByteDance). Your use of AI-generated content
              is subject to their respective terms and licenses.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Acceptable Use Policy</h2>
            <p>You agree NOT to use our Service to generate, upload, or share content that:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Is illegal, harmful, threatening, abusive, harassing, defamatory, or obscene</li>
              <li>Infringes on intellectual property rights, including copyrights, trademarks, or patents</li>
              <li>Contains child sexual abuse material (CSAM) or sexualized content involving minors</li>
              <li>Depicts non-consensual sexual acts or deepfakes of real individuals without consent</li>
              <li>Promotes violence, terrorism, or hatred against protected groups</li>
              <li>Contains malware, viruses, or malicious code</li>
              <li>Violates privacy rights or contains unauthorized personal information</li>
              <li>Is spam, phishing, or fraudulent content</li>
              <li>Attempts to manipulate, deceive, or spread misinformation</li>
              <li>Violates any applicable laws or regulations</li>
            </ul>
            <p className="mt-4">
              For complete guidelines, see our <Link to="/legal/aup" className="text-purple-600 hover:underline">Acceptable Use Policy</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. Content Moderation</h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">10.1 Our Rights</h3>
            <p>We reserve the right to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Review, monitor, and moderate all content on our platform</li>
              <li>Remove or refuse to display any content that violates these Terms</li>
              <li>Suspend or terminate accounts for violations</li>
              <li>Report illegal content to law enforcement</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">10.2 Reporting Violations</h3>
            <p>
              If you encounter content that violates these Terms, please report it to moderation@meowverse.ai or use the
              in-app reporting feature.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">11. DMCA Copyright Policy</h2>
            <p>
              We respect intellectual property rights and respond to valid copyright infringement notices under the Digital
              Millennium Copyright Act (DMCA).
            </p>
            <p className="mt-4">
              If you believe content on our platform infringes your copyright, please submit a DMCA notice to dmca@meowverse.ai.
              For more information, see our <Link to="/legal/dmca" className="text-purple-600 hover:underline">DMCA Policy</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">12. Referral Program</h2>
            <p>Our referral program allows you to earn rewards for inviting new users:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>You receive credits when referred users sign up and make qualifying actions</li>
              <li>Referral rewards are subject to fraud prevention and verification</li>
              <li>We may modify or terminate the referral program at any time</li>
              <li>Gaming, fraudulent, or automated referrals will result in account termination</li>
              <li>Referral credits cannot be exchanged for cash</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">13. Disclaimers and Limitations</h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">13.1 AI Content Disclaimer</h3>
            <p className="font-semibold">
              AI-generated content may be inaccurate, inappropriate, biased, or contain errors. We do not guarantee the quality,
              accuracy, or suitability of generated content for any purpose.
            </p>
            <p className="mt-4">
              You are solely responsible for reviewing, verifying, and determining the appropriateness of AI-generated content
              before use or publication.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">13.2 Service Availability</h3>
            <p>
              The Service is provided "AS IS" and "AS AVAILABLE" without warranties of any kind. We do not guarantee:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Uninterrupted or error-free operation</li>
              <li>Availability of specific AI models or features</li>
              <li>Compatibility with your devices or software</li>
              <li>That generated content will meet your expectations</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">13.3 No Warranties</h3>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES
              OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">14. Limitation of Liability</h2>
            <p className="font-semibold">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, MEOWVERSE.AI SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
              CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, DATA LOSS, OR BUSINESS INTERRUPTION, ARISING FROM:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Your use or inability to use the Service</li>
              <li>AI-generated content or actions taken based on such content</li>
              <li>Unauthorized access to your account or data</li>
              <li>Errors, bugs, or service interruptions</li>
              <li>Third-party conduct or content</li>
            </ul>
            <p className="mt-4">
              OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID TO US IN THE 12 MONTHS BEFORE THE CLAIM AROSE,
              OR $100, WHICHEVER IS GREATER.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">15. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless MeowVerse.ai and its officers, directors, employees, and agents from
              any claims, liabilities, damages, losses, and expenses (including attorneys' fees) arising from:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Your use of the Service</li>
              <li>Your content and AI-generated content</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">16. Account Termination</h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">16.1 By You</h3>
            <p>
              You may delete your account at any time through your <Link to="/settings/privacy" className="text-purple-600 hover:underline">Privacy Settings</Link>.
              Upon deletion, you forfeit any unused credits and subscription benefits.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">16.2 By Us</h3>
            <p>We may suspend or terminate your account immediately if you:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Violate these Terms or our policies</li>
              <li>Engage in fraudulent or illegal activity</li>
              <li>Abuse or harass other users or our staff</li>
              <li>Fail to pay amounts owed</li>
              <li>Create security or legal risks for us</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">16.3 Effect of Termination</h3>
            <p>
              Upon termination, your license to use the Service ends immediately. We may delete your account and content.
              Provisions that should survive termination (payment obligations, limitations of liability, etc.) remain in effect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">17. Dispute Resolution</h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">17.1 Informal Resolution</h3>
            <p>
              If you have a dispute, please contact us at support@meowverse.ai first. We will attempt to resolve disputes
              informally within 30 days.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">17.2 Governing Law</h3>
            <p>
              These Terms are governed by the laws of the Hong Kong Special Administrative Region, without regard to conflict of law principles.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">17.3 Arbitration</h3>
            <p>
              Any disputes not resolved informally shall be resolved through binding arbitration in Hong Kong, except you may bring claims
              in small claims court if they qualify. The arbitration shall be conducted in accordance with the Hong Kong International
              Arbitration Centre (HKIAC) rules.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">18. General Provisions</h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">18.1 Changes to Terms</h3>
            <p>
              We may modify these Terms at any time. Material changes will be notified via email or website notice at least
              30 days before taking effect. Continued use after changes constitutes acceptance.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">18.2 Entire Agreement</h3>
            <p>
              These Terms, along with our Privacy Policy and other referenced policies, constitute the entire agreement between
              you and MeowVerse.ai.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">18.3 Severability</h3>
            <p>
              If any provision of these Terms is found invalid or unenforceable, the remaining provisions continue in full effect.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">18.4 Assignment</h3>
            <p>
              You may not assign these Terms without our consent. We may assign these Terms to any affiliate or successor.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">18.5 No Waiver</h3>
            <p>
              Our failure to enforce any provision does not waive our right to enforce it later.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">19. Contact Information</h2>
            <div className="bg-gray-50 p-6 rounded-lg mt-4">
              <p>MeowVerse Ltd.</p>
              <p className="mt-2">Rm D3, 11/F, Luk Hop Industrial Building, 8 Luk Hop Street, San Po Kong, Kowloon</p>
              <p className="mt-2">Hong Kong SAR</p>
              <p className="mt-4"><strong>Email:</strong> legal@meowverse.ai</p>
              <p className="mt-2"><strong>Support:</strong> support@meowverse.ai</p>
              <p className="mt-2"><strong>DMCA Agent:</strong> dmca@meowverse.ai</p>
              <p className="mt-2"><strong>Moderation:</strong> moderation@meowverse.ai</p>
            </div>
          </section>

          <section className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Related Policies</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to="/legal/privacy" className="block p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition">
                <h3 className="font-semibold text-purple-900">Privacy Policy</h3>
                <p className="text-sm text-purple-700 mt-1">How we handle your data</p>
              </Link>
              <Link to="/legal/aup" className="block p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition">
                <h3 className="font-semibold text-pink-900">Acceptable Use Policy</h3>
                <p className="text-sm text-pink-700 mt-1">Content and usage guidelines</p>
              </Link>
              <Link to="/legal/refund" className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                <h3 className="font-semibold text-blue-900">Refund Policy</h3>
                <p className="text-sm text-blue-700 mt-1">Payment and refund terms</p>
              </Link>
              <Link to="/legal/dmca" className="block p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition">
                <h3 className="font-semibold text-indigo-900">DMCA Policy</h3>
                <p className="text-sm text-indigo-700 mt-1">Copyright infringement procedures</p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
