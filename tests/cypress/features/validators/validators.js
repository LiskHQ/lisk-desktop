/* eslint-disable */
import { ss } from '../../../constants';

const getValidatorNameFromRow = (ele) =>
  ele.find('span:first-child > div > div:last-child > div:last-child > p:first-child').text();

Then(
  /(\w+) count should have value greater than (\d+)/,
  (displayElementClassName, displayContent) => {
    cy.get(`.${displayElementClassName} > p`)
      .eq(0)
      .then((ele) => {
        const count = +ele.text();
        expect(count).gte(+displayContent);
      });
  }
);

When(/I observe (\w+)/, (elementClass) => {
  if (elementClass === 'generator') {
    cy.get(ss.generatorItem).as('generatorList');
  } else {
    const className = ss[elementClass];
    cy.get(className).invoke('text').as(elementClass);
  }
});

Then(/^(\w+) should be incremented by at least (\d+)$/, function (elementClass, incrementValue) {
  const className = ss[elementClass];
  cy.get(className).then((ele) => {
    const value = +ele.text();
    expect(value).gte(+this[elementClass] + +incrementValue);
  });
});

Then(/^next generator list should be updated accordingly$/, function () {
  const generatorList = this.generatorList;
  const secondGenerator = generatorList.eq(1);

  cy.get(ss.generatorItem)
    .eq(0)
    .then((ele) => {
      expect(ele.text() === secondGenerator.text());
    });
});

Then(
  /^time (\w+) should be incremented by at least (\d+) seconds/,
  function (elementClass, incrementValue) {
    const className = ss[elementClass];
    const parseTimeToSeconds = (time) => {
      const minutes = time.match(/^\d+(?=:)/g)?.[0] || 0;
      const seconds = time.match(/(?<=:)\d+$/g) || 0;
      return 60 * +minutes + +seconds;
    };

    cy.get(className).then((ele) => {
      const nowSeconds = parseTimeToSeconds(ele.text());
      expect(nowSeconds).gte(parseTimeToSeconds(this[elementClass]) + +incrementValue);
    });
  }
);

Then(/^next generator list should have a maximum of (\d+) validators/, (generatorCount) => {
  cy.get(ss.generatorItem).should('have.length.at.most', generatorCount);
});

Then(/^next generators should match first members of the Generators list$/, () => {
  cy.get(ss.validatorRow)
    .eq(1)
    .then((ele) => {
      const validatorName = getValidatorNameFromRow(ele);
      cy.get(ss.generatorItem).eq(0).contains(validatorName);
    });
});

Then(/^first validator should be generating$/, () => {
  cy.get(ss.validatorRow).each((ele, index) => {
    if (index === 0) {
      expect(ele.find('span:last-child > div > div > main > p').text()).contain('Generating');
    }
  });
});

Then(/^validators should be sorted in (\w+) order by generatingTime$/, (sortOrder) => {
  let prevForgeTime = sortOrder === 'descending' ? Infinity : -Infinity;
  const parseToSeconds = (time) => {
    const minutes = time.match(/\d+(?=m)/g)?.[0] || 0;
    const seconds = time.match(/\d+(?=s)$/g)?.[0] || 0;
    return 60 * +minutes + +seconds;
  };

  cy.get(`${ss.validatorRow}`).each((ele) => {
    const forgeTime = parseToSeconds(ele.find('span:first-child ~ span ~ span ~ span').text());

    if (forgeTime) {
      expect(forgeTime)[sortOrder === 'descending' ? 'lte' : 'gte'](prevForgeTime);
      prevForgeTime = forgeTime;
    }
  });
});

Then(/^validators should be sorted in (\w+) order by status$/, (sortOrder) => {
  let prevStatus = sortOrder === 'descending' ? 'zzzzz' : '';

  cy.get(`${ss.validatorRow}`).each((ele) => {
    const status = ele.find('span:first-child ~ span ~ span ~ span').text();
    expect(sortOrder === 'descending' ? prevStatus >= status : prevStatus <= status).eq(true);
    prevStatus = status;
  });
});

Then(/^filtered results should be displayed$/, () => {
  cy.get(`${ss.validatorRow}`).should('have.length.within', 0, 103);
});

When(/^I watch a validator$/, function () {
  cy.get(`${ss.validatorRow}`)
    .eq(0)
    .then((ele) => {
      const watchToggleBtn = ele.find(
        'span:first-child > div:first-child > div:first-child > span:first-child'
      );
      this.watchedValidator = getValidatorNameFromRow(ele);
      watchToggleBtn.trigger('click');
    });
});

When(/^I don't watch a validator$/, () => {
  cy.get(`${ss.validatorRow}`)
    .eq(0)
    .then((ele) => {
      const watchToggleBtn = ele.find(
        'span:first-child > div:first-child > div:first-child > span:first-child'
      );
      watchToggleBtn.trigger('click');
    });
});

Then(/^validator should be watched$/, function () {
  cy.get(`${ss.validatorRow}`).each((ele) => {
    const validatorName = getValidatorNameFromRow(ele);
    if (validatorName === this.watchedValidator) {
      expect(
        ele.find(
          'span:first-child > div:first-child > div:first-child > span:first-child ~ div > main'
        )
      ).contain('Remove from watched');
    }
  });
});

Then(/^I should be on a stake transaction details modal$/, () => {
  cy.location().should((location) => {
    const hasAddress =
      /\?modal=transactionDetails&transactionID=a1c5521f466ae5476d3908cc8d562444d45adf4ac3af57e77f1f9359999ab9ca&token=LSK/.test(
        location.href
      );
    expect(hasAddress).true;
  });
});
