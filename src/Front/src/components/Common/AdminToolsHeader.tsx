import * as React from "react";
import { Link } from "react-router-dom";
import * as styles from "./AdminToolsHeader.less";

interface IProps {
  title?: string;
  routerLink?: boolean;
  backTo: string;
  backText: string;
}

export default class AdminToolsHeader extends React.Component<IProps> {
  public render() {
    const { title } = this.props;
    const url = this.props.backTo;
    const linkText = this.props.backText;
    return (
      <header className={styles.root} data-tid="AdminToolsHeader">
        <h1 data-tid="Header" className={styles.title}>
          {title}
        </h1>
        {this.props.routerLink ? (
          <Link to={url} data-tid="BackLink">
            {linkText}
          </Link>
        ) : (
          <a href={url} data-tid="BackLink">
            {linkText}
          </a>
        )}
      </header>
    );
  }
}
