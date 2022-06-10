Feature: Wallets

  Background:
    Given Network switcher is enabled
    Given I login as genesis on customNode
    Given I am on wallets page
    And I wait 1 seconds

  @basic
  Scenario: I should see initally loaded wallets
    Then I should have 20 wallets rendered in table

  @basic
  Scenario: I should be able to load more wallets
    And I click on showMoreAccountsBtn
    And I wait 1 seconds
    Then I should have 40 wallets rendered in table

  @basic
  Scenario: I should be navigated to the accurate account page when an wallet is clicked
    When I click on walletsRow
    Then I should be on the wallet page

