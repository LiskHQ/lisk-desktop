import grid from 'flexboxgrid/dist/flexboxgrid.css';

export default (t) => [
  {
    title: t('Name'),
    classList: `${grid['col-xs-3']} text-left`,
  },
  {
    title: t('Expiry'),
    classList: `${grid['col-xs-3']} text-left`,
  },
  {
    title: t('Connection ID'),
    classList: `${grid['col-xs-4']} text-left`,
  },
  {
    title: t('Action'),
    classList: `${grid['col-xs-2']} text-left`,
  },
];
