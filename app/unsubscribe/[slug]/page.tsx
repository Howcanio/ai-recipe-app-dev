import { getSubscriberByUnsubscribeToken } from '@/app/lib/emailDbActions';
import Unsubscribe from './components/Unsubscribe';

type Params = {
  params: {
    slug: string;
  };
};

export default async function UnsubscribePage({ params: { slug } }: Params) {
  const subscriber = await getSubscriberByUnsubscribeToken(slug);

  return (
    slug && (
      <Unsubscribe
        unsubscribeToken={slug}
        isSubscribed={subscriber?.is_active}
      />
    )
  );
}
