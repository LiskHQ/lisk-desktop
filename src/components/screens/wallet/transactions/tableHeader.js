import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { tokenMap } from '../../../../constants/tokens';

export default (t, activeToken, changeSort) => {
  const isLSK = activeToken === tokenMap.LSK.key;
  return ([
    {
      title: t('Transaction'),
      classList: isLSK ? grid['col-xs-4'] : grid['col-xs-5'],
    },
    {
      title: t('Date'),
      classList: grid['col-xs-1'],
      sort: {
        fn: changeSort,
        key: 'timestamp',
      },
    },
    {
      title: t('Transaction Fee'),
      classList: grid['col-xs-1'],
    },
    {
      title: t('Details'),
      classList: isLSK ? `${grid['col-xs-4']} ${grid['col-md-4']}` : 'hidden',
    },
    {
      title: t('Amount'),
      classList: grid['col-xs-2'],
    },
  ]);
};
