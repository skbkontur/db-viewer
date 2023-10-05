import { Fit, RowStack } from "@skbkontur/react-stack-layout";
import { Button, Modal, ThemeContext } from "@skbkontur/react-ui";
import React from "react";

import { jsStyles } from "./ConfirmDeleteObjectModal.styles";

interface ConfirmDeleteObjectModalProps {
    onDelete: () => void;
    onCancel: () => void;
}

export function ConfirmDeleteObjectModal({ onDelete, onCancel }: ConfirmDeleteObjectModalProps): React.ReactElement {
    const theme = React.useContext(ThemeContext);
    return (
        <Modal ignoreBackgroundClick noClose data-tid="ConfirmDeleteObjectModal">
            <Modal.Header>
                <span className={jsStyles.modalText(theme)}>Подтвердите удаление объекта</span>
            </Modal.Header>
            <Modal.Body>
                <span className={jsStyles.modalText(theme)}>Данные об объекте будут удалены безвозвратно</span>
            </Modal.Body>
            <Modal.Footer panel>
                <RowStack gap={2} block>
                    <Fit>
                        <Button use="primary" onClick={onDelete} data-tid="Delete">
                            Удалить
                        </Button>
                    </Fit>
                    <Button onClick={onCancel} data-tid="Cancel">
                        Отменить
                    </Button>
                </RowStack>
            </Modal.Footer>
        </Modal>
    );
}
