import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Box, Typography, TextField, Select, MenuItem,
  FormControl, InputLabel, Chip, Alert,
} from '@mui/material';
import { MuiProvider } from './MuiProvider';
import { tokens } from '../../theme/tokens';

const BASE = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : import.meta.env.BASE_URL + '/';

type LocatorKind = 'getByRole' | 'getByText' | 'getByLabel' | 'getByTestId' | 'css' | 'xpath';

const KINDS: { value: LocatorKind; label: string }[] = [
  { value: 'getByRole',   label: 'getByRole' },
  { value: 'getByText',   label: 'getByText' },
  { value: 'getByLabel',  label: 'getByLabel' },
  { value: 'getByTestId', label: 'getByTestId' },
  { value: 'css',         label: 'CSS' },
  { value: 'xpath',       label: 'XPath' },
];

const PLACEHOLDERS: Record<LocatorKind, string> = {
  getByRole:   'e.g. button',
  getByText:   'e.g. Login',
  getByLabel:  'e.g. Username',
  getByTestId: 'e.g. login-button',
  css:         'e.g. .login-btn',
  xpath:       'e.g. //button[@type="submit"]',
};

export interface LocatorLabProps {
  page?: string;
  height?: number;
}

function LocatorLabInner({ page = 'login.html', height = 400 }: LocatorLabProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [kind, setKind] = useState<LocatorKind>('getByRole');
  const [value, setValue] = useState('');
  const [name, setName] = useState('');
  const [count, setCount] = useState<number | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [iframeReady, setIframeReady] = useState(false);

  const src = `${BASE}practice-pages/${page}`;

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      // Only accept messages from our own practice-page iframe
      if (e.source !== iframeRef.current?.contentWindow) return;
      if (e.data?.type !== 'pw-result') return;
      setCount(typeof e.data.count === 'number' ? e.data.count : null);
      setQueryError(e.data.error ?? null);
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  // Clear pending debounce on unmount
  useEffect(() => () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, []);

  const sendQuery = useCallback((k: LocatorKind, v: string, n: string) => {
    if (!iframeRef.current?.contentWindow || !v.trim()) {
      setCount(null);
      setQueryError(null);
      return;
    }
    iframeRef.current.contentWindow.postMessage(
      { type: 'pw-query', kind: k, value: v.trim(), name: n.trim() },
      window.location.origin,
    );
  }, []);

  const schedule = useCallback((k: LocatorKind, v: string, n: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => sendQuery(k, v, n), 300);
  }, [sendQuery]);

  const handleKindChange = (k: LocatorKind) => {
    setKind(k);
    setCount(null);
    setQueryError(null);
    schedule(k, value, name);
  };

  const handleValueChange = (v: string) => {
    setValue(v);
    schedule(kind, v, name);
  };

  const handleNameChange = (n: string) => {
    setName(n);
    schedule(kind, value, n);
  };

  const badgeColor = count === null ? tokens.faint
    : count === 0 ? tokens.emberSoft
    : count === 1 ? tokens.green
    : tokens.amber;

  const badgeLabel = count === null ? '' : `${count} match${count !== 1 ? 'es' : ''}`;

  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden', my: 2.5 }}>
      {/* Header bar */}
      <Box sx={{
        px: 2, py: 1, bgcolor: 'background.paper',
        borderBottom: '1px solid', borderColor: 'divider',
        display: 'flex', alignItems: 'center', gap: 1,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mr: 1 }}>
          {(['#FF5F57', '#FFBD2E', '#28C840'] as const).map(c => (
            <Box key={c} sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: c }} />
          ))}
        </Box>
        <Typography sx={{ fontFamily: '"IBM Plex Mono",monospace', fontSize: 12, color: 'text.secondary', flex: 1 }}>
          LocatorLab — {page}
        </Typography>
        {count !== null && (
          <Chip
            label={badgeLabel}
            size="small"
            sx={{
              bgcolor: badgeColor + '22', color: badgeColor,
              fontFamily: '"IBM Plex Mono",monospace', fontSize: 11, fontWeight: 700,
            }}
          />
        )}
      </Box>

      {/* Split view */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 300px', height }}>
        {/* Left: iframe */}
        <Box sx={{ borderRight: '1px solid', borderColor: 'divider', bgcolor: '#fff' }}>
          <iframe
            ref={iframeRef}
            src={src}
            title="practice page"
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
            onLoad={() => setIframeReady(true)}
          />
        </Box>

        {/* Right: controls */}
        <Box sx={{
          p: 2, bgcolor: 'background.paper',
          display: 'flex', flexDirection: 'column', gap: 2,
          overflowY: 'auto',
        }}>
          <Typography variant="caption" sx={{
            color: 'text.secondary', fontFamily: '"IBM Plex Mono",monospace',
            textTransform: 'uppercase', letterSpacing: '.1em',
          }}>
            Locator
          </Typography>

          <FormControl size="small" fullWidth>
            <InputLabel id="locator-kind-label">Type</InputLabel>
            <Select
              labelId="locator-kind-label"
              value={kind}
              label="Type"
              onChange={e => handleKindChange(e.target.value as LocatorKind)}
            >
              {KINDS.map(k => (
                <MenuItem
                  key={k.value}
                  value={k.value}
                  sx={{ fontFamily: '"IBM Plex Mono",monospace', fontSize: 13 }}
                >
                  {k.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            size="small"
            fullWidth
            label={kind === 'getByRole' ? 'Role' : 'Value'}
            placeholder={PLACEHOLDERS[kind]}
            value={value}
            onChange={e => handleValueChange(e.target.value)}
            disabled={!iframeReady}
            inputProps={{ style: { fontFamily: '"IBM Plex Mono",monospace', fontSize: 13 } }}
          />

          {kind === 'getByRole' && (
            <TextField
              size="small"
              fullWidth
              label="name (optional)"
              placeholder='e.g. Login'
              value={name}
              onChange={e => handleNameChange(e.target.value)}
              disabled={!iframeReady}
              inputProps={{ style: { fontFamily: '"IBM Plex Mono",monospace', fontSize: 13 } }}
            />
          )}

          {queryError && (
            <Alert severity="error" sx={{ fontSize: 12, '& .MuiAlert-message': { fontFamily: '"IBM Plex Mono",monospace', wordBreak: 'break-all' } }}>
              {queryError}
            </Alert>
          )}

          {!queryError && count !== null && count > 1 && (
            <Alert severity="warning" sx={{ fontSize: 12 }}>
              Strict mode: {count} matches would throw. Narrow with <code>filter()</code> or <code>nth()</code>.
            </Alert>
          )}

          {!queryError && count === 0 && (
            <Alert severity="error" sx={{ fontSize: 12 }}>
              No elements matched.
            </Alert>
          )}

          {!queryError && count === 1 && (
            <Alert severity="success" sx={{ fontSize: 12 }}>
              Strict mode: exactly 1 match ✓
            </Alert>
          )}

          <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: 11, lineHeight: 1.7, display: 'block' }}>
              Matches highlight in orange. Playwright locators auto-wait and must resolve to exactly 1 element in strict mode.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default function LocatorLab(props: LocatorLabProps) {
  return (
    <MuiProvider>
      <LocatorLabInner {...props} />
    </MuiProvider>
  );
}
