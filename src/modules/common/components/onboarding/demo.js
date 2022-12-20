import React from 'react';
import DemoRenderer from '@theme/demo/demoRenderer';
import Onboarding from './onboarding';

/* eslint-disable-next-line no-console */
const finalCallback = console.log;

const getOnboardingSlides = () => ([{
  title: ('Welcome to Lisk Validators!'),
  content: ('Lisk blockchain network is based on a Proof of Stake consensus algorithm, in which 101 validators are chosen to run the network by the community.'),
  illustration: 'welcomeLiskValidators',
}, {
  title: ('Your voice matters'),
  content: ('In this section of Lisk you can stake for up to 101 validators to run Lisk’s blockchain network, and by doing so have a real impact on the Lisk ecosystem.'),
  illustration: 'yourVoiceMatters',
}]);

const OnboardingDemo = () => (
  <div>
    <h2>Onboarding</h2>
    <DemoRenderer>
      <Onboarding
        slides={getOnboardingSlides()}
        finalCallback={finalCallback}
        ctaLabel="Start voting"
        name="validatorOnboarding"
      />
    </DemoRenderer>
  </div>
);

export default OnboardingDemo;
