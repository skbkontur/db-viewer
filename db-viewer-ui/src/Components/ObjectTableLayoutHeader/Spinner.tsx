import { Spinner as UiSpinner } from "@skbkontur/react-ui";
import type { ReactElement } from "react";

import { jsStyles } from "./Spinner.styles";

interface SpinnerProps {
    caption?: string;
}

export const Spinner = ({ caption = "" }: SpinnerProps): ReactElement => (
    <span className={jsStyles.root()}>
        <UiSpinner type="mini" caption={caption} />
    </span>
);
