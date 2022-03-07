import { ss } from '../../../constants';

const getDelegateNameFromRow = (ele) => ele.find('span:first-child > div > div:last-child > div:last-child > p:first-child').text();

/* eslint-disable */
Then(/(\w+) count should have value greater than (\d+)/, function(displayElementClassName, displayContent){
    cy.get(`.${displayElementClassName} > p`).eq(0).then((ele) => {
        const count = +ele.text()
        expect(count).gte(+displayContent)
    })
})

When(/I observe (\w+)/, function(elementClass){
    if(elementClass === 'forger') {
        cy.get(ss.forgerItem).as('forgerList')
    } else {
        const className = ss[elementClass]
        cy.get(className).invoke('text').as(elementClass)
    }
})

Then(/^(\w+) should be incremented by at least (\d+)$/, function(elementClass, incrementValue){
    const className = ss[elementClass]
    cy.get(className).then(ele => {
        const value = +ele.text()
        expect(value).gte(+this[elementClass] + +incrementValue);
    })
})

Then(/^next forger list should be updated accordingly$/, function(){
    const forgerList = this.forgerList;
    const secondForger = forgerList.eq(1)

    cy.get(ss.forgerItem).eq(0).then(ele => {
        expect(ele.text() === secondForger.text());
    })

})

Then(/^time (\w+) should be incremented by at least (\d+) seconds/, function(elementClass, incrementValue){
    const className = ss[elementClass]
    const parseTimeToSeconds = (time) => {
        const minuites = time.match(/^\d+(?=:)/g)?.[0] || 0
        const seconds = time.match(/(?<=:)\d+$/g) || 0
        return 60 * +minuites + +seconds
    }

    cy.get(className).then(ele => {
        const nowSeconds = parseTimeToSeconds(ele.text());
        expect(nowSeconds).gte(parseTimeToSeconds(this[elementClass]) + +incrementValue);
    })
})

Then(/^next forger list should have a maximum of (\d+) delegates/, function(forgerCount){
    cy.get(ss.forgerItem).should('have.length.at.most', forgerCount)
})

Then(/^next forgers should match first members of the inside round list$/, function(){
    cy.get(ss.delegateRow).eq(1).then((ele) => {
        const delegateName = getDelegateNameFromRow(ele)
        cy.get(ss.forgerItem).eq(0).contains(delegateName)
    })
})

Then(/^first delegate should be forging$/, function(){
    cy.get(ss.delegateRow).each((ele, index) => {
        if(index === 0) {
            expect(ele.find('span:last-child > div > div > main > p').text()).contain('Forging')
        }
    })
})

Then(/^delegates should be sorted in (\w+) order by forgingTime$/, function (sortOrder) {
    let prevForgeTime = sortOrder === 'descending' ? Infinity : -Infinity;
    const parseToSeconds = (time) => {
        const minuites = time.match(/\d+(?=m)/g)?.[0] || 0
        const seconds = time.match(/\d+(?=s)$/g)?.[0] || 0
        return 60 * +minuites + +seconds
    }
  
    cy.get(`${ss.delegateRow}`).each((ele) => {
      const forgeTime = parseToSeconds(ele.find('span:first-child ~ span ~ span ~ span').text());
      
      if(forgeTime) {
        expect(forgeTime)[sortOrder === 'descending' ? 'lte' : 'gte'](prevForgeTime);
        prevForgeTime = forgeTime;
      }
    })
  }); 

  Then(/^delegates should be sorted in (\w+) order by status$/, function (sortOrder) {
    let prevStatus = sortOrder === 'descending' ? 'zzzzz' : '';
  
    cy.get(`${ss.delegateRow}`).each((ele) => {
        const status = ele.find('span:first-child ~ span ~ span ~ span').text()
        expect(sortOrder === 'descending' ? prevStatus >= status :prevStatus <= status ).eq(true)
        prevStatus = status;
    })
  }); 

  Then(/^filtered results should be displayed$/, function () {
    cy.get(`${ss.delegateRow}`).should('have.length.within', 0, 103)
  }); 

  When(/^I watch a delegate$/, function () {
    cy.get(`${ss.delegateRow}`).eq(0).then((ele) => {
        const watchToggleBtn = ele.find('span:first-child > div:first-child > div:first-child > span:first-child');
        this.watchedDelegate = getDelegateNameFromRow(ele)
        watchToggleBtn.trigger('click')
      })
  }); 
  When(/^I don't watch a delegate$/, function () {
    cy.get(`${ss.delegateRow}`).eq(0).then((ele) => {
        const watchToggleBtn = ele.find('span:first-child > div:first-child > div:first-child > span:first-child');
        watchToggleBtn.trigger('click')
      })
  }); 
  
  Then (/^delegate should be watched$/, function () {
    cy.get(`${ss.delegateRow}`).each((ele) => {
        const delegateName = getDelegateNameFromRow(ele)
        if(delegateName === this.watchedDelegate){
            expect(ele.find('span:first-child > div:first-child > div:first-child > span:first-child ~ div > main')).contain('Remove from watched')
        }
      })
  }); 

  Then(/^there should be more than (\d+) delegates in table$/, function (number) {
    cy.get(ss.delegateRow).should('have.length.gte', number);
  });

  Then(/^I should be on a vote transaction details modal$/, function () {
    cy.location().should((location) => {
      const hasAddress = /\?modal=transactionDetails&transactionId=a1c5521f466ae5476d3908cc8d562444d45adf4ac3af57e77f1f9359999ab9ca&token=LSK/.test(location.href);
      expect(hasAddress).true;
    });
  });

