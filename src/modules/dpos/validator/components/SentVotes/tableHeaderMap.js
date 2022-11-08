import grid from 'flexboxgrid/dist/flexboxgrid.css';

export default (t) => [
  {
    title: t('Delegate'),
    classList: `${grid['col-xs-3']}`,
  },
  {
    title: t('Rank'),
    classList: `${grid['col-xs-2']}`,
  },
  {
    title: t('Delegate weight'),
    classList: `${grid['col-xs-2']}`,
  },
  {
    title: t('Vote amount'),
    classList: `${grid['col-xs-2']}`,
  },
  {
    title: t('Action'),
    classList: `${grid['col-xs-3']}`,
  },
];
