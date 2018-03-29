import merge from 'lodash.merge';

const tabletStyles = {
  width: '280px',
  fontSize: '14px',
  main: {
    padding: '10px 40px 30px',
  },
  header: {
    padding: '30px 40px 20px',
    fontSize: '24px',
  },
  footer: {
    padding: '0px 40px 0px',
  },
  button: {
    margin: '20px 0px 20px 0px',
    fontSize: '15px',
  },
};

const desktopStyles = {
  width: '486px',
  fontSize: '15px',
  main: {
    padding: '10px 90px 30px',
  },
  header: {
    padding: '80px 90px 20px',
    fontSize: '28px',
  },
  footer: {
    padding: '0px 90px 0px',
  },
  button: {
    margin: '20px 0px 40px 0px',
    fontSize: '16px',
  },
};

export const styles = {
  desktop: {
    intro: merge({
      borderRadius: '0',
      color: '#000',
      textAlign: 'center',
      arrow: {
        display: 'none',
      },
      header: {
        borderBottom: 'none',
        fontFamily: 'gilroy,Open Sans,sans-serif',
      },
      skip: {
        fontFamily: 'Open Sans,sans-serif',
        color: '#74869B',
        float: 'none',
        margin: '0',
      },
      footer: {
        textAlign: 'center',
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
      },
    }, desktopStyles),
    outro: merge({
      borderRadius: '0',
      color: '#000',
      textAlign: 'center',
      arrow: {
        display: 'none',
      },
      header: {
        borderBottom: 'none',
        fontFamily: 'gilroy,Open Sans,sans-serif',
      },
      skip: {
        display: 'none',
      },
      footer: {
        textAlign: 'center',
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
      },
    }, desktopStyles),
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
    skip: merge({
      borderRadius: '0',
      color: '#000',
      textAlign: 'center',
      arrow: {
        display: 'none',
      },
      header: {
        borderBottom: 'none',
        fontFamily: 'gilroy,Open Sans,sans-serif',
      },
      skip: {
        fontFamily: 'Open Sans,sans-serif',
        backgroundImage: 'linear-gradient(-224deg, #FF6236 14%, #C80039 100%)',
        color: '#fff',
        height: '60px',
        width: '85%',
        borderRadius: '3px',
        float: 'none',
        margin: '20px 0px 40px 0px',
      },
      footer: {
        textAlign: 'center',
      },
      close: {
        display: 'none',
      },
      button: {
        display: 'none',
      },
    }, desktopStyles),
  },
  tablet: {
    intro: merge({
      borderRadius: '0',
      color: '#000',
      textAlign: 'center',
      arrow: {
        display: 'none',
      },
      header: {
        borderBottom: 'none',
        fontFamily: 'gilroy,Open Sans,sans-serif',
      },
      skip: {
        fontFamily: 'Open Sans,sans-serif',
        color: '#74869B',
        float: 'none',
        margin: '0',
      },
      footer: {
        textAlign: 'center',
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
      },
    }, tabletStyles),
    outro: merge({
      borderRadius: '0',
      color: '#000',
      textAlign: 'center',
      arrow: {
        display: 'none',
      },
      header: {
        borderBottom: 'none',
        fontFamily: 'gilroy,Open Sans,sans-serif',
      },
      skip: {
        display: 'none',
      },
      footer: {
        textAlign: 'center',
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
      },
    }, tabletStyles),
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
    skip: merge({
      borderRadius: '0',
      color: '#000',
      textAlign: 'center',
      arrow: {
        display: 'none',
      },
      header: {
        borderBottom: 'none',
        fontFamily: 'gilroy,Open Sans,sans-serif',
      },
      skip: {
        fontFamily: 'Open Sans,sans-serif',
        backgroundImage: 'linear-gradient(-224deg, #FF6236 14%, #C80039 100%)',
        color: '#fff',
        height: '60px',
        width: '85%',
        borderRadius: '3px',
        float: 'none',
        margin: '20px 0px',
      },
      footer: {
        textAlign: 'center',
      },
      close: {
        display: 'none',
      },
      button: {
        display: 'none',
      },
    }, tabletStyles),
  },
};

export const steps = (t, isDesktop) => [
  {
    title: t('Onboarding whenever you need'),
    text: t('Go to "More" on your Sidebar to start the onboarding whenever you need.'),
    selector: '#onboardingAnchor',
    position: 'bottom',
    style: isDesktop ? styles.desktop.skip : styles.tablet.skip,
  },
  {
    title: t('Welcome to Lisk Hub'),
    text: t('Take a tour to see how it works. It should not take longer than 5 minutes'),
    selector: '#onboardingAnchor',
    position: 'bottom',
    style: isDesktop ? styles.desktop.intro : styles.tablet.intro,
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
    text: t('Here you see your address and balance. You can click your account avatar to see all your saved IDs.'),
    selector: '.account',
    position: 'bottom',
    style: isDesktop ? styles.desktop.step : styles.tablet.step,
  },
  {
    title: t('Keep the overview'),
    text: t('Click here to go to the main page of Lisk Hub and find all relevant statistics and ID information'),
    selector: '#dashboard',
    position: 'right',
    style: isDesktop ? styles.desktop.step : styles.tablet.step,
  },
  {
    title: t('Send LSK'),
    text: t('Click here to transfer funds between Lisk IDs and access your transaction history.'),
    selector: '#transactions',
    position: 'right',
    style: isDesktop ? styles.desktop.step : styles.tablet.step,
  },
  {
    title: t('Explore the network'),
    text: t('View all the transactions happening on the Lisk Network in real time. Search for addresses and transactions.'),
    selector: '#explorer',
    position: 'right',
    style: isDesktop ? styles.desktop.step : styles.tablet.step,
  },
  {
    title: t('Delegate voting'),
    text: t('View forging delegates and vote for the ones you support.'),
    selector: '#voting',
    position: 'right',
    style: isDesktop ? styles.desktop.step : styles.tablet.step,
  },
  {
    title: t('Manage your application'),
    text: t('Register and oversee your decentralized application here. Available soon.'),
    selector: '#sidechains',
    position: 'right',
    style: isDesktop ? styles.desktop.step : styles.tablet.step,
  },
  {
    title: t('Access extra features'),
    text: t('Change account settings, enable delegate voting and repeat the onboarding here.'),
    selector: '.more-menu',
    position: 'right',
    style: isDesktop ? styles.desktop.step : styles.tablet.step,
  },
  {
    title: t('You’ve completed the tour!'),
    text: t('You can now use Lisk Hub.<br> If you want to repeat the onboarding, navigate to "More" on the sidebar.'),
    selector: '#onboardingAnchor',
    position: 'bottom',
    style: isDesktop ? styles.desktop.outro : styles.tablet.outro,
  },
];
