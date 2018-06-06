import { expect } from 'chai';
import search from './search';
import actionTypes from '../../constants/actions';


const mockData = ['1', '2'];

describe('Reducer: search', () => {
  it('should clear suggestions', () => {
    const state = {
      suggestions: {
        delegates: mockData,
        addresses: mockData,
        transactions: mockData,
      },
    };
    const action = {
      type: actionTypes.searchClearSuggestions,
      data: {},
    };
    const stateWithClearedSuggestions = search(state, action);
    expect(stateWithClearedSuggestions).to.deep.equal({
      suggestions: {
        delegates: [],
        addresses: [],
        transactions: [],
      },
    });
  });

  it('should reduce search suggestions to key,value object', () => {
    const state = {
      suggestions: {
        addresses: [],
        delegates: [],
        transactions: [],
      },
    };

    const delegatesResponse = { delegates: mockData };
    const addressesResponse = { addresses: mockData };
    const transactionsResponse = { transactions: mockData };
    const action = {
      type: actionTypes.searchSuggestions,
      data: [
        delegatesResponse,
        addressesResponse,
        transactionsResponse,
      ],
    };
    // responses come as array from promise all,
    // reducer transform results to Object with keys
    const stateWithReducedSuggestions = search(state, action);
    expect(stateWithReducedSuggestions).to.deep.equal({
      suggestions: {
        addresses: mockData,
        delegates: mockData,
        transactions: mockData,
      },
    });
  });
});

