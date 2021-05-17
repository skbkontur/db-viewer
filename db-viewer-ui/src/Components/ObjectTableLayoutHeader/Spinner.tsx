import { Spinner as UiSpinner } from "@skbkontur/react-ui";
import React from "react";

import { jsStyles } from "./Spinner.styles";

interface SpinnerProps {
    caption?: string;
}

export class Spinner extends React.Component<SpinnerProps> {
    public render(): JSX.Element {
        return (
            <span className={jsStyles.root()}>
                <UiSpinner type="mini" caption={this.props.caption || ""} />
            </span>
        );
    }
}
