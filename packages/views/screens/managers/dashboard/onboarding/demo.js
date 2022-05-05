import React from 'react';
import DemoRenderer from 'src/theme/demo/demoRenderer';
import Onboarding from './onboarding';

/* eslint-disable-next-line no-console */
const finalCallback = console.log;

const getOnboardingSlides = () => ([{
  title: ('Welcome to Lisk Delegates!'),
  content: ('Lisk blockchain network is based on a Delegated Proof of Stake consensus algorithm, in which 101 delegates are chosen to run the network by the community.'),
  illustration: 'welcomeLiskDelegates',
}, {
  title: ('Your voice matters'),
  content: ('In this section of Lisk you can vote for up to 101 delegates to run Lisk’s blockchain network and by doing so have a real impact on the Lisk ecosystem.'),
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
        name="delegateOnboarding"
      />
    </DemoRenderer>
  </div>
);

export default OnboardingDemo;
