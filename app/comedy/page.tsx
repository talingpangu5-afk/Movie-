'use client'

import { HubCategoryPage } from '@/components/HubCategoryPage';
import { tmdb } from '@/lib/tmdb';

export default function ComedyPage() {
  return (
    <HubCategoryPage 
      title="Comedy Details" 
      subtitle="The Ultimate Comedy Collection & More" 
      fetcher={(page) => tmdb.getByGenre(35, page)} 
    />
  );
}
