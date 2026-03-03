import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How AGENZ collects, uses, and protects your personal information.',
};

const sections = [
  {
    title: '1. Who We Are',
    content: `AGENZ Creative Hub ("AGENZ", "we", "us", or "our") is a creative digital agency based in Sulaymaniyah, Kurdistan Region, Iraq. We provide advertising, video production, graphic design, and strategic media services.

Contact: agenz@agenz-iq.com
Address: City Center, Office 26, Floor 7, Sulaymaniyah, Iraq`,
  },
  {
    title: '2. Information We Collect',
    content: `We collect only the information you voluntarily provide through our contact form:

• Full name
• Email address
• Your message

We do not collect payment details, create user accounts, or require registration of any kind.`,
  },
  {
    title: '3. How We Use Your Information',
    content: `The information you submit is used solely to:

• Respond to your inquiry or service request
• Send you a confirmation that we received your message
• Follow up regarding potential collaboration

We do not sell, rent, or share your personal information with third parties for marketing purposes.`,
  },
  {
    title: '4. Third-Party Services',
    content: `To operate our contact form and protect against spam, we use the following third-party services:

EmailJS — processes and delivers email messages submitted through our contact form. Your name, email, and message are transmitted through their servers. See EmailJS Privacy Policy for details.

Google reCAPTCHA v3 — verifies that contact form submissions are made by humans, not bots. This service may collect IP address and browser/device data as part of its verification process. See Google Privacy Policy for details.

These services are governed by their own privacy policies. We encourage you to review them.`,
  },
  {
    title: '5. Cookies',
    content: `Our website does not set any first-party cookies. Google reCAPTCHA v3 may set cookies as part of its fraud-prevention mechanism. You can manage or disable cookies through your browser settings, though this may affect the functionality of our contact form.`,
  },
  {
    title: '6. Data Retention',
    content: `We retain the information you send us only as long as necessary to respond to your inquiry and for reasonable follow-up. Email correspondence is stored in our email system and deleted when no longer needed.`,
  },
  {
    title: '7. Your Rights',
    content: `You have the right to:

• Request access to the personal data we hold about you
• Request correction or deletion of your data
• Withdraw consent at any time

To exercise any of these rights, contact us at agenz@agenz-iq.com and we will respond promptly.`,
  },
  {
    title: '8. Children\'s Privacy',
    content: `Our website is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such information, please contact us immediately.`,
  },
  {
    title: '9. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. When we do, we will revise the "Last Updated" date at the top of this page. We encourage you to review this policy periodically.`,
  },
  {
    title: '10. Contact Us',
    content: `If you have any questions or concerns about this Privacy Policy, please reach out:

Email: agenz@agenz-iq.com
Address: City Center, Office 26, Floor 7, Sulaymaniyah, Kurdistan Region, Iraq`,
  },
];

export default function PrivacyPage() {
  return (
    <main className="scrollable-page min-h-screen bg-[#050505] text-white">
      {/* Background gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#00e92c]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#00ffff]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto px-6 py-16 lg:py-24">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors duration-200 mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          Back to Home
        </Link>

        {/* Logo */}
        <div className="mb-10">
          <Image
            src="/agenz creative hub.svg"
            alt="AGENZ Creative Hub"
            width={140}
            height={46}
            className="h-10 w-auto opacity-80"
          />
        </div>

        {/* Header */}
        <div className="mb-12 pb-8 border-b border-white/10">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Privacy{' '}
            <span className="bg-gradient-to-r from-[#00e92c] to-[#00ffff] bg-clip-text text-transparent">
              Policy
            </span>
          </h1>
          <p className="text-gray-400 text-sm">
            Last updated: March 2025
          </p>
          <p className="text-gray-300 mt-4 leading-relaxed">
            This Privacy Policy explains how AGENZ Creative Hub collects, uses, and protects
            the information you provide when you visit our website or use our contact form.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-lg font-semibold text-white mb-3">{section.title}</h2>
              <p className="text-gray-400 leading-relaxed whitespace-pre-line text-sm">
                {section.content}
              </p>
            </section>
          ))}
        </div>

        {/* Footer strip */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} AGENZ. All rights reserved.</p>
          <Link
            href="/terms"
            className="hover:text-gray-300 transition-colors duration-200"
          >
            Terms of Service →
          </Link>
        </div>
      </div>
    </main>
  );
}
