import CopyIcon from "@skbkontur/react-icons/Copy";
import { Fit, RowStack } from "@skbkontur/react-stack-layout";
import Button from "@skbkontur/react-ui/Button";
import Link from "@skbkontur/react-ui/Link";
import Modal from "@skbkontur/react-ui/Modal";
import React from "react";

import { CopyToClipboardToast } from "../AllowCopyToClipboard";

import styles from "./ErrorHandlingContainer.less";

interface ErrorHandlingContainerModalState {
    showStack: boolean;
}

interface ErrorHandlingContainerModalProps {
    canClose: boolean;
    onClose: () => void;
    message: string;
    stack: Nullable<string>;
    serverStack: Nullable<string>;
}

export class ErrorHandlingContainerModal extends React.Component<
    ErrorHandlingContainerModalProps,
    ErrorHandlingContainerModalState
> {
    public state: ErrorHandlingContainerModalState = { showStack: false };

    public componentDidMount(): void {
        window.addEventListener("keypress", this.handleKeyPress);
    }

    public componentWillUnmount(): void {
        window.removeEventListener("keypress", this.handleKeyPress);
    }

    private handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === "h") {
            this.setState({ showStack: true });
        }
    };

    public render(): JSX.Element {
        const { canClose, message, onClose, serverStack, stack } = this.props;

        const { showStack } = this.state;

        return (
            <Modal data-tid="ErrorHandlingContainerModal" onClose={canClose ? onClose : undefined} noClose={!canClose}>
                <Modal.Header data-tid="Header">Произошла непредвиденная ошибка</Modal.Header>
                <Modal.Body>
                    <div className={styles.userMessage}>
                        <div data-tid="CallToActionInErrorMessage">
                            <div className={styles.content}>
                                <p>Попробуйте повторить запрос или обновить страницу через некоторое время.</p>
                            </div>
                        </div>
                    </div>
                    {showStack && (
                        <div>
                            <hr />
                            <div className={styles.errorMessageWrap} data-tid="ErrorMessage">
                                {message}
                            </div>
                        </div>
                    )}
                    {showStack && (
                        <div className={styles.stackTraces}>
                            {stack && (
                                <RowStack baseline block gap={2}>
                                    <Fit>
                                        <h4 className={styles.header}>Client stack trace</h4>
                                    </Fit>
                                    <Fit>
                                        <Link icon={<CopyIcon />} onClick={() => this.copyData(stack)}>
                                            Скопировать
                                        </Link>
                                    </Fit>
                                </RowStack>
                            )}
                            {stack && (
                                <div className={styles.stackTraceContainer}>
                                    <pre data-tid="ClientErrorStack" className={styles.stackTrace}>
                                        {stack}
                                    </pre>
                                </div>
                            )}
                            {serverStack && (
                                <RowStack baseline block gap={2}>
                                    <Fit>
                                        <h4 className={styles.header}>Server stack trace</h4>
                                    </Fit>
                                    <Fit>
                                        <Link icon={<CopyIcon />} onClick={() => this.copyData(serverStack)}>
                                            Скопировать
                                        </Link>
                                    </Fit>
                                </RowStack>
                            )}
                            {serverStack && (
                                <div className={styles.stackTraceContainer}>
                                    <pre data-tid="ServerErrorStack" className={styles.stackTrace}>
                                        {serverStack}
                                    </pre>
                                </div>
                            )}
                        </div>
                    )}
                </Modal.Body>
                {canClose && (
                    <Modal.Footer panel>
                        <Button onClick={onClose} data-tid="CloseButton">
                            Закрыть
                        </Button>
                    </Modal.Footer>
                )}
            </Modal>
        );
    }

    private copyData(stack: Nullable<string>) {
        if (stack != null) {
            CopyToClipboardToast.copyText(stack);
        }
    }
}
