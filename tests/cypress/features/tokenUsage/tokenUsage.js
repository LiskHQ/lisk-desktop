/* eslint-disable */
import { ss, urls } from '../../../constants';
import { Given, Then } from 'cypress-cucumber-preprocessor/steps';

Then(/^request token page should be properly displayed$/, function () {
  cy.contains(
    'Use the sharing link to easily request any amount of tokens from Lisk Desktop or Lisk Mobile users.'
  )
    .eq(0)
    .should(
      'have.text',
      'Use the sharing link to easily request any amount of tokens from Lisk Desktop or Lisk Mobile users.'
    );

  cy.contains('Simply scan the QR code using the Lisk Mobile app or any other QR code reader.')
    .eq(0)
    .should(
      'have.text',
      'Simply scan the QR code using the Lisk Mobile app or any other QR code reader.'
    );
});

Then(/^request token url should be on clipboard$/, function () {
  cy.window().then((win) => {
    win.navigator.clipboard.readText().then((clipboardValue) => {
      expect(clipboardValue).eq(
        'lisk://wallet/send?recipient=lskdxc4ta5j43jp9ro3f8zqbxta9fn6jwzjucw7yt&amount=20&reference=test_Message&token=2ba563cf98003d&recipientApplication=aq02qkbb35u4jdq8szo3pnsq'
      );
    });
  });
});

Then(/^request token url on clipboard should not have reference$/, function () {
  cy.window().then((win) => {
    win.navigator.clipboard.readText().then((clipboardValue) => {
      expect(clipboardValue).eq(
        'lisk://wallet/send?recipient=lskdxc4ta5j43jp9ro3f8zqbxta9fn6jwzjucw7yt&amount=20&token=2ba563cf98003d&recipientApplication=aq02qkbb35u4jdq8szo3pnsq'
      );
    });
  });
});
