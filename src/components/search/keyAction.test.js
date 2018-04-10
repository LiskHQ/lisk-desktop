import { expect } from 'chai';
import { visitAndSaveSearchOnEnter, visit } from './keyAction';
import keyCodes from './../../constants/keyCodes';
import routes from './../../constants/routes';
import localJSONStorage from './../../utils/localJSONStorage';

describe('Search KeyAction', () => {
  const storage = {};

  beforeEach(() => {
    window.localStorage.getItem = key => (storage[key]);
    window.localStorage.setItem = (key, item) => { storage[key] = item; };
  });

  it('saves the last 3 searches without duplicates on enter', () => {
    const testValues = [
      '811299173602533L',
      '947273526752682L',
      '',
      '382923358293526L   ',
      '947273526752682L',
    ];

    const expectedOutcome = [
      '947273526752682L',
      '382923358293526L',
      '811299173602533L',
    ];

    testValues.forEach((value) => {
      visitAndSaveSearchOnEnter({ which: keyCodes.enter, target: { value } }, []);
    });

    expect(localJSONStorage.get('searches')).to.eql(expectedOutcome);
  });

  it('visits appropriate url when searched for term', () => {
    const history = [];
    const testValues = [
      '811299173602533L',
      '382923358293526',
      'some string',
    ];

    const expectedHistory = [
      `${routes.explorer.path}${routes.accounts.path}/${testValues[0]}`,
      `${routes.explorer.path}${routes.wallet.path}/${testValues[1]}`,
      `${routes.explorer.path}${routes.searchResult.path}/${testValues[2]}`,
    ];

    testValues.forEach((value) => {
      visit(value, history);
    });

    expect(history).to.eql(expectedHistory);
  });
});
