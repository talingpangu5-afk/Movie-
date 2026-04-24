'use client'

import { HubCategoryPage } from '@/components/HubCategoryPage';
import { tmdb } from '@/lib/tmdb';

export default function TrailersPage() {
  return (
    <HubCategoryPage 
      title="Trailers" 
      subtitle="Upcoming Blockbuster Trailers & Teasers" 
      fetcher={(page) => tmdb.getUpcoming(page)} 
    />
  );
}
