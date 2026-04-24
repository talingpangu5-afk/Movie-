'use client'

import { HubCategoryPage } from '@/components/HubCategoryPage';
import { tmdb } from '@/lib/tmdb';

export default function ActionPage() {
  return (
    <HubCategoryPage 
      title="Action Movies" 
      subtitle="High-Octane Cinematic Action" 
      fetcher={(page) => tmdb.getByGenre(28, page)} 
    />
  );
}
