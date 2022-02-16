/* eslint-disable */
Then(/(\w+) should display (\s+)\s?(\w*)/, function(displayElement, displayContent, extra){
    cy.get(ss[displayElement]).eq(0).should('contain', displayContent);
  })


