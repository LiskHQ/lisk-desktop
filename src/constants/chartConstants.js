import { Line, Bar, Doughnut } from 'react-chartjs-2';

export const typeLine = 'line';
export const typeBar = 'bar';
export const typeDoughnut = 'doughnut';

export const CHART_TYPES = {
  [typeLine]: Line,
  [typeBar]: Bar,
  [typeDoughnut]: Doughnut,
};

export const chartStyles = {
  borderColor: { dark: '#4d4d50', light: '#e1e3eb' },
  backgroundColor: { dark: '#111112', light: '#ffffff' },
  titleColor: { dark: '#ffffff', light: '#0c152e' },
  textColor: { dark: '#70778b', light: '#70778b' },
  whiteColor: '#ffffff',
  platinumColor: '#e1e3eb',
  slateGray: '#70778b',
  maastrichtBlue: '#0c152e',
  ultramarineBlue: '#4070f4',
  darkBlue: '#19224d',
  ufoGreen: '#2bd67b',
  linthPink: '#f8d2d2',
  mystic: '#edf0f5',
  transparent: 'rgba(0, 0, 0, 0)',
  contentFontFamily: '\'basier-circle\', sans-serif',
  fontSize: 13,
};

export const colorPallete = [
  chartStyles.ufoGreen,
  chartStyles.ultramarineBlue,
  chartStyles.maastrichtBlue,
  chartStyles.linthPink,
  chartStyles.darkBlue,
];
