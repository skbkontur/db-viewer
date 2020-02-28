import Link from "@skbkontur/react-ui/Link";
import * as React from "react";
import { ErrorHandlingContainerModal } from "Commons/ErrorHandling/ErrorHandlingContainerModal";
import { ApiError } from "Domain/ApiBase/ApiError";

import { ErrorModalProps } from "./GenericErrorHandlingContainer";

interface DefaultErrorModalProps extends ErrorModalProps {
    showMessageFromServer: boolean;
}

export function DefaultErrorModal({ onClose, isFatal, error, stack, showMessageFromServer }: DefaultErrorModalProps) {
    const contactInfo = { eMail: "", phone: "" };
    return (
        <ErrorHandlingContainerModal
            canClose={!isFatal}
            onClose={onClose}
            errorModalTitle="Произошла непредвиденная ошибка"
            showMessageFromServerByDefault={showMessageFromServer}
            message={error == null ? "" : error.message || error.toString()}
            stack={stack}
            serverStack={error instanceof ApiError ? error.serverStackTrace : null}>
            <div>
                <p>Попробуйте повторить запрос или обновить страницу через некоторое время.</p>
                <p>
                    Если ошибка повторяется &mdash; напишите нам на{" "}
                    <Link href={`mail:${contactInfo.eMail}`}>{contactInfo.eMail}</Link>
                    <br />
                    или позвоните {contactInfo.phone}
                </p>
            </div>
        </ErrorHandlingContainerModal>
    );
}
