import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Button,
  LinearProgress, Collapse, Chip,
} from '@mui/material';
import { MuiProvider } from './MuiProvider';

export interface Question {
  q: string;
  a: string;
  senior?: string;
}

interface QuizCardInnerProps {
  storageKey: string;
  questions: Question[];
}

function QuizCardInner({ storageKey, questions }: QuizCardInnerProps) {
  const [revealed, setRevealed] = useState<boolean[]>(() => {
    try {
      const saved = localStorage.getItem(`quiz-${storageKey}`);
      return saved ? JSON.parse(saved) : Array(questions.length).fill(false);
    } catch {
      return Array(questions.length).fill(false);
    }
  });

  const toggle = (i: number) => {
    const next = revealed.map((v, idx) => (idx === i ? !v : v));
    setRevealed(next);
    try {
      localStorage.setItem(`quiz-${storageKey}`, JSON.stringify(next));
    } catch {
      // ignore storage errors in private browsing
    }
  };

  const done = revealed.filter(Boolean).length;

  return (
    <Box sx={{ my: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Typography
          variant="caption"
          sx={{ color: 'text.secondary', fontFamily: '"IBM Plex Mono",monospace' }}
        >
          {done}/{questions.length} revealed
        </Typography>
        <LinearProgress
          variant="determinate"
          value={(done / questions.length) * 100}
          sx={{
            flex: 1, height: 4, borderRadius: 2,
            bgcolor: 'divider',
            '& .MuiLinearProgress-bar': { bgcolor: 'primary.main' },
          }}
        />
      </Box>

      {questions.map((item, i) => (
        <Card key={i} sx={{ mb: 1.5 }}>
          <CardContent sx={{ pb: '12px !important' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
              <Typography sx={{ fontWeight: 600, lineHeight: 1.5, flex: 1 }}>
                {item.q}
              </Typography>
              <Button
                size="small"
                variant={revealed[i] ? 'outlined' : 'contained'}
                onClick={() => toggle(i)}
                sx={{ minWidth: 80, flexShrink: 0 }}
              >
                {revealed[i] ? 'Hide' : 'Reveal'}
              </Button>
            </Box>

            <Collapse in={revealed[i]}>
              <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
                <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem', lineHeight: 1.65 }}>
                  {item.a}
                </Typography>
                {item.senior && (
                  <Box sx={{ mt: 1.5 }}>
                    <Chip
                      label="Senior answer"
                      size="small"
                      sx={{ mb: 0.75, bgcolor: 'primary.main', color: '#0C1018', fontWeight: 700 }}
                    />
                    <Typography sx={{ fontSize: '0.85rem', color: 'text.secondary', fontStyle: 'italic', lineHeight: 1.65 }}>
                      {item.senior}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Collapse>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export interface QuizCardProps {
  storageKey: string;
  questions: Question[];
}

export default function QuizCard(props: QuizCardProps) {
  return (
    <MuiProvider>
      <QuizCardInner {...props} />
    </MuiProvider>
  );
}
