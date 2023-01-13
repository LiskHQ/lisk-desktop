import grid from 'flexboxgrid/dist/flexboxgrid.css';

export default (t) => [
  {
    title: t('Token'),
    classList: `${grid['col-xs-3']}`,
  },
  {
    title: t('Token balance'),
    classList: `${grid['col-xs-2']}`,
  },
  {
    title: t('Available balance'),
    classList: `${grid['col-xs-2']}`,
  },
  {
    title: t('Locked balance'),
    classList: `${grid['col-xs-2']}`,
  },
  {
    title: t('Fiat balance'),
    classList: `${grid['col-xs-3']}`,
  },
];
