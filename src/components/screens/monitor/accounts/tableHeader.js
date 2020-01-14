import grid from 'flexboxgrid/dist/flexboxgrid.css';

export default t => ([
  {
    title: t('Rank'),
    classList: `${grid['col-xs-1']} ${grid['col-md-1']}`,
  },
  {
    title: t('Address'),
    classList: `${grid['col-xs-3']} ${grid['col-md-5']}`,
  },
  {
    title: t('Balance'),
    classList: `${grid['col-xs-3']} ${grid['col-md-3']}`,
  },
  {
    title: t('Supply'),
    classList: `${grid['col-xs-2']} ${grid['col-md-1']}`,
  },
  {
    title: t('Owner'),
    classList: `${grid['col-xs-3']} ${grid['col-md-2']}`,
  },
]);
