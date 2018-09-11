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

export const steps = t => ([
  {
    title: t('Onboarding whenever you need'),
    text: t('Go to "Help" on your Sidebar to start the onboarding whenever you need.'),
    selector: '#onboardingAnchor',
    position: 'bottom',
    style: styles.skip,
  },
  {
    title: t('Welcome to Lisk Hub'),
    text: t('Take a tour to see how it works. It should not take longer than 5 minutes'),
    selector: '#onboardingAnchor',
    position: 'bottom',
    style: styles.intro,
  },
  // {
  //   title: t('Timeout'),
  //   text: t('After 10 minutes of not using your passphrase,
  // your Lisk ID will be locked to prevent an unauthorized use of your Lisk ID. .
  // The timer will reset as soon as you make an transaction.
  // After 5 minutes, you can also reset the timer by clicking on "reset".'),
  //   selector: '.account-timer',
  //   position: 'bottom',
  //   style: styles.step,
  // },
  {
    title: t('Lisk ID'),
    text: t('Here you see your address, balance, and avatar.'),
    selector: '.account',
    position: 'bottom',
    style: styles.step,
  },
  {
    title: t('Explore the network'),
    text: t('Search for delegates, addresses and transactions.'),
    selector: '#autosuggest-input',
    position: 'bottom',
    style: styles.step,
  },
  {
    title: t('Keep the overview'),
    text: t('Click here to go to the main page of Lisk Hub and find all relevant statistics and ID information'),
    selector: '#dashboard',
    position: 'right',
    style: styles.step,
  },
  {
    title: t('Send LSK'),
    text: t('Click here to transfer funds between Lisk IDs and access your transaction history.'),
    selector: '#transactions',
    position: 'right',
    style: styles.step,
  },
  {
    title: t('Delegate voting'),
    text: t('View forging delegates and vote for the ones you support.'),
    selector: '#delegates',
    position: 'right',
    style: styles.step,
  },
  {
    title: t('Manage your application'),
    text: t('Register and oversee your decentralized application here. Available soon.'),
    selector: '#sidechains',
    position: 'right',
    style: styles.step,
  },
  {
    title: t('Access extra features'),
    text: t('Change account settings, enable delegate voting.'),
    selector: '#settings',
    position: 'right',
    style: styles.step,
  },
  {
    title: t('You’ve completed the tour!'),
    text: t('You can now use Lisk Hub.<br> If you want to repeat the onboarding, navigate to "Help" on the sidebar.'),
    selector: '#onboardingAnchor',
    position: 'bottom',
    style: styles.outro,
  },
]);
