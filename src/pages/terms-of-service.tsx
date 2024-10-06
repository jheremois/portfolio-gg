// pages/terms.tsx

import { useRouter } from 'next/router';
import Head from 'next/head';

const Terms = () => {

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5">
      <Head>
        <title>Terms of Service - Portfoliogg</title>
        <meta name="description" content="Portfoliogg Terms of Service" />
      </Head>

      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Terms of Service</h1>
        <p className="text-gray-500 text-sm mb-8">Last updated: 6 October 2024</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">1. Introduction</h2>
          <p className="text-gray-600">
            Welcome to Portfoliogg ("we," "our," or "us"). By accessing or using our website, located at <a href="https://portfolio-gg-eta.vercel.app" className="text-blue-600 hover:underline">https://portfolio-gg-eta.vercel.app</a>, you agree to comply with and be bound by these Terms of Service ("Terms"). If you disagree with any part of these Terms, you may not use our service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">2. Description of Service</h2>
          <p className="text-gray-600">
            Portfoliogg is a platform that allows users to create and share professional portfolios. Our service includes features such as profile creation, portfolio customization, and public portfolio sharing.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">3. User Accounts</h2>
          <p className="text-gray-600 mb-4">3.1. You must create an account to use certain features of our service. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.</p>
          <p className="text-gray-600 mb-4">3.2. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.</p>
          <p className="text-gray-600 mb-4">3.3. We reserve the right to suspend or terminate your account if any information provided during the registration process or thereafter proves to be inaccurate, not current, or incomplete.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">4. User Content</h2>
          <p className="text-gray-600 mb-4">4.1. You retain all rights to the content you upload to Portfoliogg ("User Content"). By uploading content, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, adapt, publish, translate, and distribute it in any and all media.</p>
          <p className="text-gray-600 mb-4">4.2. You are solely responsible for your User Content and the consequences of posting or publishing it. You affirm, represent, and warrant that you own or have the necessary licenses, rights, consents, and permissions to publish the User Content you submit.</p>
          <p className="text-gray-600 mb-4">4.3. We reserve the right to remove any User Content that violates these Terms or is otherwise objectionable at our sole discretion.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">5. Prohibited Uses</h2>
          <p className="text-gray-600 mb-4">You agree not to use the service:</p>
          <ul className="list-disc ml-6 text-gray-600 mb-4">
            <li>5.1. For any unlawful purpose or to solicit the performance of any illegal activity.</li>
            <li>5.2. To impersonate other users or entities.</li>
            <li>5.3. To upload or transmit viruses or any other type of malicious code.</li>
            <li>5.4. To interfere with or disrupt the integrity or performance of the service.</li>
            <li>5.5. To collect or track the personal information of others.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">6. Intellectual Property</h2>
          <p className="text-gray-600">
            The service and its original content (excluding User Content), features, and functionality are and will remain the exclusive property of Portfoliogg and its licensors.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">7. Termination</h2>
          <p className="text-gray-600">
            We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">8. Limitation of Liability</h2>
          <p className="text-gray-600">
            In no event shall Portfoliogg, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">9. Changes to Terms</h2>
          <p className="text-gray-600">
            We reserve the right to modify or replace these Terms at any time. We will provide notice of any material changes by posting the new Terms on this page. Your continued use of the service after any such changes constitutes your acceptance of the new Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">10. Contact Us</h2>
          <p className="text-gray-600">
            If you have any questions about these Terms, please contact us at <a href="mailto:jheremy@geekguysstudio.com" className="text-blue-600 hover:underline">jheremy@geekguysstudio.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
