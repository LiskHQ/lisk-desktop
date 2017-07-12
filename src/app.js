/* global document */
import Account from './components/account';
import Dialogs from './components/dialogs/dialogs';
import store from './store';
import { setActivePeer } from './utils/api/peers';

export default class App extends React.Component {
  constructor() {
    super();
    const network = {
      address: 'http://localhost:4000',
      testnet: true,
      nethash: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
    };

    this.state = {
      accountInfo: {
        account: {
          isDelegate: false,
          address: '16313739661670634666L',
          username: 'lisk-nano',
          passphrase: 'wagon stock borrow episode laundry kitten salute link globe zero feed marble',
          publicKey: 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f',
        },
        address: '16313739661670634666L',
        peers: {
          online: true,
          active: {
            currentPeer: 'localhost',
            port: 4000,
            options: {
              name: 'Custom Node',
            },
          },
        },
        balance: '99992689.6',
      },
    };

    setActivePeer(store, network);
  }

  setActiveDialog(name) {
    this.setState(Object.assign({}, this.state, { activeDialog: name }));
  }

  componentDidMount() {
    // start dispatching sync ticks
    this.metronome = new Metronome();
    this.metronome.init();
  }

  render() {
    return (
      <section className={styles['body-wrapper']}>
      <Header setActiveDialog={this.setActiveDialog.bind(this)}></Header>
      <Account {...this.state.accountInfo}></Account>
        <Router>
          <div>
            <nav>
              <ul>
                <li>
                  <Link to="/">home</Link>
                </li>
              </ul>
            </nav>
            <Route exact path="/" render={() => <p>Home</p>} />
          </div>
        </Router>
        <Dialogs active={this.state.activeDialog}
          account={this.state.accountInfo.account}
          closeDialog={this.setActiveDialog.bind(this, null)} />
      </section>
    );
  }
}

