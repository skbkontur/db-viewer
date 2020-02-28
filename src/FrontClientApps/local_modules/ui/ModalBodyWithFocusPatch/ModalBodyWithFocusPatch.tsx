import Modal from "@skbkontur/react-ui/Modal";
import * as React from "react";

import cn from "./ModalBodyWithFocusPatch.less";

const RetailUiModalBody = Modal.Body;

interface ModalBodyWithFocusPatchProps {
    children?: React.ReactNode;
    manageFocus?: boolean;
}

export class ModalBodyWithFocusPatch extends React.Component<ModalBodyWithFocusPatchProps> {
    public fakeFocusabelDiv: null | HTMLElement = null;
    public previousActiveElement: null | HTMLElement = null;

    public componentDidMount() {
        const { manageFocus } = this.props;
        const fakeFocusabelDiv = this.fakeFocusabelDiv;
        if (manageFocus && fakeFocusabelDiv != null) {
            if (document.activeElement instanceof HTMLElement) {
                this.previousActiveElement = document.activeElement;
                fakeFocusabelDiv.focus();
            }
        }
    }

    public componentWillUnmount() {
        const { manageFocus } = this.props;
        if (manageFocus && this.previousActiveElement != null) {
            this.previousActiveElement.focus();
        }
    }

    public render(): JSX.Element {
        const { children, manageFocus, ...restProps } = this.props;
        return (
            <RetailUiModalBody {...restProps}>
                {manageFocus && (
                    <div tabIndex={-1} className={cn("fake-focusabel-div")} ref={x => (this.fakeFocusabelDiv = x)} />
                )}
                {children}
            </RetailUiModalBody>
        );
    }
}
