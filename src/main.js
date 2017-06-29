/* global document */
import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import ReduxCounter from './components/counter';
import Metronome from './utils/metronome';
import styles from './main.css';
import Static from './components/static';

class App extends React.Component {
  constructor() {
    super();
    this.ReduxCounter = ReduxCounter;
  }

  componentDidMount() {
    // start dispatching sync ticks
    this.metronome = new Metronome();
    this.metronome.init();
  }

  render() {
    return (
      <section className={styles['body-wrapper']}>
        <Router>
          <div>
            <nav>
              <ul>
                <li>
                  <Link to="/">home</Link>
                </li>
                <li>
                  <Link to="/counter">counter</Link>
                </li>
                <li>
                  <Link to="/static">Static</Link>
                </li>
              </ul>
            </nav>
            <Route exact path="/" render={() => <p>Home</p>} />
            <Route path="/static" component={Static} />
            <Route path="/counter" component={this.ReduxCounter} />
          </div>
        </Router>
      </section>
    );
  }
}

ReactDom.render(<App />, document.getElementById('app'));
