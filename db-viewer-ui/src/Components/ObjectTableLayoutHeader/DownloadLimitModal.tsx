import { MinusCircleIcon64Regular } from "@skbkontur/icons/icons/MinusCircleIcon/MinusCircleIcon64Regular";
import { Button, MiniModal, ThemeContext } from "@skbkontur/react-ui";
import React from "react";

import { jsStyles } from "../ConfirmDeleteObjectModal/ConfirmDeleteObjectModal.styles";

interface DownloadLimitModalProps {
    countLimit: number;
    onDownloadAbort: () => void;
}

export function DownloadLimitModal({ countLimit, onDownloadAbort }: DownloadLimitModalProps): React.ReactElement {
    const theme = React.useContext(ThemeContext);
    return (
        <MiniModal onClose={onDownloadAbort} ignoreBackgroundClick data-tid="DownloadLimitModal">
            <MiniModal.Header icon={<MinusCircleIcon64Regular />} data-tid="Header">
                <span className={jsStyles.modalHeader(theme)}>Слишком большой список</span>
            </MiniModal.Header>
            <MiniModal.Body data-tid="Body">
                <span className={jsStyles.modalBody(theme)}>
                    <span className={jsStyles.modalCaption()}>
                        Мы умеем выгружать не более {countLimit}&nbsp;объектов из&nbsp;этой таблицы.
                    </span>
                    <span>Уточните запрос с помощью фильтров</span>
                </span>
            </MiniModal.Body>
            <MiniModal.Footer>
                <Button data-tid="Cancel" size="medium" onClick={onDownloadAbort}>
                    Понятно
                </Button>
            </MiniModal.Footer>
        </MiniModal>
    );
}
