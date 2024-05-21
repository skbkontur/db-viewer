import { Fit, RowStack } from "@skbkontur/react-stack-layout";
import { Button, Link, Modal, ThemeContext } from "@skbkontur/react-ui";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import React from "react";
import { useLocation } from "react-router";

import { Condition } from "../../Domain/Api/DataTypes/Condition";
import { PropertyMetaInformation } from "../../Domain/Api/DataTypes/PropertyMetaInformation";
import { RouteUtils } from "../../Domain/Utils/RouteUtils";
import { jsStyles } from "../ConfirmDeleteObjectModal/ConfirmDeleteObjectModal.styles";
import { ObjectFilter } from "../ObjectFilter/ObjectFilter";
import { RouterLink } from "../RouterLink/RouterLink";

interface FilterModalProps {
    onClose: () => void;
    allowClose: boolean;
    modalEditingConditions: Condition[];
    tableColumns: PropertyMetaInformation[];
    onApplyFilter: () => void;
    onChangeFilter: (x0: Condition[]) => void;
}

export const FilterModal = ({
    tableColumns,
    onClose,
    modalEditingConditions,
    onChangeFilter,
    onApplyFilter,
    allowClose,
}: FilterModalProps): React.ReactElement => {
    const { pathname } = useLocation();
    const container = React.useRef<ValidationContainer>(null);
    const theme = React.useContext(ThemeContext);

    const handleApplyFilter = async () => {
        const isValid = (await container.current?.validate()) ?? true;
        if (isValid) {
            onApplyFilter();
        }
    };

    return (
        <Modal
            onClose={onClose}
            data-tid="FilterModal"
            ignoreBackgroundClick
            disableClose={!allowClose}
            noClose={!allowClose}>
            <Modal.Header>
                <span className={jsStyles.modalHeader(theme)}>Фильтр</span>
            </Modal.Header>
            <Modal.Body>
                <ValidationContainer ref={container} scrollOffset={{ top: 100 }}>
                    <ObjectFilter
                        conditions={modalEditingConditions}
                        onChange={onChangeFilter}
                        tableColumns={tableColumns}
                    />
                </ValidationContainer>
            </Modal.Body>
            <Modal.Footer panel>
                <RowStack baseline block gap={2}>
                    <Fit>
                        <Button onClick={handleApplyFilter} use="primary" data-tid="Apply">
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
                            <RouterLink to={RouteUtils.backUrl(pathname)} data-tid="GoBackToList">
                                Вернуться к списку видов объектов
                            </RouterLink>
                        )}
                    </Fit>
                </RowStack>
            </Modal.Footer>
        </Modal>
    );
};
