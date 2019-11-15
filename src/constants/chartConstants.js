import { Line, Bar, Doughnut } from 'react-chartjs-2';

export const typeLine = 'line';
export const typeBar = 'bar';
export const typeDoughnut = 'doughnut';

export const GRAPH_TYPES = {
  [typeLine]: Line,
  [typeBar]: Bar,
  [typeDoughnut]: Doughnut,
};
