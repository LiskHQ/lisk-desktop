Feature: AddAccount

    Scenario:
        Given I navigate to page "addAccountOptions"
        Then I should exactly see "Switch Network"
        And I should exactly see "\"Lisk\" will be the default mainchain application, please select your preferred network for accessing the wallet. Once selected please click on \"Continue to wallet\"."
        And I should exactly see "Lisk"
        And I should exactly see "Select network"
        And I should exactly see "Continue to wallet"
        Given I click on a button with exact text "Continue to wallet"
        Given I navigate to page "addAccountOptions"

# When I go to page: addAccount
# And I wait 1 seconds
