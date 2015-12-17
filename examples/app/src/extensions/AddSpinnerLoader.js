import React from 'react';

import * as Extension from 'react-component-extension';

import Spinner from 'react-spinner';

const AddSpinnerLoader = {
  extensionName: 'AddSpinnerLoader',

  exports: {
    methods: ['start', 'stop'],
  },

  getInitialState() {
    return {
      loading: false,
    };
  },

  start() {
    this.setState({loading: true});
  },

  stop() {
    this.setState({loading: false});
  },

  renderExtension() {
    let spinningLoader = this.state.loading ? <Spinner /> : null;

    return (
      <div>
        {this.renderComponent()}
        {spinningLoader}
      </div>
    );
  },

};

export default Extension.create(AddSpinnerLoader);
