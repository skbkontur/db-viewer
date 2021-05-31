import CopyIcon from "@skbkontur/react-icons/Copy";
import { Fit, RowStack } from "@skbkontur/react-stack-layout";
import { Button, Link, Modal, ThemeContext } from "@skbkontur/react-ui";
import { Theme } from "@skbkontur/react-ui/lib/theming/Theme";
import React from "react";

import { CopyToClipboardToast } from "../AllowCopyToClipboard";

import { jsStyles } from "./ErrorHandlingContainer.styles";

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
    private theme!: Theme;

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
        return (
            <ThemeContext.Consumer>
                {theme => {
                    this.theme = theme;
                    return this.renderMain();
                }}
            </ThemeContext.Consumer>
        );
    }

    private renderMain(): JSX.Element {
        const { canClose, message, onClose, serverStack, stack } = this.props;

        const { showStack } = this.state;

        return (
            <Modal data-tid="ErrorHandlingContainerModal" onClose={canClose ? onClose : undefined} noClose={!canClose}>
                <Modal.Header data-tid="Header">
                    <span className={jsStyles.modalText(this.theme)}>Произошла непредвиденная ошибка</span>
                </Modal.Header>
                <Modal.Body>
                    <div className={jsStyles.modalText(this.theme)}>
                        <div className={jsStyles.userMessage()}>
                            <div data-tid="CallToActionInErrorMessage">
                                <div className={jsStyles.content()}>
                                    <p>Попробуйте повторить запрос или обновить страницу через некоторое время.</p>
                                </div>
                            </div>
                        </div>
                        {showStack && (
                            <div>
                                <hr />
                                <div className={jsStyles.errorMessageWrap()} data-tid="ErrorMessage">
                                    {message}
                                </div>
                            </div>
                        )}
                        {showStack && (
                            <div className={jsStyles.stackTraces()}>
                                {stack && (
                                    <RowStack baseline block gap={2}>
                                        <Fit>
                                            <h4 className={jsStyles.header()}>Client stack trace</h4>
                                        </Fit>
                                        <Fit>
                                            <Link icon={<CopyIcon />} onClick={() => this.copyData(stack)}>
                                                Скопировать
                                            </Link>
                                        </Fit>
                                    </RowStack>
                                )}
                                {stack && (
                                    <div className={jsStyles.stackTraceContainer()}>
                                        <pre data-tid="ClientErrorStack" className={jsStyles.stackTrace(this.theme)}>
                                            {stack}
                                        </pre>
                                    </div>
                                )}
                                {serverStack && (
                                    <RowStack baseline block gap={2}>
                                        <Fit>
                                            <h4 className={jsStyles.header()}>Server stack trace</h4>
                                        </Fit>
                                        <Fit>
                                            <Link icon={<CopyIcon />} onClick={() => this.copyData(serverStack)}>
                                                Скопировать
                                            </Link>
                                        </Fit>
                                    </RowStack>
                                )}
                                {serverStack && (
                                    <div className={jsStyles.stackTraceContainer()}>
                                        <pre data-tid="ServerErrorStack" className={jsStyles.stackTrace(this.theme)}>
                                            {serverStack}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
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
