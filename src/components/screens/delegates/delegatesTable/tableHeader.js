import grid from 'flexboxgrid/dist/flexboxgrid.css';

export default shouldShowVoteColumn => ([
  {
    title: 'Vote',
    classList: `${shouldShowVoteColumn ? grid['col-md-1'] : 'hidden'}`,
  },
  {
    title: 'Rank',
    classList: grid['col-md-1'],
  },
  {
    title: 'Delegate',
    classList: `${shouldShowVoteColumn ? grid['col-xs-4'] : grid['col-xs-5']}`,
  },
  {
    title: 'Forged',
    classList: `${grid['col-md-2']}`,
    tooltip: {
      title: 'forged',
      message: 'Total amount of LSK forged by a delegate.',
    },
  },
  {
    title: 'Productivity',
    classList: grid['col-xs-2'],
    tooltip: {
      message: 'Percentage of successfully forged blocks in relation to all blocks (forged and missed).'
    },
  },
  {
    title: 'Vote weight',
    classList: grid['col-md-2'],
    tooltip: {
      title: 'Vote Weight',
      message: 'Sum of LSK in all accounts who have voted for this delegate.',
    },
  },
]);
