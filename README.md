Since [mixins are dead](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750#.jqp1e0of3), higher order components are the way to go.

I really love the approach, its much more modular and you avoid conflicting names.

But I run into gotchas, when you have a lot of behavior that you want to share it can be confusing, you might not now where the behavior comes from.
This is why I used namespace in the higher order components and also defining what are the methods/variables that will be provided by the extension.

In this package I'm creating a base Extension class that allows you to return an extended object.

## To create an Extension:

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

## To use the Extension:

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
