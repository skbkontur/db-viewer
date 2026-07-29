import { Fit, Fixed, RowStack } from "@skbkontur/react-stack-layout";
import { ThemeContext } from "@skbkontur/react-ui";
import { useStyles } from "@skbkontur/react-ui/lib/renderEnvironment";
import { useContext, type ReactElement, type ReactNode } from "react";

import { getStyles } from "./FormRow.styles";

export interface FormRowProps {
    caption?: string | ReactElement;
    captionWidth?: number;
    children?: ReactNode;
}

export function FormRow({ caption, captionWidth, children }: FormRowProps) {
    const jsStyles = useStyles(getStyles);
    const theme = useContext(ThemeContext);
    return (
        <RowStack gap={2}>
            <Fixed data-tid="FormCaption" className={jsStyles.caption(theme)} width={captionWidth || 240}>
                {caption}
            </Fixed>
            <Fit>{children}</Fit>
        </RowStack>
    );
}
