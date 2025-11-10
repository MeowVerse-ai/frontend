import React from 'react';
import { Link } from 'react-router-dom';

const AcceptableUsePolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Acceptable Use Policy</h1>
        <p className="text-sm text-gray-600 mb-8">Last Updated: November 11, 2025</p>

        <div className="prose max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Purpose</h2>
            <p>
              This Acceptable Use Policy ("AUP") defines prohibited uses of MeowVerse.ai's AI-powered content generation platform
              (the "Service"). This policy protects all users and ensures our Service is used responsibly and legally.
            </p>
            <p className="mt-4">
              By using our Service, you agree to comply with this AUP and our <Link to="/legal/terms" className="text-purple-600 hover:underline">Terms of Service</Link>.
              Violations may result in content removal, account suspension, or permanent termination without refund.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Prohibited Content</h2>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
              <p className="font-semibold text-red-900">You may NOT use our Service to generate, upload, or share:</p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.1 Illegal Content</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Child Sexual Abuse Material (CSAM):</strong> Any content depicting, suggesting, or sexualizing minors</li>
              <li><strong>Illegal Activities:</strong> Content promoting or facilitating illegal acts (drug trafficking, weapons sales, fraud, etc.)</li>
              <li><strong>Terrorism:</strong> Content supporting, glorifying, or recruiting for terrorist organizations</li>
              <li><strong>Human Trafficking:</strong> Content related to exploitation or trafficking of humans</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.2 Harmful and Dangerous Content</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Violence and Gore:</strong> Graphic depictions of violence, injury, or death intended to shock or disturb</li>
              <li><strong>Self-Harm:</strong> Content promoting suicide, self-injury, or eating disorders</li>
              <li><strong>Dangerous Activities:</strong> Instructions for creating weapons, explosives, or harmful substances</li>
              <li><strong>Animal Cruelty:</strong> Content depicting abuse or torture of animals</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.3 Hate Speech and Harassment</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Hate Speech:</strong> Content attacking people based on race, ethnicity, religion, gender, sexual orientation, disability, or other protected characteristics</li>
              <li><strong>Harassment and Bullying:</strong> Content targeting individuals with abuse, threats, or intimidation</li>
              <li><strong>Doxxing:</strong> Sharing private personal information without consent</li>
              <li><strong>Impersonation:</strong> Pretending to be someone else to deceive or harm</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.4 Sexual and Adult Content</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Explicit Sexual Content:</strong> Pornography or sexually explicit imagery</li>
              <li><strong>Non-Consensual Content:</strong> Sexual content created without consent of depicted individuals</li>
              <li><strong>Deepfakes:</strong> Non-consensual sexual or intimate deepfakes of real people</li>
              <li><strong>Sexual Exploitation:</strong> Content exploiting individuals for sexual purposes</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.5 Intellectual Property Violations</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Copyright Infringement:</strong> Using copyrighted characters, logos, or imagery without permission</li>
              <li><strong>Trademark Violations:</strong> Unauthorized use of trademarks or brand names</li>
              <li><strong>Plagiarism:</strong> Claiming others' work as your own</li>
              <li><strong>Counterfeiting:</strong> Creating fake branded products or certificates</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.6 Spam and Deceptive Practices</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Spam:</strong> Repetitive, unsolicited, or promotional content</li>
              <li><strong>Phishing:</strong> Content designed to steal credentials or personal information</li>
              <li><strong>Misinformation:</strong> Deliberately false information intended to deceive (especially health, elections, emergencies)</li>
              <li><strong>Scams and Fraud:</strong> Deceptive schemes to steal money or information</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.7 Privacy Violations</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Private Information:</strong> Sharing others' personal data without consent</li>
              <li><strong>Surveillance Content:</strong> Images or videos captured without consent in private settings</li>
              <li><strong>Identity Theft:</strong> Using others' identities for fraudulent purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. AI Generation Guidelines</h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.1 Responsible Prompt Usage</h3>
            <p>When creating AI generation prompts, you must:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Use respectful and appropriate language</li>
              <li>Avoid prompts designed to bypass safety filters</li>
              <li>Not attempt to generate prohibited content through indirect or coded language</li>
              <li>Respect the rights and dignity of real individuals</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.2 Deepfakes and Realistic Depictions</h3>
            <p>You may not:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Create deepfakes of real people without their explicit consent</li>
              <li>Generate realistic images or videos intended to deceive or mislead</li>
              <li>Create content falsely depicting public figures in compromising situations</li>
              <li>Generate fake identification documents, certificates, or credentials</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.3 Commercial Use</h3>
            <p>
              While you may use AI-generated content commercially, you must ensure:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Content does not infringe on others' intellectual property rights</li>
              <li>You comply with applicable advertising and consumer protection laws</li>
              <li>You disclose when content is AI-generated where required by law</li>
              <li>You do not mislead consumers about product origins or endorsements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Prohibited Activities</h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4.1 Platform Abuse</h3>
            <p>You may not:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Create multiple accounts to circumvent limits or bans</li>
              <li>Use bots or automated tools to abuse the Service</li>
              <li>Attempt to bypass security measures or access controls</li>
              <li>Engage in scraping or unauthorized data collection</li>
              <li>Reverse engineer or decompile our Service</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4.2 Gaming Systems</h3>
            <p>You may not:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Artificially inflate views, likes, or engagement metrics</li>
              <li>Create fake referrals or abuse the referral program</li>
              <li>Manipulate rankings or leaderboards</li>
              <li>Coordinate inauthentic engagement or vote manipulation</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4.3 Security Violations</h3>
            <p>You may not:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Attempt to access other users' accounts or data</li>
              <li>Upload malware, viruses, or malicious code</li>
              <li>Conduct security testing without prior authorization</li>
              <li>Interfere with Service operations or infrastructure</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Community Conduct</h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5.1 Comments and Interactions</h3>
            <p>When commenting or interacting with other users:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Be respectful and constructive</li>
              <li>Do not harass, bully, or threaten others</li>
              <li>Keep discussions on-topic and relevant</li>
              <li>Do not spam or post repetitive content</li>
              <li>Report violations instead of engaging</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5.2 Public Gallery Standards</h3>
            <p>Content shared in the public gallery must:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Be appropriate for a general audience (13+ years old)</li>
              <li>Not contain excessive violence or disturbing imagery</li>
              <li>Be properly tagged if containing mature themes</li>
              <li>Respect community standards and values</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Enforcement</h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6.1 Content Moderation</h3>
            <p>
              We use a combination of automated systems and human review to enforce this AUP. Content may be:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Blocked:</strong> Prevented from being generated or uploaded</li>
              <li><strong>Removed:</strong> Deleted from the platform</li>
              <li><strong>Flagged:</strong> Marked for review by our moderation team</li>
              <li><strong>Age-Restricted:</strong> Limited to certain user groups</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6.2 Account Actions</h3>
            <p>Violations may result in:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Warning:</strong> First-time minor violations</li>
              <li><strong>Temporary Suspension:</strong> Repeat or moderate violations (3-30 days)</li>
              <li><strong>Permanent Termination:</strong> Severe or repeated violations</li>
              <li><strong>Legal Action:</strong> Illegal content reported to authorities</li>
            </ul>
            <p className="mt-4 font-semibold">
              Account termination for policy violations results in loss of all credits and subscriptions without refund.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6.3 Appeals</h3>
            <p>
              If you believe your content or account was actioned in error, you may appeal by contacting moderation@meowverse.ai
              within 30 days. Include:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Your account email</li>
              <li>Description of the content or action</li>
              <li>Explanation of why you believe it was an error</li>
            </ul>
            <p className="mt-4">Appeals are reviewed within 7 business days. Our decision on appeals is final.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Reporting Violations</h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">7.1 How to Report</h3>
            <p>If you encounter content or behavior that violates this AUP:</p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
              <p className="font-semibold text-blue-900">Option 1: In-App Reporting</p>
              <p className="text-blue-800 mt-2">Click the "Report" button on any content or user profile</p>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
              <p className="font-semibold text-blue-900">Option 2: Email Report</p>
              <p className="text-blue-800 mt-2">Send details to moderation@meowverse.ai</p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">7.2 What to Include</h3>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Direct link to the content or user profile</li>
              <li>Description of the violation</li>
              <li>Screenshots (if applicable)</li>
              <li>Any relevant context</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">7.3 Emergency Reports</h3>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
              <p className="font-semibold text-red-900">Immediate Threats or Illegal Content</p>
              <p className="text-red-800 mt-2">
                For content involving immediate danger, CSAM, terrorism, or other serious crimes:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2 text-red-800">
                <li><strong>Email:</strong> emergency@meowverse.ai (monitored 24/7)</li>
                <li><strong>Contact local law enforcement immediately</strong></li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Legal Cooperation</h2>
            <p>
              We cooperate with law enforcement and legal authorities. We may:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Report illegal content to appropriate authorities</li>
              <li>Preserve user data in response to valid legal requests</li>
              <li>Provide user information pursuant to court orders or legal obligations</li>
              <li>Testify or provide evidence in legal proceedings</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Changes to This Policy</h2>
            <p>
              We may update this AUP to address new threats, technologies, or legal requirements. Material changes will be
              announced via:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Email notification to registered users</li>
              <li>Prominent notice on our website</li>
              <li>Update to the "Last Updated" date</li>
            </ul>
            <p className="mt-4">
              Continued use of the Service after changes take effect constitutes acceptance of the updated AUP.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. Contact Us</h2>
            <div className="bg-gray-50 p-6 rounded-lg mt-4">
              <p><strong>General Inquiries:</strong> support@meowverse.ai</p>
              <p className="mt-2"><strong>Policy Questions:</strong> legal@meowverse.ai</p>
              <p className="mt-2"><strong>Report Violations:</strong> moderation@meowverse.ai</p>
              <p className="mt-2"><strong>Emergency Reports:</strong> emergency@meowverse.ai</p>
            </div>
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
              <Link to="/legal/dmca" className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                <h3 className="font-semibold text-blue-900">DMCA Policy</h3>
                <p className="text-sm text-blue-700 mt-1">Copyright infringement reporting</p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AcceptableUsePolicy;
