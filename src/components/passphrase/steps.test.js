import { expect } from 'chai';
import steps from './steps';

describe('Passphrase: steps', () => {
  const stepNames = ['info', 'generate', 'show', 'confirm'];
  const context = {
    props: {
      closeDialog: () => {},
      onPassGenerated: () => {},
    },
    setState: () => {},
    state: {},
  };
  const returnSteps = steps(context);

  it('should return an object including defined steps', () => {
    const returnedKeys = Object.keys(returnSteps);
    expect(returnedKeys).to.deep.equal(stepNames);
  });

  stepNames.forEach((step) => {
    describe(`step: ${step}`, () => {
      it('should have a confirmButton with title and onClick', () => {
        expect(returnSteps[step].confirmButton.title).to.not.equal(undefined);
        expect(returnSteps[step].confirmButton.onClick).to.not.equal('function');
        expect(returnSteps[step].confirmButton.onClick()).to.be.equal(undefined);
      });

      it('should have a cancelButton with title and onClick', () => {
        expect(returnSteps[step].cancelButton.title).to.not.equal(undefined);
        expect(returnSteps[step].cancelButton.onClick).to.not.equal('function');
        expect(returnSteps[step].cancelButton.onClick()).to.be.equal(undefined);
      });
    });
  });
});
