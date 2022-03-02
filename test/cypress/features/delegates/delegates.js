import { ss } from '../../../constants';

/* eslint-disable */
Then(/(\w+) count should have value greater than (\d+)/, function(displayElementClassName, displayContent){
    cy.get(`.${displayElementClassName} > p`).eq(0).then(($ele) => {
        const count = +$ele.text()
        expect(count).gte(+displayContent)
    })
})

When(/I observe (\w+)/, function(elementClass){
    if(elementClass === 'forger'){
        cy.get(ss.forgerItem).as('forgerList')
    } else {
        const className = ss[elementClass]
        cy.get(className).invoke('text').as(elementClass)
    }
})

Then(/^(\w+) should be incremented by at least (\d+)$/, function(elementClass, incrementValue){
    const className = ss[elementClass]
    cy.get(className).then($ele => {
        const value = +$ele.text()
        expect(value).gte(+this[elementClass] + +incrementValue);
    })
})

Then(/^forger list should be updated accordinly$/, function(){
    const forgerList = this.forgerList;
    const secondForger = forgerList.eq(1)

    cy.get(ss.forgerItem).eq(0).then($ele => {
        expect($ele.text() === secondForger.text());
    })

})

Then(/^time (\w+) should be incremented by at least (\d+) seconds/, function(elementClass, incrementValue){
    const className = ss[elementClass]
    const parseTimeToSeconds = (time) => {
        const minuites = time.match(/^\d+(?=:)/g)?.[0] || 0
        const seconds = time.match(/(?<=:)\d+$/g) || 0
        return 60 * +minuites + +seconds
    }

    cy.get(className).then($ele => {
        const nowSeconds = parseTimeToSeconds($ele.text());
        expect(nowSeconds).gte(parseTimeToSeconds(this[elementClass]) + +incrementValue);
    })
})

Then(/^forger list should have a maximum of (\d+) delegates/, function(forgerCount){
    cy.get(ss.forgerItem).should('have.length.at.most', forgerCount)
})


