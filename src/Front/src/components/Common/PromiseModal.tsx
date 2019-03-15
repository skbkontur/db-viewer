import * as React from "react";

type PromiseExitFunc = (...x: any[]) => void;

interface IState {
  show: boolean;
}

export default abstract class PromiseModal extends React.Component<{}, IState> {
  public resolve: PromiseExitFunc;
  public reject: PromiseExitFunc;

  protected constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
  }

  public abstract renderContent(
    resolve: PromiseExitFunc,
    reject: PromiseExitFunc
  );

  public show() {
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
      this.setState({
        show: true,
      });
    });
  }

  public hide = () => this.setState({ show: false });

  public render() {
    if (this.state.show) {
      return this.renderContent(this.getResolve(), this.getReject());
    }
    return null;
  }

  public getResolve() {
    return (...params) => {
      this.resolve(...params);
      this.hide();
    };
  }

  public getReject() {
    return (...params) => {
      this.reject(...params);
      this.hide();
    };
  }
}
