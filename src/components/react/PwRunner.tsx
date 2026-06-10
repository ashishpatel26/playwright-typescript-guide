import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Box, Button, Typography, CircularProgress,
} from '@mui/material';
import Editor from '@monaco-editor/react';
import { MuiProvider } from './MuiProvider';
import { tokens } from '../../theme/tokens';

const BASE = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : import.meta.env.BASE_URL + '/';

export interface PwStep {
  description: string;
  action: 'navigate' | 'fill' | 'click' | 'expect-visible' | 'expect-text' | 'show-page' | 'show-error';
  selector?: string;
  value?: string;
  shouldFail?: boolean;
  delayMs?: number;
}

export interface PwRunnerProps {
  starter: string;
  steps: PwStep[];
  mockPage?: string;
  height?: number;
  label?: string;
}

type StepStatus = 'pending' | 'running' | 'pass' | 'fail';
interface StepState { status: StepStatus; error?: string; }

const STEP_DELAY = 500;

function PwRunnerInner({
  starter, steps, mockPage = 'login.html', height = 280, label = 'PwRunner — Simulation',
}: PwRunnerProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const runningRef = useRef(false);
  const resolveRef = useRef<((ok: boolean, err?: string) => void) | null>(null);
  const [stepStates, setStepStates] = useState<StepState[]>(() =>
    steps.map(() => ({ status: 'pending' as StepStatus }))
  );
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  const src = `${BASE}practice-pages/${mockPage}`;

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      // Only accept messages from our own mock-page iframe
      if (e.source !== iframeRef.current?.contentWindow) return;
      if (e.data?.type !== 'pw-step-result') return;
      resolveRef.current?.(e.data.ok === true, e.data.error);
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  const sendStep = useCallback((step: PwStep): Promise<{ ok: boolean; error?: string }> => {
    return new Promise(resolve => {
      resolveRef.current = (ok, error) => {
        resolveRef.current = null;
        resolve({ ok, error });
      };
      iframeRef.current?.contentWindow?.postMessage({
        type: 'pw-step',
        action: step.action,
        selector: step.selector ?? '',
        value: step.value ?? '',
      }, '*');
      // 3s timeout per step
      setTimeout(() => {
        if (resolveRef.current) {
          resolveRef.current = null;
          resolve({ ok: false, error: 'Step timed out after 3s' });
        }
      }, 3000);
    });
  }, []);

  const pause = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

  const run = useCallback(async () => {
    if (runningRef.current) return;
    runningRef.current = true;
    setRunning(true);
    setDone(false);
    setStepStates(steps.map(() => ({ status: 'pending' })));
    setIframeKey(k => k + 1); // reload iframe to reset state

    await pause(700); // wait for iframe reload

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];

      setStepStates(prev =>
        prev.map((s, idx) => idx === i ? { status: 'running' } : s)
      );

      await pause(step.delayMs ?? STEP_DELAY);

      const { ok, error } = await sendStep(step);
      const passed = step.shouldFail ? !ok : ok;

      setStepStates(prev =>
        prev.map((s, idx) => idx === i ? { status: passed ? 'pass' : 'fail', error } : s)
      );

      if (!passed && !step.shouldFail) break; // stop on unexpected failure
    }

    setRunning(false);
    setDone(true);
    runningRef.current = false;
  }, [steps, sendStep]);

  const reset = () => {
    if (runningRef.current) return;
    setStepStates(steps.map(() => ({ status: 'pending' })));
    setDone(false);
    setIframeKey(k => k + 1);
  };

  const statusIcon: Record<StepStatus, string> = {
    pending: '○', running: '●', pass: '✓', fail: '✕',
  };
  const statusColor: Record<StepStatus, string> = {
    pending: tokens.faint, running: tokens.blue, pass: tokens.green, fail: tokens.emberSoft,
  };

  const passCount = stepStates.filter(s => s.status === 'pass').length;
  const failCount = stepStates.filter(s => s.status === 'fail').length;

  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden', my: 2.5 }}>
      {/* Toolbar */}
      <Box sx={{
        display: 'flex', alignItems: 'center', px: 2, py: 0.75,
        bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', gap: 1,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mr: 1 }}>
          {(['#FF5F57', '#FFBD2E', '#28C840'] as const).map(c => (
            <Box key={c} sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: c }} />
          ))}
        </Box>
        <Typography sx={{ fontFamily: '"IBM Plex Mono",monospace', fontSize: 12, color: 'text.secondary', flex: 1 }}>
          {label}
        </Typography>
        <Typography sx={{ fontFamily: '"IBM Plex Mono",monospace', fontSize: 11, color: tokens.faint, mr: 1 }}>
          ⚠ simulation
        </Typography>
        {done && (
          <Button size="small" variant="outlined" onClick={reset} sx={{ fontSize: 11, height: 26, mr: 0.5 }}>
            Reset
          </Button>
        )}
        <Button
          size="small"
          variant="contained"
          onClick={run}
          disabled={running}
          startIcon={running ? <CircularProgress size={12} color="inherit" /> : undefined}
          sx={{ fontSize: 12, height: 28 }}
        >
          {running ? 'Running…' : '▶ Run'}
        </Button>
      </Box>

      {/* Split: editor left, mock page right */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 320px', height }}>
        {/* Monaco editor */}
        <Box sx={{ borderRight: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
          <Editor
            height={height}
            defaultLanguage="typescript"
            defaultValue={starter}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 12,
              fontFamily: '"IBM Plex Mono",ui-monospace,Menlo,monospace',
              readOnly: running,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              padding: { top: 8, bottom: 8 },
              renderLineHighlight: 'none',
            }}
          />
        </Box>

        {/* Mock page iframe */}
        <Box sx={{ bgcolor: '#fff', overflow: 'hidden' }}>
          <iframe
            key={iframeKey}
            ref={iframeRef}
            src={src}
            title="mock page"
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          />
        </Box>
      </Box>

      {/* Step timeline */}
      <Box sx={{
        bgcolor: '#0A0E15', borderTop: '1px solid', borderColor: 'divider',
        px: 2, py: 1.5,
      }}>
        {done && (
          <Box sx={{ mb: 1 }}>
            <Typography sx={{
              fontFamily: '"IBM Plex Mono",monospace', fontSize: 12,
              color: failCount === 0 ? tokens.green : tokens.emberSoft,
            }}>
              {failCount === 0
                ? `✓ All ${passCount} steps passed`
                : `✕ ${failCount} step${failCount !== 1 ? 's' : ''} failed`}
            </Typography>
          </Box>
        )}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {steps.map((step, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
              <Box sx={{
                fontFamily: '"IBM Plex Mono",monospace', fontSize: 13,
                color: statusColor[stepStates[i].status], minWidth: 16, mt: '1px',
                display: 'flex', alignItems: 'center',
              }}>
                {stepStates[i].status === 'running'
                  ? <CircularProgress size={11} sx={{ color: tokens.blue }} />
                  : statusIcon[stepStates[i].status]}
              </Box>
              <Box>
                <Typography sx={{
                  fontFamily: '"IBM Plex Mono",monospace', fontSize: 12,
                  color: stepStates[i].status === 'pending' ? tokens.faint : tokens.ink,
                }}>
                  {step.description}
                </Typography>
                {stepStates[i].error && (
                  <Typography sx={{ fontFamily: '"IBM Plex Mono",monospace', fontSize: 11, color: tokens.emberSoft }}>
                    {stepStates[i].error}
                  </Typography>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default function PwRunner(props: PwRunnerProps) {
  return (
    <MuiProvider>
      <PwRunnerInner {...props} />
    </MuiProvider>
  );
}
