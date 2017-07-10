/* global document */
import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Metronome from './utils/metronome';
import styles from './main.css';
import Header from './components/header';
import Account from './components/account';
import store from './reducers';
import { setActivePeer } from './utils/api/peers';

class App extends React.Component {
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

  componentDidMount() {
    // start dispatching sync ticks
    this.metronome = new Metronome();
    this.metronome.init();
  }

  render() {
    return (
      <section className={styles['body-wrapper']}>
      <Header></Header>
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
      </section>
    );
  }
}

ReactDom.render(<App />, document.getElementById('app'));
