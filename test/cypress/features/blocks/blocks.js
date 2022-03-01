/* eslint-disable */ 
import { Then } from 'cypress-cucumber-preprocessor/steps';
import { ss } from '../../../constants';

Then(/^I should see (\d+) blocks in table$/, function (number) {
	cy.get(ss.blockRow).should('have.length', number);
});

Then(/^blocks should be sorted in (\w+) order by height$/, function (sortOrder) {
	cy.wait(500);
  let prevHeight = sortOrder === 'descending' ? Infinity : -Infinity;

  cy.get(`${ss.blockRow}`).each((ele) => {
    const height = +ele[0].firstElementChild.innerText;
    expect(height)[sortOrder === 'descending' ? 'lt' : 'gt'](prevHeight);
    prevHeight = height;
  })
}); 

Then(/^I should see latest blocks$/, function () {
  let oldHeight, currentHeight
  cy.get(`${ss.blockRow} > span:first-child`).first().then(($elem) => {
    oldHeight = +$elem.text();
  });
  cy.wait(1000);
  cy.get(`${ss.blockRow} > span:first-child`).first().then(($elem) => {
    currentHeight = +$elem.text();
  });
  expect(oldHeight)['lt'](currentHeight)
});

Then(/^I should see the block details page$/, function () {
  cy.location().should((location) => {
    const hasId = /block\?id=408c63b500eac768140ef7a0dacd1638726c783c1cefa52a42189ef0fa46a1c1/.test(location.href);
    expect(hasId).true;
  })
});

Then(/^I should see (\w+) in (block\w+) section$/, function (detail, section) {
  if (section === 'blockIdDetails') {
    const truncateAddress = (address) => address.replace(/^(.{6})(.+)?(.{5})$/, '$1...$3');
    cy.get(ss[section]).should('contain', truncateAddress(detail));
  } else {
    cy.get(ss[section]).should('contain', detail);
  }
});
