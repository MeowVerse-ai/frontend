import React from 'react';
import { Link } from 'react-router-dom';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
        <p className="text-sm text-gray-600 mb-8">Last Updated: January 1, 2026</p>

        <div className="prose max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. What Are Cookies?</h2>
            <p>
              Cookies are small text files that are stored on your device (computer, tablet, or mobile phone) when you visit a website.
              They help websites remember your preferences, login status, and other information to enhance your browsing experience.
            </p>
            <p className="mt-4">
              This Cookie Policy explains how MeowVerse.ai ("we," "us," or "our") uses cookies and similar tracking technologies
              on our website at meowverse.ai (the "Service").
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Why We Use Cookies</h2>
            <p>We use cookies to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Keep you signed in to your account</li>
              <li>Remember your preferences and settings</li>
              <li>Understand how you use our Service to improve it</li>
              <li>Provide security features and prevent fraud</li>
              <li>Analyze website traffic and user behavior (anonymized)</li>
              <li>Deliver personalized content and features</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Types of Cookies We Use</h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.1 Essential Cookies (Always Active)</h3>
            <div className="bg-green-50 border-l-4 border-green-500 p-4 my-4">
              <p className="font-semibold text-green-900">These cookies are necessary for the Service to function and cannot be disabled.</p>
            </div>
            <table className="min-w-full border-collapse border border-gray-300 mt-4">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">Cookie Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Purpose</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-mono text-sm">auth_token</td>
                  <td className="border border-gray-300 px-4 py-2">Maintains your login session</td>
                  <td className="border border-gray-300 px-4 py-2">7 days</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-mono text-sm">csrf_token</td>
                  <td className="border border-gray-300 px-4 py-2">Security protection against attacks</td>
                  <td className="border border-gray-300 px-4 py-2">Session</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-mono text-sm">session_id</td>
                  <td className="border border-gray-300 px-4 py-2">Tracks your browsing session</td>
                  <td className="border border-gray-300 px-4 py-2">Session</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-mono text-sm">legal_consent</td>
                  <td className="border border-gray-300 px-4 py-2">Records consent banner acceptance</td>
                  <td className="border border-gray-300 px-4 py-2">1 year</td>
                </tr>
              </tbody>
            </table>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.2 Functional Cookies</h3>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
              <p className="font-semibold text-blue-900">These cookies enhance functionality and personalization.</p>
            </div>
            <table className="min-w-full border-collapse border border-gray-300 mt-4">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">Cookie Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Purpose</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-mono text-sm">user_preferences</td>
                  <td className="border border-gray-300 px-4 py-2">Remembers your settings and preferences</td>
                  <td className="border border-gray-300 px-4 py-2">1 year</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-mono text-sm">theme_preference</td>
                  <td className="border border-gray-300 px-4 py-2">Remembers dark/light mode choice</td>
                  <td className="border border-gray-300 px-4 py-2">1 year</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-mono text-sm">language</td>
                  <td className="border border-gray-300 px-4 py-2">Remembers your language preference</td>
                  <td className="border border-gray-300 px-4 py-2">1 year</td>
                </tr>
              </tbody>
            </table>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.3 Analytics Cookies</h3>
            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 my-4">
              <p className="font-semibold text-purple-900">These cookies help us understand how users interact with our Service (data is anonymized).</p>
            </div>
            <table className="min-w-full border-collapse border border-gray-300 mt-4">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">Cookie Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Purpose</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-mono text-sm">_analytics_id</td>
                  <td className="border border-gray-300 px-4 py-2">Tracks anonymous usage statistics</td>
                  <td className="border border-gray-300 px-4 py-2">2 years</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-mono text-sm">_pageview</td>
                  <td className="border border-gray-300 px-4 py-2">Counts page visits (anonymized)</td>
                  <td className="border border-gray-300 px-4 py-2">24 hours</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Third-Party Cookies</h2>
            <p>
              We may use third-party services that set their own cookies on your device. These services have their own privacy
              policies and cookie practices:
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4.1 Stripe (Payment Processing)</h3>
            <p>
              Stripe uses cookies to process payments securely and prevent fraud. For more information, see
              <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline ml-1">
                Stripe's Privacy Policy
              </a>.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4.2 Google OAuth</h3>
            <p>
              If you sign in with Google, Google may set cookies. See
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline ml-1">
                Google's Privacy Policy
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Cookie Duration</h2>
            <p>Cookies can be:</p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5.1 Session Cookies</h3>
            <p>
              Temporary cookies that are deleted when you close your browser. Used for maintaining your session while browsing.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5.2 Persistent Cookies</h3>
            <p>
              Remain on your device for a set period (specified in the tables above) or until you delete them manually.
              Used for remembering preferences across sessions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Managing Cookies</h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6.1 Cookie Consent Banner</h3>
            <p>
              When you first visit our website, you will see a cookie consent banner. You can accept or manage your cookie
              preferences through this banner.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6.2 Browser Settings</h3>
            <p>
              Most web browsers allow you to control cookies through their settings. You can:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Block all cookies</li>
              <li>Block third-party cookies only</li>
              <li>Delete cookies after each browsing session</li>
              <li>View and delete individual cookies</li>
            </ul>

            <p className="mt-4">Browser-specific cookie management guides:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>
                <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                  Google Chrome
                </a>
              </li>
              <li>
                <a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                  Mozilla Firefox
                </a>
              </li>
              <li>
                <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                  Safari (macOS)
                </a>
              </li>
              <li>
                <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                  Microsoft Edge
                </a>
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6.3 Impact of Disabling Cookies</h3>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4">
              <p className="font-semibold text-yellow-900">Warning:</p>
              <p className="text-yellow-800 mt-2">
                If you disable essential cookies, some features of our Service may not function properly. You may be unable to:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2 text-yellow-800">
                <li>Log in to your account</li>
                <li>Use certain features that require authentication</li>
                <li>Save your preferences</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Other Tracking Technologies</h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">7.1 Local Storage</h3>
            <p>
              We use browser local storage to store certain data locally on your device, such as user preferences and cached data.
              This improves performance and user experience.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">7.2 Web Beacons</h3>
            <p>
              We may use web beacons (small transparent images) in emails to track email opens and engagement. This helps us
              understand the effectiveness of our communications.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Do Not Track Signals</h2>
            <p>
              Some browsers offer a "Do Not Track" (DNT) signal. Currently, there is no industry standard for responding to DNT signals.
              We do not currently respond to DNT signals, but we anonymize analytics data and minimize tracking where possible.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Updates to This Cookie Policy</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes in technology, legal requirements, or our practices.
              We will notify you of significant changes by:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Updating the "Last Updated" date at the top of this policy</li>
              <li>Displaying a notice on our website</li>
              <li>Re-prompting you to review your cookie preferences</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. Your Privacy Rights</h2>
            <p>
              Your use of cookies and related data is also governed by our <Link to="/legal/privacy" className="text-purple-600 hover:underline">Privacy Policy</Link>.
              Depending on your location, you may have rights regarding your personal data under GDPR, CCPA, or other privacy laws.
            </p>
            <p className="mt-4">
              For more information about your rights and how we handle your personal data, please see our Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">11. Contact Us</h2>
            <p>
              If you have questions about our use of cookies or this Cookie Policy, please contact us:
            </p>
            <div className="mt-4 bg-gray-50 p-6 rounded-lg">
              <p><strong>Email:</strong> privacy@meowverse.ai</p>
              <p className="mt-2"><strong>Support:</strong> support@meowverse.ai</p>
            </div>
          </section>

          <section className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Related Policies</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to="/legal/privacy" className="block p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition">
                <h3 className="font-semibold text-purple-900">Privacy Policy</h3>
                <p className="text-sm text-purple-700 mt-1">How we handle your personal data</p>
              </Link>
              <Link to="/legal/terms" className="block p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition">
                <h3 className="font-semibold text-pink-900">Terms of Service</h3>
                <p className="text-sm text-pink-700 mt-1">User agreement and service terms</p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
