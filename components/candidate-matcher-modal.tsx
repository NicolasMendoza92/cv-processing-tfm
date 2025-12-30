'use client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { CandidateMatchResponse } from '@/types';

export function CandidateMatchModal({
  open,
  onOpenChange,
  data,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: CandidateMatchResponse | null;
}) {
  if (!data) return null;

  const { summary, candidates } = data;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>Candidatos compatibles</DialogTitle>
        </DialogHeader>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mb-4 text-center">
          <div className="border rounded p-3">
            <p className="text-2xl font-bold">{summary.totalCandidates}</p>
            <p className="text-sm text-muted-foreground">Total candidatos</p>
          </div>
          <div className="border rounded p-3">
            <p className="text-2xl font-bold">{summary.matchedCandidates}</p>
            <p className="text-sm text-muted-foreground">Emparejados</p>
          </div>
          <div className="border rounded p-3">
            <p className="text-2xl font-bold">{(summary.bestMatchScore * 100).toFixed(0)}%</p>
            <p className="text-sm text-muted-foreground">Mejor match</p>
          </div>
        </div>

        {/* Lista top 5 */}
        <div className="space-y-3">
          {candidates.map(c => (
            <div key={c.id} className="border rounded p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-sm text-muted-foreground">{c.currentPosition}</p>
                </div>
                <p className="text-sm font-medium">{(c.matchScore * 100).toFixed(0)}% match</p>
              </div>
              {c.reasons.length > 0 && (
                <ul className="mt-2 text-xs text-muted-foreground list-disc pl-5">
                  {c.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}