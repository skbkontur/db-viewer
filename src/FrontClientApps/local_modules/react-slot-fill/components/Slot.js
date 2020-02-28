/* eslint-disable */
// временная копия react-slot-fill
import * as React from 'react';

import { managerShape } from '../utils/PropTypes';

export default class Slot extends React.Component {
  constructor(props) {
    super(props);
    this.state = { components: [] };
    this.handleComponentChange = this.handleComponentChange.bind(this);
  }

  componentWillMount() {
    this.context.manager.onComponentsChange(this.props.name, this.handleComponentChange);
  }

  /**
   * components: Component[]
   */
  handleComponentChange(components) {
    this.setState({ components });
  }

  getFills() {
    return this.state.components.map(c => c.fill);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.name !== this.props.name) {
      this.context.manager.removeOnComponentsChange(this.props.name, this.handleComponentChange);

      const name = nextProps.name;

      this.context.manager.onComponentsChange(name, this.handleComponentChange);
    }
  }

  componentWillUnmount() {
    const name = this.props.name;
    this.context.manager.removeOnComponentsChange(name, this.handleComponentChange);
  }

  render() {
    const aggElements = [];

    this.state.components.forEach((component, index) => {
      const { fill, elements } = component;

      if (this.props.fillChildProps) {
        const fillChildProps = Object.keys(this.props.fillChildProps).reduce((acc, key) => {
          const value = this.props.fillChildProps[key]

          if (typeof value === 'function') {
            acc[key] = () => value(fill, this.getFills());
          } else {
            acc[key] = value;
          }

          return acc;
        }, {});

        elements.forEach((element, index2) => {
          aggElements.push(
            React.cloneElement(element, { key: index.toString() + index2.toString(), ...fillChildProps })
          )
        });
      } else {
        elements.forEach((element, index2) => {
          aggElements.push(
            React.cloneElement(element, { key: index.toString() + index2.toString() })
          );
        });
      }
    });

    if (typeof this.props.children === 'function') {
      const results = this.props.children(aggElements);

      if (results) {
        return results;
      } else {
        return <noscript />;
      }
    } else {
      return aggElements.length === 0 ? null : aggElements[0];
    }
  }
}

Slot.contextTypes = {
  manager: managerShape
}
