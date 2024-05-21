import { XCircleIcon64Regular } from "@skbkontur/icons/icons/XCircleIcon/XCircleIcon64Regular";
import { Button, MiniModal, ThemeContext } from "@skbkontur/react-ui";
import React from "react";

import { jsStyles } from "./ErrorHandlingContainer.styles";

interface ErrorHandlingContainerMiniModalProps {
    onClose(): void;
}

export const ErrorMiniModal = ({ onClose }: ErrorHandlingContainerMiniModalProps): React.JSX.Element => {
    const theme = React.useContext(ThemeContext);

    return (
        <MiniModal data-tid="ErrorHandlingContainerModal" width={410}>
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
};
