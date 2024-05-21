import { Button, Modal, ThemeContext } from "@skbkontur/react-ui";
import React from "react";

import { CopyToClipboardToast } from "../AllowCopyToClipboard";

import { jsStyles } from "./ErrorHandlingContainer.styles";
import { StackTrace } from "./StackTrace";

interface ErrorModalProps {
    canClose: boolean;
    message: string;
    stack: Nullable<string>;
    serverStack: Nullable<string>;

    onClose(): void;
}

export const ErrorModal = ({ canClose, onClose, stack, serverStack, message }: ErrorModalProps): React.JSX.Element => {
    const theme = React.useContext(ThemeContext);

    const copyData = (stack: Nullable<string>) => {
        if (stack) {
            CopyToClipboardToast.copyText(stack);
        }
    };

    const handleCopyStack = () => {
        copyData(stack);
    };

    const handleCopyServerStack = () => {
        copyData(serverStack);
    };

    return (
        <Modal data-tid="ErrorHandlingContainerModal" onClose={canClose ? onClose : undefined} noClose={!canClose}>
            <Modal.Header data-tid="Header">
                <span className={jsStyles.modalHeader(theme)}>Произошла непредвиденная ошибка</span>
            </Modal.Header>
            <Modal.Body>
                <div className={jsStyles.modalBody(theme)}>
                    <p className={jsStyles.userMessage()} data-tid="CallToActionInErrorMessage">
                        Попробуйте повторить запрос или обновить страницу через некоторое время
                    </p>
                    <hr />
                    <p className={jsStyles.errorMessageWrap()} data-tid="ErrorMessage">
                        {message}
                    </p>
                    <div className={jsStyles.stackTraces()}>
                        {stack && <StackTrace caption="Client stack trace" trace={stack} onCopy={handleCopyStack} />}
                        {serverStack && (
                            <StackTrace
                                caption="Server stack trace"
                                trace={serverStack}
                                onCopy={handleCopyServerStack}
                            />
                        )}
                    </div>
                </div>
            </Modal.Body>
            {canClose && (
                <Modal.Footer panel>
                    <Button onClick={onClose} size="medium" data-tid="CloseButton">
                        Закрыть
                    </Button>
                </Modal.Footer>
            )}
        </Modal>
    );
};
