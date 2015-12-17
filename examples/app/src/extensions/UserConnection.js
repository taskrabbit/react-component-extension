import * as Extension from 'react-component-extension';

class $ {
  static get() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          firstName: 'John',
          lastName: 'Doe',
        });
      }, 2000);
    });
  }
}

const UserConnection = {
  // This is the public name of the Extension
  extensionName: 'UserConnection',
  exports: {
    // Variables accessibles from the Extension
    variables: ['firstName', 'lastName'],
    // Methods callable on the Extension
    methods: ['refresh'],
  },
  // Required params to use the extension
  // should be an object key: 'description'
  requiredParams: {
    accountUrl: 'url to fetch the user',
  },
  optionalParams: {
    autoRefreshTimeout: 'timeout to auto refresh the user',
  },

  getInitialState() {
    return {
      firstName: null,
      lastName:  null,
    };
  },

  refresh() {
    $.get(this.params.accountUrl).then(({firstName, lastName}) => {
      this.setState({firstName, lastName});
    });
  },

};

export default Extension.create(UserConnection);
