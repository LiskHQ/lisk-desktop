export default function slideCheckbox(selector) {
  cy.get(selector)
    .trigger('mousedown')
    .trigger('mousemove', { which: 1, pageX: 100, pageY: 0 })
    .trigger('mouseup');
}
