Since [mixins are dead](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750#.jqp1e0of3), higher order components are the way to go.

But when you use multiple higher order component for a Component it can be confusing, you have to think about where the behavior comes from.

An Extension is namespaced and also explicit about what are the methods/variables that are be provided to the Component.

## To create an Extension:

Here we are defining a `UserConnection` extension, it allows to get the user information it allows you to call in your component, `this.props['UserConnection'].variables.firstName` and `this.props['UserConnection'].variables.lastName`.
If you want to refresh the user simply call `this.props['UserConnection'].refresh()`.
You can pass `accountUrl` and `updateAccountUrl` as params of the Extension.

```javascript
import * from 'react-component-extension';

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
    updateAccountUrl: 'url to update the user',
  },
}

export default Extension.create(UserConnection);
```

## To use the Extension:

```javascript
class Account extends React.Component {
  render() {
    <div>
      hello {this.props['UserConnection'].variables.firstName}
      click <button onClick={this.props['UserConnection'].refresh}>here</button> to refresh
    </div>
  }
}

export default UserConnection(AccountPage, {
  accountUrl: 'api/account'
});
```


## Other Examples

```javascript
const AddSpinningLoader = {
  extensionName: 'AddSpinningLoader',

  exports: {
    methods: ['start', 'stop']
  },

  getInitialState() {
    return {
      loading: false,
    }
  },

  start() {
    this.setState({loading: true})
  },

  stop() {
    this.setState({loading: false})
  },

  renderExtension() {
    let spinningLoader = this.state.loading ? <SpinningLoader/> : null;

    return (
      <div>
        {spinningLoarder}
        {this.renderComponent()}
      </div>
    )
  }  
};

export default Extension.create(AddSpinningLoader);
```

```javascript
@AddSpinningLoader
class Form extends React.Component {
  constructor(props) {
    super(props);

    this.onSubmitButton = this.onSubmitButton.bind(this);

    this.state = {
      firstName: ''
    };
  }

  onSubmitButton() {
    this.props['ValidationErrorBar'].validateOrShowBar().then(
      this.doAccountUpdate
    );
  }

  doAccountUpdate() {
    this.props['AddSpinningLoader'].start();

    $.post('api/account_update', {
      firstName: this.state.firstName
    }).then(
      this.props['AddSpinningLoader'].stop
    );
  }

  render() {
    <div>
      <input type="text" value={this.state.firstName} onChange={(firstName) => this.setState({firstName})} />;
      <button onClick={this.onSubmitButton} />
    </div>
  }
}

Form = ValidationErrorBar(Form, {
  isValid: function () {
    return this.firstName !== '';
  },
});

export default Form;
```

## Updating from a React Mixin to an Extension

It is pretty straightforward to make a React Mixin an Extension, for example here is [react-timer-mixin](https://github.com/reactjs/react-timer-mixin) as an [Extension](./examples/extensions/TimerExtension.js)

### TODO

* Add tests
* Really do the example code
* Add examples
* Add sample page
