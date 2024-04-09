import { CopyIcon16Light } from "@skbkontur/icons/icons/CopyIcon/CopyIcon16Light";
import { XCircleIcon64Regular } from "@skbkontur/icons/icons/XCircleIcon/XCircleIcon64Regular";
import { Fit, RowStack } from "@skbkontur/react-stack-layout";
import { Button, Link, Modal, MiniModal, ThemeContext } from "@skbkontur/react-ui";
import React from "react";

import { CopyToClipboardToast } from "../AllowCopyToClipboard";

import { jsStyles } from "./ErrorHandlingContainer.styles";
import { useDeveloperMode } from "./useDeveloperMode";

interface ErrorHandlingContainerModalProps {
    canClose: boolean;
    message: string;
    stack: Nullable<string>;
    serverStack: Nullable<string>;

    onClose(): void;
}

export const ErrorHandlingContainerModal = ({
    message,
    onClose,
    canClose,
    stack,
    serverStack,
}: ErrorHandlingContainerModalProps): React.JSX.Element => {
    const showStack = useDeveloperMode();
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

    if (!showStack) {
        return (
            <MiniModal width={410}>
                <MiniModal.Header data-tid="Header" icon={<XCircleIcon64Regular color="#FF5A49" />}>
                    <span className={jsStyles.modalHeader(theme)}>Произошла непредвиденная ошибка</span>
                </MiniModal.Header>
                <MiniModal.Body className={jsStyles.modalBody(theme)}>
                    Попробуйте повторить запрос или обновить страницу через некоторе время
                </MiniModal.Body>
                <MiniModal.Footer>
                    <Button onClick={onClose} size="medium" data-tid="CloseButton">
                        Закрыть
                    </Button>
                </MiniModal.Footer>
            </MiniModal>
        );
    }

    const renderStackTrace = (caption: string, trace: string, onCopy: () => void): React.JSX.Element => (
        <>
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
        </>
    );

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
                    {showStack && (
                        <>
                            <hr />
                            <p className={jsStyles.errorMessageWrap()} data-tid="ErrorMessage">
                                {message}
                            </p>
                            <div className={jsStyles.stackTraces()}>
                                {stack && renderStackTrace("Client stack trace", stack, handleCopyStack)}
                                {serverStack &&
                                    renderStackTrace("Server stack trace", serverStack, handleCopyServerStack)}
                            </div>
                        </>
                    )}
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
