// pages/privacy.tsx

import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';

const PrivacyPolicy = () => {
  const { locale } = useRouter() as { locale: 'en' | 'es' };

  const currentDate = new Date().toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <Head>
        <title>Privacy Policy - Portfoliogg</title>
        <meta name="description" content="Portfoliogg Privacy Policy" />
      </Head>
      <Header />
      <div className="min-h-screen py-20 lg:px-5 px-2 text-text">

        <div className="container mx-auto shadow-md rounded-lg p-8">
          <h1 className="text-4xl font-bold text-gray-50 mb-4">Privacy Policy</h1>
          <p className="text-gray-200 text-sm mb-8">Last updated: {currentDate}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="">
              Portfoliogg ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website or services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-semibold mb-2">2.1. Personal Information:</h3>
            <ul className="list-disc ml-6  mb-4">
              <li>Name</li>
              <li>Email address</li>
              <li>Profile picture</li>
              <li>Professional information (e.g., skills, experience, education)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2">2.2. Usage Information:</h3>
            <ul className="list-disc ml-6  mb-4">
              <li>IP address</li>
              <li>Browser type</li>
              <li>Pages visited</li>
              <li>Time and date of visits</li>
            </ul>

            <p className="">
              2.3. We collect information when you:
            </p>
            <ul className="list-disc ml-6 ">
              <li>Create an account</li>
              <li>Update your profile</li>
              <li>Upload portfolio items</li>
              <li>Interact with our website</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p className=" mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc ml-6 ">
              <li>3.1. Provide, maintain, and improve our services</li>
              <li>3.2. Process transactions and send related information</li>
              <li>3.3. Send you technical notices, updates, security alerts, and support messages</li>
              <li>3.4. Respond to your comments, questions, and customer service requests</li>
              <li>3.5. Communicate with you about products, services, offers, and events</li>
              <li>3.6. Monitor and analyze trends, usage, and activities in connection with our services</li>
              <li>3.7. Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
              <li>3.8. Personalize and improve the service and provide content or features that match user profiles or interests</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Sharing of Your Information</h2>
            <p className=" mb-4">We may share your information in the following situations:</p>
            <ul className="list-disc ml-6 ">
              <li>4.1. With your consent</li>
              <li>4.2. To comply with legal obligations</li>
              <li>4.3. To protect and defend our rights and property</li>
              <li>4.4. With service providers who help us operate our business and provide our services</li>
              <li>4.5. In connection with a merger, sale, or acquisition of all or a portion of our company</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
            <p className="">
              We implement appropriate technical and organizational measures to protect the security of your personal information. However, please note that no method of transmission over the Internet or electronic storage is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Your Data Protection Rights</h2>
            <p className=" mb-4">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="list-disc ml-6 ">
              <li>6.1. The right to access, update, or delete your personal information</li>
              <li>6.2. The right to rectification</li>
              <li>6.3. The right to object to processing</li>
              <li>6.4. The right of restriction</li>
              <li>6.5. The right to data portability</li>
              <li>6.6. The right to withdraw consent</li>
            </ul>
            <p className=" mt-4">
              To exercise these rights, please contact us using the information provided in the "Contact Us" section.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Third-Party Links</h2>
            <p className="">
              Our service may contain links to third-party websites. We are not responsible for the privacy practices or content of these third-party sites.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
            <p className="">
              Our service is not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Changes to This Privacy Policy</h2>
            <p className="">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
            <p className="">
              If you have any questions about this Privacy Policy, please contact us at <a href="mailto:jheremy@geekguysstudio.com" className="text-blue-600 hover:underline">jheremy@geekguysstudio.com</a>.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
