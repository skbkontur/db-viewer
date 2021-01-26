import { Fit, RowStack } from "@skbkontur/react-stack-layout";
import { Button, Modal } from "@skbkontur/react-ui";
import React from "react";

interface ConfirmDeleteObjectModalProps {
    onDelete: () => void;
    onCancel: () => void;
}

export function ConfirmDeleteObjectModal({ onDelete, onCancel }: ConfirmDeleteObjectModalProps): JSX.Element {
    return (
        <Modal ignoreBackgroundClick noClose data-tid="ConfirmDeleteObjectModal">
            <Modal.Header>Подтвердите удаление объекта</Modal.Header>
            <Modal.Body>Данные об объекте будут удалены безвозвратно</Modal.Body>
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
