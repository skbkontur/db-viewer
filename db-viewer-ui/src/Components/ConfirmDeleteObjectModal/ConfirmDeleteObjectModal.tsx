import { XCircleIcon64Regular } from "@skbkontur/icons/icons/XCircleIcon/XCircleIcon64Regular";
import { ColumnStack } from "@skbkontur/react-stack-layout";
import { Button, MiniModal, ThemeContext } from "@skbkontur/react-ui";
import React from "react";

import { jsStyles } from "./ConfirmDeleteObjectModal.styles";

interface ConfirmDeleteObjectModalProps {
    onDelete: () => void;
    onCancel: () => void;
}

export function ConfirmDeleteObjectModal({ onDelete, onCancel }: ConfirmDeleteObjectModalProps): React.ReactElement {
    const theme = React.useContext(ThemeContext);
    return (
        <MiniModal ignoreBackgroundClick data-tid="ConfirmDeleteObjectModal">
            <MiniModal.Header icon={<XCircleIcon64Regular />}>
                <span className={jsStyles.modalHeader(theme)}>Удалить объект?</span>
            </MiniModal.Header>
            <MiniModal.Body>
                <span className={jsStyles.modalBody(theme)}>Данные об объекте будут удалены безвозвратно</span>
            </MiniModal.Body>
            <MiniModal.Footer>
                <ColumnStack gap={2} block>
                    <Button size="medium" use="danger" onClick={onDelete} data-tid="Delete">
                        Удалить
                    </Button>
                    <Button size="medium" onClick={onCancel} data-tid="Cancel">
                        Отменить
                    </Button>
                </ColumnStack>
            </MiniModal.Footer>
        </MiniModal>
    );
}
