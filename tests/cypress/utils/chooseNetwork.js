import { networks, ss } from '../../constants';

export default function chooseNetwork(network) {
  switch (network) {
    case 'main':
      cy.get(ss.networkDropdown).click();
      cy.get(ss.networkOptions).eq(0).click();
      break;
    case 'test':
      cy.get(ss.networkDropdown).click();
      cy.get(ss.networkOptions).eq(1).click();
      break;
    case 'dev':
      cy.get(ss.networkDropdown).click();
      cy.get(ss.networkOptions).eq(2).click();
      cy.get(ss.addressInput).type(networks.customNode.node);
      cy.get(ss.connectButton).click();
      break;
    case 'invalid':
      cy.get(ss.networkDropdown).click();
      cy.get(ss.networkOptions).eq(2).click();
      cy.get(ss.addressInput).type('http://silk.road');
      cy.get(ss.connectButton).click();
      break;
    default:
      throw new Error(`Network should be one of : main , test, dev, invalid . Was: ${network}`);
  }
}
