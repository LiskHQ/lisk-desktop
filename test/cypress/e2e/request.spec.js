import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import urls from '../../constants/urls';
import ss from '../../constants/selectors';

describe('Request', () => {
  const randomAmount = Math.floor((Math.random() * 10) + 1);
  const randomReference = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
  /**
   * Request page can be opened by direct link
   * @expect url is correct
   * @expect some specific to page element is present on it
   */
  it(`Request page opens by url ${urls.send}`, () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.send);
    cy.url().should('contain', urls.send);
    cy.get(ss.recipientInput);
  });

  /**
   * Request transfer in simple mode
   * @expect mail link contains correct message
   * @expect address link contains correct address
   */
  it('Request LSK', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.wallet);
    cy.get(ss.transactionRequestButton).click();
    cy.get(ss.requestLink).contains(accounts.genesis.address);
    cy.get(ss.emailLink).should('have.prop', 'href').and('include', `mailto:?subject=Requesting%20LSK%20to%20${accounts.genesis.address}&body=Hey%20there,%20%20%20%20here%20is%20a%20link%20you%20can%20use%20to%20send%20me%20LSK%20via%20your%20wallet:%20lisk%3A%2F%2Fwallet%2Fsend%3Frecipient%3D${accounts.genesis.address}`);
  });

  /**
   * Request specific amount
   * @expect protocol link contains correct parameters
   * @expect email link contains correct message
   * @expect okay button leads to send tab
   * @expect how to use it msg appears only first time
   */
  it('Request specific amount', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.wallet);
    cy.get(ss.transactionRequestButton).click();
    cy.get(ss.requestSpecificAmountBtn).click();
    // Check there is 'How is works' screen
    cy.get(ss.okayBtn).click();
    // Enter amount and reference
    cy.get(ss.amountInput).type(randomAmount);
    cy.get(ss.referenceInput).type(randomReference);
    // Check links
    cy.get(ss.requestLink).contains(`lisk://wallet/send?recipient=${accounts.genesis.address}&amount=${randomAmount}&reference=${randomReference}`);
    // TODO unskip when 1550 is fixed
    // cy.get(ss.emailLink).should('have.prop', 'href')
    // .and('include', `mailto:?subject=Requesting%20LSK%20to%20${accounts.genesis.address}
    // &body=Hey%20there,%20%20%20%20%20%20here%20is%20a%20link%20you%20can%20use%20to%20send
    // %20me%20LSK%20via%20your%20wallet:%20lisk%3A%2F%2Fwallet%2Fsend%3Frecipient%3D$
    // {accounts.genesis.address}%26amount%3D${randomAmount}%26reference%3D${randomReference}`);
    cy.get(ss.okayBtn).click();
    cy.get(ss.transactionRequestButton).click();
    // Check there is no 'How it works' screen anymore
    cy.get(ss.emailLink);
  });
});
