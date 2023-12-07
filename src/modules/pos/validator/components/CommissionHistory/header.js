import grid from 'flexboxgrid/dist/flexboxgrid.css';

export default (t) => [
  {
    title: t('Date'),
    classList: `${grid.col} ${grid['col-xs-12']} ${grid['col-md-6']}`,
  },
  {
    title: t('Old commission (%)'),
    classList: `${grid.col} ${grid['col-xs-12']} ${grid['col-md-3']}`,
  },
  {
    title: t('New commission (%)'),
    classList: `${grid.col} ${grid['col-xs-12']} ${grid['col-md-3']}`,
  },
];
