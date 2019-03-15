import Button from "@skbkontur/react-ui/Button";
import Gapped from "@skbkontur/react-ui/Gapped";
import Modal from "@skbkontur/react-ui/Modal";
import * as React from "react";
import PromiseModal from "../Common/PromiseModal";

export class DeleteModal extends PromiseModal {
  public renderContent(resolve, _) {
    return (
      <Modal onClose={() => resolve(false)}>
        <Modal.Header>Удалить объект</Modal.Header>
        <Modal.Body>Вы уверены?</Modal.Body>
        <Modal.Footer panel>
          <Gapped>
            <Button onClick={() => resolve(true)} use={"danger"}>
              Да
            </Button>
            <Button onClick={() => resolve(false)}>Нет</Button>
          </Gapped>
        </Modal.Footer>
      </Modal>
    );
  }
}
