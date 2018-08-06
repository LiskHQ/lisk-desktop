const quickTips = t => [
  {
    title: t('What makes Lisk IDs special?'),
    description: [
      t('Your passphrase is like the only map to a hidden planet in a universe with billions and billions of galaxies. Without the map, it would take impossibly long to find.'),
      t('Any app capable of reading it can lead you to your account – Lisk Hub, Nano or Commander.'),
    ],
    goTo: {
      title: t('More about accounts'),
      link: 'https://lisk.io/academy',
    },
    picture: '../../assets/images/dashboard/universe.svg',
  },
  {
    title: t('Why should I vote?'),
    description: [
      t('For the pit stop of a racing car you want your best people to change wheels and refuel as fast as possible.'),
      t('Lisk calls them delegates. They contribute  tools, resources and ensure a safe journey. It’s up to you to choose who makes the cut.'),
    ],
    goTo: {
      title: t('More about voting'),
      link: 'https://lisk.io/academy',
    },
    picture: '../../assets/images/dashboard/racing-car.svg',
  },
  {
    title: t('How is Lisk transparent?'),
    description: [
      t('Activity on a blockchain is like watching a game of football. Thousands of people can see exactly whats happening on the field and disagreements are resolved quickly.'),
      t('Using this record, you can explore the activities of all players with Lisk Hub.'),
    ],
    goTo: {
      title: t('More about transparency'),
      link: 'https://lisk.io/academy',
    },
    picture: '../../assets/images/dashboard/soccer.svg',
  },
  {
    title: t('Dive in to the Academy'),
    description: [
      t('The Lisk Academy is a comprehensive and unbiased educational platform on blockchain technology, free and open to everyone.'),
    ],
    goTo: {
      title: t('Take a look'),
      link: 'https://lisk.io/academy',
    },
    picture: '../../assets/images/dashboard/academy.svg',
  },
];

export default quickTips;
