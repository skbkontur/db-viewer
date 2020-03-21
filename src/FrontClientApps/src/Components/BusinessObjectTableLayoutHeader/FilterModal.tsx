import { Fit, RowStack } from "@skbkontur/react-stack-layout";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import Button from "@skbkontur/react-ui/Button";
import Link from "@skbkontur/react-ui/Link";
import Modal from "@skbkontur/react-ui/Modal";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

import { Condition } from "Domain/Api/DataTypes/Condition";
import { Property } from "Domain/BusinessObjects/Property";

import { BusinessObjectFilter } from "../BusinessObjectFilter/BusinessObjectFilter";

import styles from "./BusinessObjectTableLayoutHeader.less";

interface FilterModalProps {
    onClose: () => void;
    allowClose: boolean;
    modalEditingConditions: Condition[];
    tableColumns: Property[];
    onApplyFilter: () => void;
    onChangeFilter: (x0: Condition[]) => void;
}

export class FilterModal extends React.Component<FilterModalProps> {
    public container: ValidationContainer | null = null;

    public handleApplyFilter = async () => {
        const isValid = this.container != null ? await this.container.validate() : true;
        if (isValid) {
            this.props.onApplyFilter();
        }
    };
    public render(): JSX.Element {
        const { tableColumns, onClose, modalEditingConditions, onChangeFilter, allowClose } = this.props;
        return (
            <Modal
                onClose={onClose}
                data-tid="FilterModal"
                ignoreBackgroundClick
                disableClose={!allowClose}
                noClose={!allowClose}>
                <Modal.Header>Фильтр</Modal.Header>
                <Modal.Body>
                    <ValidationContainer ref={el => (this.container = el)} scrollOffset={{ top: 100 }}>
                        <BusinessObjectFilter
                            conditions={modalEditingConditions}
                            onChange={onChangeFilter}
                            tableColumns={tableColumns}
                        />
                    </ValidationContainer>
                </Modal.Body>
                <Modal.Footer panel>
                    <RowStack baseline block gap={2}>
                        <Fit>
                            <Button onClick={this.handleApplyFilter} use="primary" data-tid="Apply">
                                Применить
                            </Button>
                        </Fit>
                        <Fit>
                            {allowClose && (
                                <Button onClick={onClose} data-tid="Close">
                                    Закрыть
                                </Button>
                            )}
                        </Fit>
                        <Fit>
                            {allowClose ? (
                                <Link onClick={() => onChangeFilter([])} data-tid="Clear">
                                    Очистить фильтр
                                </Link>
                            ) : (
                                <RouterLink className={styles.routerLink} to="/BusinessObjects" data-tid="GoBackToList">
                                    Вернуться к списку видов бизнес объектов
                                </RouterLink>
                            )}
                        </Fit>
                    </RowStack>
                </Modal.Footer>
            </Modal>
        );
    }
}
