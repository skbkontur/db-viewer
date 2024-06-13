import { Accordion } from "@skbkontur/edi-ui";
import React from "react";

import { ObjectDescription } from "../../Domain/Api/DataTypes/ObjectDescription";
import { ICustomRenderer } from "../../Domain/Objects/CustomRenderer";
import { PropertyMetaInformationUtils } from "../../Domain/Objects/PropertyMetaInformationUtils";

import { ObjectRenderer } from "./ObjectRenderer";

interface ObjectViewerProps {
    objectInfo: object;
    objectMeta: ObjectDescription;
    onChange: (value: string, path: string[]) => Promise<void>;
    customRenderer: ICustomRenderer;
    allowEdit: boolean;
}

export const ObjectViewer = ({
    objectMeta,
    objectInfo,
    onChange,
    allowEdit,
    customRenderer,
}: ObjectViewerProps): React.ReactElement => {
    const handleChange = (value: any, path: string[]) => {
        let serverValue = value;
        if (value) {
            serverValue = String(value);
            if (value instanceof Date) {
                serverValue = value.toISOString();
            }
        }
        onChange(serverValue, path);
    };

    const renderCaption = (path: string[]) => {
        const propertyMeta = PropertyMetaInformationUtils.getPropertyTypeByPath(objectMeta.typeMetaInformation, path);
        let typeName = propertyMeta.type.originalTypeName;
        if (typeName === "Byte[]") {
            typeName = propertyMeta.type.typeName;
        }
        return `Тип: ${typeName}`;
    };

    const renderValue = (target: Record<string, any>, path: string[]) => {
        const typeMeta = objectMeta.typeMetaInformation;
        return (
            <ObjectRenderer
                target={target}
                path={path}
                customRenderer={customRenderer}
                property={PropertyMetaInformationUtils.getPropertyTypeByPath(typeMeta, path)}
                objectType={objectMeta.identifier}
                allowEdit={allowEdit}
                onChange={handleChange}
            />
        );
    };
    return (
        <Accordion
            data-tid="RootAccordion"
            renderCaption={renderCaption}
            renderValue={renderValue}
            value={objectInfo}
            defaultCollapsed
            showToggleAll
        />
    );
};
