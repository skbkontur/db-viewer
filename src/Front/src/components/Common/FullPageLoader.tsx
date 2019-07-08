import * as React from "react";

import Link from "@skbkontur/react-ui/Link";
import Spinner from "@skbkontur/react-ui/Spinner";

import RefreshIcon from "@skbkontur/react-icons/Refresh";
import * as styles from "./FullPageLoader.less";

export enum LoaderState {
  Loading,
  Failed,
  Success,
}

interface IProps {
  state: LoaderState;
  onTryAgain?: () => void;
  height?: number;
}

export default class FullPageLoader extends React.Component<IProps> {
  public render() {
    switch (this.props.state) {
      case LoaderState.Loading:
        return (
          <div
            className={styles.loader}
            style={{ height: this.props.height || 500 }}
          >
            <Spinner type={"big"} />
          </div>
        );
      case LoaderState.Failed:
        return (
          <div
            className={styles.loader}
            style={{ height: this.props.height || 500 }}
          >
            <div>
              <div>Что-то пошло не так</div>
            </div>
            {this.props.onTryAgain && (
              <div>
                <Link onClick={this.props.onTryAgain} icon={<RefreshIcon />}>
                  Попробовать еще раз
                </Link>
              </div>
            )}
          </div>
        );
      case LoaderState.Success:
        return this.props.children;
      default:
        return null;
    }
  }
}
