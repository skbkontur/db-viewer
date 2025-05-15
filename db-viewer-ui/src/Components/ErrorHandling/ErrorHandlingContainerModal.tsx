import React from "react";

import { ErrorMiniModal } from "./ErrorMiniModal";
import { ErrorModal } from "./ErrorModal";
import { useDeveloperMode } from "./useDeveloperMode";

interface ErrorHandlingContainerModalProps {
    canClose: boolean;
    message: string;
    stack: Nullable<string>;
    serverStack: Nullable<string>;

    onClose(): void;
}

export const ErrorHandlingContainerModal = ({
    onClose,
    ...restProps
}: ErrorHandlingContainerModalProps): React.ReactElement => {
    const showStack = useDeveloperMode();

    return showStack ? <ErrorModal {...restProps} onClose={onClose} /> : <ErrorMiniModal onClose={onClose} />;
};
