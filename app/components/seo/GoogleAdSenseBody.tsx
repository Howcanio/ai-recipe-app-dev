import Script from 'next/script';

export default function GoogleAdSenseBody() {
  return (
    <>
      <ins
        className='adsbygoogle'
        style={{ display: 'inline-block', width: 728, height: 90 }}
        data-ad-client='ca-pub-6226966118368164'
        data-ad-slot={1234567890}
      />
      <Script
        id='test'
        dangerouslySetInnerHTML={{
          __html: '(window.adsbygoogle = window.adsbygoogle || []).push({});',
        }}
      />
    </>
  );
}
