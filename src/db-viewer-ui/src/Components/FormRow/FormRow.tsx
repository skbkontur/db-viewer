import { Fit, Fixed, RowStack } from "@skbkontur/react-stack-layout";
import React from "react";

import styles from "./FormRow.less";

export interface FormRowProps {
    caption?: string | JSX.Element;
    captionWidth?: number;
    children?: any;
}

export class FormRow extends React.Component<FormRowProps> {
    public render(): JSX.Element {
        const { caption, captionWidth, children } = this.props;
        return (
            <RowStack gap={2}>
                <Fixed className={styles.caption} width={captionWidth || 240}>
                    {caption}
                </Fixed>
                <Fit>{children}</Fit>
            </RowStack>
        );
    }
}
