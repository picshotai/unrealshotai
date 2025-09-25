// app/privacy/page.tsx

import React from "react";
import Head from "next/head";
import Script from "next/script";

// Define metadata for the page
export const metadata = {
  title: "Privacy Policy - UnrealShot AI",
  description: "Learn how UnrealShot AI collects, uses, and protects your personal data.",
};

const PrivacyPolicy: React.FC = () => {
  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Head>

      {/* Structured Data Schema */}
      <Script id="schema-privacy-policy" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Privacy Policy - Unrealshot AI",
          "description": "Learn how UnrealShot AI collects, uses, and protects your personal data.",
          "url": "https://www.unrealshot.com/privacy",
          "mainEntity": {
            "@type": "Organization",
            "name": "Unrealshot AI",
            "description": "Unrealshot AI is an AI-powered platform that generates professional headshots with ease, empowering individuals and businesses globally.",
            "url": "https://www.unrealshot.com",
            "founder": {
              "@type": "Person",
              "name": "The Unrealshot AI Team",
            },
          },
        })}
      </Script>

      <div className="flex-grow py-24 pb-6">
        <main className="max-w-[80rem] px-4 sm:px-6 lg:px-8 mx-auto">
          <h1 className="text-main text-6xl font-bold mx-auto mb-10 text-indigo-900 lg:mb-14">
            Privacy Policy
          </h1>
          <p className="mb-4">Effective Date: [01 Jan 25]</p>

          <section className="mb-6">
            <p className="mb-4">
              At <strong>Unrealshot AI</strong>, accessible from{" "}
              <a
                href="https://www.unrealshot.com"
                className="text-blue-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://www.unrealshot.com
              </a>
              , we are committed to protecting your privacy. This Privacy Policy explains what information we collect, how we use it, how we process user data, and your rights under <strong>applicable privacy laws, including the General Data Protection Regulation (GDPR)</strong>. By using our services, you agree to the practices described in this Privacy Policy.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
            <p className="mb-4">We collect and process the following types of personal data:</p>
            <h3 className="text-lg font-medium mb-2">1.1 Personal Information (Provided by You)</h3>
            <ul className="list-disc list-inside pl-5 mb-4">
              <li><strong>Email Address</strong> (for account creation and communication).</li>
              <li><strong>Uploaded Images & Media</strong> (used for AI model training and image generation).</li>
              <li><strong>Payment Information</strong> (processed securely via third-party payment providers).</li>
            </ul>
            <h3 className="text-lg font-medium mb-2">1.2 Automatically Collected Data</h3>
            <ul className="list-disc list-inside pl-5">
              <li><strong>Device Information</strong> (browser type, operating system, and device details).</li>
              <li><strong>IP Address & Location Data</strong> (to ensure service functionality and security).</li>
              <li><strong>Usage Data</strong> (features used, session duration, and interactions).</li>
              <li><strong>Cookies & Tracking Technologies</strong> (see Section 7).</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">2. How We Use Your Information</h2>
            <p className="mb-4">We process your data for the following purposes:</p>
            <ul className="list-disc list-inside pl-5">
              <li>✅ <strong>Service Provision:</strong> To generate AI photos, store user models for 7-14 days, and improve accuracy.</li>
              <li>✅ <strong>Account Management:</strong> To enable login, profile settings, and service customization.</li>
              <li>✅ <strong>Payment Processing:</strong> To process transactions securely (via Stripe, PayPal, or others).</li>
              <li>✅ <strong>Customer Support:</strong> To address inquiries and technical issues.</li>
              <li>✅ <strong>Marketing (With Consent):</strong> To send updates, promotions, or personalized ads.</li>
              <li>✅ <strong>Security & Fraud Prevention:</strong> To prevent misuse, unauthorized access, or data breaches.</li>
            </ul>
            <p className="mt-4">We <strong>do not</strong> sell or misuse your data.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">3. Data Storage & Retention</h2>
            <ul className="list-disc list-inside pl-5">
              <li>📌 <strong>Email Data:</strong> Stored in <strong>Supabase</strong> until account deletion.</li>
              <li>📌 <strong>Uploaded Images:</strong> Retained for <strong>14 days</strong> before automatic deletion.</li>
              <li>📌 <strong>Payment Data:</strong> Not stored by us; processed by <strong>secure third-party payment providers</strong>.</li>
              <li>📌 <strong>Logs & Analytics:</strong> Retained for performance monitoring but anonymized after 30 days.</li>
            </ul>
            <p className="mt-4">If you request deletion of your account, we will permanently erase all stored personal data.</p>
          </section>
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">4. Your Rights (GDPR & Global Compliance)</h2>
            <p className="mb-4">If you are an <strong>EU/EEA resident</strong>, you have additional GDPR rights:</p>
            <ul className="list-disc list-inside pl-5">
              <li>🔹 <strong>Right to Access:</strong> Request a copy of your personal data.</li>
              <li>🔹 <strong>Right to Rectification:</strong> Correct inaccurate or incomplete data.</li>
              <li>🔹 <strong>Right to Erasure ("Right to be Forgotten"):</strong> Request deletion of your personal data.</li>
              <li>🔹 <strong>Right to Restrict Processing:</strong> Limit how we use your data.</li>
              <li>🔹 <strong>Right to Data Portability:</strong> Request your data in a structured format.</li>
              <li>🔹 <strong>Right to Object:</strong> Stop processing for marketing purposes.</li>
              <li>🔹 <strong>Right to Withdraw Consent:</strong> If data processing is based on consent, you can withdraw it at any time.</li>
            </ul>
            <p className="mt-4">
              📩 <strong>To exercise your rights, contact us at:</strong>{" "}
              <a href="mailto:support@unrealshot.com" className="text-blue-500 hover:underline">
                support@unrealshot.com
              </a>. We will respond within <strong>14 days</strong> as per GDPR guidelines.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">5. Data Sharing & Third-Party Services</h2>
            <p className="mb-4">We <strong>do not sell</strong> your personal data. However, we may share data with:</p>
            <ul className="list-disc list-inside pl-5">
              <li><strong>Cloud Storage & AI Processing:</strong> Vercel Blob, Astria API (for AI model training).</li>
              <li><strong>Payment Processors:</strong> Stripe, PayPal (for secure transactions).</li>
              <li><strong>Analytics & Performance Monitoring:</strong> Google Analytics, Hotjar (to improve user experience).</li>
              <li><strong>Legal & Compliance Reasons:</strong> If required by law or court order.</li>
            </ul>
            <p className="mt-4">Each provider follows <strong>industry-standard security measures</strong> and <strong>GDPR compliance policies</strong>.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">6. Data Security Measures</h2>
            <ul className="list-disc list-inside pl-5">
              <li>🔒 <strong>Encryption:</strong> Data is encrypted in transit and at rest.</li>
              <li>🔒 <strong>Access Control:</strong> Limited access to authorized personnel only.</li>
              <li>🔒 <strong>Regular Security Audits:</strong> To prevent unauthorized data access.</li>
            </ul>
            <p className="mt-4">However, no system is <strong>100% secure</strong>, and we encourage users to take necessary precautions.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">7. Cookies & Tracking Technologies</h2>
            <p className="mb-4">We use cookies and similar tracking technologies to improve your experience on Unrealshot AI.</p>
            <h3 className="text-lg font-medium mb-2">7.1 What Cookies Do We Use?</h3>
            <ul className="list-disc list-inside pl-5 mb-4">
              <li>🔐 <strong>Authentication Cookies:</strong> Used by Supabase to keep you logged in after signing in via email or Google login. These cookies store session information securely.</li>
              <li>🍪 <strong>Necessary Cookies:</strong> Required for basic website functionality and security.</li>
              <li>📊 <strong>Analytics Cookies:</strong> Help us analyze site usage and improve performance (Google Analytics, Hotjar).</li>
            </ul>
            <h3 className="text-lg font-medium mb-2">7.2 Managing Cookies</h3>
            <p className="mb-4">
              You can control or disable cookies through your browser settings. However, disabling authentication cookies may log you out or limit certain features. For any questions regarding our use of cookies, contact us at{" "}
              <a href="mailto:support@unrealshot.com" className="text-blue-500 hover:underline">
                support@unrealshot.com
              </a>.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">8. Children's Privacy</h2>
            <p className="mb-4">We <strong>do not</strong> knowingly collect or process data from users under <strong>18 years old</strong>. If we discover such data, we will delete it immediately.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">9. International Data Transfers</h2>
            <p className="mb-4">
              Since we operate globally, your data <strong>may be transferred to servers outside your country</strong> (including the US & EU). We ensure these transfers comply with <strong>GDPR, SCCs (Standard Contractual Clauses), and other international laws</strong> for secure handling.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">10. Changes to This Privacy Policy</h2>
            <p className="mb-4">
              We may update this Privacy Policy to reflect <strong>legal, technical, or business changes</strong>. Any updates will be posted here with an <strong>effective date</strong>. Continued use of Unrealshot AI signifies your acceptance of the changes.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-2">11. Contact Information</h2>
            <p>
              For any questions or privacy-related concerns, contact us:
              <br />
              📧 <strong>Email:</strong>{" "}
              <a href="mailto:support@unrealshot.com" className="text-blue-500 hover:underline">
                support@unrealshot.com
              </a>
              <br />
              🌍 <strong>Website:</strong>{" "}
              <a href="https://www.unrealshot.com" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                https://www.unrealshot.com
              </a>
            </p>
          </section>
        </main>
      </div>
    </>
  );
};

export default PrivacyPolicy;