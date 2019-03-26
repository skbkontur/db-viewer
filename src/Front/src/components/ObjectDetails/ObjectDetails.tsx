/* tslint:disable:no-empty */
import Link from "@skbkontur/react-ui/Link";
import ClassNames from "classnames";
import * as React from "react";
import { FieldInfo } from "../../api/impl/FieldInfo";
import { FieldType } from "../../api/impl/FieldType";
import FieldEditor from "../Common/FieldEditor";
import { PrimitiveValue } from "../Common/PrimitiveValue";
import { copyObject } from "../Utils/CopyUtils";
import { StringUtils } from "../Utils/StringUtils";
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
    this.state = {
      expandedItems: {},
    };
  }

  public render(): React.ReactNode {
    switch (this.props.typeInfo.type) {
      case FieldType.Bool:
      case FieldType.DateTime:
      case FieldType.Enum:
      case FieldType.Int:
      case FieldType.Long:
      case FieldType.Decimal:
      case FieldType.String:
      case FieldType.Char:
      case FieldType.Byte:
        if (this.props.edit) {
          return this.renderPrimitiveEdit();
        } else {
          return this.renderPrimitiveValue();
        }
      case FieldType.Class: {
        const typeInfo = this.props.typeInfo;
        if (!this.props.data) {
          return (
            <PrimitiveValue data={null} fieldType={this.props.typeInfo.type} />
          );
        }
        return (
          <table className={styles.table}>
            <tbody>
              {Object.keys(this.props.typeInfo.fields).map(key =>
                this._renderRow(
                  key,
                  this.props.data[key],
                  typeInfo.fields[key],
                  false
                )
              )}
            </tbody>
          </table>
        );
      }
      case FieldType.HashSet:
      case FieldType.Enumerable: {
        const typeInfo = this.props.typeInfo;
        if (!this.props.data) {
          return (
            <PrimitiveValue data={null} fieldType={this.props.typeInfo.type} />
          );
        }
        return (
          <table className={styles.table}>
            <tbody>
              {Object.keys(this.props.data).map(key =>
                this._renderRow(
                  key,
                  this.props.data[key],
                  typeInfo.underlyingType,
                  false
                )
              )}
            </tbody>
          </table>
        );
      }

      case FieldType.Dictionary: {
        const typeInfo = this.props.typeInfo;
        if (!this.props.data) {
          return (
            <PrimitiveValue data={null} fieldType={this.props.typeInfo.type} />
          );
        }
        return (
          <table className={styles.table}>
            <tbody>
              {Object.keys(this.props.data).map(key =>
                this._renderRow(key, this.props.data[key], typeInfo.value, true)
              )}
            </tbody>
          </table>
        );
      }
    }
  }

  public _renderRow(
    key: string,
    value: object,
    typeInfo: FieldInfo,
    renderOriginalKey: boolean
  ) {
    const expandable =
      !!value &&
      (typeInfo.type === FieldType.HashSet ||
        typeInfo.type === FieldType.Dictionary ||
        typeInfo.type === FieldType.Class ||
        typeInfo.type === FieldType.Enumerable);
    return (
      <tr key={key}>
        <td>
          <Link icon={"Copy"} onClick={() => copyObject(value)} />
        </td>
        <td
          className={ClassNames(
            expandable && styles.complexKey,
            expandable && this.state.expandedItems[key] && styles.expanded
          )}
          onClick={() => (expandable ? this.handleExpand(key) : () => {})}
        >
          {renderOriginalKey ? key : StringUtils.upperCaseFirstLetter(key)}
        </td>
        <td className={styles.complexValue}>
          {!expandable || this.state.expandedItems[key] ? (
            <ObjectDetails
              data={value}
              edit={this.props.edit}
              typeInfo={typeInfo}
              onChange={newValue =>
                this.props.typeInfo.type === FieldType.Enumerable ||
                this.props.typeInfo.type === FieldType.HashSet
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

  private renderPrimitiveValue(): React.ReactNode {
    const { data, typeInfo } = this.props;
    return <PrimitiveValue data={data} fieldType={typeInfo.type} />;
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
