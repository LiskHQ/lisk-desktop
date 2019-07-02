import accounts from '../../constants/accounts';
import networks from '../../constants/networks';
import urls from '../../constants/urls';
import ss from '../../constants/selectors';

describe('Wallet Others account', () => {
  const topDelegate = {
    address: '2581762640681118072L',
    username: 'genesis_51',
  };

  const getBookmaksObjFromLS = () => JSON.parse(localStorage.getItem('bookmarks'));

  beforeEach(() => {
    cy.server();
    cy.route('/api/accounts?address=**').as('requestAccountData');
  });

  it('Delegate -> Address, Name & Label are correct', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(`${urls.accounts}/${topDelegate.address}`);
    cy.wait('@requestAccountData');
    cy.url().should('contain', topDelegate.address);
    cy.get(ss.accountAddress).contains(topDelegate.address);
    cy.get(ss.accountName).contains(topDelegate.username);
    cy.get(ss.accountLabel).contains('Delegate #1');
  });

  it('Not delegate -> Address, Name & Label are correct', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(`${urls.accounts}/${accounts.empty_account.address}`);
    cy.get(ss.accountAddress).contains(accounts.empty_account.address);
    cy.get(ss.accountName).contains('Account');
    cy.get(ss.accountLabel).should('not.exist');
  });

  /* eslint-disable max-statements */
  // This test needs to be skipped until this task is implement (issue #2056)
  it.skip('Bookmarked account -> Address, Name & Label are correct', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(urls.dashboard);
    cy.get(ss.addBookmarkAccountButton).click();
    cy.get(ss.addressInput).click().type(accounts.empty_account.address);
    cy.get(ss.nextBtn).click();
    cy.get(ss.titleInput).type('Alice');
    cy.get(ss.nextBtn).click();
    cy.visit(`${urls.accounts}/${accounts.empty_account.address}`);
    cy.get(ss.accountAddress).contains(accounts.empty_account.address);
    cy.get(ss.accountName).contains('Alice');
    cy.get(ss.accountLabel).contains('Bookmarked Account');
  });

  it('Send LSK to this account', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(`${urls.accounts}/${accounts.delegate.address}`);
    cy.wait('@requestAccountData');
    cy.get(ss.sendToThisAccountBtn).click();
    cy.url().should('contain', urls.send);
    cy.get(ss.recipientInput).should('have.value', accounts.delegate.address);
  });

  it('Add / Remove bookmark', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(`${urls.accounts}/${accounts.genesis.address}`);
    cy.wait('@requestAccountData');
    cy.wait(300);
    cy.get(ss.bookmarkAccountBtn).contains('Bookmark account');
    cy.get(ss.bookmarkAccountBtn).click();
    cy.get(ss.titleInput).type('Bob');
    cy.get(ss.confirmAddToBookmarks).click()
      .should(() => {
        expect(getBookmaksObjFromLS().LSK[0].address).to.equal(accounts.genesis.address);
        expect(getBookmaksObjFromLS().LSK[0].title).to.equal('Bob');
      });
    cy.route('/api/delegates?**').as('requestDelegatesData');
    cy.reload();
    cy.wait('@requestDelegatesData');
    cy.get(ss.accountName).contains('Bob');
    cy.get(ss.bookmarkAccountBtn).contains('Account bookmarked');
    cy.get(ss.bookmarkAccountBtn).click();
    cy.get(ss.confirmAddToBookmarks).click()
      .should(() => {
        expect(getBookmaksObjFromLS().LSK.length).to.equal(0);
      });
    cy.get(ss.accountName).contains('Account');
  });

  it('Cant change bookmark name for bookmarked delegate', () => {
    cy.autologin(accounts.genesis.passphrase, networks.devnet.node);
    cy.visit(`${urls.accounts}/${accounts.delegate.address}`);
    cy.wait('@requestAccountData');
    cy.wait(300);
    cy.get(ss.bookmarkAccountBtn).contains('Bookmark account');
    cy.get(ss.bookmarkAccountBtn).click();
    cy.get(ss.titleInput).type('Bob');
    cy.get(ss.titleInput).should('have.value', accounts.delegate.username);
  });
});
