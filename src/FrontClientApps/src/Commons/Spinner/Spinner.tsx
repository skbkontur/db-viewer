import * as React from "react";
import { Spinner as UiSpinner } from "ui";

import cn from "./Spinner.less";

interface SpinnerProps {
    caption?: string;
}

export class Spinner extends React.Component<SpinnerProps> {
    public render(): JSX.Element {
        return (
            <span className={cn("root")}>
                <UiSpinner type="mini" caption={this.props.caption || ""} />
            </span>
        );
    }
}
