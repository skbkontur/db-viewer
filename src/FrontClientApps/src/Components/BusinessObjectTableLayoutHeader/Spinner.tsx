import UiSpinner from "@skbkontur/react-ui/Spinner";
import * as React from "react";

import * as styles from "./Spinner.less";

interface SpinnerProps {
    caption?: string;
}

export class Spinner extends React.Component<SpinnerProps> {
    public render(): JSX.Element {
        return (
            <span className={styles.root}>
                <UiSpinner type="mini" caption={this.props.caption || ""} />
            </span>
        );
    }
}
