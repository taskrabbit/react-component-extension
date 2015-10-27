Since [mixins are dead](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750#.jqp1e0of3), higher order components are the way to go.

I really love the approach, its much more modular and you avoid conflicting names.

But I run into gotchas, when you have a lot of behavior that you want to share it can be confusing, you might not now where the behavior comes from.
This is why I used namespace in the higher order components and also defining what are the methods/variables that will be provided by the extension.

In this package I'm creating a base Extension class that allows you to return an extended object.

## To create an Extension:

Here we are defining a `UserConnection` extension, it allows to get the user information it allows you to call in your component, `this.props['UserConnection'].firstName` and `this.props['UserConnection'].lastName`.
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
class AccountPage extends React.Component {
  render() {
    <Div>
      hello {this.props['UserConnection'].firstName}
      click <Button onClick={this.props['UserConnection'].refresh}>here</Button> to refresh
    </Div>
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
      <Div>
        {spinningLoarder}
        {this.renderComponent()}
      </Div>
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

It is pretty straightforward to make a current Mixin an Extension, for example
here is [react-timer-mixin](https://github.com/reactjs/react-timer-mixin) as an [Extension](./examples/extensions/TimerExtension.js)

### TODO

* Add tests
* Really do the example code :)
* Add examples
* Add sample page
