'use client'

import { HubCategoryPage } from '@/components/HubCategoryPage';
import { tmdb } from '@/lib/tmdb';

export default function SerialsPage() {
  return (
    <HubCategoryPage 
      title="Serials & TV Shows" 
      subtitle="Trending Serials from Global Networks" 
      fetcher={(page) => tmdb.getTVShows(page)} 
    />
  );
}
