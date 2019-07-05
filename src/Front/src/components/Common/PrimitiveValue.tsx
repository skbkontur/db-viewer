import * as React from "react";
import { PrimitiveType } from "../../api/impl/PrimitiveType";
import * as styles from "./PrimitiveValue.less";

interface IProps {
  data: any;
  primitiveType: PrimitiveType;
}

export class PrimitiveValue extends React.Component<IProps> {
  public render() {
    const { data, primitiveType } = this.props;
    if (data == null) {
      return <span className={styles.null}>(null)</span>;
    }
    if (primitiveType === PrimitiveType.Bool) {
      return <span>{data.toString()}</span>;
    }
    if (typeof data === "string") {
      return <span>{data}</span>;
    }
    return <span>{JSON.stringify(data)}</span>;
  }
}
