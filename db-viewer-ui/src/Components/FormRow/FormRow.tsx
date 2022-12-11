import { Fit, Fixed, RowStack } from "@skbkontur/react-stack-layout";
import { Hint, ThemeContext } from "@skbkontur/react-ui";
import React from "react";

import { jsStyles } from "./FormRow.styles";

export interface FormRowProps {
    caption?: string | JSX.Element;
    captionWidth?: number;
    children?: React.ReactNode;
    hint?: null | string;
}

export function FormRow({ caption, captionWidth, hint, children }: FormRowProps): JSX.Element {
    const theme = React.useContext(ThemeContext);

    const hintElement = hint ? (
        <div style={{ textAlign: "start" }}>
            {hint.split("\n").map(x => (
                <div key={x}>{x}</div>
            ))}
        </div>
    ) : null;

    return (
        <RowStack gap={2}>
            <Fixed data-tid="FormCaption" className={jsStyles.caption(theme)} width={captionWidth || 240}>
                {hintElement ? (
                    <Hint maxWidth={400} text={hintElement}>
                        {caption}
                    </Hint>
                ) : (
                    caption
                )}
            </Fixed>
            <Fit>{children}</Fit>
        </RowStack>
    );
}
