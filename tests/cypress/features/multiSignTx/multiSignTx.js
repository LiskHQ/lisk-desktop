/* eslint-disable */
import { Then } from 'cypress-cucumber-preprocessor/steps';
import { wallets, ss } from '../../../constants';
import { multiSignatureTxs } from '../../utils/mockTx';

Then(/^I enter the publicKey of ([^\s]+) at input ([\w]+)$/, function (walletName, index) {
  cy.get(ss.msignPkInput).eq(index - 1).type(wallets[walletName].summary.publicKey);
});

Then(/^I set ([\w]+) inputs as optional$/, function (numOfOptionals) {
  for (let index = 1; index <= numOfOptionals; index++) {
    cy.get(ss.mandatoryToggle).eq(index).click();
    cy.get(ss.selectOptional).eq(index).click();
    cy.get(ss.mandatoryToggle).eq(index).click();
  }
});

Then(/^I paste transaction ([^\s]+)$/, function (tx) {
  cy.get(ss.txSignInput).paste({ pastePayload: multiSignatureTxs[tx] });
});

Then(/^I confirm data of ([^\s]+)$/, function (tx) {
  let template = {};
  switch (tx) {
    case 'RegisterMultiSignGroupTx_second_sign':
      template.txSenderAddress = 'lsks6wh4zqfd8wyka3rj243rshcdqyug9gyvehxwz';
      template.txNumberOfSignatures = '2';
      template.memberTitle = [
        'lskdxc...cw7yt(Optional)',
        'lskehj...o9cjy(Optional)',
        'lsks6w...ehxwz(Mandatory)',
        'lsks6w...ehxwz(Mandatory)',
        'lskdxc...cw7yt(Optional)',
        'lskehj...o9cjy(Optional)',
      ];
      template.txFee = '0.00414 LSK';
      template.txRemainingMembers = ' 2/3';
      break;
    case 'RegisterMultiSignGroupTx_third_sign':
      template.txSenderAddress = 'lsks6wh4zqfd8wyka3rj243rshcdqyug9gyvehxwz';
      template.txNumberOfSignatures = '2';
      template.memberTitle = [
        'lskdxc...cw7yt(Optional)',        
        'lskehj...o9cjy(Optional)',
        'lsks6w...ehxwz(Mandatory)',
        'lsks6w...ehxwz(Mandatory)',
        'lskdxc...cw7yt(Optional)',
        'lskehj...o9cjy(Optional)',
      ];
      template.txFee = '0.00414 LSK';
      template.txRemainingMembers = ' 1/3';
      break;
    case 'RegisterSecondPassphraseTx':
      template.txSenderAddress = 'lskwunwxqmss9w3mtuvzgbsfy665cz4eo3rd2mxdp';
      template.txNumberOfSignatures = '2';
      template.memberTitle = [
        'lskwun...2mxdp(Mandatory)',
        'lskehj...o9cjy(Mandatory)',
        'lskwun...2mxdp(Mandatory)',
        'lskehj...o9cjy(Mandatory)',
      ];
      template.txFee = '0.00314 LSK';
      template.txRemainingMembers = ' 1/2';
      break;
    default:
      break;
  }
  cy.get(ss.txHeader).eq(0).should('have.text', 'Register multisignature group');
  cy.get(ss.txSenderAddress).eq(0).should('have.text', template.txSenderAddress);
  cy.get(ss.txNumberOfSignatures).eq(0).should('have.text', template.txNumberOfSignatures);
  cy.get(ss.txFee).eq(0).should('have.text', template.txFee);
  cy.get(ss.txRemainingMembers).eq(0).should('have.text', template.txRemainingMembers);
  template.memberTitle.forEach((el, index) => {
    cy.get(ss.memberTitle).eq(index).should('have.text', el);
  })
});

Then(/^I input second passphrase$/, function () {
  cy.get(ss.passphraseInput).first().click();
  cy.get(ss.passphraseInput).each(($el, index) => {
    const passphraseWordsArray = wallets.validator.passphrase.split(' ');
    cy.wrap($el, { log: false }).type(passphraseWordsArray[index], { log: false });
  });
});

Then(/^I should have the transaction ([^\s]+) in the clipboard$/, function (tx) {
  cy.window().then((win) => {
    win.navigator.clipboard.readText().then((text) => {
      expect(text).to.eq(multiSignatureTxs[tx]);
    });
  });
});

Then(/^([^\s]+) should have been downloaded correctly$/, function (tx) {
  cy.readFile(`cypress/downloads/tx-${JSON.parse(multiSignatureTxs[tx]).id}.json`).then(json => {
    expect(JSON.stringify(json)).to.eq(multiSignatureTxs[tx]);
  });
});
