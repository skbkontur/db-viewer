import { ColumnStack, Fit, RowStack } from "@skbkontur/react-stack-layout";
import { tooltip, ValidationContainer, ValidationInfo, ValidationWrapperV1 } from "@skbkontur/react-ui-validations";
import Button from "@skbkontur/react-ui/Button";
import Input from "@skbkontur/react-ui/Input";
import Modal from "@skbkontur/react-ui/Modal";
import React from "react";
import { Link } from "react-router-dom";
import { StringUtils } from "Domain/Utils/StringUtils";
import { validateBusinessObjectField } from "Domain/Utils/ValidationUtils";

import { FormRow } from "../FormRow/FormRow";

interface BusinessObjectModalState {
    scopeId: string;
    id: string;
    index: Nullable<string>;
}

interface BusinessObjectModalProps {
    objectName: string;
    showIndex: boolean;
    onOpenClick: (scopeId: string, id: string, arrayIndex: Nullable<string>) => void;
}

export class BusinessObjectModal extends React.Component<BusinessObjectModalProps, BusinessObjectModalState> {
    public state: BusinessObjectModalState = {
        scopeId: "",
        id: "",
        index: null,
    };

    public container: ValidationContainer | null = null;

    public getValidation(value: string | null | undefined): ValidationInfo | null {
        if (value == null || StringUtils.isNullOrWhitespace(value)) {
            return { message: "Поле должно быть заполнено", type: "submit" };
        }
        return validateBusinessObjectField(value);
    }

    public render(): JSX.Element {
        const { objectName, showIndex } = this.props;
        const { scopeId, id, index } = this.state;
        return (
            <Modal noClose>
                <Modal.Header data-tid="Header">{objectName}</Modal.Header>
                <Modal.Body>
                    <ValidationContainer ref={el => (this.container = el)} scrollOffset={{ top: 100 }}>
                        <ColumnStack gap={2}>
                            <FormRow captionWidth={100} caption="ScopeId">
                                <ValidationWrapperV1
                                    data-tid="ScopeIdValidation"
                                    renderMessage={tooltip("right middle")}
                                    validationInfo={this.getValidation(scopeId)}>
                                    <Input
                                        onChange={(e, val) => this.setState({ scopeId: val })}
                                        value={scopeId}
                                        data-tid="ScopeId"
                                    />
                                </ValidationWrapperV1>
                            </FormRow>
                            <FormRow captionWidth={100} caption="Id">
                                <ValidationWrapperV1
                                    data-tid="IdValidation"
                                    renderMessage={tooltip("right middle")}
                                    validationInfo={this.getValidation(id)}>
                                    <Input onChange={(e, val) => this.setState({ id: val })} value={id} data-tid="Id" />
                                </ValidationWrapperV1>
                            </FormRow>
                            {showIndex && (
                                <FormRow captionWidth={100} caption="Index">
                                    <ValidationWrapperV1
                                        data-tid="IndexValidation"
                                        renderMessage={tooltip("right middle")}
                                        validationInfo={this.getValidation(index)}>
                                        <Input
                                            onChange={(e, val) => this.setState({ index: val })}
                                            value={index || ""}
                                            data-tid="Index"
                                        />
                                    </ValidationWrapperV1>
                                </FormRow>
                            )}
                        </ColumnStack>
                    </ValidationContainer>
                </Modal.Body>
                <Modal.Footer panel>
                    <RowStack baseline block gap={2}>
                        <Fit>
                            <Button use="primary" onClick={this.onOpenClick} data-tid="GoToObject">
                                Перейти
                            </Button>
                        </Fit>
                        <Link to="/AdminTools/BusinessObjects" data-tid="GoBackToList">
                            Вернуться к списку видов бизнес объектов
                        </Link>
                    </RowStack>
                </Modal.Footer>
            </Modal>
        );
    }

    public onOpenClick = () => {
        this.validateAndOpen();
    };

    public async validateAndOpen(): Promise<void> {
        const isValid = this.container != null ? await this.container.validate() : true;
        const { id, scopeId, index } = this.state;
        if (isValid) {
            this.props.onOpenClick(scopeId, id, index);
        }
    }
}
