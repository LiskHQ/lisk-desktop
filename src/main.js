/* global document */
import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Metronome from './utils/metronome';
import styles from './main.css';
import Header from './components/header';

const App = () => {
  // start dispatching sync ticks
  const metronome = new Metronome();
  metronome.init();

  return (
    <section className={styles['body-wrapper']}>
    <Header></Header>
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
};

ReactDom.render(<App />, document.getElementById('app'));
