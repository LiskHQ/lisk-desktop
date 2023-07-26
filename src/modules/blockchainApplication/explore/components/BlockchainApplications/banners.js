// istanbul ignore file
import routes from 'src/routes/routes';

const banners = [
  {
    infoMessage: (t) => t('Introducing blockchain application exploring and management'),
    infoDescription: (t) =>
      t(
        'A new management feature allows you to seamlessly add and switch between applications. The dedicated application tab provides a comprehensive overview of registered, active, and terminated blockchain applications, and statistics.'
      ),
    illustrationName: 'applicationManagement',
    infoLink: routes.blockchainApplications.path,
    infoLinkText: 'Explore',
  },
  {
    infoMessage: (t) => t('Introducing wallet connect management and exploring'),
    infoDescription: (t) =>
      t(
        'Enjoy a streamlined and secure experience of signing transactions for external applications. Unlock a world of possibilities with Wallet Connect Integration, and take full control of your digital assets.'
      ),
    illustrationName: 'walletConnect',
    infoLink: `${routes.blockchainApplications.path}?tab=SessionManager`,
    infoLinkText: 'Explore',
  },
];

export default banners;
