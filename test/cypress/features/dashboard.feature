Feature: Dashboard

  Scenario: Open last transaction
    Given I autologin as genesis to devnet
    Given I am on Dashboard page
    When I click on recent transaction
    Then I am on transaction details page

  Scenario: Open bookmark
    Given I autologin as genesis to devnet
    Given I have a bookmark saved
    Given I am on Dashboard page
    When I click on bookmark
    Then I am on account page
