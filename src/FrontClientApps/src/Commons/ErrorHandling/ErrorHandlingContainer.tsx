import * as React from "react";
import { DefaultErrorModal } from "Commons/ErrorHandling/DefaultErrorModal";

import { apiErrorHandler, ErrorModalProps, GenericErrorHandlingContainer } from "./GenericErrorHandlingContainer";

interface DefaultErrorHandlingContainerProps {
    showMessageFromServer?: boolean;
    children?: any;
    handlers?: Array<(state: ErrorModalProps) => React.ReactElement | null>;
}

export function ErrorHandlingContainer({
    handlers,
    children,
    showMessageFromServer,
}: DefaultErrorHandlingContainerProps) {
    return (
        <GenericErrorHandlingContainer
            handlers={[
                ...(handlers || []),
                apiErrorHandler(
                    s => <DefaultErrorModal showMessageFromServer={showMessageFromServer || false} {...s} />,
                    null
                ),
            ]}>
            {children}
        </GenericErrorHandlingContainer>
    );
}
