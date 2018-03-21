export const styles = {
  step: {
    fontSize: '15px',
    borderRadius: '0',
    color: '#000',
    textAlign: 'left',
    width: '280px',
    hole: {
      borderRadius: '0px',
    },
    header: {
      borderBottom: 'none',
      fontFamily: 'gilroy,Open Sans,sans-serif',
      fontSize: '18px',
      fontWeight: '400',
    },
    skip: {
      fontFamily: 'Open Sans,sans-serif',
      color: '#74869B',
      lineHeight: '30px',
    },
    close: {
      display: 'none',
    },
    button: {
      fontFamily: 'Open Sans,sans-serif',
      backgroundColor: '#fff',
      color: '#ED4537',
      padding: '0px',
      lineHeight: '30px',
    },
  },
  skip: {
    fontSize: '15px',
    borderRadius: '0',
    color: '#000',
    textAlign: 'center',
    width: '486px',
    arrow: {
      display: 'none',
    },
    main: {
      padding: '10px 90px 30px',
    },
    header: {
      borderBottom: 'none',
      fontFamily: 'gilroy,Open Sans,sans-serif',
      fontSize: '28px',
      padding: '80px 90px 20px',
    },
    skip: {
      fontFamily: 'Open Sans,sans-serif',
      fontSize: '16px',
      backgroundImage: 'linear-gradient(-224deg, #FF6236 14%, #C80039 100%)',
      color: '#fff',
      height: '60px',
      width: '85%',
      margin: '20px 0px 40px 0px',
      borderRadius: '3px',
      float: 'none',
    },
    footer: {
      textAlign: 'center',
      padding: '0px 90px 0px',
    },
    close: {
      display: 'none',
    },
    button: {
      display: 'none',
    },
  },
  intro: {
    fontSize: '15px',
    borderRadius: '0',
    color: '#000',
    textAlign: 'center',
    width: '486px',
    arrow: {
      display: 'none',
    },
    main: {
      padding: '10px 90px 30px',
    },
    header: {
      borderBottom: 'none',
      fontFamily: 'gilroy,Open Sans,sans-serif',
      fontSize: '28px',
      padding: '80px 90px 20px',
    },
    skip: {
      fontFamily: 'Open Sans,sans-serif',
      color: '#74869B',
      float: 'none',
      margin: '0',
    },
    footer: {
      textAlign: 'center',
      padding: '0px 90px 0px',
    },
    close: {
      display: 'none',
    },
    button: {
      fontFamily: 'Open Sans,sans-serif',
      backgroundImage: 'linear-gradient(224deg, #FF6236 14%, #C80039 100%)',
      color: '#fff',
      height: '60px',
      width: '85%',
      margin: '20px 0px 40px 0px',
      fontSize: '16px',
    },
  },
  outro: {
    fontSize: '15px',
    borderRadius: '0',
    color: '#000',
    textAlign: 'center',
    width: '486px',
    arrow: {
      display: 'none',
    },
    main: {
      padding: '10px 90px 30px',
    },
    header: {
      borderBottom: 'none',
      fontFamily: 'gilroy,Open Sans,sans-serif',
      fontSize: '28px',
      padding: '80px 90px 20px',
    },
    skip: {
      display: 'none',
    },
    footer: {
      textAlign: 'center',
      padding: '0px 90px 0px',
    },
    close: {
      display: 'none',
    },
    button: {
      fontFamily: 'Open Sans,sans-serif',
      backgroundImage: 'linear-gradient(224deg, #FF6236 14%, #C80039 100%)',
      color: '#fff',
      height: '60px',
      width: '85%',
      margin: '20px 0px 40px 0px',
      fontSize: '16px',
    },
  },
};

export const steps = [
  {
    title: 'Onboarding whenever you need',
    text: 'Go to "More" on your Sidebar to start the onboarding whenever you need.',
    selector: '#onboardingAnchor',
    position: 'bottom',
    style: styles.skip,
  },
  {
    title: 'Welcome to Lisk Hub',
    text: 'Take a tour to see how it works. It should not take longer than 5 minutes',
    selector: '#onboardingAnchor',
    position: 'bottom',
    style: styles.intro,
  },
  {
    title: 'Timeout',
    text: 'After 10 minutes of inactivity you will be logged out to prevent an unauthorized access to your Lisk ID. This will reset as soon as you become active again. You can also reset the timer anytime by clicking on the countdown.',
    selector: '.account-timer',
    position: 'bottom',
    style: styles.step,
  },
  {
    title: 'Lisk ID',
    text: 'Click here to view your balance, Lisk ID and saved Lisk IDs.',
    selector: '.account',
    position: 'bottom',
    style: styles.step,
  },
  {
    title: 'Keep the overview',
    text: 'Click here to go back to the main page of Lisk Hub and find all relevant statistics and ID information',
    selector: '#dashboard',
    position: 'right',
    style: styles.step,
  },
  {
    title: 'Send LSK',
    text: 'Click here to transfer funds between Lisk IDs and access your transaction history.',
    selector: '#transactions',
    position: 'right',
    style: styles.step,
  },
  {
    title: 'Explore the network',
    text: 'View all the transactions happening on the Lisk Network in real time. Search for addresses and transactions.',
    selector: '#explorer',
    position: 'right',
    style: styles.step,
  },
  {
    title: 'Manage your application',
    text: 'Register and oversee your decentralized application here. Available soon.',
    selector: '#sidechains',
    position: 'right',
    style: styles.step,
  },
  {
    title: 'Access extra features',
    text: 'Change account settings, enable delegate voting and repeat the onboarding here.',
    selector: '.more-menu',
    position: 'right',
    style: styles.step,
  },
  {
    title: 'You’ve completed the tour!',
    text: 'You can now use Lisk Hub.<br> If you want to repeat the onboarding, navigate to "More" on the sidebar.',
    selector: '#onboardingAnchor',
    position: 'bottom',
    style: styles.outro,
  },
];
