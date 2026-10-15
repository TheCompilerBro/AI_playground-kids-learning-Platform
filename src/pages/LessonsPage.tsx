import React, { useState, useMemo } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { ActivityCard } from '../components/learning/ActivityCard';
import { EmptyState } from '../components/ui/EmptyState';
import { LESSONS } from '../data/lessons';
import { useProgress } from '../hooks/useProgress';
import { BookOpen, Search } from 'lucide-react';

export const LessonsPage: React.FC = () => {
  const { progress } = useProgress();
  const [selectedBandFilter, setSelectedBandFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLessons = useMemo(() => {
    return LESSONS.filter((lesson) => {
      const matchesBand = selectedBandFilter === 'all' || lesson.learningBand === selectedBandFilter;
      const matchesSearch =
        searchQuery.trim() === '' ||
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesBand && matchesSearch;
    });
  }, [selectedBandFilter, searchQuery]);

  return (
    <PageContainer size="default">
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-white rounded-3xl border border-[#E8E8F0] p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#6558E8] bg-[#DDF3FF] px-3 py-1 rounded-full flex items-center gap-1.5 w-fit">
                <BookOpen className="w-3.5 h-3.5" /> Interactive Lessons
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#17233C] font-['Nunito']">
                Lesson Library
              </h1>
              <p className="text-sm sm:text-base text-[#64748B]">
                Explore short, engaging lessons packed with interactive sorting, pattern finding, and machine learning games.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search lessons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E8E8F0] text-sm text-[#17233C] focus:border-[#6558E8] focus:outline-none"
              />
            </div>
          </div>

          {/* Band Filter Pills */}
          <div className="mt-6 pt-6 border-t border-[#E8E8F0] flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-[#17233C] uppercase tracking-wide mr-2">
              Filter by Level:
            </span>
            <button
              onClick={() => setSelectedBandFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                selectedBandFilter === 'all'
                  ? 'bg-[#6558E8] text-white border-[#6558E8]'
                  : 'bg-[#F8F7F2] text-[#64748B] border-[#E8E8F0] hover:bg-[#E8E8F0]'
              }`}
            >
              All Levels ({LESSONS.length})
            </button>
            <button
              onClick={() => setSelectedBandFilter('explorer')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                selectedBandFilter === 'explorer'
                  ? 'bg-[#6558E8] text-white border-[#6558E8]'
                  : 'bg-[#F8F7F2] text-[#64748B] border-[#E8E8F0] hover:bg-[#E8E8F0]'
              }`}
            >
              AI Explorer (5–6)
            </button>
            <button
              onClick={() => setSelectedBandFilter('detective')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                selectedBandFilter === 'detective'
                  ? 'bg-[#6558E8] text-white border-[#6558E8]'
                  : 'bg-[#F8F7F2] text-[#64748B] border-[#E8E8F0] hover:bg-[#E8E8F0]'
              }`}
            >
              AI Detective (7–8)
            </button>
            <button
              onClick={() => setSelectedBandFilter('creator')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                selectedBandFilter === 'creator'
                  ? 'bg-[#6558E8] text-white border-[#6558E8]'
                  : 'bg-[#F8F7F2] text-[#64748B] border-[#E8E8F0] hover:bg-[#E8E8F0]'
              }`}
            >
              AI Creator (9–10)
            </button>
          </div>
        </div>

        {/* Lesson Cards Grid or Empty State */}
        {filteredLessons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons.map((lesson) => (
              <ActivityCard
                key={lesson.id}
                lesson={lesson}
                progress={progress.lessonProgress[lesson.id]}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No lessons found"
            description="Try clearing your search query or picking a different level filter above."
            actionLabel="Show All Lessons"
            onAction={() => {
              setSelectedBandFilter('all');
              setSearchQuery('');
            }}
          />
        )}
      </div>
    </PageContainer>
  );
};
