import { IconMinusCircleRegular64 } from "@skbkontur/icons/IconMinusCircleRegular64";
import { Button, MiniModal, ThemeContext } from "@skbkontur/react-ui";
import { useContext, type ReactElement } from "react";

import { jsStyles } from "../ConfirmDeleteObjectModal/ConfirmDeleteObjectModal.styles";

interface DownloadLimitModalProps {
    countLimit: number;
    onDownloadAbort: () => void;
}

export function DownloadLimitModal({ countLimit, onDownloadAbort }: DownloadLimitModalProps): ReactElement {
    const theme = useContext(ThemeContext);
    return (
        <MiniModal onClose={onDownloadAbort} ignoreBackgroundClick data-tid="DownloadLimitModal">
            <MiniModal.Header icon={<IconMinusCircleRegular64 />} data-tid="Header">
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
