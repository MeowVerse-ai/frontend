import React from 'react';
import { Link } from 'react-router-dom';

const LegalNotice = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Legal Notice / Impressum</h1>
        <p className="text-sm text-gray-600 mb-8">Information pursuant to §5 TMG (Germany) and EU regulations</p>

        <div className="prose max-w-none space-y-6 text-gray-700">

          {/* Company Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Company Information</h2>

            <div className="bg-gray-50 p-6 rounded-lg space-y-3">
              <p><strong>Company Name:</strong> MeowVerse Ltd.</p>
              <p><strong>Legal Form:</strong> Limited Company</p>
              <p><strong>Registered in:</strong> Hong Kong Special Administrative Region (SAR)</p>
              <p><strong>Company Registration Number:</strong> <span className="text-purple-600">79032161</span></p>
            </div>
          </section>

          {/* Registered Address */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Registered Business Address</h2>

            <div className="bg-gray-50 p-6 rounded-lg">
              <p>Room D3, 11/F, Luk Hop Industrial Building</p>
              <p>8 Luk Hop Street, San Po Kong</p>
              <p>Kowloon, Hong Kong SAR</p>
            </div>
          </section>

          {/* Management */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Management / Authorized Representative</h2>

            <div className="bg-gray-50 p-6 rounded-lg">
              <p><strong>Managing Director / CEO:</strong> <span className="text-purple-600">Dr.-Ing. Zizhe Wang</span></p>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Contact Information</h2>

            <div className="bg-gray-50 p-6 rounded-lg space-y-3">
              <div>
                <p><strong>General Inquiries:</strong></p>
                <p>Email: <a href="mailto:support@meowverse.ai" className="text-purple-600 hover:text-purple-700 underline">support@meowverse.ai</a></p>
              </div>

              <div>
                <p><strong>Legal Inquiries:</strong></p>
                <p>Email: <a href="mailto:legal@meowverse.ai" className="text-purple-600 hover:text-purple-700 underline">legal@meowverse.ai</a></p>
              </div>

              <div>
                <p><strong>Privacy Matters:</strong></p>
                <p>Email: <a href="mailto:privacy@meowverse.ai" className="text-purple-600 hover:text-purple-700 underline">privacy@meowverse.ai</a></p>
              </div>

              {/* <div>
                <p><strong>Business Phone:</strong> <span className="text-purple-600">[Your Business Phone Number]</span></p>
                <p className="text-sm text-gray-600 mt-1">(Optional: Add when you have a dedicated business line)</p>
              </div> */}
            </div>
          </section>

          {/* VAT Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">VAT Identification</h2>

            <div className="bg-gray-50 p-6 rounded-lg">
              <p><strong>EU VAT ID:</strong> <span className="text-purple-600">[Will be added after EU VAT registration]</span></p>
              <p className="text-sm text-gray-600 mt-2">
                Currently not registered for EU VAT. Registration will be completed when applicable thresholds are met.
              </p>
            </div>
          </section>

          {/* Responsible for Content */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Responsible for Content</h2>
            <p className="text-sm text-gray-600 mb-3">(Required under §18 Abs. 2 MStV - Germany)</p>

            <div className="bg-gray-50 p-6 rounded-lg">
              <p><strong>Name:</strong> <span className="text-purple-600">Dr.-Ing. Zizhe Wang</span></p>
              <p><strong>Address:</strong> Same as registered business address above</p>
            </div>
          </section>

          {/* Dispute Resolution */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Dispute Resolution</h2>

            <p>
              The European Commission provides a platform for online dispute resolution (ODR):
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-700 underline ml-1"
              >
                https://ec.europa.eu/consumers/odr
              </a>
            </p>

            <p className="mt-4">
              We are not obliged to participate in dispute resolution proceedings before a consumer arbitration board,
              but we are generally willing to do so.
            </p>
          </section>

          {/* Professional Regulations */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Professional Regulations</h2>

            <p>
              <strong>Applicable Law:</strong> This service is operated in accordance with the laws of Hong Kong SAR
              and complies with applicable EU regulations including GDPR.
            </p>

            <p className="mt-4">
              <strong>Regulatory Authority:</strong> Companies Registry, Hong Kong SAR
            </p>
          </section>

          {/* Liability Disclaimer */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Liability for Content</h2>

            <p>
              As a service provider, we are responsible for our own content on these pages in accordance with
              general laws. However, we are not obliged to monitor transmitted or stored third-party information
              or to investigate circumstances that indicate illegal activity.
            </p>

            <p className="mt-4">
              Obligations to remove or block the use of information under general laws remain unaffected.
              However, liability in this regard is only possible from the point in time at which knowledge of
              a specific legal violation becomes known. Upon notification of corresponding legal violations,
              we will remove this content immediately.
            </p>
          </section>

          {/* Liability for Links */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Liability for Links</h2>

            <p>
              Our website contains links to external websites of third parties over whose content we have no influence.
              Therefore, we cannot assume any liability for this third-party content. The respective provider or
              operator of the pages is always responsible for the content of the linked pages.
            </p>

            <p className="mt-4">
              The linked pages were checked for possible legal violations at the time of linking. Illegal content
              was not recognizable at the time of linking. However, permanent monitoring of the content of the
              linked pages is not reasonable without concrete evidence of a legal violation. Upon notification of
              legal violations, we will remove such links immediately.
            </p>
          </section>

          {/* Copyright */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Copyright</h2>

            <p>
              The content and works created by the site operators on these pages are subject to copyright law.
              Duplication, processing, distribution, and any form of commercialization of such material beyond
              the scope of copyright law requires the prior written consent of its respective author or creator.
            </p>

            <p className="mt-4">
              Downloads and copies of this page are only permitted for private, non-commercial use. Insofar as
              the content on this site was not created by the operator, the copyrights of third parties are respected.
              In particular, third-party content is identified as such. Should you nevertheless become aware of a
              copyright infringement, please inform us accordingly. Upon notification of violations, we will remove
              such content immediately.
            </p>
          </section>

          {/* Related Policies */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Related Legal Documents</h2>

            <div className="bg-purple-50 p-6 rounded-lg">
              <p className="mb-3">For more information about our services and your rights, please see:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <Link to="/legal/terms" className="text-purple-600 hover:text-purple-700 underline">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/legal/privacy" className="text-purple-600 hover:text-purple-700 underline">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/legal/cookies" className="text-purple-600 hover:text-purple-700 underline">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link to="/legal/dmca" className="text-purple-600 hover:text-purple-700 underline">
                    DMCA Copyright Policy
                  </Link>
                </li>
              </ul>
            </div>
          </section>

          {/* Last Updated */}
          <section className="mt-12 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              <strong>Last Updated:</strong> November 2025
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default LegalNotice;
