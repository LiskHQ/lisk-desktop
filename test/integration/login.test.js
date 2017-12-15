import { step } from 'mocha-steps';

describe('@integration: Login', () => {
  describe('Scenario: should allow to login', () => {
    step('Given I\'m on login page');
    step('When I fill in "wagon stock borrow episode laundry kitten salute link globe zero feed marble" to "passphrase" field');
    step('And I click "login button"');
    step('Then I should be logged in');
  });

  describe('Scenario: should show toast when trying to connect to an unavailable custom node', () => {
    step('Given I\'m on login page');
    step('When I fill in "wagon stock borrow episode laundry kitten salute link globe zero feed marble" to "passphrase" field');
    step('And I select option no. 3 from "network" select');
    step('And I clear "address" field');
    step('And I fill in "http://localhost:4218" to "address" field');
    step('And I click "login button"');
    step('Then I should see text "Unable to connect to the node" in "toast" element');
  });
});
