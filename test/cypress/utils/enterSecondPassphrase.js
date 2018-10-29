const ss = {
  secondPassphraseInput: '.second-passphrase input',
  secondPassphraseNextBtn: '.second-passphrase-next',
};

export default function enterSecondPassphrase(passphrase) {
  cy.get(ss.secondPassphraseInput).each(($el, index) => {
    const passphraseWordsArray = passphrase.split(' ');
    cy.wrap($el).type(passphraseWordsArray[index]);
  });
  cy.get(ss.secondPassphraseNextBtn).click();
}
