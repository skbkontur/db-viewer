import { Spinner as UiSpinner } from "@skbkontur/react-ui";
import { useStyles } from "@skbkontur/react-ui/lib/renderEnvironment";
import type { ReactElement } from "react";

import { getStyles } from "./Spinner.styles";

interface SpinnerProps {
    caption?: string;
}

export const Spinner = ({ caption = "" }: SpinnerProps): ReactElement => {
    const jsStyles = useStyles(getStyles);
    return (
        <span className={jsStyles.root()}>
            <UiSpinner size="small" caption={caption} />
        </span>
    );
};
