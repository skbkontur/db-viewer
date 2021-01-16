import ClearIcon from "@skbkontur/react-icons/Clear";
import DownloadIcon from "@skbkontur/react-icons/Download";
import FilterIcon from "@skbkontur/react-icons/Filter";
import SettingsIcon from "@skbkontur/react-icons/Settings";
import { Fill, Fit, RowStack } from "@skbkontur/react-stack-layout";
import Button from "@skbkontur/react-ui/Button";
import Link from "@skbkontur/react-ui/Link";
import Modal from "@skbkontur/react-ui/Modal";
import Tooltip from "@skbkontur/react-ui/Tooltip";
import difference from "lodash/difference";
import React from "react";

import { Condition } from "../../Domain/Api/DataTypes/Condition";
import { CountResult } from "../../Domain/Api/DataTypes/CountResult";
import { PropertyMetaInformation } from "../../Domain/Api/DataTypes/PropertyMetaInformation";
import { ObjectSearchQuery } from "../../Domain/Objects/ObjectSearchQuery";
import { PropertyMetaInformationUtils } from "../../Domain/Objects/PropertyMetaInformationUtils";
import { FieldSelector } from "../FieldSelector/FieldSelector";

import { CountOfRecordsSelector } from "./CountOfRecordsSelector";
import { FilterModal } from "./FilterModal";
import styles from "./ObjectTableLayoutHeader.less";
import { Spinner } from "./Spinner";

interface ObjectTableLayoutHeaderProps {
    query: ObjectSearchQuery;
    allowReadAll: boolean;
    properties: PropertyMetaInformation[];
    onChange: (x0: null | Partial<ObjectSearchQuery>) => void;
    onDownloadClick: () => void;
    onDownloadAbort: () => void;
    downloading: boolean;
    showModalFilter: boolean;
    showDownloadModal: boolean;
    downloadCount?: CountResult;
}

interface ObjectTableLayoutHeaderState {
    showFilterModal: boolean;
    modalEditingConditions: Condition[];
}

export class ObjectTableLayoutHeader extends React.Component<
    ObjectTableLayoutHeaderProps,
    ObjectTableLayoutHeaderState
> {
    public state: ObjectTableLayoutHeaderState = {
        showFilterModal: false,
        modalEditingConditions: [],
    };

    public componentDidMount(): void {
        this.setState({
            modalEditingConditions: this.props.query.conditions || [],
        });
    }

    public componentDidUpdate(prevProps: ObjectTableLayoutHeaderProps): void {
        const { query, showModalFilter } = this.props;
        if (query.conditions !== prevProps.query.conditions || showModalFilter !== prevProps.showModalFilter) {
            this.setState({
                showFilterModal: showModalFilter,
                modalEditingConditions: this.props.query.conditions || [],
            });
        }
    }

    public render(): JSX.Element {
        const {
            query,
            allowReadAll,
            properties,
            onChange,
            onDownloadClick,
            onDownloadAbort,
            downloading,
            showDownloadModal,
            downloadCount,
        } = this.props;
        const { showFilterModal, modalEditingConditions } = this.state;
        const allowCloseModal =
            allowReadAll || PropertyMetaInformationUtils.hasFilledRequiredFields(query.conditions || [], properties);
        return (
            <RowStack baseline block gap={2}>
                <Fill />
                <Fit className={styles.filter}>
                    <Link icon={<FilterIcon />} onClick={this.handleOpenFilterModal} data-tid="OpenFilter">
                        Фильтрация
                    </Link>
                </Fit>
                <Fit className={styles.countSelector}>
                    <CountOfRecordsSelector count={query.count} onChange={value => onChange({ count: value })} />
                </Fit>
                <Fit>
                    <Link icon={<ClearIcon />} onClick={() => onChange(null)} data-tid="ClearFilter">
                        Очистить фильтр
                    </Link>
                </Fit>
                <Fit>
                    <Tooltip render={() => this.renderFieldSelectorTooltipContent()} pos="bottom right" trigger="click">
                        <Link icon={<SettingsIcon />} data-tid="FieldSettings">
                            Настроить поля
                        </Link>
                    </Tooltip>
                </Fit>
                <Fit>
                    <Link
                        icon={downloading ? <Spinner /> : <DownloadIcon />}
                        onClick={onDownloadClick}
                        disabled={downloading}
                        data-tid="DownloadLink">
                        Выгрузить всё в Excel
                    </Link>
                </Fit>
                {showFilterModal && (
                    <FilterModal
                        allowClose={allowCloseModal}
                        onClose={this.handleCloseFilterModal}
                        modalEditingConditions={modalEditingConditions}
                        tableColumns={properties.filter(x => x.isSearchable)}
                        onChangeFilter={x => this.setState({ modalEditingConditions: x })}
                        onApplyFilter={this.handleApplyFilter}
                    />
                )}
                {showDownloadModal && downloadCount && (
                    <Modal width={500} onClose={onDownloadAbort} ignoreBackgroundClick data-tid="DownloadLimitModal">
                        <Modal.Header data-tid="Header">Слишком большой список</Modal.Header>
                        <Modal.Body data-tid="Body">
                            Мы умеем выгружать не более {downloadCount.countLimit} объектов из этой таблицы. Уточните
                            запрос с помощью фильтров, чтобы записей стало меньше.
                        </Modal.Body>
                        <Modal.Footer panel>
                            <Button data-tid="Cancel" onClick={onDownloadAbort}>
                                Понятно
                            </Button>
                        </Modal.Footer>
                    </Modal>
                )}
            </RowStack>
        );
    }

    private renderFieldSelectorTooltipContent(): null | JSX.Element {
        const { query, properties, onChange } = this.props;
        const { hiddenColumns } = query;
        if (properties.length === 0) {
            return null;
        }
        const fields = properties.map(x => ({ name: x.name, caption: x.name }));
        return (
            <FieldSelector
                showSelectAllButton
                data-tid="ColumnSelector"
                fieldDefinitions={fields}
                hiddenFields={hiddenColumns}
                onShowField={fieldNames => onChange({ hiddenColumns: difference(hiddenColumns, fieldNames) })}
                onHideField={fieldNames => onChange({ hiddenColumns: [...hiddenColumns, ...fieldNames] })}
            />
        );
    }

    private readonly handleOpenFilterModal = () => {
        this.setState({ showFilterModal: true });
    };

    private readonly handleCloseFilterModal = () => {
        this.setState({ showFilterModal: false });
    };

    private readonly handleApplyFilter = () => {
        this.props.onChange({
            conditions: this.state.modalEditingConditions.filter(x => x.value != null && x.value.trim() !== ""),
        });
        this.setState({ showFilterModal: false });
    };
}
