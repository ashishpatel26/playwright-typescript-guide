import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Box, Button, Typography, CircularProgress,
} from '@mui/material';
import Editor from '@monaco-editor/react';
import type * as MonacoNS from 'monaco-editor';
import { MuiProvider } from './MuiProvider';
import { tokens } from '../../theme/tokens';

const SANDBOX_DOC = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><script>
window.addEventListener('message', function(e) {
  if (!e.data || e.data.type !== 'run') return;
  var origLog = console.log, origError = console.error, origWarn = console.warn;
  console.log = function() {
    var t = Array.from(arguments).map(function(a){return typeof a==='object'?JSON.stringify(a,null,2):String(a);}).join(' ');
    parent.postMessage({type:'output',kind:'log',text:t},'*');
    origLog.apply(console,arguments);
  };
  console.error = function() {
    var t = Array.from(arguments).map(String).join(' ');
    parent.postMessage({type:'output',kind:'error',text:t},'*');
    origError.apply(console,arguments);
  };
  console.warn = function() {
    var t = Array.from(arguments).map(String).join(' ');
    parent.postMessage({type:'output',kind:'warn',text:t},'*');
    origWarn.apply(console,arguments);
  };
  try { eval(e.data.code); }
  catch(err) { parent.postMessage({type:'output',kind:'error',text:err.message},'*'); }
  parent.postMessage({type:'done'},'*');
});
<\/script></body></html>`;

interface OutputLine { kind: 'log' | 'error' | 'warn'; text: string; }

export interface TsPlaygroundProps {
  starter: string;
  height?: number;
  label?: string;
}

function TsPlaygroundInner({ starter, height = 260, label = 'TypeScript Playground' }: TsPlaygroundProps) {
  const editorRef = useRef<MonacoNS.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof MonacoNS | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [output, setOutput] = useState<OutputLine[]>([]);
  const [running, setRunning] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      // Only accept messages from our own sandbox iframe
      if (e.source !== iframeRef.current?.contentWindow) return;
      if (e.data?.type === 'output') {
        setOutput(prev => [...prev, { kind: e.data.kind, text: e.data.text }]);
      } else if (e.data?.type === 'done') {
        setRunning(false);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  const run = useCallback(async () => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco || !iframeRef.current) return;

    setOutput([]);
    setRunning(true);

    try {
      const model = editor.getModel();
      if (!model) { setRunning(false); return; }

      const uriStr = model.uri.toString();
      const getWorker = await monaco.languages.typescript.getTypeScriptWorker();
      const client = await getWorker(model.uri);
      const emit = await client.getEmitOutput(uriStr);
      const js = emit.outputFiles[0]?.text ?? '';

      if (!js.trim()) {
        setOutput([{ kind: 'error', text: 'Transpile produced no output — fix TypeScript errors first.' }]);
        setRunning(false);
        return;
      }

      iframeRef.current.contentWindow?.postMessage({ type: 'run', code: js }, '*');
    } catch (err: unknown) {
      setOutput([{ kind: 'error', text: err instanceof Error ? err.message : String(err) }]);
      setRunning(false);
    }
  }, []);

  const kindColor: Record<string, string> = {
    log: tokens.green,
    error: tokens.emberSoft,
    warn: tokens.amber,
  };
  const kindIcon: Record<string, string> = { log: '›', error: '✗', warn: '⚠' };

  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden', my: 2.5 }}>
      <Box sx={{
        display: 'flex', alignItems: 'center', px: 2, py: 0.75,
        bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mr: 1 }}>
          {(['#FF5F57', '#FFBD2E', '#28C840'] as const).map(c => (
            <Box key={c} sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: c }} />
          ))}
        </Box>
        <Typography sx={{ fontFamily: '"IBM Plex Mono",monospace', fontSize: 12, color: 'text.secondary', flex: 1 }}>
          {label}
        </Typography>
        <Button
          size="small"
          variant="contained"
          onClick={run}
          disabled={running || !ready}
          startIcon={running ? <CircularProgress size={12} color="inherit" /> : undefined}
          sx={{ fontSize: 12, height: 28 }}
        >
          {running ? 'Running…' : '▶ Run'}
        </Button>
      </Box>

      <Editor
        height={height}
        defaultLanguage="typescript"
        defaultValue={starter}
        theme="vs-dark"
        onMount={(editor, monaco) => {
          editorRef.current = editor;
          monacoRef.current = monaco;
          monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
            target: monaco.languages.typescript.ScriptTarget.ES2020,
            module: monaco.languages.typescript.ModuleKind.None,
            strict: true,
            noEmit: false,
          });
          setReady(true);
        }}
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          fontFamily: '"IBM Plex Mono",ui-monospace,Menlo,monospace',
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          padding: { top: 10, bottom: 10 },
          renderLineHighlight: 'none',
        }}
      />

      <iframe
        ref={iframeRef}
        sandbox="allow-scripts"
        srcDoc={SANDBOX_DOC}
        title="ts-sandbox"
        style={{ display: 'none' }}
      />

      {(output.length > 0 || running) && (
        <Box sx={{
          bgcolor: '#0A0E15', borderTop: '1px solid', borderColor: 'divider',
          px: 2, py: 1.25, maxHeight: 180, overflowY: 'auto',
          fontFamily: '"IBM Plex Mono",monospace', fontSize: 13, lineHeight: 1.9,
        }}>
          {output.length === 0 && running && (
            <Box sx={{ color: 'text.secondary' }}>Running…</Box>
          )}
          {output.map((line, i) => (
            <Box key={i} sx={{ color: kindColor[line.kind] ?? tokens.ink }}>
              <Box component="span" sx={{ color: tokens.faint, mr: 1.5 }}>{kindIcon[line.kind]}</Box>
              {line.text}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default function TsPlayground(props: TsPlaygroundProps) {
  return (
    <MuiProvider>
      <TsPlaygroundInner {...props} />
    </MuiProvider>
  );
}
