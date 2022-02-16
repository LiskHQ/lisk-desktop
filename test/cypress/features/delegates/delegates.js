/* eslint-disable */
Then(/(\w+) count should have value greater than (\d+)/, function(displayElementClassName, displayContent){
    cy.get(`.${displayElementClassName} > p`).eq(0).each((ele) => {
        const count = +ele.html()
        alert(ele.html())
        expect(count).gte(+displayContent)
    })
})


