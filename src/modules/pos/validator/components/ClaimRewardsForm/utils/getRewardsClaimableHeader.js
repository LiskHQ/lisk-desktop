import grid from 'flexboxgrid/dist/flexboxgrid.css';

const getRewardsClaimableHeader = (t) => [
  {
    title: t && t('Name'),
    classList: `${grid['col-xs-4']}`,
  },
  {
    title: t && t('Token'),
    classList: `${grid['col-xs-2']}`,
  },
  {
    title: t && t('Reward amount'),
    classList: `${grid['col-xs-4']}`,
  },
  {
    title: t && t('Fiat'),
    classList: `${grid['col-xs-2']}`,
  },
];

export default getRewardsClaimableHeader;
