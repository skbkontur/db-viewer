import { CopyIcon16Light } from "@skbkontur/icons/icons/CopyIcon/CopyIcon16Light";
import { Fit, RowStack } from "@skbkontur/react-stack-layout";
import { Link, ThemeContext } from "@skbkontur/react-ui";
import React from "react";

import { jsStyles } from "./ErrorHandlingContainer.styles";

interface StackTraceProps {
    caption: string;
    trace: string;

    onCopy(): void;
}

export const StackTrace = ({ caption, trace, onCopy }: StackTraceProps): React.ReactElement => {
    const theme = React.useContext(ThemeContext);

    return (
        <section>
            <RowStack baseline block gap={2}>
                <Fit>
                    <h4 className={jsStyles.header()}>{caption}</h4>
                </Fit>
                <Fit>
                    <Link icon={<CopyIcon16Light />} onClick={onCopy}>
                        Скопировать
                    </Link>
                </Fit>
            </RowStack>
            <div className={jsStyles.stackTraceContainer()}>
                <pre data-tid="ClientErrorStack" className={jsStyles.stackTrace(theme)}>
                    {trace}
                </pre>
            </div>
        </section>
    );
};
