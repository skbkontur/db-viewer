import { Fit, Fixed, RowStack } from "@skbkontur/react-stack-layout";
import { ThemeContext } from "@skbkontur/react-ui";
import { useContext, type ReactElement, type ReactNode } from "react";

import { jsStyles } from "./FormRow.styles";

export interface FormRowProps {
    caption?: string | ReactElement;
    captionWidth?: number;
    children?: ReactNode;
}

export function FormRow({ caption, captionWidth, children }: FormRowProps) {
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
