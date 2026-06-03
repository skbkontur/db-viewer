import { StringUtils } from "@skbkontur/edi-ui";
import { IconNetDownloadRegular16 } from "@skbkontur/icons/IconNetDownloadRegular16";
import { IconSettingsGearRegular16 } from "@skbkontur/icons/IconSettingsGearRegular16";
import { IconUiFilterFunnelRegular16 } from "@skbkontur/icons/IconUiFilterFunnelRegular16";
import { IconXCircleRegular16 } from "@skbkontur/icons/IconXCircleRegular16";
import { Fit, RowStack } from "@skbkontur/react-stack-layout";
import { Link, Tooltip } from "@skbkontur/react-ui";
import difference from "lodash/difference";
import { useEffect, useState, type ReactElement } from "react";

import { Condition } from "../../Domain/Api/DataTypes/Condition";
import { CountResult } from "../../Domain/Api/DataTypes/CountResult";
import { PropertyMetaInformation } from "../../Domain/Api/DataTypes/PropertyMetaInformation";
import { ObjectSearchQuery } from "../../Domain/Objects/ObjectSearchQuery";
import { PropertyMetaInformationUtils } from "../../Domain/Objects/PropertyMetaInformationUtils";
import { FieldSelector } from "../FieldSelector/FieldSelector";

import { CountOfRecordsSelector } from "./CountOfRecordsSelector";
import { DownloadLimitModal } from "./DownloadLimitModal";
import { FilterModal } from "./FilterModal";
import { jsStyles } from "./ObjectTableLayoutHeader.styles";
import { Spinner } from "./Spinner";

interface ObjectTableLayoutHeaderProps {
    query: ObjectSearchQuery;
    allowReadAll: boolean;
    properties: PropertyMetaInformation[];
    onChange: (update: null | Partial<ObjectSearchQuery>) => void;
    onDownloadClick: () => void;
    onDownloadAbort: () => void;
    downloading: boolean;
    showModalFilter: boolean;
    showDownloadModal: boolean;
    downloadCount?: CountResult;
}

export const ObjectTableLayoutHeader = ({
    query,
    allowReadAll,
    properties,
    onChange,
    onDownloadClick,
    onDownloadAbort,
    downloading,
    showModalFilter,
    showDownloadModal,
    downloadCount,
}: ObjectTableLayoutHeaderProps): ReactElement => {
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [modalEditingConditions, setModalEditingConditions] = useState<Condition[]>([]);

    useEffect(() => {
        setShowFilterModal(showModalFilter);
        setModalEditingConditions(query.conditions || []);
    }, [query.conditions, showModalFilter]);

    const renderFieldSelectorTooltipContent = (): null | ReactElement => {
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
    };

    const handleApplyFilter = () => {
        onChange({
            conditions: modalEditingConditions.filter(x => !StringUtils.isNullOrWhitespace(x.value)),
            offset: 0,
        });
        setShowFilterModal(false);
    };

    const allowCloseModal =
        allowReadAll || PropertyMetaInformationUtils.hasFilledRequiredFields(query.conditions || [], properties);

    return (
        <RowStack baseline block gap={2} style={{ flexWrap: "wrap" }}>
            <Fit className={jsStyles.filter()}>
                <Link
                    icon={<IconUiFilterFunnelRegular16 />}
                    onClick={() => setShowFilterModal(true)}
                    data-tid="OpenFilter">
                    Фильтрация
                </Link>
            </Fit>
            <Fit className={jsStyles.countSelector()}>
                <CountOfRecordsSelector count={query.count} onChange={value => onChange({ count: value })} />
            </Fit>
            <Fit>
                <Link icon={<IconXCircleRegular16 />} onClick={() => onChange(null)} data-tid="ClearFilter">
                    Очистить фильтр
                </Link>
            </Fit>
            <Fit>
                <Tooltip render={() => renderFieldSelectorTooltipContent()} pos="bottom right" trigger="click">
                    <Link icon={<IconSettingsGearRegular16 />} data-tid="FieldSettings">
                        Настроить поля
                    </Link>
                </Tooltip>
            </Fit>
            <Fit>
                <Link
                    icon={downloading ? <Spinner /> : <IconNetDownloadRegular16 />}
                    onClick={onDownloadClick}
                    disabled={downloading}
                    data-tid="DownloadLink">
                    Выгрузить всё в Excel
                </Link>
            </Fit>
            {showFilterModal && (
                <FilterModal
                    allowClose={allowCloseModal}
                    onClose={() => setShowFilterModal(false)}
                    modalEditingConditions={modalEditingConditions}
                    tableColumns={properties.filter(x => x.isSearchable)}
                    onChangeFilter={setModalEditingConditions}
                    onApplyFilter={handleApplyFilter}
                />
            )}
            {showDownloadModal && downloadCount && (
                <DownloadLimitModal countLimit={downloadCount.countLimit} onDownloadAbort={onDownloadAbort} />
            )}
        </RowStack>
    );
};
