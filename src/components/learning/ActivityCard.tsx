import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import type { Lesson, LessonProgress } from '../../types';
import { LEARNING_BANDS } from '../../data/learningBands';

interface ActivityCardProps {
  lesson: Lesson;
  progress?: LessonProgress;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  lesson,
  progress,
}) => {
  const isCompleted = progress?.status === 'completed';
  const bandInfo = LEARNING_BANDS[lesson.learningBand];
  const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[lesson.icon] || Icons.BookOpen;

  return (
    <article
      className="group bg-white rounded-3xl border border-[#E8E8F0] p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:border-[#6558E8]/40 hover:-translate-y-0.5"
    >
      <div>
        {/* Top meta tags */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full text-[#17233C]"
              style={{ backgroundColor: bandInfo.accentBg }}
            >
              {bandInfo.name}
            </span>
            <span className="flex items-center gap-1 text-xs text-[#64748B] font-medium">
              <Clock className="w-3.5 h-3.5" />
              {lesson.durationMinutes} min
            </span>
          </div>

          {isCompleted && (
            <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#DDF7E8] text-[#065F46]">
              <CheckCircle2 className="w-3.5 h-3.5" /> Completed
            </span>
          )}
        </div>

        {/* Icon & Title */}
        <div className="flex items-start gap-3.5 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-[#DDF3FF] text-[#6558E8] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
            <IconComponent className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#17233C] group-hover:text-[#6558E8] transition-colors leading-snug font-['Nunito']">
              {lesson.title}
            </h3>
            {progress?.score !== undefined && isCompleted && (
              <span className="text-xs text-[#10B981] font-semibold">
                Score: {progress.score}%
              </span>
            )}
          </div>
        </div>

        {/* Summary */}
        <p className="text-sm text-[#64748B] leading-relaxed line-clamp-3 mb-6">
          {lesson.summary}
        </p>
      </div>

      {/* Action CTA */}
      <div className="pt-4 border-t border-[#E8E8F0] flex items-center justify-between">
        <span className="text-xs font-bold text-[#64748B]">
          {lesson.steps.length} interactive steps
        </span>

        <Link
          to={`/lessons/${lesson.id}`}
          className={`inline-flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl transition-all ${
            isCompleted
              ? 'bg-[#F8F7F2] text-[#17233C] hover:bg-[#E8E8F0]'
              : 'bg-[#6558E8] text-white hover:bg-[#5145CF]'
          }`}
        >
          <span>{isCompleted ? 'Play Again' : 'Start Lesson'}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );
};
