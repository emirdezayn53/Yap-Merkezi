import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function CalculatorsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/');
  }, [router]);
  return null;
}
