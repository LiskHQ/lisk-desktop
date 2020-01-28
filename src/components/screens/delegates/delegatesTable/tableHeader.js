import grid from 'flexboxgrid/dist/flexboxgrid.css';

export default (shouldShowVoteColumn, t, apiVersion) => ([
  {
    title: t('Vote'),
    classList: `${shouldShowVoteColumn ? grid['col-md-1'] : 'hidden'}`,
  },
  {
    title: t('Rank'),
    classList: apiVersion === '3' ? 'hidden' : grid['col-md-1'],
  },
  {
    title: t('Delegate'),
    classList: `${shouldShowVoteColumn ? grid['col-xs-4'] : grid['col-xs-5']}`,
  },
  {
    title: t('Forged'),
    classList: apiVersion === '3' ? grid['col-md-3'] : grid['col-md-2'],
    tooltip: {
      title: t('forged'),
      message: t('Total amount of LSK forged by a delegate.'),
    },
  },
  {
    title: t('Productivity'),
    classList: grid['col-xs-2'],
    tooltip: {
      message: t('Percentage of successfully forged blocks in relation to all blocks (forged and missed).'),
      position: 'showOnLeft',
    },
  },
  {
    title: t('Vote weight'),
    classList: grid['col-md-2'],
    tooltip: {
      title: t('Vote Weight'),
      message: t('Sum of LSK in all accounts who have voted for this delegate.'),
      position: 'showOnLeft',
    },
  },
]);
