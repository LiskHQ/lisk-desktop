import { step } from 'mocha-steps';

describe('@integration: Register', () => {
  describe('Scenario: should allow to create a new account', () => {
    step('Given I\'m on "register"');
    step('And I 250 times move mouse randomly');
    step('And I click "next button"');
    step('And I remember passphrase, click "next button", fill in missing word');
    step('And I click "next button"');
    step('Then I should be logged in');
  });
});
