import { step } from 'mocha-steps';

describe('@integration: Wallet', () => {
  describe('Scenario: should not allow to send when not enough funds', () => {
    step('Given I\'m on "wallet" as "empty account"');
    step('And I fill in "1" to "amount" field');
    step('And I fill in "537318935439898807L" to "recipient" field');
    step('Then I should see "Insufficient funds" error message');
    step('And "send next button" should be disabled');
  });

  describe('Scenario: should give and error message when sending fails', () => {
    step('Given I\'m on "wallet" as "genesis" account');
    step('And I fill in "1" to "amount" field');
    step('And I fill in "537318935439898807L" to "recipient" field');
    step('And I click "send next button"');
    step('When I click "send button"');
    step('Then I should see text "An error occurred while creating the transaction." in "result box message" element');
  });

  describe('Scenario: should allow to send LSK from unlocked account', () => {
    step('Given I\'m on "wallet" as "genesis" account');
    step('And I fill in "1" to "amount" field');
    step('And I fill in "537318935439898807L" to "recipient" field');
    step('And I click "send next button"');
    step('When I click "send button"');
    step('Then I should see text "Transaction is being processed and will be confirmed. It may take up to 15 minutes to be secured in the blockchain." in "result box message" element');
  });

  describe('Scenario: should allow to send LSK from locked account', () => {
    step('Given I\'m on "wallet" as "genesis" account');
    step('And I fill in "1" to "amount" field');
    step('And I fill in "537318935439898807L" to "recipient" field');
    step('And I click "send next button"');
    step('And I fill in passphrase of "second passphrase account" to "passphrase" field');
    step('When I click "send button"');
    step('Then I should see text "Transaction is being processed and will be confirmed. It may take up to 15 minutes to be secured in the blockchain." in "result box message" element');
  });

  describe('Scenario: should allow to send LSK from unlocked account with 2nd passphrase', () => {
    step('Given I\'m on "wallet" as "second passphrase account"');
    step('And I fill in "1" to "amount" field');
    step('And I fill in "537318935439898807L" to "recipient" field');
    step('And I click "send next button"');
    step('And I fill in second passphrase of "second passphrase account" to "second passphrase" field');
    step('When I click "send button"');
    step('Then I should see text "Transaction is being processed and will be confirmed. It may take up to 15 minutes to be secured in the blockchain." in "result box message" element');
  });

  describe('Scenario: should allow to send LSK from locked account with 2nd passphrase', () => {
    step('Given I\'m on "wallet" as "second passphrase account"');
    step('And I fill in "1" to "amount" field');
    step('And I fill in "537318935439898807L" to "recipient" field');
    step('And I click "send next button"');
    step('And I fill in passphrase of "second passphrase account" to "passphrase" field');
    step('And I fill in second passphrase of "second passphrase account" to "second passphrase" field');
    step('When I click "send button"');
    step('Then I should see text "Transaction is being processed and will be confirmed. It may take up to 15 minutes to be secured in the blockchain." in "result box message" element');
  });

  describe('Scenario: should allow to view transactions', () => {
    step('Given I\'m on "wallet" as "genesis" account');
    step('Then I should see 20 rows');
    step('When I scroll to the bottom of "transactions box"');
    step('Then I should see 40 rows');
  });

  describe('Scenario: should allow to filter transactions', () => {
    // functionality not implemented yet
  });

  describe('Scenario: should allow to search transactions', () => {
    // functionality not implemented yet
  });
});
