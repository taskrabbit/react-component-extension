import React from 'react/addons';
import { expect } from 'chai';
import Extension from '../src/Extension';
import jsdom from 'mocha-jsdom';

const TestUtils = React.addons.TestUtils;

describe('Extension', () => {
  const Loader = {
    extensionName: 'LoaderExtension',
    exports: {
      methods: ['start', 'stop'],
      variables: ['isRunning'],
    },

    getInitialState() {
      return {
        isRunning: false,
      };
    },

    start() {
      this.setState({isRunning: true});
    },

    stop() {
      this.setState({isRunning: false});
    },
  };

  const LoaderExtension = Extension.create(Loader);

  jsdom();

  describe('creation of Extension', () => {

    describe('.getOriginalComponent', () => {

      describe('with one extension', () => {
        let TestComponent;
        let component;
        let originalComponent;

        beforeEach(() => {
          class TestComponent extends React.Component {
            constructor(props) {
              super(props);

              this.state = { checkValue: true };
            }

            render() {
              return (
                <div>
                  ComponentLevel
                </div>
              );
            }
          }
          TestComponent = LoaderExtension(TestComponent);

          component = TestUtils.renderIntoDocument(<TestComponent/>);
          originalComponent = component.getOriginalComponent();
        });

        it('sets the name properly', () => {
          expect(component.constructor.displayName).to.eql('LoaderExtension (TestComponent)');
        });

        it('returns the originalComponent', () => {
          expect(originalComponent.state.checkValue).to.eql(true);
        });
      });

      describe('with multiple extensions', () => {
        let TestComponent;
        let component;
        let originalComponent;

        const OtherExtension = Extension.create({
          extensionName: 'OtherExtension',
        });

        beforeEach(() => {
          class TestComponent extends React.Component {
            constructor(props) {
              super(props);

              this.state = { checkValue: true };
            }

            render() {
              return (
                <div>
                  ComponentLevel
                </div>
              );
            }
          }
          TestComponent = LoaderExtension(TestComponent);
          TestComponent = OtherExtension(TestComponent);

          component         = TestUtils.renderIntoDocument(<TestComponent/>);
          originalComponent = component.getOriginalComponent();
        });

        it('sets the name properly', () => {
          expect(component.constructor.displayName).to.eql('OtherExtension (LoaderExtension (TestComponent))');
        });

        it('returns the originalComponent', () => {
          expect(originalComponent.state.checkValue).to.eql(true);
        });
      });

    });

    describe('with decorators', () => {

      describe('without params', () => {
        let TestComponent;
        let component;
        let originalComponent;

        beforeEach(() => {
          @LoaderExtension
          class TestComponent extends React.Component {
            constructor(props) {
              super(props);

              this.state = { checkValue: true };
            }

            render() {
              return (
                <div>
                  ComponentLevel
                </div>
              );
            }
          }
          component = TestUtils.renderIntoDocument(<TestComponent/>);
          originalComponent = component.getOriginalComponent();
        });

        it('sets the name properly', () => {
          expect(component.constructor.displayName).to.eql('LoaderExtension (TestComponent)');
        });

        it('returns the originalComponent', () => {
          expect(originalComponent.state.checkValue).to.eql(true);
        });
      });

      describe('with params', () => {
        let TestComponent;
        let component;
        let originalComponent;

        beforeEach(() => {
          @LoaderExtension({someParams: 'foo'})
          class TestComponent extends React.Component {
            constructor(props) {
              super(props);

              this.state = { checkValue: true };
            }

            render() {
              return (
                <div>
                  ComponentLevel
                </div>
              );
            }
          }
          component = TestUtils.renderIntoDocument(<TestComponent/>);
          originalComponent = component.getOriginalComponent();
        });

        it('sets the name properly', () => {
          expect(component.constructor.displayName).to.eql('LoaderExtension (TestComponent)');
        });

        it('returns the originalComponent', () => {
          expect(originalComponent.state.checkValue).to.eql(true);
        });
      });

    });

    describe('.bindOriginalComponent', () => {
      // TODO
    });

  });

  describe('use of Extension', () => {
    it('provides variables to the Component', () => {
      class VariablesTest extends React.Component {
        render() {
          expect(this.props['LoaderExtension'].variables.isRunning).to.eql(false);
          expect(this.props['LoaderExtension'].variables.somethingElse).to.eql(undefined);

          return (
            <div>VariablesTest</div>
          );
        }
      }

      VariablesTest = LoaderExtension(VariablesTest);

      TestUtils.renderIntoDocument(<VariablesTest/>);
    });

    it('provides methods to the Component', () => {
      class MethodsTest extends React.Component {
        render() {
          return (
            <div>
              <p>MethodsTest</p>
              <button
                ref='startButton'
                onClick={this.props['LoaderExtension'].start}
              >
                start
              </button>
              <button
                ref='stopButton'
                onClick={this.props['LoaderExtension'].stop}
              >
                stop
              </button>
            </div>
          );
        }
      }

      MethodsTest = LoaderExtension(MethodsTest);

      const component         = TestUtils.renderIntoDocument(<MethodsTest/>);
      const originalComponent = component.getOriginalComponent();
      const startButtonNode   = originalComponent.refs.startButton;
      const stopButtonNode    = originalComponent.refs.stopButton;

      TestUtils.Simulate.click(startButtonNode);

      expect(originalComponent.props['LoaderExtension'].variables.isRunning).to.eql(true);

      TestUtils.Simulate.click(stopButtonNode);

      expect(originalComponent.props['LoaderExtension'].variables.isRunning).to.eql(false);
    });

    describe('params of the extensions', () => {
      const OtherLoader = {
        extensionName: 'OtherLoaderExtension',
        exports: {
          methods: ['checkParams'],
        },
        optionalParams: {
          'width': 'width of the loader',
        },
        requiredParams: {
          'color': 'this is important',
        },

        checkParams() {
        },
      };

      const LoaderExtension = Extension.create(OtherLoader);

      it('uses the params passed by the Component properly');

      it('raises an error if the required params is not passed');

      it('does not allow using the params if they are not explicitly set');

    });

  });

});
