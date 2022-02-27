import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import { getTransactionBaseFees, getTransactionFee } from '@api/transaction';
import useTransactionFeeCalculation from '@shared/transactionPriority/useTransactionFeeCalculation';
import { fromRawLsk } from '@utils/lsk';
import accounts from '../../../../../test/constants/accounts';

import Form, { validateState } from './form';

jest.mock('@shared/transactionPriority/useTransactionFeeCalculation');
jest.mock('@api/transaction');

const transactionBaseFees = {
  Low: 156,
  Medium: 100,
  High: 51,
};

const mockFeeFactor = 100;
getTransactionBaseFees.mockResolvedValue(transactionBaseFees);
getTransactionFee.mockImplementation((params) => {
  const selectedTransactionPriority = params.selectedPriority.selectedIndex;
  const fees = fromRawLsk(
    Object.values(transactionBaseFees)[selectedTransactionPriority] * mockFeeFactor,
  );
  return ({
    value: fees, feedback: '', error: false,
  });
});

useTransactionFeeCalculation.mockImplementation(() => ({
  minFee: { value: 0.001 },
  fee: { value: 0.01 },
}));

describe('Multisignature editor component', () => {
  let wrapper;
  const props = {
    t: v => v,
    account: accounts.genesis,
    nextStep: jest.fn(),
  };

  beforeEach(() => {
    wrapper = mount(<Form {...props} />);
  });

  it('renders properly', () => {
    expect(wrapper).toContainMatchingElement('header');
    expect(wrapper).toContainMatchingElement('ProgressBar');
    expect(wrapper).toContainMatchingElement('.multisignature-editor-input');
    expect(wrapper).toContainMatchingElement('.multisignature-members-controls');
    expect(wrapper).toContainMatchingElements(2, 'MemberField');
    expect(wrapper).toContainMatchingElement('TransactionPriority');
    expect(wrapper).toContainMatchingElement('footer');
  });

  it('CTA is disabled when form is invalid', () => {
    expect(wrapper.find('.confirm-button').at(0)).toBeDisabled();
  });

  it('can add no more than 64 members', () => {
    for (let i = 0; i < 62; ++i) {
      wrapper.find('.add-new-members').at(0).simulate('click');
    }

    expect(wrapper).toContainMatchingElements(64, 'MemberField');
    expect(wrapper.find('.add-new-members').at(0)).toBeDisabled();
  });

  it('delete icon is only visible if required signatures < members.length', () => {
    expect(wrapper).not.toContainMatchingElement('.delete-icon');
    for (let i = 0; i < 3; ++i) {
      wrapper.find('.add-new-members').at(0).simulate('click');
    }
    expect(wrapper).toContainMatchingElements(5, '.delete-icon');
  });

  it('clicking delete icon deletes a member field', () => {
    wrapper.find('.add-new-members').at(0).simulate('click');
    wrapper.find('.delete-icon').at(0).simulate('click');
    expect(wrapper).toContainMatchingElements(2, 'MemberField');
  });

  it('props.nextStep is called when the CTA is clicked', () => {
    wrapper.find('input.input-with-dropdown-input').at(0).simulate(
      'change',
      { target: { value: accounts.genesis.summary.publicKey } },
    );
    wrapper.find('input.input-with-dropdown-input').at(1).simulate(
      'change',
      { target: { value: accounts.delegate.summary.publicKey } },
    );
    act(() => { wrapper.update(); });
    wrapper.find('.confirm-button').at(0).simulate('click');
    expect(props.nextStep).toHaveBeenCalledTimes(1);
  });
});

describe('validateState', () => {
  it('should return error if signature are less than mandatory members', () => {
    const pbk = accounts.genesis.summary.publicKey;
    const params = {
      mandatoryKeys: [pbk, pbk, pbk],
      optionalKeys: [],
      requiredSignatures: 2,
      t: str => str,
    };
    const error = 'Number of signatures must be equal to the number of members.';
    expect(validateState(params).messages).toContain(error);
  });

  it('should return error if signatures are more than all members', () => {
    const pbk = accounts.genesis.summary.publicKey;
    const params = {
      mandatoryKeys: [pbk, pbk, pbk],
      optionalKeys: [],
      requiredSignatures: 5,
      t: str => str,
    };
    const error = 'Number of signatures must be equal to the number of members.';
    expect(validateState(params).messages).toContain(error);
  });

  it('should return error if optional members are practically mandatory', () => {
    const pbk = accounts.genesis.summary.publicKey;
    const params = {
      mandatoryKeys: [pbk, pbk, pbk],
      optionalKeys: [pbk],
      requiredSignatures: 4,
      t: str => str,
    };
    const error = 'Either change the optional member to mandatory or define more optional members.';
    expect(validateState(params).messages).toContain(error);
  });

  it('should return error if optional members never get to sign', () => {
    const pbk = accounts.genesis.summary.publicKey;
    const params = {
      mandatoryKeys: [pbk, pbk, pbk],
      optionalKeys: [pbk],
      requiredSignatures: 3,
      t: str => str,
    };
    const error = 'Either change the optional member to mandatory or define more optional members.';
    expect(validateState(params).messages).toContain(error);
  });

  it('should return error if there are only optional members', () => {
    const pbk = accounts.genesis.summary.publicKey;
    const params = {
      mandatoryKeys: [],
      optionalKeys: [pbk, pbk, pbk],
      requiredSignatures: 3,
      t: str => str,
    };
    const error = 'All members can not be optional. Consider changing them to mandatory.';
    expect(validateState(params).messages).toContain(error);
  });

  it('should return error if the number of signature is equal to optional and mandatory members', () => {
    const pbk = accounts.genesis.summary.publicKey;
    const params = {
      mandatoryKeys: [pbk, pbk, pbk],
      optionalKeys: [pbk, pbk, pbk],
      requiredSignatures: 6,
      t: str => str,
    };
    const error = 'Either change the optional member to mandatory or reduce the number of signatures.';
    expect(validateState(params).messages).toContain(error);
  });

  it('should return error if there are more than 64 members', () => {
    const pbk = accounts.genesis.summary.publicKey;
    const params = {
      mandatoryKeys: new Array(65).fill(pbk),
      optionalKeys: [],
      requiredSignatures: 65,
      t: str => str,
    };
    const error = 'Maximum number of members is {{MAX_MULTI_SIG_MEMBERS}}.';
    expect(validateState(params).messages).toContain(error);
  });
  it('should return error if there are duplicate public keys', () => {
    const pbk = accounts.genesis.summary.publicKey;
    const params = {
      mandatoryKeys: new Array(2).fill(pbk),
      optionalKeys: [],
      requiredSignatures: 2,
      t: str => str,
    };
    const error = 'Duplicate public keys detected.';
    expect(validateState(params).messages).toContain(error);
  });
});
