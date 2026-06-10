export const tokens = {
  bg: '#0C1018',
  panel: '#121927',
  panel2: '#0F1520',
  line: '#202B3D',
  ink: '#E8EDF5',
  muted: '#8A96A8',
  faint: '#5A6678',
  ember: '#F05133',
  emberSoft: '#FF7B5C',
  blue: '#6BB5FF',
  amber: '#FFB454',
  green: '#7EE787',
  pink: '#F778BA',
  violet: '#A5A0FF',
  cyan: '#56D4DD',
  codeAccent: '#FFD9A0',
  terminalBg: '#0A0E15',
} as const;

export type Tokens = typeof tokens;
