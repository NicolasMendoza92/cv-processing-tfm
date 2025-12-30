'use client';
import { useEffect, useState } from 'react';
import { matchOffersAction } from '@/services/cvServices';
import type { CandidateDataExtended, MatchedOffer, OfferMatchSummary } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: CandidateDataExtended | null;
}

export function OfferMatcherModal({ open, onOpenChange, candidate }: Props) {
const [summary, setSummary] = useState<OfferMatchSummary | null>(null);
const [offers, setOffers] = useState<MatchedOffer[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!candidate) return;
    setLoading(true);
    matchOffersAction({
      name: candidate.name,
      email: candidate.email || '',
      phone: candidate.phone || '',
      experience: candidate.experience,
      education: candidate.education,
      skills: candidate.skills,
      languages: candidate.languages,
      summary: candidate.summary || undefined,
      raw_text: candidate.rawText || undefined,
    }).then(res => {
      if (res.success) {
        setSummary(res.summary || null);
        setOffers(res.offers || []);
      }
      setLoading(false);
    });
  }, [candidate]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ofertas recomendadas para {candidate?.name}</DialogTitle>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        )}

        {!loading && summary && (
          <div className="grid grid-cols-3 gap-4 mb-4 text-center">
            <div className="border rounded p-3">
              <p className="text-2xl font-bold">{summary.totalOffers}</p>
              <p className="text-sm text-muted-foreground">Total ofertas</p>
            </div>
            <div className="border rounded p-3">
              <p className="text-2xl font-bold">{summary.matchedOffers}</p>
              <p className="text-sm text-muted-foreground">Emparejadas</p>
            </div>
            <div className="border rounded p-3">
              <p className="text-2xl font-bold">{(summary.bestMatchScore * 100).toFixed(0)}%</p>
              <p className="text-sm text-muted-foreground">Mejor match</p>
            </div>
          </div>
        )}

        {!loading && offers.length === 0 && (
          <p className="text-center text-muted-foreground">No se encontraron ofertas compatibles.</p>
        )}

        {!loading && offers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {offers.map(offer => (
              <div key={offer.id} className="border rounded p-4">
                <h3 className="font-semibold">{offer.title}</h3>
                <p className="text-sm text-muted-foreground">{offer.company}</p>
                <p className="text-sm mt-2">Match: {(offer.matchScore * 100).toFixed(0)}%</p>
                {offer.reasons.length > 0 && (
                  <details className="mt-2 text-xs text-muted-foreground">
                    <summary className="cursor-pointer">Ver razones</summary>
                    <ul className="list-disc pl-4 mt-1">
                      {offer.reasons.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}