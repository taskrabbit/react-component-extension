'use strict';

import React    from 'react';
import ReactDOM from 'react-dom';

import AddSpinnerLoader from './extensions/AddSpinnerLoader';
import UserConnection    from './extensions/UserConnection';

@AddSpinnerLoader
@UserConnection({accountUrl: 'http://foo.bar/api/account'})
class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleRefreshClick = this.handleRefreshClick.bind(this);
  }

  handleRefreshClick() {
    this.props['AddSpinnerLoader'].start();

    this.props['UserConnection'].refresh().then(
      this.props['AddSpinnerLoader'].stop
    );
  }

  render() {
    return (
      <div>
        <p>Hello {this.props['UserConnection'].variables.firstName || 'unknown'}</p>
        <p>Is loading: {this.props['AddSpinnerLoader'].variables.loading ? 'yes' : 'no'}</p>
        <button onClick={this.handleRefreshClick}>Refresh</button>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('content'));
