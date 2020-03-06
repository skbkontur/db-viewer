import CopyIcon from "@skbkontur/react-icons/Copy";
import { Fit, RowStack } from "@skbkontur/react-stack-layout";
import Button from "@skbkontur/react-ui/Button";
import Link from "@skbkontur/react-ui/Link";
import Modal from "@skbkontur/react-ui/Modal";
import * as React from "react";

import { CopyToClipboardToast } from "../AllowCopyToClipboard";

import cn from "./ErrorHandlingContainer.less";

interface ErrorHandlingContainerModalState {
    showStack: boolean;
}

interface ErrorHandlingContainerModalProps {
    canClose: boolean;
    onClose: () => void;
    errorModalTitle: string;
    showMessageFromServerByDefault: boolean;
    message: string;
    stack: Nullable<string>;
    serverStack: Nullable<string>;
}

export class ErrorHandlingContainerModal extends React.Component<
    ErrorHandlingContainerModalProps,
    ErrorHandlingContainerModalState
> {
    public state: ErrorHandlingContainerModalState = { showStack: false };

    public componentDidMount() {
        window.addEventListener("keypress", this.handleKeyPress);
    }

    public componentWillUnmount() {
        window.removeEventListener("keypress", this.handleKeyPress);
    }

    public handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === "h") {
            this.setState({ showStack: true });
        }
    };

    public render() {
        const {
            canClose,
            message,
            errorModalTitle,
            onClose,
            serverStack,
            showMessageFromServerByDefault,
            stack,
            children,
        } = this.props;

        const { showStack } = this.state;

        return (
            <Modal data-tid="ErrorHandlingContainerModal" onClose={canClose ? onClose : undefined} noClose={!canClose}>
                <Modal.Header data-tid="Header">{errorModalTitle}</Modal.Header>
                <Modal.Body>
                    <div className={cn("user-message")}>
                        {showMessageFromServerByDefault && (
                            <div className={cn("error-message-from-server")}>
                                <div className={cn("error-message-wrap")} data-tid="ErrorMessage">
                                    {message}
                                </div>
                                <hr />
                            </div>
                        )}
                        <div data-tid="CallToActionInErrorMessage">{children}</div>
                    </div>
                    {showStack &&
                        !showMessageFromServerByDefault && (
                            <div>
                                <hr />
                                <div className={cn("error-message-wrap")} data-tid="ErrorMessage">
                                    {message}
                                </div>
                            </div>
                        )}
                    {showStack && (
                        <div className={cn("stack-traces")}>
                            {stack && (
                                <RowStack baseline block gap={2}>
                                    <Fit>
                                        <h4>Client stack trace</h4>
                                    </Fit>
                                    <Fit>
                                        <Link icon={<CopyIcon />} onClick={() => this.copyData(stack)}>
                                            Скопировать
                                        </Link>
                                    </Fit>
                                </RowStack>
                            )}
                            {stack && (
                                <div className={cn("stack-trace-container")}>
                                    <pre data-tid="ClientErrorStack" className={cn("stack-trace")}>
                                        {stack}
                                    </pre>
                                </div>
                            )}
                            {serverStack && (
                                <RowStack baseline block gap={2}>
                                    <Fit>
                                        <h4>Server stack trace</h4>
                                    </Fit>
                                    <Fit>
                                        <Link icon={<CopyIcon />} onClick={() => this.copyData(serverStack)}>
                                            Скопировать
                                        </Link>
                                    </Fit>
                                </RowStack>
                            )}
                            {serverStack && (
                                <div className={cn("stack-trace-container")}>
                                    <pre data-tid="ServerErrorStack" className={cn("stack-trace")}>
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
