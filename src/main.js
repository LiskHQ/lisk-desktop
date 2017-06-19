/* global document */
import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import ReduxConter from './components/counter';

const App = () => (
      <div>
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
              </ul>
            </nav>
            <Route exact path="/" render={() => <p>Home</p>} />
            <Route path="/counter" component={ReduxConter} />
          </div>
        </Router>
      </div>
    );

ReactDom.render(<App />, document.getElementById('app'));
