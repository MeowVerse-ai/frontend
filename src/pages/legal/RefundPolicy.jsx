import React from 'react';
import { Link } from 'react-router-dom';

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Refund Policy</h1>
        <p className="text-sm text-gray-600 mb-8">Last Updated: November 11, 2025</p>

        <div className="prose max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Overview</h2>
            <p>
              This Refund Policy explains our policies and procedures regarding refunds for MeowVerse.ai services,
              including subscription fees and credit purchases. Due to the instant digital nature of our AI content generation
              services, refunds are generally not provided except in specific circumstances outlined below.
            </p>
            <p className="mt-4">
              By purchasing credits or subscribing to our Creator Tier, you acknowledge and agree to this Refund Policy
              and our <Link to="/legal/terms" className="text-purple-600 hover:underline">Terms of Service</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Credit Purchases</h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.1 General Policy</h3>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4">
              <p className="font-semibold text-yellow-900">Credit purchases are non-refundable.</p>
              <p className="text-yellow-800 mt-2">
                Once credits are purchased and delivered to your account, they cannot be refunded or exchanged for cash.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.2 Why Credits Are Non-Refundable</h3>
            <p>Credits are digital products that are:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Delivered instantly upon purchase</li>
              <li>Immediately available for use in generating AI content</li>
              <li>Consumed upon use and cannot be "returned"</li>
              <li>Subject to third-party API costs when used</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.3 Exceptions for Credit Purchases</h3>
            <p>We may issue refunds for credit purchases in the following situations:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Billing Error:</strong> You were charged incorrectly or multiple times for the same purchase</li>
              <li><strong>Technical Failure:</strong> Credits were not delivered due to a system error</li>
              <li><strong>Fraudulent Charge:</strong> Unauthorized purchase on your account (must be reported within 48 hours)</li>
              <li><strong>Service Unavailability:</strong> Our Service was completely unavailable and you could not use purchased credits</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.4 Credit Packages</h3>
            <p>Current credit packages and pricing:</p>
            <table className="min-w-full border-collapse border border-gray-300 mt-4">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">Package</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Credits</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Price</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Refund Policy</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Starter Pack</td>
                  <td className="border border-gray-300 px-4 py-2">50 credits</td>
                  <td className="border border-gray-300 px-4 py-2">$4.99</td>
                  <td className="border border-gray-300 px-4 py-2">Non-refundable</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Popular Pack</td>
                  <td className="border border-gray-300 px-4 py-2">120 credits</td>
                  <td className="border border-gray-300 px-4 py-2">$9.99</td>
                  <td className="border border-gray-300 px-4 py-2">Non-refundable</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Pro Pack</td>
                  <td className="border border-gray-300 px-4 py-2">300 credits</td>
                  <td className="border border-gray-300 px-4 py-2">$19.99</td>
                  <td className="border border-gray-300 px-4 py-2">Non-refundable</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Ultimate Pack</td>
                  <td className="border border-gray-300 px-4 py-2">700 credits</td>
                  <td className="border border-gray-300 px-4 py-2">$49.99</td>
                  <td className="border border-gray-300 px-4 py-2">Non-refundable</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Creator Tier Subscription</h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.1 Subscription Details</h3>
            <div className="bg-purple-50 p-4 rounded-lg my-4">
              <p><strong>Price:</strong> $9.99/month</p>
              <p className="mt-2"><strong>Billing Cycle:</strong> Monthly, auto-renewing</p>
              <p className="mt-2"><strong>Benefits:</strong></p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>20 daily credits (resets daily)</li>
                <li>No watermarks on generated content</li>
                <li>Access to all AI models</li>
                <li>Priority generation queue</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.2 Subscription Refund Policy</h3>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4">
              <p className="font-semibold text-yellow-900">Subscription fees are non-refundable for partial billing periods.</p>
              <p className="text-yellow-800 mt-2">
                If you cancel your subscription, you will retain access until the end of your current billing period,
                but no refund will be issued for the unused portion.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.3 Cancellation Process</h3>
            <p>You may cancel your Creator Tier subscription at any time:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Go to your Account Settings</li>
              <li>Navigate to "Subscription" section</li>
              <li>Click "Cancel Subscription"</li>
              <li>Confirm cancellation</li>
            </ul>
            <p className="mt-4">
              <strong>Effect of Cancellation:</strong> Your subscription remains active until the end of the current billing period.
              You will not be charged for subsequent months.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.4 Exceptions for Subscriptions</h3>
            <p>We may issue prorated refunds for subscriptions in the following cases:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Billing Error:</strong> You were incorrectly charged (duplicate charge, wrong amount)</li>
              <li><strong>Service Outage:</strong> Our Service was unavailable for an extended period (7+ consecutive days)</li>
              <li><strong>Account Termination by Us:</strong> We terminated your account in error</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Chargebacks and Disputes</h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4.1 Contact Us First</h3>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
              <p className="font-semibold text-blue-900">Before filing a chargeback with your bank:</p>
              <p className="text-blue-800 mt-2">
                Please contact us at billing@meowverse.ai. Most billing issues can be resolved quickly and amicably
                without the need for chargebacks.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4.2 Chargeback Consequences</h3>
            <p>
              Filing a chargeback without contacting us first may result in:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Immediate suspension of your account</li>
              <li>Loss of all credits and content</li>
              <li>Permanent ban if the chargeback is found to be fraudulent</li>
              <li>Legal action for fraudulent chargebacks</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4.3 Legitimate Disputes</h3>
            <p>
              If you have a legitimate billing dispute and contact us within 30 days, we will:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Investigate the issue promptly</li>
              <li>Provide transaction documentation</li>
              <li>Issue refunds for valid errors</li>
              <li>Work with you to resolve the matter fairly</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Requesting a Refund</h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5.1 How to Request</h3>
            <p>To request a refund for eligible purchases:</p>
            <ol className="list-decimal pl-6 space-y-2 mt-4">
              <li>Email billing@meowverse.ai</li>
              <li>Include your account email address</li>
              <li>Provide transaction ID or date of purchase</li>
              <li>Explain the reason for your refund request</li>
              <li>Include any supporting documentation (screenshots, error messages, etc.)</li>
            </ol>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5.2 Refund Timeline</h3>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Request Deadline:</strong> Within 7 days of the charge</li>
              <li><strong>Review Period:</strong> We will review your request within 3-5 business days</li>
              <li><strong>Approval Notification:</strong> You will receive an email with our decision</li>
              <li><strong>Processing Time:</strong> Approved refunds are processed within 5-10 business days</li>
              <li><strong>Receipt:</strong> Refunds appear in your account within 3-7 business days after processing (depending on your bank)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5.3 Refund Method</h3>
            <p>
              Refunds are issued to the original payment method used for the purchase. We cannot issue refunds to
              different cards, accounts, or in the form of cash or credits.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Special Circumstances</h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6.1 Fraudulent Purchases</h3>
            <p>
              If your account was compromised and unauthorized purchases were made:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Contact us immediately at security@meowverse.ai</li>
              <li>Provide details of the unauthorized transactions</li>
              <li>Change your password and enable two-factor authentication</li>
              <li>We will investigate and issue refunds for confirmed fraudulent charges</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6.2 Account Termination by Us</h3>
            <p>
              If we terminate your account for violating our <Link to="/legal/terms" className="text-purple-600 hover:underline">Terms of Service</Link> or
              <Link to="/legal/aup" className="text-purple-600 hover:underline ml-1">Acceptable Use Policy</Link>:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>No refunds will be issued for unused credits</li>
              <li>No refunds will be issued for remaining subscription time</li>
              <li>All purchases are forfeited upon termination for cause</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6.3 Service Discontinuation</h3>
            <p>
              If we permanently discontinue the Service:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>We will provide at least 30 days' advance notice</li>
              <li>Active subscriptions will be cancelled and prorated refunds issued</li>
              <li>Unused purchased credits may be refunded at our discretion</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Taxes and Fees</h2>
            <p>
              Refunds do not include transaction fees, currency conversion fees, or taxes paid. These fees are set by
              third-party payment processors and financial institutions and are non-refundable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Free Tier</h2>
            <p>
              The free tier provides 10 daily credits at no charge. There are no refunds associated with free tier usage,
              as no payment is required.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Consumer Rights</h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">9.1 EU Right of Withdrawal</h3>
            <p>
              For customers in the European Union: You have a 14-day right of withdrawal for purchases. However, by using
              our Service and consuming credits, you expressly agree to immediate performance and waive your right of withdrawal
              for digital content that has been delivered.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">9.2 Other Jurisdictions</h3>
            <p>
              Some jurisdictions may provide additional consumer protection rights. This Refund Policy does not limit any
              mandatory consumer rights you may have under applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. Changes to This Policy</h2>
            <p>
              We may update this Refund Policy from time to time. Changes will be effective immediately upon posting.
              We will notify you of material changes via:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Email to your registered email address</li>
              <li>Notice on our website</li>
              <li>Update to the "Last Updated" date</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">11. Contact Information</h2>
            <div className="bg-gray-50 p-6 rounded-lg mt-4">
              <p><strong>Billing Questions:</strong> billing@meowverse.ai</p>
              <p className="mt-2"><strong>Refund Requests:</strong> billing@meowverse.ai</p>
              <p className="mt-2"><strong>Fraud Reports:</strong> security@meowverse.ai</p>
              <p className="mt-2"><strong>General Support:</strong> support@meowverse.ai</p>
            </div>
            <p className="mt-6">
              Our billing support team is available Monday-Friday, 9 AM - 6 PM EST. We typically respond within 1 business day.
            </p>
          </section>

          <section className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Related Policies</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to="/legal/terms" className="block p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition">
                <h3 className="font-semibold text-purple-900">Terms of Service</h3>
                <p className="text-sm text-purple-700 mt-1">Complete user agreement</p>
              </Link>
              <Link to="/legal/privacy" className="block p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition">
                <h3 className="font-semibold text-pink-900">Privacy Policy</h3>
                <p className="text-sm text-pink-700 mt-1">How we protect your data</p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
