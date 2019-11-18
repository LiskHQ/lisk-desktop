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
  borderColor: 'rgba(15, 126, 255, 0.5)',
  whiteColor: '#ffffff',
  platinumColor: '#e1e3eb',
  slateGray: '#70778b',
  maastrichtBlue: '#0c152e',
  ultramarineBlue: '#4070f4',
  darkBlue: '#19224d',
  ufoGreen: '#2bd67b',
  linthPink: '#f8d2d2',
  transparent: 'rgba(0, 0, 0, 0)',
  contentFontFamily: '\'basier-circle\', sans-serif',
  fontSize: 13,
};

export const doughnutColorPallete = [
  chartStyles.ufoGreen,
  chartStyles.maastrichtBlue,
  chartStyles.ultramarineBlue,
  chartStyles.linthPink,
  chartStyles.darkBlue,
];
