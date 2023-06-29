import { screen } from '@testing-library/react';
import { smartRender } from 'src/utils/testHelpers';
import WalletRow from './index';

const config = {
  renderType: 'render',
};

const props = {
  data: {
    address: 'lsk3szyzzh78tvw5yufsqcvsck5me2rp3fcsdv7s7',
    balance: 100000000000000,
    knowledge: {
      owner: 'Max Kordex',
      description: 'from Lisk',
    },
  },
  token: {
    displayDenom: 'lsk',
    denomUnits: [{ denom: 'lsk', decimals: 8, aliases: ['Lisk'] }],
    symbol: 'LSK',
  },
  tokenSupply: {
    amount: '11036090880452566',
    tokenID: '0200000000000000',
  },
};

describe('WalletRow', () => {
  it('renders properly', () => {
    smartRender(WalletRow, props, config);
    expect(screen.getByText('lsk3szyzzh78tvw5yufsqcvsck5me2rp3fcsdv7s7')).toBeInTheDocument();
    expect(screen.getByText('1,000,000 LSK')).toBeInTheDocument();
    expect(screen.getByText('0.91%')).toBeInTheDocument();
    expect(screen.getByText('Max Kordex from Lisk')).toBeInTheDocument();
  });

  it('displays fallback supply value', () => {
    const updatedProps = { ...props, tokenSupply: undefined };
    smartRender(WalletRow, updatedProps, config);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('displays fallback owner value', () => {
    const updatedProps = { ...props, data: { ...props.data, knowledge: {} } };
    smartRender(WalletRow, updatedProps, config);
    expect(screen.getByText('-')).toBeInTheDocument();
  });
});
