import { step } from 'mocha-steps';

describe('@integration: Account switch', () => {
  describe('Scenario: should allow to remove a saved account', () => {
    step('Given I\'m on "account switcher" with accounts: "gensis,delegate,empty account"');
    step('Then I should see 3 instances of "saved account card"');
    step('When I click "edit button"');
    step('And I click "remove button"');
    step('And I click "remove button"');
    step('Then I should see 2 instances of "saved account card"');
  });

  describe('Scenario: should allow to switch account', () => {
    step('Given I\'m on "account switcher" with accounts: "gensis,delegate,empty account"');
    step('When I click "saved account card"');
    step('Then I should be logged in as "genesis" account');
  });
});
