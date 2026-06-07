import { useEffect, useState } from 'react';
import { type FormSubmission } from '@/store/submissionsSlice';
import { Row } from './Row';

interface Props {
  submission: FormSubmission;
  isNew: boolean;
}

export function SubmissionCard({ submission, isNew }: Props) {
  const [highlight, setHighlight] = useState(isNew);

  useEffect(() => {
    if (!isNew) return;
    const t = setTimeout(() => setHighlight(false), 2500);
    return () => clearTimeout(t);
  }, [isNew]);

  return (
    <div
      className={`
        rounded-2xl p-5
        border transition-all duration-700
        bg-[#111111]
        ${
          highlight
            ? 'border-indigo-500/60 shadow-[0_0_24px_rgba(99,102,241,0.15)]'
            : 'border-white/[0.06]'
        }
      `}
    >
      <div className="flex gap-4 items-start">
        {submission.image ? (
          <img
            src={submission.image}
            alt={submission.name}
            className="h-20 w-20 rounded-xl object-cover border border-white/10 shrink-0"
          />
        ) : (
          <div className="h-20 w-20 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
            <span className="text-2xl text-white/20">
              {submission.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <div className="flex flex-col gap-2 min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base font-medium text-white">
              {submission.name}
            </span>
            {highlight && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                new
              </span>
            )}
          </div>
          <Row label="Age" value={String(submission.age)} />
          <Row label="Email" value={submission.email} />
          <Row label="Gender" value={submission.gender} />
          <Row label="Country" value={submission.country} />
          <Row
            label="Terms"
            value={submission.terms ? 'Accepted' : 'Declined'}
          />
        </div>
      </div>
    </div>
  );
}
