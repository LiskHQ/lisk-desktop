import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { tokenMap } from '../../../../constants/tokens';

export default (t, activeToken) => {
  const isLSK = activeToken === tokenMap.LSK.key;
  return ([
    {
      title: t('Transaction'),
      classList: isLSK ? grid['col-xs-4'] : grid['col-xs-5'],
    },
    {
      title: t('Date'),
      classList: isLSK ? grid['col-xs-2'] : grid['col-xs-3'],
    },
    {
      title: t('Details'),
      classList: isLSK ? `${grid['col-xs-2']} ${grid['col-md-2']}` : 'hidden',
    },
    {
      title: t('Transaction Fee'),
      classList: grid['col-xs-2'],
    },
    {
      title: t('Amount'),
      classList: grid['col-xs-2'],
    },
  ]);
};
