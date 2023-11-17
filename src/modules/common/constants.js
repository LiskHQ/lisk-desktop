import i18next from 'i18next';
import routes from 'src/routes/routes';

export const INFO_BANNERS = {
  liskMigration: {
    infoMessage: (t) => t('Lisk v4 Migration'),
    infoLabel: (t) => t('Announcement'),
    infoDescription: (t) =>
      t(
        'This announcement is intended for all validators and node operators. Please ensure that you correctly migrate your nodes to the new network to avoid missing any blocks after the network hard fork.'
      ),
    illustrationName: 'liskMigrationIllustration',
    infoLink: 'https://lisk.com/documentation/lisk-core/v4/management/migration.html',
    infoLinkText: 'Migration guide',
  },
  proofOfStake: {
    infoMessage: (t) => t('Introducing proof of stake'),
    infoDescription: (t) =>
      t(
        'Enhancing the blockchain consensus mechanism with PoS, and providing increased decentralization, scalability, and energy efficiency, empowering users to participate in securing the network, and earning rewards based on their token holdings.'
      ),
    illustrationName: 'proofOfStake',
  },
  accountManagement: {
    infoMessage: (t) => t('Introducing account management'),
    infoDescription: (t) =>
      t(
        'Effortlessly manage multiple accounts in one interface with enhanced privacy and security. Seamlessly switch between accounts, allocate funds, and monitor balances.'
      ),
    illustrationName: 'accountManagement',
    infoLink: routes.wallet.path,
    infoLinkText: 'Explore',
  },
  blockchainExploring: {
    infoMessage: (t) => t('Introducing blockchain application exploring and management'),
    infoDescription: (t) =>
      t(
        'A new management feature allows you to seamlessly add and switch between applications. The dedicated application tab provides a comprehensive overview of registered, active, and terminated blockchain applications, and statistics.'
      ),
    illustrationName: 'applicationManagement',
    infoLink: routes.blockchainApplications.path,
    infoLinkText: 'Explore',
  },
  hardwareWalletManagement: {
    infoMessage: (t) => t('Introducing hardware wallet management'),
    infoDescription: (t) =>
      t(
        'Explore multiple hardware wallet devices simultaneously. Seamlessly access your accounts through the integrated functionality of our new account management feature.'
      ),
    illustrationName: 'hardwareWalletManagement',
    infoLink: routes.wallet.path,
    infoLinkText: 'Explore',
  },
  walletConnectManagement: {
    infoMessage: (t) => t('Introducing wallet connect management and exploring'),
    infoDescription: (t) =>
      t(
        'Enjoy a streamlined and secure experience of signing transactions for external applications. Unlock a world of possibilities with Wallet Connect Integration, and take full control of your digital assets.'
      ),
    illustrationName: 'walletConnect',
    infoLink: `${routes.blockchainApplications.path}?tab=SessionManager`,
    infoLinkText: 'Explore',
  },
  events: {
    infoMessage: (t) => t('Introducing events'),
    infoDescription: (t) =>
      t(
        'Stay informed in real-time about crucial blockchain activities. With this new feature, track the end to end execution and its results for all transactions and blocks.'
      ),
    illustrationName: 'transactionEvents',
    infoLink: routes.wallet.path,
    infoLinkText: 'Explore',
  },
  multiTokens: {
    infoMessage: (t) => t('Introducing Multi-tokens'),
    infoDescription: (t) =>
      t(
        'With Lisk interoperability, you can now store, manage, and transact with a variety of tokens within a single wallet interface. Seamlessly switch between different digital assets and diversify your portfolio effortlessly. Enjoy the convenience and flexibility of Multi-Tokens.'
      ),
    illustrationName: 'multiTokenBalances',
    infoLink: routes.allTokens.path,
    infoLinkText: 'Explore',
  },
  sendAndRequestTokenOnChain: {
    infoMessage: (t) => t('Introducing sending and requesting token within an application'),
    infoDescription: (t) =>
      t(
        'Flawlessly move your assets within a specific blockchain application. Experience the power of cross-chain transfers, enabling you to expand your reach and optimize your asset management strategies.'
      ),
    illustrationName: 'crossApplicationsSendRequestTokens',
  },
  sendAndRequestTokenCrossChain: {
    infoMessage: (t) => t('Introducing sending and requesting token across applications'),
    infoDescription: (t) =>
      t(
        'Flawlessly move your assets across different blockchain applications. Experience the power of cross-chain transfers, enabling you to expand your reach and optimize your asset management strategies.'
      ),
    illustrationName: 'withinAndCrossApplicationsSendRequestTokens',
  },
  networkAndApplicationManagement: {
    infoMessage: (t) => t('Introducing Network and Application management'),
    infoDescription: (t) =>
      t(
        'Take control of your blockchain network settings. Now you can customize your network preferences according to your specific needs.'
      ),
    illustrationName: 'networkManagement',
    infoLink: `${routes.wallet.path}?modal=manageApplications`,
    infoLinkText: 'Explore',
  },
};

export const INSUFFICENT_TOKEN_BALANCE_MESSAGE = {
  registerMultiSignature: i18next.t(
    'Token balance is not enough to register a multisignature account.'
  ),
  registerValidator: i18next.t('Token balance is not enough to register a validator profile'),
  stakeValidator: i18next.t('Token balance is not enough to stake a validator.'),
};
