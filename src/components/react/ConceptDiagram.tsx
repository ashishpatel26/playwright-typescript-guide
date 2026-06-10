import React from 'react';
import { Box } from '@mui/material';
import { MuiProvider } from './MuiProvider';
import { tokens } from '../../theme/tokens';

// ── Testing Pyramid ──────────────────────────────────────────────────────────
function TestingPyramid() {
  return (
    <svg viewBox="0 0 520 260" style={{ width: '100%', maxWidth: 520, display: 'block', margin: '0 auto' }}>
      {/* E2E — top */}
      <polygon points="260,18 330,100 190,100" fill={tokens.ember} opacity="0.92" />
      <text x="260" y="65" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700">E2E</text>
      {/* Integration — middle */}
      <polygon points="190,110 330,110 375,185 145,185" fill={tokens.violet} opacity="0.88" />
      <text x="260" y="155" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700">Integration</text>
      {/* Unit — bottom */}
      <polygon points="145,195 375,195 420,255 100,255" fill={tokens.blue} opacity="0.85" />
      <text x="260" y="233" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="700">Unit</text>
      {/* Right labels */}
      <text x="342" y="62" fill={tokens.muted} fontSize="11">few · slow · expensive</text>
      <text x="388" y="155" fill={tokens.muted} fontSize="11">some · medium</text>
      <text x="432" y="233" fill={tokens.muted} fontSize="11">many · fast · cheap</text>
      {/* Left labels */}
      <text x="178" y="62" fill={tokens.muted} fontSize="11" textAnchor="end">high confidence</text>
      <text x="130" y="155" fill={tokens.muted} fontSize="11" textAnchor="end">medium confidence</text>
      <text x="88" y="233" fill={tokens.muted} fontSize="11" textAnchor="end">low confidence</text>
    </svg>
  );
}

// ── Browser Hierarchy ─────────────────────────────────────────────────────────
function BrowserHierarchy() {
  const BOX_W = 140, BOX_H = 36, RX = 8;
  type NodeDef = { x: number; y: number; label: string; color: string };
  const nodes: NodeDef[] = [
    { x: 190, y: 20,  label: 'Browser',         color: tokens.ember },
    { x: 90,  y: 110, label: 'BrowserContext',   color: tokens.violet },
    { x: 290, y: 110, label: 'BrowserContext',   color: tokens.violet },
    { x: 30,  y: 200, label: 'Page',             color: tokens.blue },
    { x: 170, y: 200, label: 'Page',             color: tokens.blue },
    { x: 310, y: 200, label: 'Page',             color: tokens.blue },
  ];
  const edges = [[0,1],[0,2],[1,3],[1,4],[2,5]] as const;
  return (
    <svg viewBox="0 0 520 260" style={{ width: '100%', maxWidth: 520, display: 'block', margin: '0 auto' }}>
      {edges.map(([p, c], i) => {
        const px = nodes[p].x + BOX_W / 2;
        const py = nodes[p].y + BOX_H;
        const cx = nodes[c].x + BOX_W / 2;
        const cy = nodes[c].y;
        return (
          <line key={i} x1={px} y1={py} x2={cx} y2={cy}
            stroke={tokens.line} strokeWidth="1.5" />
        );
      })}
      {nodes.map((n, i) => (
        <g key={i} transform={`translate(${n.x},${n.y})`}>
          <rect width={BOX_W} height={BOX_H} rx={RX}
            fill={tokens.panel} stroke={n.color} strokeWidth="1.5" />
          <text x={BOX_W / 2} y={BOX_H / 2 + 5} textAnchor="middle"
            fill={n.color} fontSize="12" fontWeight="600" fontFamily="monospace">
            {n.label}
          </text>
        </g>
      ))}
      <text x="260" y="252" textAnchor="middle" fill={tokens.faint} fontSize="11">
        Each BrowserContext is isolated — cookies, storage, auth state
      </text>
    </svg>
  );
}

// ── Retry Timeline ───────────────────────────────────────────────────────────
function RetryTimeline() {
  type EventDef = { x: number; label: string; sub: string; color: string; icon: string };
  const events: EventDef[] = [
    { x: 60,  label: 'Attempt 1', sub: 'run test',       color: tokens.blue,    icon: '▶' },
    { x: 175, label: 'FAIL',      sub: 'locator timeout', color: tokens.ember,   icon: '✕' },
    { x: 270, label: 'Wait',      sub: '500ms backoff',  color: tokens.amber,   icon: '⏱' },
    { x: 360, label: 'Attempt 2', sub: 'run test',       color: tokens.blue,    icon: '▶' },
    { x: 460, label: 'PASS',      sub: 'element found',  color: tokens.green,   icon: '✓' },
  ];
  return (
    <svg viewBox="0 0 520 120" style={{ width: '100%', maxWidth: 520, display: 'block', margin: '0 auto' }}>
      <line x1="40" y1="55" x2="490" y2="55" stroke={tokens.line} strokeWidth="2" />
      <polygon points="490,50 500,55 490,60" fill={tokens.line} />
      {events.map((e, i) => (
        <g key={i} transform={`translate(${e.x},0)`}>
          <circle cx="0" cy="55" r="14" fill={tokens.panel} stroke={e.color} strokeWidth="2" />
          <text x="0" y="60" textAnchor="middle" fill={e.color} fontSize="13" fontWeight="700">{e.icon}</text>
          <text x="0" y="88" textAnchor="middle" fill={tokens.ink} fontSize="11" fontWeight="600">{e.label}</text>
          <text x="0" y="102" textAnchor="middle" fill={tokens.muted} fontSize="10">{e.sub}</text>
        </g>
      ))}
    </svg>
  );
}

// ── Public component ──────────────────────────────────────────────────────────
export type DiagramType = 'testing-pyramid' | 'browser-hierarchy' | 'retry-timeline';

export interface ConceptDiagramProps {
  type: DiagramType;
}

function ConceptDiagramInner({ type }: ConceptDiagramProps) {
  return (
    <Box sx={{ py: 2, px: 1 }}>
      {type === 'testing-pyramid' && <TestingPyramid />}
      {type === 'browser-hierarchy' && <BrowserHierarchy />}
      {type === 'retry-timeline' && <RetryTimeline />}
    </Box>
  );
}

export default function ConceptDiagram(props: ConceptDiagramProps) {
  return (
    <MuiProvider>
      <ConceptDiagramInner {...props} />
    </MuiProvider>
  );
}
