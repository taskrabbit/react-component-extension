'use strict';

import React    from 'react';
import ReactDOM from 'react';

import * as Extension from 'react-component-extension';

class App extends React.Component {
  render() {
    return (
      <div>
        <p>Hello</p>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('content'));
