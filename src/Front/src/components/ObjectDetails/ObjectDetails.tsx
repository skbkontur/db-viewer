/* tslint:disable:no-empty */
import * as ClassNames from "classnames";
import * as React from "react";
import { FieldInfo } from "../../api/impl/FieldInfo";
import { FieldType } from "../../api/impl/FieldType";
import FieldEditor from "../primitives/FieldEditor";
import { IDictionary } from "../TypesList/IDictionary";
import * as styles from "./ObjectDetails.less";

interface IProps {
  data: object;
  edit: boolean;
  typeInfo: FieldInfo;
  onChange: (value: object) => void;
}

interface IState {
  expandedItems: IDictionary<boolean>;
}

export default class ObjectDetails extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    const expandedItems = {};
    if (
      this.props.typeInfo.type === FieldType.Enumerable ||
      this.props.typeInfo.type === FieldType.Class
    ) {
      for (const key of Object.keys(props.data)) {
        expandedItems[key] = false;
      }
    }
    this.state = {
      expandedItems,
    };
  }

  public render() {
    switch (this.props.typeInfo.type) {
      case FieldType.Bool:
      case FieldType.DateTime:
      case FieldType.Enum:
      case FieldType.Int:
      case FieldType.Long:
      case FieldType.Decimal:
      case FieldType.String:
        if (this.props.edit) {
          return this.renderPrimitiveEdit();
        } else {
          return this.renderPrimitiveValue();
        }
      case FieldType.Class: {
        const typeInfo = this.props.typeInfo;
        return (
          <table className={styles.table}>
            <tbody>
              {Object.keys(this.props.typeInfo.fields).map(key =>
                this._renderRow(key, this.props.data[key], typeInfo.fields[key])
              )}
            </tbody>
          </table>
        );
      }
      case FieldType.Enumerable: {
        const typeInfo = this.props.typeInfo;
        return (
          <table className={styles.table}>
            <tbody>
              {Object.keys(this.props.data).map(key =>
                this._renderRow(
                  key,
                  this.props.data[key],
                  typeInfo.underlyingType
                )
              )}
            </tbody>
          </table>
        );
      }
    }
  }

  public _renderRow(key: string, value: object, typeInfo: FieldInfo) {
    const expandable =
      typeInfo.type === FieldType.Class ||
      typeInfo.type === FieldType.Enumerable;
    return (
      <tr key={key}>
        <td
          className={ClassNames(
            expandable && styles.complexKey,
            expandable && this.state.expandedItems[key] && styles.expanded
          )}
          onClick={() => (expandable ? this.handleExpand(key) : () => {})}
        >
          {key}
        </td>
        <td className={styles.complexValue}>
          {!expandable || this.state.expandedItems[key] ? (
            <ObjectDetails
              data={value}
              edit={this.props.edit}
              typeInfo={typeInfo}
              onChange={newValue =>
                this.props.typeInfo.type === FieldType.Enumerable
                  ? this.props.onChange(
                      (this.props.data as object[]).map((x, idx) =>
                        idx.toString() === key ? newValue : x
                      )
                    )
                  : this.props.onChange({ ...this.props.data, [key]: newValue })
              }
            />
          ) : null}
        </td>
      </tr>
    );
  }

  private renderPrimitiveEdit() {
    const { typeInfo, data } = this.props;
    return (
      <FieldEditor
        value={data}
        typeInfo={typeInfo}
        onChange={value => this.props.onChange(value)}
        dateAsInput
      />
    );
  }

  private renderPrimitiveValue() {
    const { data, typeInfo } = this.props;
    if (data === null || data === undefined) {
      return <span className={styles.null}>(null)</span>;
    }
    if (typeInfo.type === FieldType.Bool) {
      return data.toString();
    }
    return data;
  }

  private handleExpand(key: string) {
    this.setState(({ expandedItems }) => ({
      expandedItems: {
        ...expandedItems,
        [key]: !expandedItems[key],
      },
    }));
  }
}
