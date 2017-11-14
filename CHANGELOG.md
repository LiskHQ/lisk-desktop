# Change Log

## [v1.1.0](https://github.com/LiskHQ/lisk-nano/tree/v1.1.0) (2017-09-14)
[Full Changelog](https://github.com/LiskHQ/lisk-nano/compare/v1.1.0-rc.3...v1.1.0)

**Fixed bugs:**

- Pending votes are in voting dialog [\#741](https://github.com/LiskHQ/lisk-nano/issues/741)
- MY VOTES modal dialog, the X does not seem to delete/remove anything [\#722](https://github.com/LiskHQ/lisk-nano/issues/722)
- Voting does not reflect in grid after voting and progress indicator completes, must toggle tabs [\#720](https://github.com/LiskHQ/lisk-nano/issues/720)
- More user-friendly voting input validation error messages [\#718](https://github.com/LiskHQ/lisk-nano/issues/718)
- Transaction confirmation success message is incorrect [\#717](https://github.com/LiskHQ/lisk-nano/issues/717)
- Confirmations not updated [\#716](https://github.com/LiskHQ/lisk-nano/issues/716)
- Loading indicator is not dismissed [\#668](https://github.com/LiskHQ/lisk-nano/issues/668)
- Forging rank circle progress bar [\#600](https://github.com/LiskHQ/lisk-nano/issues/600)
- Voting transaction does not appear right away after voting [\#304](https://github.com/LiskHQ/lisk-nano/issues/304)

**Closed issues:**

- LISK sent from Wallet to Bittrex address not showing up [\#729](https://github.com/LiskHQ/lisk-nano/issues/729)
- If already voted for a delegate\(s\), it does not say which one\(s\) [\#721](https://github.com/LiskHQ/lisk-nano/issues/721)

**Merged pull requests:**

- Fix voting status update race condition - Closes \#720 [\#743](https://github.com/LiskHQ/lisk-nano/pull/743) ([slaweet](https://github.com/slaweet))
- Don't show pending votes in voting dialog - Closes \#741 [\#742](https://github.com/LiskHQ/lisk-nano/pull/742) ([slaweet](https://github.com/slaweet))
- Make sure confirmations are updated - Closes \#716 [\#735](https://github.com/LiskHQ/lisk-nano/pull/735) ([slaweet](https://github.com/slaweet))
- Fix removing votes in "MY VOTES" - Closes \#722 [\#728](https://github.com/LiskHQ/lisk-nano/pull/728) ([slaweet](https://github.com/slaweet))
- Disable "Confirm" vote button if too many delegates selected - Closes \#718 [\#727](https://github.com/LiskHQ/lisk-nano/pull/727) ([slaweet](https://github.com/slaweet))
- Fix amount in transaction success alert - Closes \#717 [\#726](https://github.com/LiskHQ/lisk-nano/pull/726) ([slaweet](https://github.com/slaweet))
- Give better passphrase error messages than "invalid" - Closes \#491 [\#724](https://github.com/LiskHQ/lisk-nano/pull/724) ([alepop](https://github.com/alepop))

## [v1.1.0-rc.3](https://github.com/LiskHQ/lisk-nano/tree/v1.1.0-rc.3) (2017-09-08)
[Full Changelog](https://github.com/LiskHQ/lisk-nano/compare/v1.1.0-rc.2...v1.1.0-rc.3)

**Fixed bugs:**

- Clicking on the active tab re-initiates the component [\#711](https://github.com/LiskHQ/lisk-nano/issues/711)
- Wrong amount shown in pending transactions [\#710](https://github.com/LiskHQ/lisk-nano/issues/710)
- Doesn't seem to work with testnet [\#707](https://github.com/LiskHQ/lisk-nano/issues/707)

**Closed issues:**

- LSK disappeared [\#709](https://github.com/LiskHQ/lisk-nano/issues/709)
- Don't send secret to active peers [\#708](https://github.com/LiskHQ/lisk-nano/issues/708)
- Hi there. I recently bought some LSK tokens, my first transaction was made successfully and I managed to receive them with no issues. I decided to purchase some more the following day, and when I sent them to my Lisk Nano wallet, I noticed the additional tokens I just bought would show up and disappear after a while, and now those tokens I just bought are no longer there. Only the ones I purchased from the first transaction are visible. I have the transaction ID for both transactions from Bittrex. Can anyone assist me?   [\#704](https://github.com/LiskHQ/lisk-nano/issues/704)
- Didn't receive my Lisk from Bittrex. [\#699](https://github.com/LiskHQ/lisk-nano/issues/699)

**Merged pull requests:**

- Implement localization - Closes \#558 [\#715](https://github.com/LiskHQ/lisk-nano/pull/715) ([yasharAyari](https://github.com/yasharAyari))
- Revert "Implement localization - closes \#558" [\#714](https://github.com/LiskHQ/lisk-nano/pull/714) ([reyraa](https://github.com/reyraa))
- Revert 705 558 implement localization [\#713](https://github.com/LiskHQ/lisk-nano/pull/713) ([reyraa](https://github.com/reyraa))
- Multiple minor fixings - Closes \#711, \#710, \#707 [\#712](https://github.com/LiskHQ/lisk-nano/pull/712) ([reyraa](https://github.com/reyraa))
- Implement localization - closes \#558 [\#705](https://github.com/LiskHQ/lisk-nano/pull/705) ([yasharAyari](https://github.com/yasharAyari))

## [v1.1.0-rc.2](https://github.com/LiskHQ/lisk-nano/tree/v1.1.0-rc.2) (2017-09-05)
[Full Changelog](https://github.com/LiskHQ/lisk-nano/compare/v1.1.0-rc.1...v1.1.0-rc.2)

**Fixed bugs:**

- Reset focus in wallet while logging again with different account [\#698](https://github.com/LiskHQ/lisk-nano/issues/698)
- Custom node address - Lisk Nano 1.1.0 rc1 [\#697](https://github.com/LiskHQ/lisk-nano/issues/697)
- Passphrase in voting dialog showed in clear text. 1.1.0 rc 1 [\#695](https://github.com/LiskHQ/lisk-nano/issues/695)
- Random delay in showing buttons after login [\#669](https://github.com/LiskHQ/lisk-nano/issues/669)
- Custom node configuration is being forgotten [\#666](https://github.com/LiskHQ/lisk-nano/issues/666)

**Closed issues:**

- missing lisk coins address [\#692](https://github.com/LiskHQ/lisk-nano/issues/692)
- Setup stylelint rules and run it in Jenkins [\#642](https://github.com/LiskHQ/lisk-nano/issues/642)

**Merged pull requests:**

- Fix url validator to accept ip and domain - Closes \#697 [\#701](https://github.com/LiskHQ/lisk-nano/pull/701) ([reyraa](https://github.com/reyraa))
- Reset focus in wallet while logging again with different account - Closes \#698 [\#700](https://github.com/LiskHQ/lisk-nano/pull/700) ([alepop](https://github.com/alepop))
- Make secondPassphraseInput type='password' - Closes \#695 [\#696](https://github.com/LiskHQ/lisk-nano/pull/696) ([slaweet](https://github.com/slaweet))
- Setup stylelint rules and run it in jenkins - Closes \#642 [\#691](https://github.com/LiskHQ/lisk-nano/pull/691) ([yasharAyari](https://github.com/yasharAyari))

## [v1.1.0-rc.1](https://github.com/LiskHQ/lisk-nano/tree/v1.1.0-rc.1) (2017-09-01)
[Full Changelog](https://github.com/LiskHQ/lisk-nano/compare/v1.0.2...v1.1.0-rc.1)

**Implemented enhancements:**

- Increase polling interval when not focused. [\#693](https://github.com/LiskHQ/lisk-nano/issues/693)
- Move the Login logic to middlewares [\#596](https://github.com/LiskHQ/lisk-nano/issues/596)
- Move account fetch and update logic into middlewares [\#594](https://github.com/LiskHQ/lisk-nano/issues/594)
- Create a priced primary button [\#583](https://github.com/LiskHQ/lisk-nano/issues/583)
- Issues with logging in [\#550](https://github.com/LiskHQ/lisk-nano/issues/550)
- Enhancements in routing [\#499](https://github.com/LiskHQ/lisk-nano/issues/499)
- Change account registration into a modal dialog [\#346](https://github.com/LiskHQ/lisk-nano/issues/346)

**Fixed bugs:**

- Fix after-migration issues in transactions tab [\#683](https://github.com/LiskHQ/lisk-nano/issues/683)
- Registering delegate doesn't update UI [\#682](https://github.com/LiskHQ/lisk-nano/issues/682)
- Fix eslint error in liskAmount component [\#674](https://github.com/LiskHQ/lisk-nano/issues/674)
- ConfirmVotes component should check validity of second passphrase before firing the action [\#628](https://github.com/LiskHQ/lisk-nano/issues/628)
- Cards don’t have the shadow [\#627](https://github.com/LiskHQ/lisk-nano/issues/627)
- Fix login page after-migration differences [\#624](https://github.com/LiskHQ/lisk-nano/issues/624)
- Infinite scroll loading should start earlier than when the bottom is hit [\#623](https://github.com/LiskHQ/lisk-nano/issues/623)
- Fix voting tab after-migration differences [\#622](https://github.com/LiskHQ/lisk-nano/issues/622)
- Global loading bar issues [\#619](https://github.com/LiskHQ/lisk-nano/issues/619)
- Issues in forging tab [\#618](https://github.com/LiskHQ/lisk-nano/issues/618)
- Stabilize e2e Scenario: should remember the selected network [\#615](https://github.com/LiskHQ/lisk-nano/issues/615)
- Migration regressions in voting tab [\#597](https://github.com/LiskHQ/lisk-nano/issues/597)
- Issue with logging page [\#590](https://github.com/LiskHQ/lisk-nano/issues/590)
- Logout should remove all account-related data from redux [\#584](https://github.com/LiskHQ/lisk-nano/issues/584)
- After-migration fixes in passphrase component [\#566](https://github.com/LiskHQ/lisk-nano/issues/566)
- Unit tests fail with JavaScript heap out of memory [\#562](https://github.com/LiskHQ/lisk-nano/issues/562)
- Issues with logging in [\#550](https://github.com/LiskHQ/lisk-nano/issues/550)
- Fix offline behaviour [\#545](https://github.com/LiskHQ/lisk-nano/issues/545)
- Fix the Electron app [\#539](https://github.com/LiskHQ/lisk-nano/issues/539)
- Stabilise unit tests for generateSeed [\#530](https://github.com/LiskHQ/lisk-nano/issues/530)
- Passphrase field doesn't work [\#524](https://github.com/LiskHQ/lisk-nano/issues/524)
- Transactions tab should provide "No transactions" message [\#522](https://github.com/LiskHQ/lisk-nano/issues/522)
- Page is rendered before styles are loaded [\#511](https://github.com/LiskHQ/lisk-nano/issues/511)
- Fix Header component [\#506](https://github.com/LiskHQ/lisk-nano/issues/506)
- Enhancements in routing [\#499](https://github.com/LiskHQ/lisk-nano/issues/499)
- Lisk Nano notified me of a negative balance [\#477](https://github.com/LiskHQ/lisk-nano/issues/477)
- "Invalid transaction timestamp" [\#365](https://github.com/LiskHQ/lisk-nano/issues/365)
- Upon starting the application, caps lock symbol pops up without caps lock being on [\#211](https://github.com/LiskHQ/lisk-nano/issues/211)

**Closed issues:**

- Use local storage instead of cookies [\#681](https://github.com/LiskHQ/lisk-nano/issues/681)
- "Report issue..." should go to Zendesk, not Github [\#664](https://github.com/LiskHQ/lisk-nano/issues/664)
- Browser console is polluted with redux actions [\#649](https://github.com/LiskHQ/lisk-nano/issues/649)
- Use theme props to customize react-toolbox tab [\#641](https://github.com/LiskHQ/lisk-nano/issues/641)
- Clean workspace folder in Jenkins on success [\#634](https://github.com/LiskHQ/lisk-nano/issues/634)
- Setup auto-login option and fix login redirect for better developer experience [\#633](https://github.com/LiskHQ/lisk-nano/issues/633)
- Register delegate with 2nd passphrase e2e test sometimes fail [\#632](https://github.com/LiskHQ/lisk-nano/issues/632)
- Page html title is “lisk nano” \(should be “Lisk Nano”\) [\#626](https://github.com/LiskHQ/lisk-nano/issues/626)
- Move Api calls to actions using Redux Thunk [\#611](https://github.com/LiskHQ/lisk-nano/issues/611)
- Create a middleware to handle success alerts after a transaction added [\#610](https://github.com/LiskHQ/lisk-nano/issues/610)
- Update readme build badge [\#592](https://github.com/LiskHQ/lisk-nano/issues/592)
- Centralise test setup [\#589](https://github.com/LiskHQ/lisk-nano/issues/589)
- Add autocomplete module to 'confirm votes modal' [\#587](https://github.com/LiskHQ/lisk-nano/issues/587)
- Unit tests should run on file change only once [\#581](https://github.com/LiskHQ/lisk-nano/issues/581)
- Clean up unit test output [\#578](https://github.com/LiskHQ/lisk-nano/issues/578)
- Migrate desktop notifications for changes to React [\#568](https://github.com/LiskHQ/lisk-nano/issues/568)
- Unify naming of components that use 'connect' [\#567](https://github.com/LiskHQ/lisk-nano/issues/567)
- Re-enable e2e tests for features already working in React [\#565](https://github.com/LiskHQ/lisk-nano/issues/565)
- Migrate "Save network to cookie" [\#564](https://github.com/LiskHQ/lisk-nano/issues/564)
- Jenkins doesn't fail if there are eslint errors in tests [\#548](https://github.com/LiskHQ/lisk-nano/issues/548)
- Migrate Spinner component to React [\#546](https://github.com/LiskHQ/lisk-nano/issues/546)
- Create ActionBar React component [\#541](https://github.com/LiskHQ/lisk-nano/issues/541)
- Create a React component for second passphrase field [\#540](https://github.com/LiskHQ/lisk-nano/issues/540)
- Review and improve React unit test coverage [\#531](https://github.com/LiskHQ/lisk-nano/issues/531)
- Fix responsiveness of the layout [\#529](https://github.com/LiskHQ/lisk-nano/issues/529)
- Add unit tests for sign/verify message [\#527](https://github.com/LiskHQ/lisk-nano/issues/527)
- Implement click to send functionality in React [\#516](https://github.com/LiskHQ/lisk-nano/issues/516)
- Implement custom alert dialogs in React [\#515](https://github.com/LiskHQ/lisk-nano/issues/515)
- Implement pending transactions in React [\#514](https://github.com/LiskHQ/lisk-nano/issues/514)
- Resolve Lisk address [\#508](https://github.com/LiskHQ/lisk-nano/issues/508)
- Re-enable e2e tests for features already working in React [\#507](https://github.com/LiskHQ/lisk-nano/issues/507)
- Setup React toolbox tabs for Transactions/Voting/Forging [\#505](https://github.com/LiskHQ/lisk-nano/issues/505)
- Unify the test titles [\#503](https://github.com/LiskHQ/lisk-nano/issues/503)
- Create \<LiskAmount val={val} /\> React component [\#501](https://github.com/LiskHQ/lisk-nano/issues/501)
- Setup React Storybook [\#496](https://github.com/LiskHQ/lisk-nano/issues/496)
- Implement global loading bar React component [\#494](https://github.com/LiskHQ/lisk-nano/issues/494)
- Migrate voting for delegates on Voting tab to React [\#492](https://github.com/LiskHQ/lisk-nano/issues/492)
- Migrate account creation modal [\#487](https://github.com/LiskHQ/lisk-nano/issues/487)
- Setup React toaster library [\#486](https://github.com/LiskHQ/lisk-nano/issues/486)
- Improve eslint report [\#467](https://github.com/LiskHQ/lisk-nano/issues/467)
- Migrate send dialog to React [\#355](https://github.com/LiskHQ/lisk-nano/issues/355)
- Migrate Register as delegate to React [\#354](https://github.com/LiskHQ/lisk-nano/issues/354)
- Migrate Register second passphrase to React [\#353](https://github.com/LiskHQ/lisk-nano/issues/353)
- Migrate Forging tab to React [\#351](https://github.com/LiskHQ/lisk-nano/issues/351)
- Migrate browsing delegates on Voting tab to React [\#350](https://github.com/LiskHQ/lisk-nano/issues/350)
- Migrate home page to React [\#348](https://github.com/LiskHQ/lisk-nano/issues/348)
- Migrate login page to React [\#347](https://github.com/LiskHQ/lisk-nano/issues/347)
- Get back coverage reports [\#276](https://github.com/LiskHQ/lisk-nano/issues/276)
- Delegate list gets slow when loading ~1000 delegates [\#260](https://github.com/LiskHQ/lisk-nano/issues/260)
- Upgrade webpack 1 to 2, optimize webpack loading time [\#61](https://github.com/LiskHQ/lisk-nano/issues/61)

**Merged pull requests:**

- Increase polling interval when not focused. - Closes \#693 [\#694](https://github.com/LiskHQ/lisk-nano/pull/694) ([slaweet](https://github.com/slaweet))
- Use local storage instead of cookies - Closes \#681 [\#689](https://github.com/LiskHQ/lisk-nano/pull/689) ([slaweet](https://github.com/slaweet))
- Bugfix: Registering delegate doesn't update UI - Closes \#682 [\#688](https://github.com/LiskHQ/lisk-nano/pull/688) ([slaweet](https://github.com/slaweet))
- Fix after-migration issues in transactions tab - Closes \#683 [\#684](https://github.com/LiskHQ/lisk-nano/pull/684) ([slaweet](https://github.com/slaweet))
- Fix stories for Send, SignMessage and Toaster [\#680](https://github.com/LiskHQ/lisk-nano/pull/680) ([lohek](https://github.com/lohek))
- ConfirmVotes component should check validity of second passphrase - Closes \#628 [\#679](https://github.com/LiskHQ/lisk-nano/pull/679) ([yasharAyari](https://github.com/yasharAyari))
- Bump lisk-js version [\#677](https://github.com/LiskHQ/lisk-nano/pull/677) ([slaweet](https://github.com/slaweet))
- After-migration fixes in passphrase component - Closes \#566 [\#676](https://github.com/LiskHQ/lisk-nano/pull/676) ([slaweet](https://github.com/slaweet))
- Fix eslint error in liskAmount component -Closes \#674 [\#675](https://github.com/LiskHQ/lisk-nano/pull/675) ([slaweet](https://github.com/slaweet))
- Fix login page after-migration differences - Closes \#624 [\#673](https://github.com/LiskHQ/lisk-nano/pull/673) ([alepop](https://github.com/alepop))
- Change "Report issue..." to go to Zendesk, not Github - Closes \#664 [\#671](https://github.com/LiskHQ/lisk-nano/pull/671) ([slaweet](https://github.com/slaweet))
- Update README [\#662](https://github.com/LiskHQ/lisk-nano/pull/662) ([albinekcom](https://github.com/albinekcom))
- Fix pluralization for confirmation tooltip [\#657](https://github.com/LiskHQ/lisk-nano/pull/657) ([ccampbell](https://github.com/ccampbell))
- Set up source maps in karma [\#655](https://github.com/LiskHQ/lisk-nano/pull/655) ([slaweet](https://github.com/slaweet))
- Unify naming of components that use 'connect' - Closes \#567 [\#654](https://github.com/LiskHQ/lisk-nano/pull/654) ([slaweet](https://github.com/slaweet))
- Add karma coverage json output [\#652](https://github.com/LiskHQ/lisk-nano/pull/652) ([slaweet](https://github.com/slaweet))
- Fix voting tab after migration differences - Close \#622 [\#651](https://github.com/LiskHQ/lisk-nano/pull/651) ([yasharAyari](https://github.com/yasharAyari))
- Clean Redux actions from browser console - Closes \#649 [\#650](https://github.com/LiskHQ/lisk-nano/pull/650) ([slaweet](https://github.com/slaweet))
- Give cards back their shadow - Closes \#627 [\#648](https://github.com/LiskHQ/lisk-nano/pull/648) ([slaweet](https://github.com/slaweet))
- Use theme prop to style Tabs and Dialog - Closes \#641 [\#647](https://github.com/LiskHQ/lisk-nano/pull/647) ([slaweet](https://github.com/slaweet))
- Capitalize page title - Closes \#626 [\#646](https://github.com/LiskHQ/lisk-nano/pull/646) ([slaweet](https://github.com/slaweet))
- Improve eslint report - Closes \#467 [\#645](https://github.com/LiskHQ/lisk-nano/pull/645) ([slaweet](https://github.com/slaweet))
- Delegate list gets slow when loading ~1000 delegates - Closes \#260 [\#644](https://github.com/LiskHQ/lisk-nano/pull/644) ([slaweet](https://github.com/slaweet))
- Fix infinity scroll - Closes \#623 [\#643](https://github.com/LiskHQ/lisk-nano/pull/643) ([alepop](https://github.com/alepop))
- Setup auto-login option and fix login redirect for better developer experience - Closes \#633 [\#640](https://github.com/LiskHQ/lisk-nano/pull/640) ([slaweet](https://github.com/slaweet))
- Make e2e tests more stable - Closes \#632 [\#639](https://github.com/LiskHQ/lisk-nano/pull/639) ([slaweet](https://github.com/slaweet))
- Fix global loading bar issues - Closes \#619 [\#637](https://github.com/LiskHQ/lisk-nano/pull/637) ([slaweet](https://github.com/slaweet))
- Isolate core and presentational logics - Closes \#611, \#610, \#584 [\#636](https://github.com/LiskHQ/lisk-nano/pull/636) ([reyraa](https://github.com/reyraa))
- Clean workspace folder in Jenkins on success - Closes \#634 [\#635](https://github.com/LiskHQ/lisk-nano/pull/635) ([slaweet](https://github.com/slaweet))
- Fix issues in forging - Closes \#618 [\#630](https://github.com/LiskHQ/lisk-nano/pull/630) ([slaweet](https://github.com/slaweet))
- Stabilize e2e Scenario: should remember the selected network - Closes \#615 [\#629](https://github.com/LiskHQ/lisk-nano/pull/629) ([slaweet](https://github.com/slaweet))
- Add autocomplete module to 'confirm votes modal' - Closes \#587 [\#625](https://github.com/LiskHQ/lisk-nano/pull/625) ([yasharAyari](https://github.com/yasharAyari))
- Fix responsiveness of the layout - Closes \#529 [\#617](https://github.com/LiskHQ/lisk-nano/pull/617) ([slaweet](https://github.com/slaweet))
- Ignore Scenario: should remember the selected network [\#616](https://github.com/LiskHQ/lisk-nano/pull/616) ([slaweet](https://github.com/slaweet))
- Fix the Electron app - Closes \#539 [\#614](https://github.com/LiskHQ/lisk-nano/pull/614) ([slaweet](https://github.com/slaweet))
- Cetralise test setup - Closes \#589 [\#613](https://github.com/LiskHQ/lisk-nano/pull/613) ([slaweet](https://github.com/slaweet))
- Fix offline behaviour - Closes \#545 [\#612](https://github.com/LiskHQ/lisk-nano/pull/612) ([slaweet](https://github.com/slaweet))
- Migrate desktop notifications to react - Closes \#568 [\#609](https://github.com/LiskHQ/lisk-nano/pull/609) ([alepop](https://github.com/alepop))
- Update readme build badge - Closes \#592 [\#608](https://github.com/LiskHQ/lisk-nano/pull/608) ([slaweet](https://github.com/slaweet))
- Make Jenkins fail if there are eslint errors in tests - Closes \#548 [\#607](https://github.com/LiskHQ/lisk-nano/pull/607) ([slaweet](https://github.com/slaweet))
- Migration regressions in voting tab - Closes \#597 [\#606](https://github.com/LiskHQ/lisk-nano/pull/606) ([yasharAyari](https://github.com/yasharAyari))
- Migrate "Save network to cookie" - Closes \#564 [\#605](https://github.com/LiskHQ/lisk-nano/pull/605) ([slaweet](https://github.com/slaweet))
- Stabilise seed generator test - Closes \#530 [\#604](https://github.com/LiskHQ/lisk-nano/pull/604) ([reyraa](https://github.com/reyraa))
- Move the Login logic to middlewares - Closes \#596 [\#603](https://github.com/LiskHQ/lisk-nano/pull/603) ([reyraa](https://github.com/reyraa))
- Transactions tab should provide "No transactions" message- Closes \#522 [\#602](https://github.com/LiskHQ/lisk-nano/pull/602) ([yasharAyari](https://github.com/yasharAyari))
- Review and improve React unit test coverage - Closes \#531 [\#601](https://github.com/LiskHQ/lisk-nano/pull/601) ([slaweet](https://github.com/slaweet))
- Move logic to middlewares - Closes \#594 [\#598](https://github.com/LiskHQ/lisk-nano/pull/598) ([alepop](https://github.com/alepop))
- Migrate voting for delegates on voting component - Closes \#492 [\#593](https://github.com/LiskHQ/lisk-nano/pull/593) ([yasharAyari](https://github.com/yasharAyari))
- Fix login issues- Closes \#590 [\#591](https://github.com/LiskHQ/lisk-nano/pull/591) ([reyraa](https://github.com/reyraa))
- Create priced button component - Closes \#583 [\#585](https://github.com/LiskHQ/lisk-nano/pull/585) ([reyraa](https://github.com/reyraa))
- Unit tests should run on file change only once - Closes \#581 [\#582](https://github.com/LiskHQ/lisk-nano/pull/582) ([alepop](https://github.com/alepop))
- Fix unit tests JavaScript heap out of memory error - Closes \#562 [\#580](https://github.com/LiskHQ/lisk-nano/pull/580) ([slaweet](https://github.com/slaweet))
- Cleanup unit test output - Closes \#578  [\#579](https://github.com/LiskHQ/lisk-nano/pull/579) ([alepop](https://github.com/alepop))
- Re-enable e2e tests for features already working in React - Closes \#565 [\#577](https://github.com/LiskHQ/lisk-nano/pull/577) ([slaweet](https://github.com/slaweet))
- Fix header component style - Closes \#506 [\#575](https://github.com/LiskHQ/lisk-nano/pull/575) ([alepop](https://github.com/alepop))
- Create ActionBar React component - Closes \#541 [\#563](https://github.com/LiskHQ/lisk-nano/pull/563) ([slaweet](https://github.com/slaweet))
- Create a React component for second passphrase field - Closes \#540 [\#560](https://github.com/LiskHQ/lisk-nano/pull/560) ([slaweet](https://github.com/slaweet))
- Set second passphrase - Closes \#353 [\#552](https://github.com/LiskHQ/lisk-nano/pull/552) ([reyraa](https://github.com/reyraa))
- Login issues - Closes \#550 [\#551](https://github.com/LiskHQ/lisk-nano/pull/551) ([reyraa](https://github.com/reyraa))
- Implement pending transactions in React - Closes \#514 [\#549](https://github.com/LiskHQ/lisk-nano/pull/549) ([slaweet](https://github.com/slaweet))
- Add Spinner component - Closes \#546 [\#547](https://github.com/LiskHQ/lisk-nano/pull/547) ([slaweet](https://github.com/slaweet))
- Extract css styles to one file - Closes \#511 [\#544](https://github.com/LiskHQ/lisk-nano/pull/544) ([alepop](https://github.com/alepop))
- Register as delegate - Closes \#354 [\#543](https://github.com/LiskHQ/lisk-nano/pull/543) ([reyraa](https://github.com/reyraa))
- Fix header component - Closes \#506 [\#542](https://github.com/LiskHQ/lisk-nano/pull/542) ([alepop](https://github.com/alepop))
- Migrate global loading bar to React - Closes \#494 [\#538](https://github.com/LiskHQ/lisk-nano/pull/538) ([slaweet](https://github.com/slaweet))
- Fix coverage reports - Closes \#276 [\#537](https://github.com/LiskHQ/lisk-nano/pull/537) ([slaweet](https://github.com/slaweet))
- Implement click to send functionality in React - Closes \#516 [\#534](https://github.com/LiskHQ/lisk-nano/pull/534) ([slaweet](https://github.com/slaweet))
- Setup React toolbox tabs - Closes \#505 [\#532](https://github.com/LiskHQ/lisk-nano/pull/532) ([slaweet](https://github.com/slaweet))
- Add unit tests for sign/verify message - Closes \#527 [\#528](https://github.com/LiskHQ/lisk-nano/pull/528) ([slaweet](https://github.com/slaweet))
- Implement custom alert dialogs in React - Closes \#515 [\#526](https://github.com/LiskHQ/lisk-nano/pull/526) ([slaweet](https://github.com/slaweet))
- Fix passphrase field - Closes \#524 [\#525](https://github.com/LiskHQ/lisk-nano/pull/525) ([slaweet](https://github.com/slaweet))
- Re-enable e2e tests for features already working in React - Closes \#507 [\#523](https://github.com/LiskHQ/lisk-nano/pull/523) ([slaweet](https://github.com/slaweet))
- Setup React toaster - Closes \#486 [\#519](https://github.com/LiskHQ/lisk-nano/pull/519) ([slaweet](https://github.com/slaweet))
- Implement account creation modal - Closes \#487 [\#518](https://github.com/LiskHQ/lisk-nano/pull/518) ([reyraa](https://github.com/reyraa))
- Add Yashar Ayari to Authors in README.md [\#517](https://github.com/LiskHQ/lisk-nano/pull/517) ([slaweet](https://github.com/slaweet))
- Migrate send dialog to React - Closes \#355 [\#513](https://github.com/LiskHQ/lisk-nano/pull/513) ([slaweet](https://github.com/slaweet))
- Migrate browsing delegates on Voting tab to React - Closes \#350 [\#512](https://github.com/LiskHQ/lisk-nano/pull/512) ([yasharAyari](https://github.com/yasharAyari))
- Enhancements in routing - Closes \#499 [\#509](https://github.com/LiskHQ/lisk-nano/pull/509) ([alepop](https://github.com/alepop))
- Unify test titles - Closes \#503 [\#504](https://github.com/LiskHQ/lisk-nano/pull/504) ([reyraa](https://github.com/reyraa))
- Create \<LiskAmount val={val} /\> React component - Closes \#501 [\#502](https://github.com/LiskHQ/lisk-nano/pull/502) ([slaweet](https://github.com/slaweet))
- Migrate Login page - Closes \#347 [\#498](https://github.com/LiskHQ/lisk-nano/pull/498) ([reyraa](https://github.com/reyraa))
- Add react storybook - Closes \#496 [\#497](https://github.com/LiskHQ/lisk-nano/pull/497) ([willclarktech](https://github.com/willclarktech))
- Migrate forging component to React - Closes \#351 [\#495](https://github.com/LiskHQ/lisk-nano/pull/495) ([slaweet](https://github.com/slaweet))

## [v1.0.2](https://github.com/LiskHQ/lisk-nano/tree/v1.0.2) (2017-07-20)
[Full Changelog](https://github.com/LiskHQ/lisk-nano/compare/1.0.2...v1.0.2)

## [1.0.2](https://github.com/LiskHQ/lisk-nano/tree/1.0.2) (2017-07-20)
[Full Changelog](https://github.com/LiskHQ/lisk-nano/compare/v1.0.1...1.0.2)

**Implemented enhancements:**

- Update account regularly on beat events [\#488](https://github.com/LiskHQ/lisk-nano/issues/488)
- Increase unit test coverage for routing [\#479](https://github.com/LiskHQ/lisk-nano/issues/479)
- Add react routing [\#474](https://github.com/LiskHQ/lisk-nano/issues/474)
- Support more deployment methods [\#455](https://github.com/LiskHQ/lisk-nano/issues/455)
- Possibility to define custom node to broadcast transactions [\#8](https://github.com/LiskHQ/lisk-nano/issues/8)

**Fixed bugs:**

- Not able to use my public node anymore without added port 8000  [\#424](https://github.com/LiskHQ/lisk-nano/issues/424)
- Rank is not displayed while searching [\#303](https://github.com/LiskHQ/lisk-nano/issues/303)

**Closed issues:**

- Re-enable e2e tests in Jenkins [\#482](https://github.com/LiskHQ/lisk-nano/issues/482)
- Create general modal dialogs in React [\#478](https://github.com/LiskHQ/lisk-nano/issues/478)
- Make active peer available in main component [\#469](https://github.com/LiskHQ/lisk-nano/issues/469)
- Enhance unit test output [\#466](https://github.com/LiskHQ/lisk-nano/issues/466)
- Add hot module reload functionality [\#465](https://github.com/LiskHQ/lisk-nano/issues/465)
- Add hot CSS reload functionality [\#464](https://github.com/LiskHQ/lisk-nano/issues/464)
- Lisk Nano - cannot install on Windows 32-bit machine [\#454](https://github.com/LiskHQ/lisk-nano/issues/454)
- Migrate Sign/Verify message to React [\#352](https://github.com/LiskHQ/lisk-nano/issues/352)
- Migrate transactions tab to React [\#349](https://github.com/LiskHQ/lisk-nano/issues/349)
- Update "build" badge in README [\#275](https://github.com/LiskHQ/lisk-nano/issues/275)
- Create a modal that can compile any child component [\#163](https://github.com/LiskHQ/lisk-nano/issues/163)

**Merged pull requests:**

- Invalid timestamp fixes - Closes \#365 [\#500](https://github.com/LiskHQ/lisk-nano/pull/500) ([reyraa](https://github.com/reyraa))
- Update account regularly on beat events - Closes \#488 [\#493](https://github.com/LiskHQ/lisk-nano/pull/493) ([reyraa](https://github.com/reyraa))
- Migrate transactions tab to react - Closes \#349 [\#490](https://github.com/LiskHQ/lisk-nano/pull/490) ([yasharAyari](https://github.com/yasharAyari))
- Increase unit test coverage for routing - Closes \#479 [\#489](https://github.com/LiskHQ/lisk-nano/pull/489) ([alepop](https://github.com/alepop))
- Update "build" badge in README - Closes \#275 [\#484](https://github.com/LiskHQ/lisk-nano/pull/484) ([slaweet](https://github.com/slaweet))
- Fix e2e tests in Jenkinsfile - Closes \#482 [\#483](https://github.com/LiskHQ/lisk-nano/pull/483) ([slaweet](https://github.com/slaweet))
- Fix notification about negative balance - Closes \#477 [\#481](https://github.com/LiskHQ/lisk-nano/pull/481) ([alepop](https://github.com/alepop))
- Create general modal dialogs in React - Closes \#478 [\#480](https://github.com/LiskHQ/lisk-nano/pull/480) ([slaweet](https://github.com/slaweet))
- Implement sign/verify message as React components - Closes \#352 [\#476](https://github.com/LiskHQ/lisk-nano/pull/476) ([slaweet](https://github.com/slaweet))
- Add react routing - Closes \#474 [\#475](https://github.com/LiskHQ/lisk-nano/pull/475) ([reyraa](https://github.com/reyraa))
- Enhance unit test output - Closes \#466 [\#473](https://github.com/LiskHQ/lisk-nano/pull/473) ([alepop](https://github.com/alepop))
- Add hot module reload functionality - Closes \#465 [\#472](https://github.com/LiskHQ/lisk-nano/pull/472) ([alepop](https://github.com/alepop))
- Add new deployments to package.json - Closes \#455 [\#471](https://github.com/LiskHQ/lisk-nano/pull/471) ([slaweet](https://github.com/slaweet))
- Make active peer available in main component - Closes \#469 [\#470](https://github.com/LiskHQ/lisk-nano/pull/470) ([reyraa](https://github.com/reyraa))

## [v1.0.1](https://github.com/LiskHQ/lisk-nano/tree/v1.0.1) (2017-07-10)
[Full Changelog](https://github.com/LiskHQ/lisk-nano/compare/v1.0.0...v1.0.1)

**Closed issues:**

- Update Build Badge for Jenkins [\#468](https://github.com/LiskHQ/lisk-nano/issues/468)
- Remove boilerplate example components [\#462](https://github.com/LiskHQ/lisk-nano/issues/462)
- Login with custom node not possible [\#449](https://github.com/LiskHQ/lisk-nano/issues/449)
- Add a grid system to react boilerplate [\#448](https://github.com/LiskHQ/lisk-nano/issues/448)
- Migrate header component to React [\#444](https://github.com/LiskHQ/lisk-nano/issues/444)
- Migrate top component to React [\#443](https://github.com/LiskHQ/lisk-nano/issues/443)
- Remove less files and use css version of them [\#440](https://github.com/LiskHQ/lisk-nano/issues/440)
- Set up Lisk Nano theme in React Toolbox [\#438](https://github.com/LiskHQ/lisk-nano/issues/438)
- Add a material design based framework to react boilerplate [\#435](https://github.com/LiskHQ/lisk-nano/issues/435)
- Create Api utilities to communicate with Lisk-js endpoints [\#434](https://github.com/LiskHQ/lisk-nano/issues/434)
- Can't Open Wallet With a Passphrase [\#425](https://github.com/LiskHQ/lisk-nano/issues/425)

**Merged pull requests:**

- Remove boilerplate example components - Closes \#462 [\#463](https://github.com/LiskHQ/lisk-nano/pull/463) ([reyraa](https://github.com/reyraa))
- Migrate top component to react - Closes \#443 [\#461](https://github.com/LiskHQ/lisk-nano/pull/461) ([yasharAyari](https://github.com/yasharAyari))
- Migrate header component to react - Close \#444 [\#459](https://github.com/LiskHQ/lisk-nano/pull/459) ([yasharAyari](https://github.com/yasharAyari))
- Add new deployments to package.json - Closes \#455 [\#457](https://github.com/LiskHQ/lisk-nano/pull/457) ([Isabello](https://github.com/Isabello))
- Remove IPC listeners after logout [\#452](https://github.com/LiskHQ/lisk-nano/pull/452) ([alepop](https://github.com/alepop))
- Add Flexbox grid to react boilerplate - Close \#448 [\#450](https://github.com/LiskHQ/lisk-nano/pull/450) ([yasharAyari](https://github.com/yasharAyari))
- Remove less files and use css files instead of them - Closes \#440 [\#442](https://github.com/LiskHQ/lisk-nano/pull/442) ([yasharAyari](https://github.com/yasharAyari))
- Fix login to https custom node - Closes \#424 [\#441](https://github.com/LiskHQ/lisk-nano/pull/441) ([slaweet](https://github.com/slaweet))
- Set up Lisk Nano theme in React Toolbox - close \#438 [\#439](https://github.com/LiskHQ/lisk-nano/pull/439) ([yasharAyari](https://github.com/yasharAyari))
- Create api utilities - Closes \#434 [\#437](https://github.com/LiskHQ/lisk-nano/pull/437) ([reyraa](https://github.com/reyraa))
- Add material design frame work to react boilerplate - closes \#435  [\#436](https://github.com/LiskHQ/lisk-nano/pull/436) ([yasharAyari](https://github.com/yasharAyari))

## [v1.0.0](https://github.com/LiskHQ/lisk-nano/tree/v1.0.0) (2017-06-22)
[Full Changelog](https://github.com/LiskHQ/lisk-nano/compare/v1.0.0-rc.5...v1.0.0)

**Fixed bugs:**

- Fix test coverage results [\#430](https://github.com/LiskHQ/lisk-nano/issues/430)
- Loading bar doesn't hide after sucessfull login [\#422](https://github.com/LiskHQ/lisk-nano/issues/422)

**Closed issues:**

- Implement account logic in React [\#429](https://github.com/LiskHQ/lisk-nano/issues/429)
- Set up boilerplate for React migration [\#342](https://github.com/LiskHQ/lisk-nano/issues/342)
- Improve e2e test coverage [\#274](https://github.com/LiskHQ/lisk-nano/issues/274)

**Merged pull requests:**

- Account logic - Closes \#429 [\#433](https://github.com/LiskHQ/lisk-nano/pull/433) ([reyraa](https://github.com/reyraa))
- Fix test coverage results - Closes \#430 [\#432](https://github.com/LiskHQ/lisk-nano/pull/432) ([yasharAyari](https://github.com/yasharAyari))
- Improve e2e coverage - Closes \#274 [\#427](https://github.com/LiskHQ/lisk-nano/pull/427) ([slaweet](https://github.com/slaweet))
- Create react boilerplate - Closes \#342 [\#426](https://github.com/LiskHQ/lisk-nano/pull/426) ([yasharAyari](https://github.com/yasharAyari))
- Fix loading bar after unsuccessfull login - Closes \#422 [\#423](https://github.com/LiskHQ/lisk-nano/pull/423) ([slaweet](https://github.com/slaweet))

## [v1.0.0-rc.5](https://github.com/LiskHQ/lisk-nano/tree/v1.0.0-rc.5) (2017-06-16)
[Full Changelog](https://github.com/LiskHQ/lisk-nano/compare/v1.0.0-rc.4...v1.0.0-rc.5)

**Fixed bugs:**

- New Account and Login buttons are permanently disabled [\#420](https://github.com/LiskHQ/lisk-nano/issues/420)
- Using wrong URL as custom node results in endless loop [\#417](https://github.com/LiskHQ/lisk-nano/issues/417)

**Merged pull requests:**

- Fix an issue in form validation in login page - Closes \#420 [\#421](https://github.com/LiskHQ/lisk-nano/pull/421) ([reyraa](https://github.com/reyraa))
- Use Javascript URL method to normalize URL before setting active peer - Closes \#417 [\#419](https://github.com/LiskHQ/lisk-nano/pull/419) ([reyraa](https://github.com/reyraa))

## [v1.0.0-rc.4](https://github.com/LiskHQ/lisk-nano/tree/v1.0.0-rc.4) (2017-06-15)
[Full Changelog](https://github.com/LiskHQ/lisk-nano/compare/v1.0.0-rc.3...v1.0.0-rc.4)

**Implemented enhancements:**

- Add bouncer animation to pending send transactions [\#407](https://github.com/LiskHQ/lisk-nano/issues/407)
- Clicking anywhere after generating passphrase break "ctrl+a" selection scope [\#403](https://github.com/LiskHQ/lisk-nano/issues/403)
- Remove the "Load More" link at the bottom of the first few transactions [\#402](https://github.com/LiskHQ/lisk-nano/issues/402)
- Remove "Today" on the "Forging" Tab [\#401](https://github.com/LiskHQ/lisk-nano/issues/401)
- Gray line after adding a delegate to the voting list [\#330](https://github.com/LiskHQ/lisk-nano/issues/330)
- Add Explorer links to the help menu [\#282](https://github.com/LiskHQ/lisk-nano/issues/282)

**Closed issues:**

- Unify "not enough funds" errors [\#405](https://github.com/LiskHQ/lisk-nano/issues/405)
- Typos in the login text [\#399](https://github.com/LiskHQ/lisk-nano/issues/399)

**Merged pull requests:**

- Add space between "remove votes from" and divider - Closes \#330 [\#416](https://github.com/LiskHQ/lisk-nano/pull/416) ([slaweet](https://github.com/slaweet))
- Replace "Forged today" with "In past 365 days" - Closes \#401 [\#413](https://github.com/LiskHQ/lisk-nano/pull/413) ([slaweet](https://github.com/slaweet))
- Prevent blur event on textarea.passphrase element [\#412](https://github.com/LiskHQ/lisk-nano/pull/412) ([alepop](https://github.com/alepop))
- Unify "not enough funds" errors - Closes \#405 [\#411](https://github.com/LiskHQ/lisk-nano/pull/411) ([slaweet](https://github.com/slaweet))
- Add pending status spinner to transactions list - Closes \#407 [\#410](https://github.com/LiskHQ/lisk-nano/pull/410) ([reyraa](https://github.com/reyraa))
- Fix typos - Closes \#399 [\#409](https://github.com/LiskHQ/lisk-nano/pull/409) ([reyraa](https://github.com/reyraa))
- Load 20 transaction instead 10 - Closes \#402 [\#408](https://github.com/LiskHQ/lisk-nano/pull/408) ([alepop](https://github.com/alepop))
- Add explorer link to Help menu [\#395](https://github.com/LiskHQ/lisk-nano/pull/395) ([alepop](https://github.com/alepop))

## [v1.0.0-rc.3](https://github.com/LiskHQ/lisk-nano/tree/v1.0.0-rc.3) (2017-06-13)
[Full Changelog](https://github.com/LiskHQ/lisk-nano/compare/v1.0.0-rc.2...v1.0.0-rc.3)

**Implemented enhancements:**

- Polish voting page [\#344](https://github.com/LiskHQ/lisk-nano/issues/344)
- After the confirmation of a 1st/2nd passphrase, add another step [\#331](https://github.com/LiskHQ/lisk-nano/issues/331)
- Conform all numbers with comma [\#326](https://github.com/LiskHQ/lisk-nano/issues/326)
- Visual bug with the tabs - 1px white line on the left side [\#321](https://github.com/LiskHQ/lisk-nano/issues/321)
- Improve sign and verify message output styling [\#150](https://github.com/LiskHQ/lisk-nano/issues/150)

**Fixed bugs:**

- Forging tab doesn't show correct template for \(non-\)delegate accounts [\#391](https://github.com/LiskHQ/lisk-nano/issues/391)
- Address and balance overflows on smaller screen [\#389](https://github.com/LiskHQ/lisk-nano/issues/389)
- Delegate registration popup doesn't show second passphrase input [\#388](https://github.com/LiskHQ/lisk-nano/issues/388)
- Javascript Error: app.setAboutPanelOptions is not a function [\#386](https://github.com/LiskHQ/lisk-nano/issues/386)
- Delegates highlighting after voting is broken [\#380](https://github.com/LiskHQ/lisk-nano/issues/380)
- Cancel button does not work in delegate registration modal [\#373](https://github.com/LiskHQ/lisk-nano/issues/373)
- Forging tab still have "Load more" button/lavel [\#367](https://github.com/LiskHQ/lisk-nano/issues/367)
- 25 LSK fee showing for a new account [\#363](https://github.com/LiskHQ/lisk-nano/issues/363)
- Window jumps to top when loading more transactions. [\#361](https://github.com/LiskHQ/lisk-nano/issues/361)
- Polish voting page [\#344](https://github.com/LiskHQ/lisk-nano/issues/344)

**Closed issues:**

- Empty recipient field when clicking on sender address [\#381](https://github.com/LiskHQ/lisk-nano/issues/381)
- Connect to mainnet nodes via https [\#378](https://github.com/LiskHQ/lisk-nano/issues/378)
- Jenkins Coveralls Reporter lost from Karma.conf.js [\#374](https://github.com/LiskHQ/lisk-nano/issues/374)
- Uncaught Exception on Startup [\#364](https://github.com/LiskHQ/lisk-nano/issues/364)
- Unify use of modal full screen mode [\#358](https://github.com/LiskHQ/lisk-nano/issues/358)
- Change delegate registration modal header [\#345](https://github.com/LiskHQ/lisk-nano/issues/345)
- Remove "input names" feature from Voting tab [\#343](https://github.com/LiskHQ/lisk-nano/issues/343)

**Merged pull requests:**

- Bumping version - 1.0.0-rc.3 [\#397](https://github.com/LiskHQ/lisk-nano/pull/397) ([Isabello](https://github.com/Isabello))
- Fix the header for smaller displays - Closes \#389 [\#396](https://github.com/LiskHQ/lisk-nano/pull/396) ([reyraa](https://github.com/reyraa))
- Fix delegates highlighting after voting - Closes \#380 [\#394](https://github.com/LiskHQ/lisk-nano/pull/394) ([slaweet](https://github.com/slaweet))
- Fix template issues in forging tab - Closes \#391 [\#392](https://github.com/LiskHQ/lisk-nano/pull/392) ([reyraa](https://github.com/reyraa))
- Delegate registration popup fixings - Closes \#388 [\#390](https://github.com/LiskHQ/lisk-nano/pull/390) ([reyraa](https://github.com/reyraa))
- Fix Javascript Error: app.setAboutPanelOptions is not a function [\#387](https://github.com/LiskHQ/lisk-nano/pull/387) ([alepop](https://github.com/alepop))
- Change delegate registration modal header text - Closes \#345 [\#385](https://github.com/LiskHQ/lisk-nano/pull/385) ([yasharAyari](https://github.com/yasharAyari))
- Polish voting page - Closes \#344 [\#384](https://github.com/LiskHQ/lisk-nano/pull/384) ([yasharAyari](https://github.com/yasharAyari))
- Remove 'input names' feature from Voting tab - Closes \#343 [\#383](https://github.com/LiskHQ/lisk-nano/pull/383) ([yasharAyari](https://github.com/yasharAyari))
- Fixes the usage of modal.dialog - Closes \#381 [\#382](https://github.com/LiskHQ/lisk-nano/pull/382) ([reyraa](https://github.com/reyraa))
- Connect to mainnet nodes via https - Closes \#378 [\#379](https://github.com/LiskHQ/lisk-nano/pull/379) ([slaweet](https://github.com/slaweet))
- Hide "Load More" button in forging tab - Closes \#367 [\#377](https://github.com/LiskHQ/lisk-nano/pull/377) ([slaweet](https://github.com/slaweet))
- Restore karma-jenkins-reporter in karma.conf.js - Closes \#374 [\#376](https://github.com/LiskHQ/lisk-nano/pull/376) ([Isabello](https://github.com/Isabello))
- Hide modal in cancel method - Closes \#373 [\#375](https://github.com/LiskHQ/lisk-nano/pull/375) ([reyraa](https://github.com/reyraa))
- Don't show a fee on new account registration - Closes \#363 [\#372](https://github.com/LiskHQ/lisk-nano/pull/372) ([slaweet](https://github.com/slaweet))
- Remove extra gray in vote dialog - Closes \#330 [\#371](https://github.com/LiskHQ/lisk-nano/pull/371) ([slaweet](https://github.com/slaweet))
- Unify modals fullscreen and width - Closes \#358 [\#370](https://github.com/LiskHQ/lisk-nano/pull/370) ([slaweet](https://github.com/slaweet))
- Fix load more transactions jumps to top bug - Closes \#361 [\#369](https://github.com/LiskHQ/lisk-nano/pull/369) ([slaweet](https://github.com/slaweet))
- Intro for passphrase generation modals - Closes 331 [\#359](https://github.com/LiskHQ/lisk-nano/pull/359) ([reyraa](https://github.com/reyraa))
- Conform all numbers with comma - Closes \#326 [\#339](https://github.com/LiskHQ/lisk-nano/pull/339) ([yasharAyari](https://github.com/yasharAyari))
- Fix visual bug with the tabs in main component- Closes \#321 [\#337](https://github.com/LiskHQ/lisk-nano/pull/337) ([yasharAyari](https://github.com/yasharAyari))

## [v1.0.0-rc.2](https://github.com/LiskHQ/lisk-nano/tree/v1.0.0-rc.2) (2017-06-08)
[Full Changelog](https://github.com/LiskHQ/lisk-nano/compare/v1.0.0-rc.1...v1.0.0-rc.2)

**Implemented enhancements:**

- Not all modals show the fees of a transaction [\#332](https://github.com/LiskHQ/lisk-nano/issues/332)
- Same loading bar which is all the time at the same location [\#328](https://github.com/LiskHQ/lisk-nano/issues/328)
- A blue border around "Show all columns" menu [\#323](https://github.com/LiskHQ/lisk-nano/issues/323)
- Move the √ icon from the peers box to the inner network box [\#320](https://github.com/LiskHQ/lisk-nano/issues/320)
- Check version compatibility on login [\#309](https://github.com/LiskHQ/lisk-nano/issues/309)
- All forms should look and feel the same [\#301](https://github.com/LiskHQ/lisk-nano/issues/301)
- Display nethash when logged in [\#285](https://github.com/LiskHQ/lisk-nano/issues/285)
- Show desktop notifications for changes [\#253](https://github.com/LiskHQ/lisk-nano/issues/253)

**Fixed bugs:**

- Send all funds is not clickable [\#356](https://github.com/LiskHQ/lisk-nano/issues/356)
- Auto select the Recipient Address in the send modal [\#333](https://github.com/LiskHQ/lisk-nano/issues/333)
- Add infinity scroll to "Forged blocks" [\#327](https://github.com/LiskHQ/lisk-nano/issues/327)
- Add shadow to the TRANSACTIONS menu entry [\#299](https://github.com/LiskHQ/lisk-nano/issues/299)
- New account doesn't load delegates [\#288](https://github.com/LiskHQ/lisk-nano/issues/288)
- Send all funds message [\#286](https://github.com/LiskHQ/lisk-nano/issues/286)
- Custom node still allows login if its not online [\#283](https://github.com/LiskHQ/lisk-nano/issues/283)
- Wrong tooltip wording [\#281](https://github.com/LiskHQ/lisk-nano/issues/281)
- New Account switches network after closing modal [\#280](https://github.com/LiskHQ/lisk-nano/issues/280)

**Closed issues:**

- White space above the transactions table [\#329](https://github.com/LiskHQ/lisk-nano/issues/329)
- Add % symbol behind the percentage number for uptime/approval on the voting page [\#322](https://github.com/LiskHQ/lisk-nano/issues/322)
- Official nodes distribution [\#318](https://github.com/LiskHQ/lisk-nano/issues/318)
- Postgress fail on Ubuntu 17.04 [\#317](https://github.com/LiskHQ/lisk-nano/issues/317)
- Unify transaction confirmation [\#315](https://github.com/LiskHQ/lisk-nano/issues/315)
- Research framework migration paths [\#311](https://github.com/LiskHQ/lisk-nano/issues/311)
- Align modal headers with the forms and buttons [\#302](https://github.com/LiskHQ/lisk-nano/issues/302)
- VOTING page is not loading on a new account [\#300](https://github.com/LiskHQ/lisk-nano/issues/300)
- Add a border-radius to the main menu [\#298](https://github.com/LiskHQ/lisk-nano/issues/298)
- Draw the thin gray line through the end at the 3-dot menu [\#297](https://github.com/LiskHQ/lisk-nano/issues/297)
- Problem with the 3 dots in send modal, responsive design [\#296](https://github.com/LiskHQ/lisk-nano/issues/296)
- Buttons in modals are not aligned correctly [\#295](https://github.com/LiskHQ/lisk-nano/issues/295)
- Conformity between modals [\#294](https://github.com/LiskHQ/lisk-nano/issues/294)
- Copyright in the about is incorrect [\#287](https://github.com/LiskHQ/lisk-nano/issues/287)
- Refactor new passphrase modal into a component [\#189](https://github.com/LiskHQ/lisk-nano/issues/189)

**Merged pull requests:**

- Send the right options to Send modal - Closes \#356 [\#357](https://github.com/LiskHQ/lisk-nano/pull/357) ([reyraa](https://github.com/reyraa))
- Use one universal loading bar - Closes \#328 [\#340](https://github.com/LiskHQ/lisk-nano/pull/340) ([slaweet](https://github.com/slaweet))
- Remove the blue border around "Show all columns" - Closes \#323 [\#338](https://github.com/LiskHQ/lisk-nano/pull/338) ([slaweet](https://github.com/slaweet))
- Keep the load-more button hidden if the page has vertical scrollbar - Closes \#327 [\#336](https://github.com/LiskHQ/lisk-nano/pull/336) ([reyraa](https://github.com/reyraa))
- Add infinity scroll for forged blocks [\#335](https://github.com/LiskHQ/lisk-nano/pull/335) ([alepop](https://github.com/alepop))
- Minor ui fixes [\#334](https://github.com/LiskHQ/lisk-nano/pull/334) ([alepop](https://github.com/alepop))
- Add % symbol for uptime/approval on the voting page - Closes \#322 [\#325](https://github.com/LiskHQ/lisk-nano/pull/325) ([slaweet](https://github.com/slaweet))
- Move online/offline icon inside node element - Closes \#320 [\#324](https://github.com/LiskHQ/lisk-nano/pull/324) ([slaweet](https://github.com/slaweet))
- Remove login page title [\#319](https://github.com/LiskHQ/lisk-nano/pull/319) ([slaweet](https://github.com/slaweet))
- Unify transaction confirmation - Closes \#315 [\#316](https://github.com/LiskHQ/lisk-nano/pull/316) ([slaweet](https://github.com/slaweet))
- Check version compatibility on login - Closes \#309 [\#314](https://github.com/LiskHQ/lisk-nano/pull/314) ([slaweet](https://github.com/slaweet))
- Improve sign/verify message ui - Closes \#150 [\#313](https://github.com/LiskHQ/lisk-nano/pull/313) ([reyraa](https://github.com/reyraa))
- Unify modals buttons and alignment [\#312](https://github.com/LiskHQ/lisk-nano/pull/312) ([slaweet](https://github.com/slaweet))
- UI fixings: Unify forms, shadow to main tabs [\#310](https://github.com/LiskHQ/lisk-nano/pull/310) ([reyraa](https://github.com/reyraa))
- Add modal method to dialog service as general modal service [\#308](https://github.com/LiskHQ/lisk-nano/pull/308) ([yasharAyari](https://github.com/yasharAyari))
- Try to connect on login page before going further - Closes \#283 [\#307](https://github.com/LiskHQ/lisk-nano/pull/307) ([slaweet](https://github.com/slaweet))
- UI fixes [\#306](https://github.com/LiskHQ/lisk-nano/pull/306) ([alepop](https://github.com/alepop))
- Fix Copyright date range - Closes \#287 [\#293](https://github.com/LiskHQ/lisk-nano/pull/293) ([alepop](https://github.com/alepop))
- Refine top header [\#292](https://github.com/LiskHQ/lisk-nano/pull/292) ([reyraa](https://github.com/reyraa))
- Keep selected network on new account cancellation - Closes \#280 [\#291](https://github.com/LiskHQ/lisk-nano/pull/291) ([slaweet](https://github.com/slaweet))
- Fix delegate list on new account - Closes \#288 [\#290](https://github.com/LiskHQ/lisk-nano/pull/290) ([slaweet](https://github.com/slaweet))
- Refactor save passphrase modal into a component - Closes \#189 [\#278](https://github.com/LiskHQ/lisk-nano/pull/278) ([slaweet](https://github.com/slaweet))
- Show desktop notifications for changes [\#263](https://github.com/LiskHQ/lisk-nano/pull/263) ([alepop](https://github.com/alepop))

## [v1.0.0-rc.1](https://github.com/LiskHQ/lisk-nano/tree/v1.0.0-rc.1) (2017-05-31)
[Full Changelog](https://github.com/LiskHQ/lisk-nano/compare/v0.2.1...v1.0.0-rc.1)

**Implemented enhancements:**

- Send funds by clicking on account balance and transaction amount [\#270](https://github.com/LiskHQ/lisk-nano/issues/270)
- Signing a message simplicity [\#261](https://github.com/LiskHQ/lisk-nano/issues/261)
- Sign/verify message should contain some explanation [\#181](https://github.com/LiskHQ/lisk-nano/issues/181)
- Use window.requestAnimationFrame\(\) instead of timeouts [\#174](https://github.com/LiskHQ/lisk-nano/issues/174)

**Fixed bugs:**

- Circular progress bar should be overlaid when connecting to peer [\#272](https://github.com/LiskHQ/lisk-nano/issues/272)
- 2nd passphrase generation bug [\#267](https://github.com/LiskHQ/lisk-nano/issues/267)
- Infinite scrolling doesn't work in big screens [\#256](https://github.com/LiskHQ/lisk-nano/issues/256)
- Sending a transaction to own address displays the sent transaction but not the received [\#236](https://github.com/LiskHQ/lisk-nano/issues/236)
- Fee and Amount headers are missaligned [\#225](https://github.com/LiskHQ/lisk-nano/issues/225)
- Implement Try/Catch in Jenkins File [\#223](https://github.com/LiskHQ/lisk-nano/issues/223)
- Default window size is massive on large display [\#221](https://github.com/LiskHQ/lisk-nano/issues/221)
- Delegate name shown is too timid [\#219](https://github.com/LiskHQ/lisk-nano/issues/219)
- Secondary menu for Forged Blocks is not vertically aligned [\#217](https://github.com/LiskHQ/lisk-nano/issues/217)
- Input labels not visible after text entered [\#214](https://github.com/LiskHQ/lisk-nano/issues/214)
- Running electron app opens blank window [\#213](https://github.com/LiskHQ/lisk-nano/issues/213)
- Fix names of services in delegateApi.js and forgingApi.js [\#208](https://github.com/LiskHQ/lisk-nano/issues/208)

**Closed issues:**

- Download link broken for Mac DMG [\#251](https://github.com/LiskHQ/lisk-nano/issues/251)
- ccccccgiukgtugtvctgeektecvrcdjvnjltbbigjrvdl [\#250](https://github.com/LiskHQ/lisk-nano/issues/250)
- Resolve FIXME comments in e2e tests [\#203](https://github.com/LiskHQ/lisk-nano/issues/203)
- Refactor e2e tests to multitple files and use cucumber [\#202](https://github.com/LiskHQ/lisk-nano/issues/202)
- Setup watch mode for eslint  [\#186](https://github.com/LiskHQ/lisk-nano/issues/186)
- Make files organisation clearer [\#154](https://github.com/LiskHQ/lisk-nano/issues/154)
- Document source code using YUIDoc [\#30](https://github.com/LiskHQ/lisk-nano/issues/30)

**Merged pull requests:**

- Make offline progress bar overlay - Closes \#272 [\#273](https://github.com/LiskHQ/lisk-nano/pull/273) ([slaweet](https://github.com/slaweet))
- Send from address or amount - Closes \#270 [\#271](https://github.com/LiskHQ/lisk-nano/pull/271) ([reyraa](https://github.com/reyraa))
- Unbind mousemove listener on passphrase directive $destroy - Closes \#267 [\#269](https://github.com/LiskHQ/lisk-nano/pull/269) ([slaweet](https://github.com/slaweet))
- Disable new account e2e test [\#266](https://github.com/LiskHQ/lisk-nano/pull/266) ([slaweet](https://github.com/slaweet))
- 186 setup watch mode for eslint [\#264](https://github.com/LiskHQ/lisk-nano/pull/264) ([alepop](https://github.com/alepop))
- Add "sign and copy to clipboard" button to sign message - Closes \#261 [\#262](https://github.com/LiskHQ/lisk-nano/pull/262) ([slaweet](https://github.com/slaweet))
- Add some explanation to sign/verify message - Closes \#181 [\#259](https://github.com/LiskHQ/lisk-nano/pull/259) ([slaweet](https://github.com/slaweet))
- Add "Load more" button back to transactions list - Closes \#256 [\#258](https://github.com/LiskHQ/lisk-nano/pull/258) ([slaweet](https://github.com/slaweet))
- Fix transaction list order [\#257](https://github.com/LiskHQ/lisk-nano/pull/257) ([slaweet](https://github.com/slaweet))
- Refactor e2e tests to multitple files and use cucumber - Closes \#202 [\#252](https://github.com/LiskHQ/lisk-nano/pull/252) ([slaweet](https://github.com/slaweet))
- Make tabs more visible - Closes \#220 [\#248](https://github.com/LiskHQ/lisk-nano/pull/248) ([reyraa](https://github.com/reyraa))
- Rename Transfer to Send - Closes \#215 [\#247](https://github.com/LiskHQ/lisk-nano/pull/247) ([slaweet](https://github.com/slaweet))
- Display reflexive transaction in gray with circle arrow - Closes \#236 [\#246](https://github.com/LiskHQ/lisk-nano/pull/246) ([slaweet](https://github.com/slaweet))
- Fix names of services in delegateApi.js and forgingApi.js - Closes \#208 [\#245](https://github.com/LiskHQ/lisk-nano/pull/245) ([slaweet](https://github.com/slaweet))
- Correct lock resources for nano [\#243](https://github.com/LiskHQ/lisk-nano/pull/243) ([Isabello](https://github.com/Isabello))
- Make files organisation clearer - Closes \#154 [\#242](https://github.com/LiskHQ/lisk-nano/pull/242) ([alepop](https://github.com/alepop))
- Revert "Make files organisation clearer - Resolves \#154" [\#241](https://github.com/LiskHQ/lisk-nano/pull/241) ([slaweet](https://github.com/slaweet))
- Add documentation, Fixes \#30 [\#240](https://github.com/LiskHQ/lisk-nano/pull/240) ([reyraa](https://github.com/reyraa))
- Fix forging unit tests [\#239](https://github.com/LiskHQ/lisk-nano/pull/239) ([slaweet](https://github.com/slaweet))
- Make delegate name less timid - Closes \#219 [\#238](https://github.com/LiskHQ/lisk-nano/pull/238) ([slaweet](https://github.com/slaweet))
- Fix forging tab visibility - Closes \#218 [\#237](https://github.com/LiskHQ/lisk-nano/pull/237) ([slaweet](https://github.com/slaweet))
- Fix input label overflow - Closes \#214 [\#230](https://github.com/LiskHQ/lisk-nano/pull/230) ([slaweet](https://github.com/slaweet))
- Fix alignment of md-checkbox in md-menu-item - Closes \#217 [\#229](https://github.com/LiskHQ/lisk-nano/pull/229) ([slaweet](https://github.com/slaweet))
- Change secondary menu options and order - Closes \#216 [\#228](https://github.com/LiskHQ/lisk-nano/pull/228) ([slaweet](https://github.com/slaweet))
- Fix transaction fee and amount header alignment - Closes \#225 [\#227](https://github.com/LiskHQ/lisk-nano/pull/227) ([slaweet](https://github.com/slaweet))
- Restrict initial window size on big screens - Closes \#221 [\#226](https://github.com/LiskHQ/lisk-nano/pull/226) ([slaweet](https://github.com/slaweet))
- Implement try/catch into Jenkinsfile - Closes \#223 [\#224](https://github.com/LiskHQ/lisk-nano/pull/224) ([Isabello](https://github.com/Isabello))
- Remove base href="/" - Closes \#213 [\#222](https://github.com/LiskHQ/lisk-nano/pull/222) ([slaweet](https://github.com/slaweet))
- Make files organisation clearer - Resolves \#154 [\#212](https://github.com/LiskHQ/lisk-nano/pull/212) ([alepop](https://github.com/alepop))
- Eliminate redundant Api calls. Closes \#174 [\#210](https://github.com/LiskHQ/lisk-nano/pull/210) ([reyraa](https://github.com/reyraa))
- Resolve FIXME comments in e2e tests - Closes \#203 [\#209](https://github.com/LiskHQ/lisk-nano/pull/209) ([slaweet](https://github.com/slaweet))

## [v0.2.1](https://github.com/LiskHQ/lisk-nano/tree/v0.2.1) (2017-05-11)
[Full Changelog](https://github.com/LiskHQ/lisk-nano/compare/v0.2.0...v0.2.1)

**Implemented enhancements:**

- Change the appearance of the Send modal similar to Vote modal [\#175](https://github.com/LiskHQ/lisk-nano/issues/175)
- Simplify peer selection before login [\#153](https://github.com/LiskHQ/lisk-nano/issues/153)
- Improve error message on invalid recipient address [\#142](https://github.com/LiskHQ/lisk-nano/issues/142)
- Improve appearance of low ranking delegate [\#137](https://github.com/LiskHQ/lisk-nano/issues/137)
- Add more menu items to Electron wrapper [\#134](https://github.com/LiskHQ/lisk-nano/issues/134)
- Enable context menu [\#121](https://github.com/LiskHQ/lisk-nano/issues/121)
- Add routing functionality [\#117](https://github.com/LiskHQ/lisk-nano/issues/117)
- Add about menu dialog to electron wrapper [\#107](https://github.com/LiskHQ/lisk-nano/issues/107)
- Move send form to a dialog opened by a button at the top [\#88](https://github.com/LiskHQ/lisk-nano/issues/88)
- "Load more" - replacement  [\#66](https://github.com/LiskHQ/lisk-nano/issues/66)
- Add possibility to sign/verify message [\#29](https://github.com/LiskHQ/lisk-nano/issues/29)
- Add delegate votes management [\#24](https://github.com/LiskHQ/lisk-nano/issues/24)
- Add support for delegate registration [\#22](https://github.com/LiskHQ/lisk-nano/issues/22)
- Add support for second passphrase registration [\#21](https://github.com/LiskHQ/lisk-nano/issues/21)

**Fixed bugs:**

- Force SCM checkout in Jenkins [\#205](https://github.com/LiskHQ/lisk-nano/issues/205)
- Account with second passphrase cannot register as delegate [\#198](https://github.com/LiskHQ/lisk-nano/issues/198)
- Maximum amount validation doesn't work [\#194](https://github.com/LiskHQ/lisk-nano/issues/194)
- Second passphrase registration menu item persists [\#190](https://github.com/LiskHQ/lisk-nano/issues/190)
- http://localhost:8080/ is broken [\#180](https://github.com/LiskHQ/lisk-nano/issues/180)
- Fix repeater issue in transaction list [\#157](https://github.com/LiskHQ/lisk-nano/issues/157)
- Signed message output missing publickey for cold accounts [\#152](https://github.com/LiskHQ/lisk-nano/issues/152)
- Closing new account procedure results in inaccessible login [\#148](https://github.com/LiskHQ/lisk-nano/issues/148)
- Appearance issues in Firefox [\#147](https://github.com/LiskHQ/lisk-nano/issues/147)
- Delegate account is not clearly indicated [\#141](https://github.com/LiskHQ/lisk-nano/issues/141)
- Vote button should be disabled until delegates selected [\#140](https://github.com/LiskHQ/lisk-nano/issues/140)
- Clicking "My Votes" when zero displays empty rectangle [\#139](https://github.com/LiskHQ/lisk-nano/issues/139)
- Vote confirmation modal overflows, hiding header and footer [\#138](https://github.com/LiskHQ/lisk-nano/issues/138)
- Peer selection highlighted as errorneous when passphrase invalid [\#136](https://github.com/LiskHQ/lisk-nano/issues/136)
- Scientific annotation displayed on transaction history [\#128](https://github.com/LiskHQ/lisk-nano/issues/128)
- Inconsistency in transaction amount [\#127](https://github.com/LiskHQ/lisk-nano/issues/127)
- Peer selection does not work [\#124](https://github.com/LiskHQ/lisk-nano/issues/124)
- Set maximum amount function invalid [\#122](https://github.com/LiskHQ/lisk-nano/issues/122)
- OSX Build is now --mac for electron builder [\#120](https://github.com/LiskHQ/lisk-nano/issues/120)
- Remove Git Hooks from src/package.json [\#111](https://github.com/LiskHQ/lisk-nano/issues/111)
- Logout button / app quitting [\#64](https://github.com/LiskHQ/lisk-nano/issues/64)

**Closed issues:**

- Implement Jenkins to run CI [\#192](https://github.com/LiskHQ/lisk-nano/issues/192)
- Update lisk-js to version 0.4.1 [\#182](https://github.com/LiskHQ/lisk-nano/issues/182)
- Unify angular service naming [\#179](https://github.com/LiskHQ/lisk-nano/issues/179)
- Create e2e tests for all 1.0.0 features [\#178](https://github.com/LiskHQ/lisk-nano/issues/178)
- Review test coverage [\#171](https://github.com/LiskHQ/lisk-nano/issues/171)
- Refactor some parts of forging controller into a service [\#170](https://github.com/LiskHQ/lisk-nano/issues/170)
- Refactor peers service account-related methods [\#169](https://github.com/LiskHQ/lisk-nano/issues/169)
- Update or remove unmaintained History.md [\#155](https://github.com/LiskHQ/lisk-nano/issues/155)
- Signed build for macOS and Windows [\#91](https://github.com/LiskHQ/lisk-nano/issues/91)
- Create an issue template [\#85](https://github.com/LiskHQ/lisk-nano/issues/85)
- Integrate end to end tests into travis build [\#54](https://github.com/LiskHQ/lisk-nano/issues/54)

**Merged pull requests:**

- Preparing 0.2.1 release [\#207](https://github.com/LiskHQ/lisk-nano/pull/207) ([karmacoma](https://github.com/karmacoma))
- Correct Jenkinsfile checkout issue - Closes \#205 [\#206](https://github.com/LiskHQ/lisk-nano/pull/206) ([Isabello](https://github.com/Isabello))
- Fix delegate registration for account with second passphrase - Closes \#198 [\#204](https://github.com/LiskHQ/lisk-nano/pull/204) ([slaweet](https://github.com/slaweet))
- Create e2e tests for all 1.0.0 features - Closes \#178 [\#201](https://github.com/LiskHQ/lisk-nano/pull/201) ([slaweet](https://github.com/slaweet))
- Fix maximum amount validation - Closes \#194 [\#200](https://github.com/LiskHQ/lisk-nano/pull/200) ([slaweet](https://github.com/slaweet))
- Unify naming conventions - Closes \#179 [\#199](https://github.com/LiskHQ/lisk-nano/pull/199) ([reyraa](https://github.com/reyraa))
- Fix maximum amount validation - Closes \#194 [\#197](https://github.com/LiskHQ/lisk-nano/pull/197) ([slaweet](https://github.com/slaweet))
- Initial implementation of Jenkins CI - Closes \#192 [\#195](https://github.com/LiskHQ/lisk-nano/pull/195) ([Isabello](https://github.com/Isabello))
- Hide 2nd passphrase menu item after registration - Closes \#190 [\#191](https://github.com/LiskHQ/lisk-nano/pull/191) ([slaweet](https://github.com/slaweet))
- Fix routing issues - Closes \#180 [\#188](https://github.com/LiskHQ/lisk-nano/pull/188) ([reyraa](https://github.com/reyraa))
- Updating lisk-js - Closes \#182 [\#187](https://github.com/LiskHQ/lisk-nano/pull/187) ([karmacoma](https://github.com/karmacoma))
- Review test coverage - Closes \#171 [\#185](https://github.com/LiskHQ/lisk-nano/pull/185) ([slaweet](https://github.com/slaweet))
- Updating lisk-js - Closes \#182 [\#184](https://github.com/LiskHQ/lisk-nano/pull/184) ([karmacoma](https://github.com/karmacoma))
- Change the style of Send modal to make it similar to other modals - Closes \#175 [\#177](https://github.com/LiskHQ/lisk-nano/pull/177) ([reyraa](https://github.com/reyraa))
- Move $peers service account-related methods to Account - Closes \#169 [\#176](https://github.com/LiskHQ/lisk-nano/pull/176) ([slaweet](https://github.com/slaweet))
- Refactor some parts of forging controller into a service - Closes \#170 [\#173](https://github.com/LiskHQ/lisk-nano/pull/173) ([slaweet](https://github.com/slaweet))
- Fixing appearance issues in Firefox - Fixes \#147 [\#172](https://github.com/LiskHQ/lisk-nano/pull/172) ([reyraa](https://github.com/reyraa))
- Support delegate registration - Closes \#22 [\#168](https://github.com/LiskHQ/lisk-nano/pull/168) ([reyraa](https://github.com/reyraa))
- Refactor use of alert dialogs and toasts [\#167](https://github.com/LiskHQ/lisk-nano/pull/167) ([slaweet](https://github.com/slaweet))
- Fix disable button reverts [\#166](https://github.com/LiskHQ/lisk-nano/pull/166) ([slaweet](https://github.com/slaweet))
- Fix new account generation cancel action - Closes \#148 [\#165](https://github.com/LiskHQ/lisk-nano/pull/165) ([slaweet](https://github.com/slaweet))
- Simplify peer selection dropdown on login page - Closes \#153 [\#164](https://github.com/LiskHQ/lisk-nano/pull/164) ([slaweet](https://github.com/slaweet))
- Prevent send form errors after successful transaction [\#162](https://github.com/LiskHQ/lisk-nano/pull/162) ([slaweet](https://github.com/slaweet))
- Second passphrase should be null not undefined [\#161](https://github.com/LiskHQ/lisk-nano/pull/161) ([slaweet](https://github.com/slaweet))
- Make sure that send dialog shows decimal point, not comma [\#160](https://github.com/LiskHQ/lisk-nano/pull/160) ([slaweet](https://github.com/slaweet))
- Fix repeater issue in transaction list - Fixes \#157 [\#159](https://github.com/LiskHQ/lisk-nano/pull/159) ([slaweet](https://github.com/slaweet))
- Add routing functionality - Fixes \#117 [\#158](https://github.com/LiskHQ/lisk-nano/pull/158) ([reyraa](https://github.com/reyraa))
- Removing unmaintained History.md - Closes \#155 [\#156](https://github.com/LiskHQ/lisk-nano/pull/156) ([karmacoma](https://github.com/karmacoma))
- Distinguish input and output in sign/verify message - Closes \#150 [\#151](https://github.com/LiskHQ/lisk-nano/pull/151) ([slaweet](https://github.com/slaweet))
- Use angular-svg-round-progressbar in forging center - Fixes \#137 [\#149](https://github.com/LiskHQ/lisk-nano/pull/149) ([slaweet](https://github.com/slaweet))
- Vote list too high - Fixes \#138 [\#146](https://github.com/LiskHQ/lisk-nano/pull/146) ([slaweet](https://github.com/slaweet))
- Support second passphrase - Closes \#21 [\#145](https://github.com/LiskHQ/lisk-nano/pull/145) ([reyraa](https://github.com/reyraa))
- Disable "My Votes \(0\)" button - Fixes \#139 [\#144](https://github.com/LiskHQ/lisk-nano/pull/144) ([slaweet](https://github.com/slaweet))
- Disable vote button until delegates selected - Closes \#140 [\#143](https://github.com/LiskHQ/lisk-nano/pull/143) ([slaweet](https://github.com/slaweet))
- Add more menu items to Electron wrapper - Closes \#134 [\#135](https://github.com/LiskHQ/lisk-nano/pull/135) ([slaweet](https://github.com/slaweet))
- Add possibility to sign/verify message - Closes \#29 [\#133](https://github.com/LiskHQ/lisk-nano/pull/133) ([slaweet](https://github.com/slaweet))
- Fix maximum amount function - Closes \#122 [\#131](https://github.com/LiskHQ/lisk-nano/pull/131) ([slaweet](https://github.com/slaweet))
- Fix transaction amount inconsistency - Closes \#127 [\#130](https://github.com/LiskHQ/lisk-nano/pull/130) ([slaweet](https://github.com/slaweet))
- Use inifinite scroll for transactions list - Closes \#66 [\#129](https://github.com/LiskHQ/lisk-nano/pull/129) ([slaweet](https://github.com/slaweet))
- Remove Git Hooks from src/package.json - Closes \#111 [\#126](https://github.com/LiskHQ/lisk-nano/pull/126) ([slaweet](https://github.com/slaweet))
- "About" menu item and dialog - Closes \#107 [\#125](https://github.com/LiskHQ/lisk-nano/pull/125) ([slaweet](https://github.com/slaweet))
- Enable context menu - Closes \#121 [\#123](https://github.com/LiskHQ/lisk-nano/pull/123) ([slaweet](https://github.com/slaweet))
- Send through modal - Closes \#88 [\#116](https://github.com/LiskHQ/lisk-nano/pull/116) ([reyraa](https://github.com/reyraa))
- Add delegate votes management - Closes \#24 [\#115](https://github.com/LiskHQ/lisk-nano/pull/115) ([slaweet](https://github.com/slaweet))

## [v0.2.0](https://github.com/LiskHQ/lisk-nano/tree/v0.2.0) (2017-04-18)
[Full Changelog](https://github.com/LiskHQ/lisk-nano/compare/v0.1.2...v0.2.0)

**Implemented enhancements:**

- Select network in login dialog [\#89](https://github.com/LiskHQ/lisk-nano/issues/89)
- Send all [\#62](https://github.com/LiskHQ/lisk-nano/issues/62)
- Add forging center [\#23](https://github.com/LiskHQ/lisk-nano/issues/23)

**Fixed bugs:**

- Prevent regular login with non-bip39-passphrase and ENTER-key [\#112](https://github.com/LiskHQ/lisk-nano/issues/112)
- Login.lisk.io and testnet.lisk.io peers options do not work [\#106](https://github.com/LiskHQ/lisk-nano/issues/106)
- Localhost:7000 is missing from peers options [\#105](https://github.com/LiskHQ/lisk-nano/issues/105)
- Peer doesn't show the peer at first [\#99](https://github.com/LiskHQ/lisk-nano/issues/99)
- App build is broken [\#94](https://github.com/LiskHQ/lisk-nano/issues/94)
- Prevent from calling "new account" function if already called [\#92](https://github.com/LiskHQ/lisk-nano/issues/92)
- Floating-point arithmetic rounding error in balance [\#80](https://github.com/LiskHQ/lisk-nano/issues/80)
- Transactions sent do not appear immediately within listing [\#63](https://github.com/LiskHQ/lisk-nano/issues/63)
- Webpack - Module build failed: SyntaxError [\#55](https://github.com/LiskHQ/lisk-nano/issues/55)
- Received "Error - An error occurred while sending the transaction." message, but Transaction still went through [\#19](https://github.com/LiskHQ/lisk-nano/issues/19)
- Weird behaviour while UI is selected [\#17](https://github.com/LiskHQ/lisk-nano/issues/17)
- New passphrase window sometimes pops-up more than once [\#16](https://github.com/LiskHQ/lisk-nano/issues/16)
- Ctrl/Cmd + A select more than passphrase [\#15](https://github.com/LiskHQ/lisk-nano/issues/15)
- Error: No peer connection. [\#11](https://github.com/LiskHQ/lisk-nano/issues/11)

**Closed issues:**

- Update electron dependencies for binary builds [\#113](https://github.com/LiskHQ/lisk-nano/issues/113)
- Travis build marked as "passed" even though a test case failed [\#97](https://github.com/LiskHQ/lisk-nano/issues/97)
- Figure out how to securely serve Lisk Nano as a web app [\#87](https://github.com/LiskHQ/lisk-nano/issues/87)
- Change license from MIT to GPLv3 [\#79](https://github.com/LiskHQ/lisk-nano/issues/79)
- Speed up webpack build time in unit tests [\#60](https://github.com/LiskHQ/lisk-nano/issues/60)
- Test webpack compilation during travis build [\#57](https://github.com/LiskHQ/lisk-nano/issues/57)
- Set up unit test framework that works with Angular and Webpack [\#52](https://github.com/LiskHQ/lisk-nano/issues/52)
- Add test coverage metric that works with Angular [\#51](https://github.com/LiskHQ/lisk-nano/issues/51)
- Review tests run during travis build [\#46](https://github.com/LiskHQ/lisk-nano/issues/46)
- Fix errors produced by eslint [\#45](https://github.com/LiskHQ/lisk-nano/issues/45)
- Rework code for lisk-js 0.3 [\#42](https://github.com/LiskHQ/lisk-nano/issues/42)
- Setup end-to-end tests [\#41](https://github.com/LiskHQ/lisk-nano/issues/41)
- Migrate Jade to Pug [\#38](https://github.com/LiskHQ/lisk-nano/issues/38)
- Add test coverage metric [\#28](https://github.com/LiskHQ/lisk-nano/issues/28)
- Setup travis based continous integration [\#27](https://github.com/LiskHQ/lisk-nano/issues/27)
- Setup static code analysis [\#26](https://github.com/LiskHQ/lisk-nano/issues/26)
- Setup unit testing framework [\#25](https://github.com/LiskHQ/lisk-nano/issues/25)

**Merged pull requests:**

- Updating lisk-js [\#119](https://github.com/LiskHQ/lisk-nano/pull/119) ([karmacoma](https://github.com/karmacoma))
- Prevent regular login with non-bip39-passphrase and ENTER-key - Closes \#112 [\#118](https://github.com/LiskHQ/lisk-nano/pull/118) ([slaweet](https://github.com/slaweet))
- Update electron build dependencies - Closes \#113 [\#114](https://github.com/LiskHQ/lisk-nano/pull/114) ([Isabello](https://github.com/Isabello))
- Add forging center - Closes \#23 [\#110](https://github.com/LiskHQ/lisk-nano/pull/110) ([slaweet](https://github.com/slaweet))
- Show ports only in localhost peers - Closes \#106 [\#109](https://github.com/LiskHQ/lisk-nano/pull/109) ([slaweet](https://github.com/slaweet))
- Add localhost:7000 to peers options - Closes \#105 [\#108](https://github.com/LiskHQ/lisk-nano/pull/108) ([slaweet](https://github.com/slaweet))
- Fix "send all funds" to set 0 if no funds - Closes \#62 [\#104](https://github.com/LiskHQ/lisk-nano/pull/104) ([slaweet](https://github.com/slaweet))
- Fix peer dropdown for nodes without specified port - Closes \#99 [\#103](https://github.com/LiskHQ/lisk-nano/pull/103) ([slaweet](https://github.com/slaweet))
- Move network selection to login module - Closes \#89 [\#102](https://github.com/LiskHQ/lisk-nano/pull/102) ([reyraa](https://github.com/reyraa))
- Make peer dropdown work also with ports - Closes \#99 [\#101](https://github.com/LiskHQ/lisk-nano/pull/101) ([slaweet](https://github.com/slaweet))
- Fix peer doesn't show the peer at first \#99 [\#100](https://github.com/LiskHQ/lisk-nano/pull/100) ([slaweet](https://github.com/slaweet))
- Failed tests should fail travis build \#97 [\#98](https://github.com/LiskHQ/lisk-nano/pull/98) ([slaweet](https://github.com/slaweet))
- Fix build by not minifying - Closes \#94 [\#95](https://github.com/LiskHQ/lisk-nano/pull/95) ([slaweet](https://github.com/slaweet))
- Disable "New account" button after clicked - Closes \#92 [\#93](https://github.com/LiskHQ/lisk-nano/pull/93) ([slaweet](https://github.com/slaweet))
- Fix floating-point arithmetic rounding error in balance \#80 [\#90](https://github.com/LiskHQ/lisk-nano/pull/90) ([slaweet](https://github.com/slaweet))
- Create an issue template [\#86](https://github.com/LiskHQ/lisk-nano/pull/86) ([slaweet](https://github.com/slaweet))
- Show pending transactions - Closes \#63 [\#84](https://github.com/LiskHQ/lisk-nano/pull/84) ([slaweet](https://github.com/slaweet))
- Adding "send all funds" feature - Closes \#62 [\#83](https://github.com/LiskHQ/lisk-nano/pull/83) ([slaweet](https://github.com/slaweet))
- Rework code for lisk-js 0.3 - Closes \#42 [\#82](https://github.com/LiskHQ/lisk-nano/pull/82) ([slaweet](https://github.com/slaweet))
- Changing license from MIT to GPLv3 - Closes \#79 [\#81](https://github.com/LiskHQ/lisk-nano/pull/81) ([karmacoma](https://github.com/karmacoma))
- E2e test tweaks [\#78](https://github.com/LiskHQ/lisk-nano/pull/78) ([slaweet](https://github.com/slaweet))
- Finish unit tests [\#77](https://github.com/LiskHQ/lisk-nano/pull/77) ([slaweet](https://github.com/slaweet))
- Update authors [\#76](https://github.com/LiskHQ/lisk-nano/pull/76) ([karmacoma](https://github.com/karmacoma))
- Fixing eslint errors - Closes \#45 [\#75](https://github.com/LiskHQ/lisk-nano/pull/75) ([karmacoma](https://github.com/karmacoma))
- Unit test send component [\#74](https://github.com/LiskHQ/lisk-nano/pull/74) ([slaweet](https://github.com/slaweet))
- Test transactions component [\#73](https://github.com/LiskHQ/lisk-nano/pull/73) ([slaweet](https://github.com/slaweet))
- Unit tests of login component [\#72](https://github.com/LiskHQ/lisk-nano/pull/72) ([slaweet](https://github.com/slaweet))
- Adding unit tests [\#70](https://github.com/LiskHQ/lisk-nano/pull/70) ([slaweet](https://github.com/slaweet))
- Adding test coverage metric that works with Angular - Closes \#51 [\#67](https://github.com/LiskHQ/lisk-nano/pull/67) ([slaweet](https://github.com/slaweet))
- Set up unit test framework that works with Angular and Webpack - Closes \#52 [\#59](https://github.com/LiskHQ/lisk-nano/pull/59) ([slaweet](https://github.com/slaweet))
- Test webpack build in travis - Closes \#57 [\#58](https://github.com/LiskHQ/lisk-nano/pull/58) ([slaweet](https://github.com/slaweet))
- Adding babel-plugin-syntax-trailing-function-commas - Closes \#55 [\#56](https://github.com/LiskHQ/lisk-nano/pull/56) ([karmacoma](https://github.com/karmacoma))
- Adding end to end tests - Closes \#41 [\#53](https://github.com/LiskHQ/lisk-nano/pull/53) ([slaweet](https://github.com/slaweet))
- Review tests in travis - Closes \#46 [\#50](https://github.com/LiskHQ/lisk-nano/pull/50) ([slaweet](https://github.com/slaweet))
- Fix eslint errors - Closes \#45 [\#49](https://github.com/LiskHQ/lisk-nano/pull/49) ([slaweet](https://github.com/slaweet))
- Fix new passphrase autofocus - Closes \#15 [\#48](https://github.com/LiskHQ/lisk-nano/pull/48) ([slaweet](https://github.com/slaweet))
- Migrate jade to pug - Closes \#38 [\#47](https://github.com/LiskHQ/lisk-nano/pull/47) ([slaweet](https://github.com/slaweet))
- Gitignore generated file app.js [\#44](https://github.com/LiskHQ/lisk-nano/pull/44) ([slaweet](https://github.com/slaweet))
- Make all npm dependencies version strict [\#43](https://github.com/LiskHQ/lisk-nano/pull/43) ([slaweet](https://github.com/slaweet))
- Setup autologin from a cookie for development purposes [\#40](https://github.com/LiskHQ/lisk-nano/pull/40) ([slaweet](https://github.com/slaweet))
- Fix multiple new passphrase windows bug - Closes \#16 [\#39](https://github.com/LiskHQ/lisk-nano/pull/39) ([slaweet](https://github.com/slaweet))
- Setup travis based continuous intergation - Closes \#27 [\#37](https://github.com/LiskHQ/lisk-nano/pull/37) ([slaweet](https://github.com/slaweet))
- Setup eslint in grunt - Closes \#26 [\#36](https://github.com/LiskHQ/lisk-nano/pull/36) ([slaweet](https://github.com/slaweet))
- Ctrl+a to select passphrase on registration - Closes \#15 [\#35](https://github.com/LiskHQ/lisk-nano/pull/35) ([slaweet](https://github.com/slaweet))
- Adding test coverage metric - Closes \#28 [\#34](https://github.com/LiskHQ/lisk-nano/pull/34) ([Tosch110](https://github.com/Tosch110))
- Adding test suite - Closes \#25 [\#33](https://github.com/LiskHQ/lisk-nano/pull/33) ([Tosch110](https://github.com/Tosch110))
- Update copyright [\#31](https://github.com/LiskHQ/lisk-nano/pull/31) ([Isabello](https://github.com/Isabello))

## [v0.1.2](https://github.com/LiskHQ/lisk-nano/tree/v0.1.2) (2016-12-01)
[Full Changelog](https://github.com/LiskHQ/lisk-nano/compare/v0.1.1...v0.1.2)

**Implemented enhancements:**

- Passphrase unhide possibility [\#6](https://github.com/LiskHQ/lisk-nano/issues/6)

**Closed issues:**

- Mouse scroll changes transaction amount [\#18](https://github.com/LiskHQ/lisk-nano/issues/18)
- Enable Copy of Transaction ID's [\#14](https://github.com/LiskHQ/lisk-nano/issues/14)
- NPM warns electron-prebuilt is depreciated and renamed to electron [\#12](https://github.com/LiskHQ/lisk-nano/issues/12)

**Merged pull requests:**

- electron-prebuilt will be depreciated [\#13](https://github.com/LiskHQ/lisk-nano/pull/13) ([Citizen-X](https://github.com/Citizen-X))

## [v0.1.1](https://github.com/LiskHQ/lisk-nano/tree/v0.1.1) (2016-10-13)
[Full Changelog](https://github.com/LiskHQ/lisk-nano/compare/v0.1.0...v0.1.1)

**Implemented enhancements:**

- Add support for second passphrases [\#1](https://github.com/LiskHQ/lisk-nano/issues/1)

**Fixed bugs:**

- No login with BIP39 mnemonic with more than 12 words [\#2](https://github.com/LiskHQ/lisk-nano/issues/2)

## [v0.1.0](https://github.com/LiskHQ/lisk-nano/tree/v0.1.0) (2016-08-17)
[Full Changelog](https://github.com/LiskHQ/lisk-nano/compare/v0.0.1...v0.1.0)

## [v0.0.1](https://github.com/LiskHQ/lisk-nano/tree/v0.0.1) (2016-08-01)


\* *This Change Log was automatically generated by [github_changelog_generator](https://github.com/skywinder/Github-Changelog-Generator)*