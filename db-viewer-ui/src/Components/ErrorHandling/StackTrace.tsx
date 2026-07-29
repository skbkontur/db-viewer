import { IconCopyLight16 } from "@skbkontur/icons/IconCopyLight16";
import { Fit, RowStack } from "@skbkontur/react-stack-layout";
import { Link, ThemeContext } from "@skbkontur/react-ui";
import { useStyles } from "@skbkontur/react-ui/lib/renderEnvironment";
import { useContext, type ReactElement } from "react";

import { getStyles } from "./ErrorHandlingContainer.styles";

interface StackTraceProps {
    caption: string;
    trace: string;

    onCopy(): void;
}

export const StackTrace = ({ caption, trace, onCopy }: StackTraceProps): ReactElement => {
    const jsStyles = useStyles(getStyles);
    const theme = useContext(ThemeContext);

    return (
        <section>
            <RowStack baseline block gap={2}>
                <Fit>
                    <h4 className={jsStyles.header()}>{caption}</h4>
                </Fit>
                <Fit>
                    <Link icon={<IconCopyLight16 />} onClick={onCopy}>
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
