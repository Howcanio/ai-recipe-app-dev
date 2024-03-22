import Link from 'next/link';

export default async function TermsOfService() {
  return (
    <div className='px-10 py-5 text-neutral-black flex flex-col gap-3'>
      <h1 className='font-bold text-3xl lg:text-5xl'>
        Privacy Policy for Howcan, Inc.
      </h1>
      <p className='font-bold mt-5 lg:mt-10'>
        Last Updated:{' '}
        <span className='opacity-80'>
          {new Date(Date.now()).toLocaleString().split(',')[0]}
        </span>
      </p>
      <h3 className='font-bold text-xl lg:text-2xl'>Introduction</h3>
      <p className='opacity-80 font-medium'>
        Welcome to Howcan, Inc. (&quot;we&quot;, &quot;our&quot;, or
        &quot;us&quot;). We operate the website Howcan.io to deliver cooking
        recipes and other personalized results. This Privacy Policy explains how
        we collect, use, disclose, and safeguard your information when you use
        our website and services.
      </p>
      <h3 className='font-bold text-xl lg:text-2xl'>
        What Information We Collect
      </h3>
      <h3 className='font-bold text-xl lg:text-2xl'> Personal Information</h3>
      <p className='opacity-80 font-medium'>
        When you register on Howcan.io, we collect the following personal
        information:
      </p>
      <ul className='list-disc pl-6'>
        <li>Name</li>
        <li>Email address</li>
        <li>IP address</li>
      </ul>
      <h3 className='font-bold text-xl lg:text-2xl'>
        Cookies and Tracking Technologies
      </h3>
      <p className='opacity-80 font-medium'>
        We use cookies to personalize your experience on Howcan.io.
      </p>
      <h3 className='font-bold text-xl lg:text-2xl'>
        How We Use Your Information
      </h3>
      <p className='opacity-80 font-medium'>
        We use the information we collect to:
      </p>
      <ul className='list-disc pl-6'>
        <li>Provide and improve our services</li>
        <li>Personalize your experience</li>
        <li>Send you daily summary digests via email</li>
        <li>
          Monitor and analyze usage and trends to improve your experience with
          Howcan
        </li>
      </ul>
      <h3 className='font-bold text-xl lg:text-2xl'>
        How We Share Your Information
      </h3>
      <h3 className='font-bold text-xl lg:text-2xl'>Third-Party Services</h3>
      <p className='opacity-80 font-medium'>
        We share anonymized data with analytics tools and advertising networks
        to improve our service and enable monetization. No personally
        identifiable information is shared with these third-party services.
      </p>
      <h3 className='font-bold text-xl lg:text-2xl'>Data Security</h3>
      <p className='opacity-80 font-medium'>
        We use standard industry protocols and AWS services to protect your
        data.
      </p>
      <h3 className='font-bold text-xl lg:text-2xl'>User Rights</h3>
      <p className='opacity-80 font-medium'>
        You have the right to delete your account from the settings page on
        Howcan.
      </p>
      <h3 className='font-bold text-xl lg:text-2xl'>Data Retention</h3>
      <p className='opacity-80 font-medium'>
        For each unique request submitted, we create an individual webpage where
        a result page is made publicly available.
      </p>
      <h3 className='font-bold text-xl lg:text-2xl'>
        International Data Transfers
      </h3>
      <p className='opacity-80 font-medium'>
        Our servers are hosted in the United States. While we do not currently
        have international users, we may in the future, and by using our
        service, you consent to the transfer of your data to the United States.
      </p>
      <h3 className='font-bold text-xl lg:text-2xl'>Children&apos;s Privacy</h3>
      <p className='opacity-80 font-medium'>
        Our service is not intended for children under the age of 13, and we do
        not knowingly collect data from children.
      </p>
      <h3 className='font-bold text-xl lg:text-2xl'>
        Updates to This Privacy Policy
      </h3>
      <p className='opacity-80 font-medium'>
        We may update this Privacy Policy from time to time. Changes will be
        posted on Howcan.io.
      </p>
      <h3 className='font-bold text-xl lg:text-2xl'>Contact Us</h3>
      <p className='opacity-80 font-medium'>
        For any privacy-related concerns, you can reach out to us at
        <span className='text-primary'>
          <Link href='mailto:support@howcan.io'>{''} support@howcan.io</Link>
        </span>
        .
      </p>
    </div>
  );
}
