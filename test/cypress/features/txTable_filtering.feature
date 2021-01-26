# Feature: Transaction table filtering

#   Background:
#     Given I login as genesis on devnet
#     Given I am on Wallet page
#     Then I click filter transactions

#   Scenario: Filter by 1 Amount, add second filter by 1 Amount
#     When I type amount to 5
#     And I apply filters
#     Then I should see 4 transactions in table
#     And I click filter transactions
#     When I type amount from 4800
#     When I type amount to 100
#     And I apply filters
#     Then I should see 3 transactions in table

#   Scenario: Filter by Message
#     When I type message without-initialization
#     And I apply filters
#     Then I should see 1 transactions in table

#   Scenario: Filter by all filters combined, clear all filters
#     When I type amount from 0.01
#     And I type amount to 1
#     And I type message without
#     And I apply filters
#     Then I should see 1 transactions in table
#     When I clear all filters
#     Then I should see 30 transactions in table

#   Scenario: Incoming/Outgoing applies to filter results
#     When I type amount from 4900
#     And I apply filters
#     Then I should see 30 transactions in table
#     Then I click filter incoming
#     Then I should see 1 transactions in table
#     Then I click filter outgoing
#     Then I should see 30 transactions in table
