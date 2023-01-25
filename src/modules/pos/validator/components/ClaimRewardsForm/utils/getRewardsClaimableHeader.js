import grid from 'flexboxgrid/dist/flexboxgrid.css';

const getRewardsClaimableHeader = (t) => [
  {
    title: t && t('Token'),
    classList: `${grid['col-xs-3']}`,
  },
  {
    title: t && t('Reward amount'),
    classList: `${grid['col-xs-4']}`,
  },
  {
    title: t && t('Fiat'),
    classList: `${grid['col-xs-1']}`,
  },
];

export default getRewardsClaimableHeader;
