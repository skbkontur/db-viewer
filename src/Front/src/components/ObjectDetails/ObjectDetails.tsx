/* tslint:disable:no-empty */
import Link from "@skbkontur/react-ui/Link";
import ClassNames from "classnames";
import * as React from "react";
import { PrimitiveType } from "../../api/impl/PrimitiveType";
import { TypeInfo } from "../../api/impl/TypeInfo";
import FieldEditor from "../Common/FieldEditor";
import { PrimitiveValue } from "../Common/PrimitiveValue";
import { copyObject } from "../Utils/CopyUtils";
import { StringUtils } from "../Utils/StringUtils";
import * as styles from "./ObjectDetails.less";

interface IProps {
  data: object;
  edit: boolean;
  typeInfo: TypeInfo;
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
      case PrimitiveType.Bool:
      case PrimitiveType.DateTime:
      case PrimitiveType.Enum:
      case PrimitiveType.Int:
      case PrimitiveType.Long:
      case PrimitiveType.Short:
      case PrimitiveType.Decimal:
      case PrimitiveType.String:
      case PrimitiveType.Char:
      case PrimitiveType.Byte:
      case PrimitiveType.SByte:
        if (this.props.edit) {
          return this.renderPrimitiveEdit();
        } else {
          return this.renderPrimitiveValue();
        }
      case PrimitiveType.Class: {
        if (!this.props.data) {
          return (
            <PrimitiveValue
              data={null}
              primitiveType={this.props.typeInfo.type}
            />
          );
        }
        return (
          <table data-tid="ObjectDetails" className={styles.table}>
            <tbody>
              {this.props.typeInfo.properties.map(property =>
                this._renderRow(
                  property.description.name,
                  this.props.data[property.description.name],
                  property.typeInfo,
                  false
                )
              )}
            </tbody>
          </table>
        );
      }
      case PrimitiveType.HashSet:
      case PrimitiveType.Enumerable: {
        const typeInfo = this.props.typeInfo;
        if (!this.props.data) {
          return (
            <PrimitiveValue
              data={null}
              primitiveType={this.props.typeInfo.type}
            />
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

      case PrimitiveType.Dictionary: {
        const typeInfo = this.props.typeInfo;
        if (!this.props.data) {
          return (
            <PrimitiveValue
              data={null}
              primitiveType={this.props.typeInfo.type}
            />
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
    typeInfo: TypeInfo,
    renderOriginalKey: boolean
  ) {
    const expandable =
      !!value &&
      (typeInfo.type === PrimitiveType.HashSet ||
        typeInfo.type === PrimitiveType.Dictionary ||
        typeInfo.type === PrimitiveType.Class ||
        typeInfo.type === PrimitiveType.Enumerable);
    return (
      <tr data-tid="ObjectDetailsRow" key={key}>
        <td>
          <Link data-tid="CopyLink" icon={"Copy"} onClick={() => copyObject(value)} />
        </td>
        <td
          data-tid="RowName"
          className={ClassNames(
            expandable && styles.complexKey,
            expandable && this.state.expandedItems[key] && styles.expanded
          )}
          onClick={() => (expandable ? this.handleExpand(key) : () => {})}
        >
          {renderOriginalKey ? key : StringUtils.upperCaseFirstLetter(key)}
        </td>
        <td data-tid="RowValue" className={styles.complexValue}>
          {!expandable || this.state.expandedItems[key] ? (
            <ObjectDetails
              data={value}
              edit={this.props.edit}
              typeInfo={typeInfo}
              onChange={newValue =>
                this.props.typeInfo.type === PrimitiveType.Enumerable ||
                this.props.typeInfo.type === PrimitiveType.HashSet
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
    return <PrimitiveValue data={data} primitiveType={typeInfo.type} />;
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
