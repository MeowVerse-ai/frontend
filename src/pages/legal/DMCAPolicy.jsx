import React from 'react';
import { Link } from 'react-router-dom';

const DMCAPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">DMCA Copyright Policy</h1>
        <p className="text-sm text-gray-600 mb-8">Last Updated: November 11, 2025</p>

        <div className="prose max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Introduction</h2>
            <p>
              MeowVerse.ai respects the intellectual property rights of others and expects our users to do the same.
              We comply with the Digital Millennium Copyright Act ("DMCA") and respond to valid copyright infringement notices.
            </p>
            <p className="mt-4">
              This policy explains how to report copyright infringement, how we handle such reports, and the consequences
              for users who repeatedly infringe copyrights. It applies to all content on our platform at meowverse.ai (the "Service").
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Copyright Infringement Notification</h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.1 How to File a DMCA Notice</h3>
            <p>
              If you believe that content on our Service infringes your copyright, you may submit a DMCA takedown notice
              to our designated Copyright Agent.
            </p>

            <div className="bg-purple-50 border-l-4 border-purple-500 p-6 my-6">
              <p className="font-semibold text-purple-900 text-lg">DMCA Copyright Agent</p>
              <p className="mt-3 text-purple-900"><strong>Email:</strong> dmca@meowverse.ai</p>
              <p className="mt-2 text-purple-900"><strong>Subject Line:</strong> "DMCA Takedown Notice"</p>
              <p className="mt-2 text-sm text-purple-800">
                For expedited processing, please use the email method and include "DMCA Takedown Notice" in the subject line.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2.2 Required Elements of a DMCA Notice</h3>
            <p>
              To be valid under the DMCA (17 U.S.C. § 512(c)(3)), your notice must include ALL of the following:
            </p>

            <ol className="list-decimal pl-6 space-y-4 mt-4">
              <li>
                <strong>Identification of the copyrighted work:</strong>
                <p className="mt-1">Describe the copyrighted work you claim has been infringed. If multiple works are covered by a single notification, provide a representative list.</p>
                <p className="mt-1 italic text-sm">Example: "My photograph titled 'Sunset Beach' registered with the U.S. Copyright Office under registration number VA 123-456."</p>
              </li>

              <li>
                <strong>Identification of the infringing material:</strong>
                <p className="mt-1">Provide the direct URL(s) to the specific content you claim is infringing. General descriptions are not sufficient.</p>
                <p className="mt-1 italic text-sm">Example: "https://meowverse.ai/gallery/post/abc123"</p>
              </li>

              <li>
                <strong>Your contact information:</strong>
                <p className="mt-1">Provide sufficient information for us to contact you, including:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Full legal name</li>
                  <li>Mailing address</li>
                  <li>Telephone number</li>
                  <li>Email address</li>
                </ul>
              </li>

              <li>
                <strong>Good faith statement:</strong>
                <p className="mt-1">Include the following statement:</p>
                <p className="mt-2 italic text-sm bg-gray-50 p-3 rounded">
                  "I have a good faith belief that the use of the material in the manner complained of is not authorized
                  by the copyright owner, its agent, or the law."
                </p>
              </li>

              <li>
                <strong>Accuracy statement under penalty of perjury:</strong>
                <p className="mt-1">Include the following statement:</p>
                <p className="mt-2 italic text-sm bg-gray-50 p-3 rounded">
                  "I swear, under penalty of perjury, that the information in this notification is accurate and that I am
                  the copyright owner, or am authorized to act on behalf of the owner, of an exclusive right that is allegedly infringed."
                </p>
              </li>

              <li>
                <strong>Physical or electronic signature:</strong>
                <p className="mt-1">Sign the notice. An electronic signature (typing your full legal name) is acceptable for email submissions.</p>
              </li>
            </ol>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-6">
              <p className="font-semibold text-yellow-900">Important Notice:</p>
              <p className="text-yellow-800 mt-2">
                Submitting a false or fraudulent DMCA notice may result in legal liability. Under 17 U.S.C. § 512(f),
                you may be liable for damages (including costs and attorneys' fees) if you knowingly misrepresent that
                material is infringing.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Our Response to DMCA Notices</h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.1 Review Process</h3>
            <p>Upon receiving a valid DMCA notice, we will:</p>
            <ol className="list-decimal pl-6 space-y-2 mt-4">
              <li>Review the notice for compliance with DMCA requirements</li>
              <li>Verify the identification of the allegedly infringing content</li>
              <li>Promptly remove or disable access to the content if the notice is valid</li>
              <li>Notify the user who posted the content</li>
              <li>Document the takedown in our records</li>
            </ol>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.2 Timeline</h3>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Initial Review:</strong> Within 2 business days of receipt</li>
              <li><strong>Takedown Action:</strong> Within 1 business day of validation</li>
              <li><strong>User Notification:</strong> Immediately upon takedown</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.3 Invalid Notices</h3>
            <p>
              If your DMCA notice does not comply with legal requirements, we may:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Request additional information or clarification</li>
              <li>Reject the notice if it remains incomplete</li>
              <li>Not take action until a valid notice is received</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Counter-Notification</h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4.1 If Your Content Was Removed</h3>
            <p>
              If you believe your content was removed in error or misidentification, you may submit a DMCA counter-notice
              to our Copyright Agent at the same address: <strong>dmca@meowverse.ai</strong>
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4.2 Required Elements of a Counter-Notice</h3>
            <p>
              To be valid under the DMCA (17 U.S.C. § 512(g)(3)), your counter-notice must include:
            </p>

            <ol className="list-decimal pl-6 space-y-4 mt-4">
              <li>
                <strong>Your physical or electronic signature</strong>
              </li>

              <li>
                <strong>Identification of the removed material:</strong>
                <p className="mt-1">Description of the material and the location where it appeared before removal (URL).</p>
              </li>

              <li>
                <strong>Good faith statement:</strong>
                <p className="mt-2 italic text-sm bg-gray-50 p-3 rounded">
                  "I swear, under penalty of perjury, that I have a good faith belief that the material was removed or
                  disabled as a result of mistake or misidentification of the material to be removed or disabled."
                </p>
              </li>

              <li>
                <strong>Your contact information:</strong>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Full legal name</li>
                  <li>Physical address</li>
                  <li>Telephone number</li>
                  <li>Email address</li>
                </ul>
              </li>

              <li>
                <strong>Consent to jurisdiction:</strong>
                <p className="mt-2 italic text-sm bg-gray-50 p-3 rounded">
                  "I consent to the jurisdiction of the Federal District Court for the judicial district in which my address
                  is located (or [specify jurisdiction] if my address is outside the United States), and I will accept service
                  of process from the person who provided the original DMCA notice or an agent of such person."
                </p>
              </li>
            </ol>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4.3 Our Response to Counter-Notices</h3>
            <p>Upon receiving a valid counter-notice:</p>
            <ol className="list-decimal pl-6 space-y-2 mt-4">
              <li>We will promptly forward the counter-notice to the original complainant</li>
              <li>We will inform them that we will restore the content in 10-14 business days</li>
              <li>We will restore the content unless the copyright owner files a court action seeking a restraining order</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Repeat Infringer Policy</h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5.1 Three-Strike Policy</h3>
            <p>
              We maintain a repeat infringer policy in accordance with the DMCA. Users who repeatedly infringe copyrights
              will have their accounts terminated:
            </p>

            <div className="bg-red-50 p-4 rounded-lg my-4">
              <ul className="space-y-2">
                <li><strong>First Strike:</strong> Warning and content removal</li>
                <li><strong>Second Strike:</strong> Temporary account suspension (7 days) and content removal</li>
                <li><strong>Third Strike:</strong> Permanent account termination</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5.2 Definition of Repeat Infringer</h3>
            <p>
              A "repeat infringer" is a user who has received multiple valid DMCA takedown notices or for whom we have
              other reliable evidence of repeated copyright violations.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5.3 Appeals</h3>
            <p>
              If your account is terminated for repeat infringement and you believe this was in error, you may appeal
              within 30 days by emailing legal@meowverse.ai with evidence supporting your claim.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. AI-Generated Content and Copyright</h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6.1 Your Responsibilities</h3>
            <p>
              When generating AI content on our platform, you are responsible for ensuring your prompts and resulting
              content do not infringe copyrights:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Do not use prompts that reference specific copyrighted characters, logos, or artworks</li>
              <li>Do not attempt to recreate copyrighted works using AI</li>
              <li>Do not use AI to generate content in the style of a specific artist without permission</li>
              <li>Be aware that AI-generated content similar to existing works may still infringe</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6.2 Copyright Ownership of AI Content</h3>
            <p>
              The copyright status of AI-generated content is complex and evolving. While you retain rights to content
              you generate (subject to our <Link to="/legal/terms" className="text-purple-600 hover:underline">Terms of Service</Link>),
              you should:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Be aware that copyright law regarding AI-generated works varies by jurisdiction</li>
              <li>Not represent AI-generated content as human-created where this matters legally</li>
              <li>Consult a lawyer for commercial uses of AI-generated content</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Trademark and Other Rights</h2>
            <p>
              While this policy focuses on copyright, we also respect trademark rights, rights of publicity, and other
              intellectual property rights. Content that infringes these rights may be removed even without a formal DMCA notice.
            </p>
            <p className="mt-4">
              For trademark infringement or other IP violations, contact: legal@meowverse.ai
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Fair Use</h2>
            <p>
              We recognize that some uses of copyrighted material may constitute fair use under copyright law. When evaluating
              DMCA notices, we may consider fair use principles, but we are not required to make legal determinations about
              fair use.
            </p>
            <p className="mt-4">
              If you believe your use of copyrighted material is fair use, you should explain this in your counter-notice.
              However, fair use is determined on a case-by-case basis and may ultimately require a court determination.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Limitations and Disclaimers</h2>
            <p>
              MeowVerse.ai acts as a service provider under the DMCA safe harbor provisions (17 U.S.C. § 512). We:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Do not actively monitor user content for copyright infringement</li>
              <li>Respond to valid DMCA notices when received</li>
              <li>Are not responsible for determining copyright ownership or validity</li>
              <li>Do not provide legal advice regarding copyright matters</li>
              <li>Reserve the right to remove any content at our discretion</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. International Copyright</h2>
            <p>
              We respect copyright laws worldwide. While this policy references U.S. law (DMCA), we will respond to
              valid copyright complaints from any jurisdiction in accordance with applicable international treaties and laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">11. Changes to This Policy</h2>
            <p>
              We may update this DMCA Policy to reflect changes in law or our practices. Changes will be effective upon
              posting with an updated "Last Updated" date. Material changes will be announced via website notice or email.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">12. Contact Information</h2>

            <div className="bg-gray-50 p-6 rounded-lg mt-4">
              <p className="font-semibold text-lg text-gray-900 mb-4">Designated Copyright Agent</p>

              <p><strong>Company:</strong> MeowVerse Ltd.</p>
              <p className="mt-2"><strong>Registered in:</strong> Hong Kong SAR</p>
              <p className="mt-2"><strong>Address:</strong> Room D3, 11/F, Luk Hop Industrial Building, 8 Luk Hop Street, San Po Kong, Kowloon</p>

              <p className="mt-6"><strong>For DMCA Notices and Counter-Notices:</strong></p>
              <p className="mt-2">Email: dmca@meowverse.ai</p>
              <p className="mt-1 text-sm text-gray-600">(Include "DMCA Takedown Notice" or "DMCA Counter-Notice" in subject)</p>

              <p className="mt-6"><strong>For General Copyright Questions:</strong></p>
              <p className="mt-2">Email: legal@meowverse.ai</p>

              <p className="mt-6"><strong>For Other IP Issues (Trademarks, etc.):</strong></p>
              <p className="mt-2">Email: legal@meowverse.ai</p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-6">
              <p className="font-semibold text-blue-900">Note on Response Times:</p>
              <p className="text-blue-800 mt-2">
                We process DMCA notices during business hours (Monday-Friday, 9 AM - 6 PM EST). Valid notices received
                outside business hours will be processed on the next business day. Emergency requests involving illegal
                content should be sent to emergency@meowverse.ai.
              </p>
            </div>
          </section>

          <section className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Additional Resources</h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Learn More About Copyright</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <a href="https://www.copyright.gov/dmca/" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                  U.S. Copyright Office - DMCA Information
                </a>
              </li>
              <li>
                <a href="https://www.copyright.gov/" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                  U.S. Copyright Office
                </a>
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Related Policies</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Link to="/legal/terms" className="block p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition">
                <h3 className="font-semibold text-purple-900">Terms of Service</h3>
                <p className="text-sm text-purple-700 mt-1">User agreement and IP rights</p>
              </Link>
              <Link to="/legal/aup" className="block p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition">
                <h3 className="font-semibold text-pink-900">Acceptable Use Policy</h3>
                <p className="text-sm text-pink-700 mt-1">Content guidelines and restrictions</p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DMCAPolicy;
