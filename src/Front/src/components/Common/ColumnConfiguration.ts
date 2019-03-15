import { ReactNode } from "react";

export class ColumnConfiguration {
  public static createByPath(path: string): ColumnConfiguration {
    return new ColumnConfiguration(x => x[path]);
  }

  public static create(): ColumnConfiguration {
    return new ColumnConfiguration(_ => null);
  }

  private _render: (value, item) => React.ReactNode;
  private readonly _extractValue: (item) => any;
  private _renderHeader: () => React.ReactNode;

  private constructor(extractValue: (item) => any) {
    this._extractValue = extractValue;
  }

  public withCustomRender(
    render: (value, item) => React.ReactNode
  ): ColumnConfiguration {
    this._render = render;
    return this;
  }

  public withHeader(renderHeader: () => ReactNode): ColumnConfiguration {
    this._renderHeader = renderHeader;
    return this;
  }

  public renderItem(item) {
    const value = this._extractValue(item);
    return this._render ? this._render(value, item) : value;
  }

  public renderHeader() {
    return this._renderHeader ? this._renderHeader() : null;
  }
}
