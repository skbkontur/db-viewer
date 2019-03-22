import * as React from "react";
import { FieldType } from "../../api/impl/FieldType";
import * as styles from "./PrimitiveValue.less";

interface IProps {
  data: any;
  fieldType: FieldType;
}

export class PrimitiveValue extends React.Component<IProps> {
  public render() {
    const { data, fieldType } = this.props;
    if (data == null) {
      return <span className={styles.null}>(null)</span>;
    }
    if (fieldType === FieldType.Bool) {
      return <span>{data.toString()}</span>;
    }
    return <span>{data}</span>;
  }
}
