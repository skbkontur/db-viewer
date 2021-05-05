import { Button, Modal, ThemeContext } from "@skbkontur/react-ui";
import React from "react";

import { jsStyles } from "../ConfirmDeleteObjectModal/ConfirmDeleteObjectModal.styles";

interface DownloadLimitModalProps {
    countLimit: number;
    onDownloadAbort: () => void;
}

export function DownloadLimitModal({ countLimit, onDownloadAbort }: DownloadLimitModalProps) {
    const theme = React.useContext(ThemeContext);
    return (
        <Modal width={500} onClose={onDownloadAbort} ignoreBackgroundClick data-tid="DownloadLimitModal">
            <Modal.Header data-tid="Header">
                <span className={jsStyles.modalText(theme)}>Слишком большой список</span>
            </Modal.Header>
            <Modal.Body data-tid="Body">
                <span className={jsStyles.modalText(theme)}>
                    Мы умеем выгружать не более {countLimit} объектов из этой таблицы. Уточните запрос с помощью
                    фильтров, чтобы записей стало меньше.
                </span>
            </Modal.Body>
            <Modal.Footer panel>
                <Button data-tid="Cancel" onClick={onDownloadAbort}>
                    Понятно
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
