/**
 * Generates a sequence of random pairs of x,y coordinates on the screen that simulates
 * the movement of mouse to produce a pass phrase.
 */
export default function moveMouseRandomly() {
  for (let i = 0; i < 70; i += 1) {
    cy.get('main').first().trigger('mousemove', {
      which: 1,
      pageX: 500 + (Math.floor((((i % 2) * 2) - 1) * (249 + (Math.random() * 250)))),
      pageY: 500 + (Math.floor((((i % 2) * 2) - 1) * (249 + (Math.random() * 250)))),
    });
  }
}
