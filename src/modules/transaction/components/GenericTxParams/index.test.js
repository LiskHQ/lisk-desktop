import React from 'react';
import { screen, render } from '@testing-library/react';
import GenericTxParams from './index';

describe('GenericTxParams', () => {
  const numericValue = 123;
  const stringValue = 'string';
  const booleanValue = true;
  const objectValue = {
    key1: 'value1',
    key2: 'value2',
  };
  const arrayValue = [1, 2, 3];

  it('should render flat transaction params correctly', () => {
    const props = {
      transaction: {
        params: {
          amount: numericValue,
          recipient: stringValue,
          bool: booleanValue,
        },
      },
    };
    render(<GenericTxParams {...props} />);
    expect(screen.getByText(numericValue)).toBeInTheDocument();
    expect(screen.getByText(stringValue)).toBeInTheDocument();
    expect(screen.getByText('true')).toBeInTheDocument();
  });

  it('should render nested object in transaction params correctly', () => {
    const props = {
      transaction: {
        params: {
          amount: numericValue,
          recipient: stringValue,
          object: objectValue,
        },
      },
    };
    render(<GenericTxParams {...props} />);
    expect(screen.getByText(numericValue)).toBeInTheDocument();
    expect(screen.getByText(stringValue)).toBeInTheDocument();
    expect(screen.getByText(objectValue.key1)).toBeInTheDocument();
    expect(screen.getByText(objectValue.key2)).toBeInTheDocument();
  });

  it('should render list in transaction params correctly', () => {
    const props = {
      transaction: {
        params: {
          amount: numericValue,
          recipient: stringValue,
          list: arrayValue,
        },
      },
    };
    render(<GenericTxParams {...props} />);
    expect(screen.getByText(numericValue)).toBeInTheDocument();
    expect(screen.getByText(stringValue)).toBeInTheDocument();
    arrayValue.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });
  it('should render transaction params with compound values correctly', () => {
    const props = {
      transaction: {
        params: {
          amount: numericValue,
          recipient: stringValue,
          object: objectValue,
          list: arrayValue,
        },
      },
    };
    render(<GenericTxParams {...props} />);
    expect(screen.getByText(numericValue)).toBeInTheDocument();
    expect(screen.getByText(stringValue)).toBeInTheDocument();
    arrayValue.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
    expect(screen.getByText(objectValue.key1)).toBeInTheDocument();
    expect(screen.getByText(objectValue.key2)).toBeInTheDocument();
  });
});
