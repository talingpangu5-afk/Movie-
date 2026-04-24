'use client'

import { HubCategoryPage } from '@/components/HubCategoryPage';
import { tmdb } from '@/lib/tmdb';

export default function AlbumsPage() {
  return (
    <HubCategoryPage 
      title="Albums & Collections" 
      subtitle="Curated Media Albums and Cinematic Collections" 
      fetcher={(page) => tmdb.getPopular(page)} 
    />
  );
}
