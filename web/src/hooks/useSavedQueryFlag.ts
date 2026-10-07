import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';

export const SAVED_QUERY_PARAM = 'saved';

// Whether the page was reached by a redirect after its first save, flagged by
// `?saved=1`. The flag is removed from the URL once read so a refresh or a
// shared link doesn't report the save again.
export default function useSavedQueryFlag() {
  const router = useRouter();
  const [saved] = useState(() => router.query[SAVED_QUERY_PARAM] === '1');

  useEffect(() => {
    if (router.query[SAVED_QUERY_PARAM] !== '1') return;
    const query = {...router.query};
    delete query[SAVED_QUERY_PARAM];
    // shallow so getServerSideProps doesn't run again
    router.replace({pathname: router.pathname, query}, undefined, {
      shallow: true,
    });
  }, [router]);

  return saved;
}
