/* eslint-disable */
import { Then } from 'cypress-cucumber-preprocessor/steps';
import { ss } from '../../../constants';

Then(/^I should have (\d+) peers rendered in table$/, function (number) {
  cy.get(ss.peerRow).should('have.length', number);
});

Then(/^peers should be sorted in (\w+) order by height$/, function (sortOrder) {
  let prevHeight = sortOrder === 'descending'? Infinity : -Infinity;

  cy.get(`${ss.peerRow}`).each((ele) =>{
    const height = parseInt(ele[0].lastElementChild.innerText);
    expect(height)[sortOrder === 'descending'? 'lte': 'gte'](prevHeight);
    prevHeight = height;
  })
}); 

