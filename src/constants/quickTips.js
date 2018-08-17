import academy from '../assets/images/dashboard/academy.svg';
import id from '../assets/images/dashboard/id.svg';
import transparent from '../assets/images/dashboard/transparent.svg';
import vote from '../assets/images/dashboard/vote.svg';

const quickTips = t => [
  {
    title: t('What is a Lisk ID?'),
    description: [
      t('Your Lisk ID is how you recognize and interact with your unique Lisk account, think of it as your email.'),
      t('You can share your Lisk ID with anyone you wish, but never reveal your passphrase to anyone as it would allow full access to your account.'),
    ],
    goTo: {
      title: t('Learn more'),
      link: 'https://lisk.io/academy',
    },
    picture: id,
  },
  {
    title: t('Why should I vote?'),
    description: [
      t('By voting you decide who is trusted to verify transactions and maintain the Lisk network, whilst collecting the rewards for doing so.'),
      t('Each LSK token is worth one vote. Voters can also be rewarded for voting for certain delegates, giving them an incentive to do so.'),
    ],
    goTo: {
      title: t('Learn more'),
      link: 'https://lisk.io/academy',
    },
    picture: vote,
  },
  {
    title: t('How is Lisk transparent?'),
    description: [
      t('Like almost all blockchains Lisk has transparency at it’s core. This means that anyone can view everything that happens on the Lisk network, including the holdings of each account.'),
      t('This helps to keep the network fair, open and honest.'),
    ],
    goTo: {
      title: t('Learn more'),
      link: 'https://lisk.io/academy',
    },
    picture: transparent,
  },
  {
    title: t('What is Lisk Academy?'),
    description: [
      t('The Lisk Academy is an entirely free, unbiased and comprehensive educational platform about blockchain technology, containing something for everyone, regardless of what level of knowledge you are at.'),
    ],
    goTo: {
      title: t('Learn more'),
      link: 'https://lisk.io/academy',
    },
    picture: academy,
  },
];

export default quickTips;
