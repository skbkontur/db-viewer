import { useState, useEffect, useRef, type ReactElement } from "react";

import { ApiErrorInfo } from "../../Domain/ApiBase/ApiError";

import { ErrorHandlingContainerModal } from "./ErrorHandlingContainerModal";

interface ErrorHandlingContainerState {
    isFatal: boolean;
    error: Error | null;
    stack: string | null;
    showModal: boolean;
}

export const ErrorHandlingContainer = (): ReactElement => {
    const [{ error, isFatal, showModal, stack }, setState] = useState<ErrorHandlingContainerState>({
        isFatal: false,
        error: null,
        stack: null,
        showModal: false,
    });

    const oldOnunhandledrejection = useRef<null | ((e: PromiseRejectionEvent, ...rest: any[]) => void)>(null);

    useEffect(() => {
        oldOnunhandledrejection.current = window.onunhandledrejection;
        window.onunhandledrejection = (e: any, ...restArgs: any[]) => {
            if (oldOnunhandledrejection.current) {
                oldOnunhandledrejection.current(e, ...restArgs);
            }
            if (typeof e.preventDefault === "function") {
                e.preventDefault();
            }
            setState({
                showModal: true,
                isFatal: false,
                error: e.reason,
                stack: e.reason.stack,
            });
        };
        return () => {
            window.onunhandledrejection = oldOnunhandledrejection.current;
        };
    }, []);

    const handleHideModal = () => setState(s => ({ ...s, showModal: false }));

    const { message, serverErrorType, serverStackTrace } = (error || {}) as ApiErrorInfo;
    return (
        <div>
            {showModal && (
                <ErrorHandlingContainerModal
                    canClose={!isFatal}
                    onClose={handleHideModal}
                    message={serverErrorType + ": " + message}
                    stack={stack}
                    serverStack={serverStackTrace}
                />
            )}
        </div>
    );
};
