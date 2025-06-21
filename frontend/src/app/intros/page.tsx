'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { IntrosHeader } from '@/components/intros-header'
import { IntroCard } from '@/components/intro-card'
import { IntrosFooter } from '@/components/intros-footer'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import Image from 'next/image'

const mockIntros = [
  {
    id: 1,
    industry: 'FinTech',
    company: 'Qonto',
    description: 'Has strong relationship with the Head of Sales at ACME.',
    avatar: '/images/avatar1.png',
    type: 'suggested' as const,
    credits: 5,
    category: 'Internal Influence' as const
  },
  {
    id: 2,
    industry: 'SaaS',
    company: 'Swile',
    description: 'Know the decision makers in the Product team at Swile.',
    avatar: '/images/avatar2.png',
    type: 'received' as const,
    credits: 3,
    category: 'Internal Stakes' as const
  },
  {
    id: 3,
    industry: 'EdTech',
    company: 'Notion',
    description: 'Familiar with their product development process and key stakeholders.',
    avatar: '/images/avatar1.png',
    type: 'requested' as const,
    credits: 4,
    category: 'Internal Stakes' as const
  }
]

export default function IntrosPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'suggested' | 'received' | 'requested' | 'accepted'>('suggested');
  const [allIntros, setAllIntros] = useState(mockIntros);
  const [displayedIntros, setDisplayedIntros] = useState(mockIntros);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Pas connecté, rediriger vers login
        router.push('/login');
      }
      // Si l'utilisateur est connecté, on l'affiche directement
      // Pas de vérification d'email nécessaire pour un login normal
    }
  }, [user, loading, router]);

  // Recherche et filtrage en temps réel
  useEffect(() => {
    let filtered = allIntros;

    // Filtrage par type
    if (filterType !== 'all') {
      filtered = filtered.filter(intro => intro.type === filterType);
    }

    // Filtrage par recherche
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(intro => 
        intro.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        intro.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        intro.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setDisplayedIntros(filtered);
  }, [searchQuery, filterType, allIntros]);

  // Suppression d'une carte
  const handleRemoveIntro = (id: number) => {
    setAllIntros(prev => prev.filter(intro => intro.id !== id));
  };

  // Changement du statut d'une intro
  const handleStatusChange = (id: number, newType: 'suggested' | 'received' | 'requested' | 'accepted') => {
    setAllIntros(prev => 
      prev.map(intro => 
        intro.id === id ? { ...intro, type: newType } : intro
      )
    );
  };

  // Afficher un loading pendant la vérification
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Ne pas afficher le contenu si l'utilisateur n'est pas connecté
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-muted to-background flex flex-col">
      <IntrosHeader />
      
      <main className="flex-1 pt-12">
        <div className="mx-auto max-w-6xl px-6 py-8 min-h-full">
          {/* Grid container with 12 columns */}
          <div className="grid grid-cols-12 gap-6">
            {/* Content area - 8 columns on desktop, full width on mobile */}
            <div className="col-span-12 lg:col-span-8 lg:col-start-3">
              {/* Header section */}
              <div className="mb-6">
                <div className="mb-4">
                  <h1 className="text-xl font-semibold text-gray-900">Intros</h1>
                </div>
                
                {/* Search bar and filter selector on same line */}
                <div className="flex items-center justify-between">
                  {/* Search bar */}
                  <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search intros"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 h-8 text-sm bg-white focus:border-blue-500 focus:ring-blue-500"
                      style={{ border: '1px solid #E6E6E6' }}
                    />
                  </div>
                  
                  {/* Filter selector */}
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setFilterType('suggested')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                        filterType === 'suggested' 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Suggested
                    </button>
                    <button
                      onClick={() => setFilterType('received')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                        filterType === 'received' 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Received
                    </button>
                    <button
                      onClick={() => setFilterType('requested')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                        filterType === 'requested' 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Requested
                    </button>
                    <button
                      onClick={() => setFilterType('accepted')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                        filterType === 'accepted' 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Accepted
                    </button>
                    <button
                      onClick={() => setFilterType('all')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                        filterType === 'all' 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      All
                    </button>
                  </div>
                </div>
              </div>

              {/* Intro cards or empty state */}
              <div className="space-y-4 pb-16">
                {displayedIntros.length > 0 ? (
                  displayedIntros.map((intro) => (
                    <IntroCard 
                      key={intro.id} 
                      intro={intro} 
                      onRemove={() => handleRemoveIntro(intro.id)}
                      onStatusChange={handleStatusChange}
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Image
                      src="/images/emptystate.png"
                      alt="No intros found"
                      width={120}
                      height={120}
                      className="mx-auto mb-4"
                    />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No intros found
                    </h3>
                    <p className="text-sm text-gray-500">
                      Try adjusting your search or check back later for new matches.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <IntrosFooter />
    </div>
  )
} 