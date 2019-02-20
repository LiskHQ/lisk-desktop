import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import urls from '../../constants/urls';
import ss from '../../constants/selectors';

describe('Request', () => {
  const randomAmount = Math.floor((Math.random() * 10) + 1);
  const randomReference = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);

  /**
   * Request transfer in simple mode
   * @expect address link contains correct address
   */
  it('Request LSK', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.wallet);
    cy.get(ss.termsOfUse).click();
    cy.visit(urls.wallet);
    cy.get(ss.transactionRequestButton).click();
    cy.get(ss.requestLink).contains(accounts.genesis.address);
  });

  /**
   * Request specific amount
   * @expect protocol link contains correct parameters
   */
  it('Request specific amount', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.wallet);
    cy.get(ss.termsOfUse).click();
    cy.visit(urls.wallet);
    cy.get(ss.transactionRequestButton).click();
    // Enter amount and reference
    cy.get(ss.amountInput).type(randomAmount);
    cy.get(ss.referenceTextarea).type(randomReference);
    // Check links
    cy.get(ss.requestLink).contains(`lisk://wallet/send?recipient=${accounts.genesis.address}&amount=${randomAmount}&reference=${randomReference}`);
  });

  /**
   * Show qrCode
   * @expect qrCode to start not visible and appear after clicking on toggle
   */
  it('Should show qrCode', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.wallet);
    cy.get(ss.termsOfUse).click();
    cy.visit(urls.wallet);
    cy.get(ss.transactionRequestButton).click();
    cy.get(ss.requestQrCode).should('be.not.visible');
    cy.get(ss.requestDropdown).get('.toggle-qrcode').click();
    cy.get(ss.requestQrCode).should('be.visible');
  });
});
