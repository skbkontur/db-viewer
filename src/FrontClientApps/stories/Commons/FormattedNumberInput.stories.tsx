import { storiesOf } from "@storybook/react";
import * as React from "react";
import { FormattedNumberInput } from "Commons/FormattedNumberInput/FormattedNumberInput";

class FormattedNumberInputContainer extends React.Component<
    {
        viewFormat?: Nullable<string>;
        editFormat?: Nullable<string>;
        align?: "left" | "right";
        selectValueOnFocus?: boolean;
        allowNegativeValue?: boolean;
    },
    { value: Nullable<number> }
> {
    public state: { value: Nullable<number> } = { value: 0 };

    public render(): JSX.Element {
        return (
            <FormattedNumberInput
                {...this.props}
                data-tid="Input"
                onChange={(e, value) => this.setState({ value: value })}
                value={this.state.value}
            />
        );
    }
}

storiesOf("FormattedNumberInput", module)
    .add("Default", () => <FormattedNumberInputContainer />)
    .add("Format 0.000", () => <FormattedNumberInputContainer editFormat="0.000" />)
    .add("Format 0 0.000", () => <FormattedNumberInputContainer viewFormat="0,0.000" editFormat="0.000" />)
    .add("Format 0 0.000 Align Right", () => (
        <FormattedNumberInputContainer viewFormat="0,0.000" editFormat="0.000" align="right" />
    ))
    .add("Format 0 0.000 default value 0.12", () => (
        <FormattedNumberInputContainer viewFormat="0,0.000" editFormat="0.000" />
    ))
    .add("WithSelection", () => (
        <FormattedNumberInputContainer viewFormat="0,0.000" editFormat="0.000" selectValueOnFocus />
    ))
    .add("With negative value", () => <FormattedNumberInputContainer editFormat="0,0.0[00000]" allowNegativeValue />);
