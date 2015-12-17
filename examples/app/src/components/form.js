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
