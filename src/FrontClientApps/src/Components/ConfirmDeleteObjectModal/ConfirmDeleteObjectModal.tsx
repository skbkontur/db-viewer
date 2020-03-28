import { Fit, RowStack } from "@skbkontur/react-stack-layout";
import Button from "@skbkontur/react-ui/Button";
import Modal from "@skbkontur/react-ui/Modal";
import * as React from "react";

interface ConfirmDeleteObjectModalProps {
    onDelete: () => void;
    onCancel: () => void;
}

export function ConfirmDeleteObjectModal({ onDelete, onCancel }: ConfirmDeleteObjectModalProps): JSX.Element {
    return (
        <Modal ignoreBackgroundClick noClose data-tid="ConfirmDeleteObjectModal">
            <Modal.Header>Подтвердите удаление объекта</Modal.Header>
            <Modal.Body>Все удаленные объекты логируются с тегом [BOS-HISTORY]</Modal.Body>
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
