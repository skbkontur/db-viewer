import * as classNames from "classnames";
import * as React from "react";
import { ColumnConfiguration } from "./ColumnConfiguration";
import * as styles from "./ResultsTable.less";

interface IProps {
  results: any[];
  columnsConfiguration: ColumnConfiguration[];
}

export default class ResultsTable extends React.Component<IProps> {
  public render() {
    if (
      !this.props.results ||
      !this.props.results.length ||
      this.props.results.length === 0
    ) {
      return <div className={styles.tableWrapper} />;
    }
    const tableHeader = this.createTableHeader();
    const resultRows = this.createResultRows();

    return (
      <div className={styles.tableWrapper}>
        <table>
          <thead>{tableHeader}</thead>
          <tbody data-tid="ResultRows">{resultRows}</tbody>
        </table>
      </div>
    );
  }

  private createTableHeader() {
    return (
      <tr>
        {this.props.columnsConfiguration.map((x, idx) => (
          <th key={idx}>{x.renderHeader()}</th>
        ))}
      </tr>
    );
  }

  private createResultRows() {
    return this.props.results.map((item, rowIndex) => {
      return (
        <tr
          data-tid="ResultRow"
          key={rowIndex}
          className={classNames(styles["row-default"], styles.row)}
        >
          {this.props.columnsConfiguration.map((configItem, columnIndex) => {
            const content = configItem.renderItem(item);
            return (
              <td key={columnIndex}>
                <div>{content}</div>
              </td>
            );
          })}
        </tr>
      );
    });
  }
}
