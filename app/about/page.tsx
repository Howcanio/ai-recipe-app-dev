import Link from 'next/link';

export default async function TermsOfService() {
  return (
    <div className='px-10 py-5 text-neutral-black flex flex-col gap-3'>
      <h3 className='font-bold text-xl lg:text-2xl'>About Us</h3>
      <p className='opacity-80 font-medium'>Welcome to Howcan.</p>
      <p className='opacity-80 font-medium'>
        At Howcan, we&apos;re leveraging Artificial Intelligence to transform
        how you cook and plan. Our platform initially focuses on helping you
        create custom recipes effortlessly, blending AI technology with your
        culinary preferences
      </p>
      <p className='opacity-80 font-medium'>
        But we&apos;re not stopping at the kitchen. Founded by experienced
        entrepreneurs with a strong background in media, Howcan is set to expand
        to leverage the potential of AI. Our goal is to apply our AI expertise
        to simplify and enhance other aspects of your life, from planning your
        next trip to developing comprehensive lesson plans for your favorite
        topic.
      </p>
      <p className='opacity-80 font-medium'>
        We&apos;re committed to making AI an accessible and valuable tool in
        your everyday life. Howcan is here to make things easier, smarter, and
        more efficient.
      </p>
      <p className='opacity-80 font-medium'>
        Howcan – Simplifying Life with AI.
      </p>
    </div>
  );
}
