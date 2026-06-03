import { IconXCircleRegular64 } from "@skbkontur/icons/IconXCircleRegular64";
import { Button, MiniModal, ThemeContext } from "@skbkontur/react-ui";
import { useContext, type ReactElement } from "react";

import { jsStyles } from "./ErrorHandlingContainer.styles";

interface ErrorHandlingContainerMiniModalProps {
    onClose(): void;
}

export const ErrorMiniModal = ({ onClose }: ErrorHandlingContainerMiniModalProps): ReactElement => {
    const theme = useContext(ThemeContext);

    return (
        <MiniModal data-tid="ErrorHandlingContainerModal" width={410}>
            <MiniModal.Header data-tid="Header" icon={<IconXCircleRegular64 color="#FF5A49" />}>
                <span className={jsStyles.modalHeader(theme)}>Произошла непредвиденная ошибка</span>
            </MiniModal.Header>
            <MiniModal.Body className={jsStyles.modalBody(theme)} data-tid="CallToActionInErrorMessage">
                Попробуйте повторить запрос или обновить страницу через некоторое время
            </MiniModal.Body>
            <MiniModal.Footer>
                <Button onClick={onClose} size="medium" data-tid="CloseButton">
                    Закрыть
                </Button>
            </MiniModal.Footer>
        </MiniModal>
    );
};
