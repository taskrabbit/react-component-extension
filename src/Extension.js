import React     from 'react';
import invariant from 'invariant';

const makeDecorator = ({params, extensionName, requiredParams, BaseLib, exports}) => {
  return (Component) => {

    const componentName = Component.displayName || Component.name;
    const containerName = `${extensionName} (${componentName})`;

    for (let key in requiredParams)  {
      invariant(
        params[key],
        `Extension params required ${containerName} ${key}: ${requiredParams[key]}`
      );
    }

    const ComponentContainer = React.createClass({
      mixins: [BaseLib],

      displayName: containerName,

      params: params,

      getInitialState() {
        return {};
      },

      getOriginalComponent() {
        if (this.refs._ExtensionComponent.getOriginalComponent) {
          return this.refs._ExtensionComponent.getOriginalComponent();
        }
        return this.refs._ExtensionComponent;
      },

      bindOriginalComponent(func, ...args) {
        return func.bind(this.getOriginalComponent(), ...args);
      },

      // Implement getExtensionProps if you want to add more behavior passed to the Component
      // it will allow accessing in the Extended Component with this.props[ExtensionName]
      getExtensionProps() {
        return {
          [extensionName]: Object.assign({variables: this.getExportedVariables()}, this.getExportedMethods()),
        };
      },

      getExportedVariables() {
        var _variables = {};
        (exports.variables || []).forEach((variableName) => _variables[variableName] = this.state[variableName]);

        return _variables;
      },

      getExportedMethods() {
        var _methods = {};
        (exports.methods || []).forEach((methodName) => _methods[methodName] = this[methodName]);

        return _methods;
      },

      renderComponent() {
        return (
          <Component
            {...this.props}
            {...this.getExtensionProps()}
            ref="_ExtensionComponent"
          />
        );
      },

      render() {
        if (this.renderExtension) {
          return this.renderExtension();
        }

        return this.renderComponent();
      },

    });

    return ComponentContainer;
  };
};

const create = ({extensionName, requiredParams = {}, exports = {}, optionalParams, ...BaseLib}) => {
  invariant(
    extensionName,
    'extensionName required when defining an extension'
  );

  const decoratorParams = {extensionName, requiredParams, BaseLib, exports};

  const Extension = (...args) => {
    if (typeof(args[0]) === 'function') {
      return makeDecorator({params: {}, ...decoratorParams})(args[0]);
    } else {
      return makeDecorator({params: args[0], ...decoratorParams});
    }
  };

  return Extension;
};

export default {create};
