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
