import grid from 'flexboxgrid/dist/flexboxgrid.css';

const walletEventHeaderMap = (t) => [
  {
    title: t('Block height'),
    classList: grid['col-xs-2'],
  },
  {
    title: t('Transaction ID'),
    classList: grid['col-xs-3'],
  },
  {
    title: t('Module'),
    classList: grid['col-xs-3'],
  },
  {
    title: t('Name'),
    classList: grid['col-xs-3'],
  },
];

const defaultEventHeaderMap = (t) => [
  {
    title: t('Index'),
    classList: grid['col-xs-3'],
  },
  {
    title: t('Module'),
    classList: grid['col-xs-4'],
  },
  {
    title: t('Name'),
    classList: grid['col-xs-4'],
  },
];

export default (t, isWallet) => (isWallet ? walletEventHeaderMap(t) : defaultEventHeaderMap(t));
