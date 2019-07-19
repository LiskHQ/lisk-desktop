Feature: Registration

  Create a new account

  Scenario: Click through the registration process
    When I am on Register page
    And I pick an avatar
    And I remember my passphrase
    And I confirm my passphrase
    Then I see the success message
