import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms and conditions governing the use of the AGENZ Creative Hub website.',
};

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: `By accessing or using the AGENZ Creative Hub website (agenz-iq.com), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.

These terms apply to all visitors and users of the website.`,
  },
  {
    title: '2. Who We Are',
    content: `AGENZ Creative Hub ("AGENZ", "we", "us", or "our") is a creative digital agency registered and operating in Sulaymaniyah, Kurdistan Region, Iraq. We specialize in advertising, video production, graphic design, and strategic media services.

Contact: agenz@agenz-iq.com
Address: City Center, Office 26, Floor 7, Sulaymaniyah, Iraq`,
  },
  {
    title: '3. Use of the Website',
    content: `You may use this website for lawful purposes only. You agree not to:

• Use the website in any way that violates applicable local, national, or international law
• Attempt to gain unauthorized access to any part of the website or its infrastructure
• Transmit any unsolicited or unauthorized advertising or promotional material
• Reproduce, duplicate, copy, or resell any part of the website without our written permission
• Engage in any conduct that restricts or inhibits anyone's use or enjoyment of the website`,
  },
  {
    title: '4. Intellectual Property',
    content: `All content on this website — including but not limited to text, graphics, logos, images, animations, video content, 3D assets, and the AGENZ brand identity — is the exclusive property of AGENZ Creative Hub and is protected by applicable intellectual property laws.

You may not reproduce, distribute, modify, or create derivative works from any content on this website without our prior written consent.

Portfolio work displayed on this website may feature creative work produced for third-party clients. Rights to that work are governed by agreements between AGENZ and those clients.`,
  },
  {
    title: '5. Contact Form & Communications',
    content: `When you submit a message through our contact form, you consent to AGENZ using your provided contact information to respond to your inquiry. We do not use this information for unsolicited marketing.

We aim to respond to all inquiries within 2 business days. Submitting a contact form does not constitute a binding agreement or guarantee of service.`,
  },
  {
    title: '6. Services & Engagements',
    content: `Information on this website describes our service offerings in general terms. The specific scope, deliverables, timeline, and terms of any engagement between AGENZ and a client are governed by a separate written agreement (contract or proposal) signed by both parties.

Nothing on this website constitutes a binding offer or guarantee of availability.`,
  },
  {
    title: '7. Disclaimers',
    content: `This website is provided on an "as is" and "as available" basis. AGENZ makes no warranties, express or implied, regarding:

• The accuracy or completeness of any content on the website
• The availability or uninterrupted operation of the website
• That the website will be free of viruses or other harmful components

We reserve the right to modify, suspend, or discontinue any part of the website at any time without notice.`,
  },
  {
    title: '8. Limitation of Liability',
    content: `To the maximum extent permitted by applicable law, AGENZ shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of, or inability to use, this website or its content.

Our total liability for any claim arising from your use of the website shall not exceed the amount you paid us, if any, in the twelve months preceding the claim.`,
  },
  {
    title: '9. Third-Party Links',
    content: `Our website may contain links to third-party websites (such as Instagram and LinkedIn). These links are provided for your convenience only. AGENZ has no control over the content or practices of those websites and accepts no responsibility for them. Visiting linked sites is done at your own risk.`,
  },
  {
    title: '10. Privacy',
    content: `Your use of this website is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy to understand our practices.`,
  },
  {
    title: '11. Governing Law',
    content: `These Terms of Service are governed by and construed in accordance with the laws of the Republic of Iraq. Any disputes arising from these terms or your use of the website shall be subject to the exclusive jurisdiction of the courts of Sulaymaniyah, Kurdistan Region, Iraq.`,
  },
  {
    title: '12. Changes to These Terms',
    content: `We reserve the right to update these Terms of Service at any time. Changes take effect immediately upon posting to the website. The "Last Updated" date at the top of this page reflects the most recent revision. Continued use of the website after changes are posted constitutes your acceptance of the revised terms.`,
  },
  {
    title: '13. Contact Us',
    content: `If you have any questions about these Terms of Service, please contact us:

Email: agenz@agenz-iq.com
Address: City Center, Office 26, Floor 7, Sulaymaniyah, Kurdistan Region, Iraq`,
  },
];

export default function TermsPage() {
  return (
    <main className="scrollable-page min-h-screen bg-[#050505] text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#00ffff]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#00e92c]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto px-6 py-16 lg:py-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors duration-200 mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          Back to Home
        </Link>

        <div className="mb-10">
          <Image
            src="/agenz creative hub.svg"
            alt="AGENZ Creative Hub"
            width={140}
            height={46}
            className="h-10 w-auto opacity-80"
          />
        </div>

        <div className="mb-12 pb-8 border-b border-white/10">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Terms of{' '}
            <span className="bg-gradient-to-r from-[#00e92c] to-[#00ffff] bg-clip-text text-transparent">
              Service
            </span>
          </h1>
          <p className="text-gray-400 text-sm">
            Last updated: March 2025
          </p>
          <p className="text-gray-300 mt-4 leading-relaxed">
            Please read these Terms of Service carefully before using the AGENZ Creative Hub
            website. They govern your access to and use of our website and services.
          </p>
        </div>

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

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} AGENZ. All rights reserved.</p>
          <Link
            href="/privacy"
            className="hover:text-gray-300 transition-colors duration-200"
          >
            Privacy Policy →
          </Link>
        </div>
      </div>
    </main>
  );
}
