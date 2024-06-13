import { ArrowDUturnLeftDownIcon16Regular } from "@skbkontur/icons/ArrowDUturnLeftDownIcon16Regular";
import { CheckAIcon16Regular } from "@skbkontur/icons/CheckAIcon16Regular";
import { ToolPencilLineIcon16Regular } from "@skbkontur/icons/ToolPencilLineIcon16Regular";
import { Fill, Fit, RowStack } from "@skbkontur/react-stack-layout";
import { Button } from "@skbkontur/react-ui";
import get from "lodash/get";
import React, { useState } from "react";

import { PropertyMetaInformation } from "../../Domain/Api/DataTypes/PropertyMetaInformation";
import { ICustomRenderer } from "../../Domain/Objects/CustomRenderer";

import { renderForEdit, renderForDetails } from "./ObjectItemRender";

function getByPath(target: Nullable<{}>, path: string[]): any {
    return get(target, path.join("."));
}

interface ObjectRendererProps {
    target: object;
    path: string[];
    property: PropertyMetaInformation;
    objectType: string;
    allowEdit: boolean;
    onChange: (value: any, path: string[]) => void;
    customRenderer: ICustomRenderer;
}

export const ObjectRenderer = ({
    target,
    objectType,
    customRenderer,
    path,
    property,
    allowEdit,
    onChange,
}: ObjectRendererProps): React.ReactElement => {
    const [editableMode, setEditableMode] = useState(false);
    const [value, setValue] = useState(undefined);

    const handleClick = () => {
        setEditableMode(true);
        setValue(getByPath(target, path));
    };

    const handleChange = (value: any) => {
        setValue(value);
    };

    const handleSaveChanges = () => {
        onChange(value, path);
        setEditableMode(false);
        setValue(undefined);
    };

    const handleCancelChanges = () => {
        setEditableMode(false);
        setValue(undefined);
    };

    const canEditProperty = () => {
        const type = property.type.typeName;
        return type != null && !type.includes("[]") && !property.isIdentity && property.isEditable && allowEdit;
    };

    const canEdit = canEditProperty();
    return (
        <RowStack gap={2} baseline block data-tid="FieldRow">
            <Fit data-tid="FieldValue">
                {editableMode
                    ? renderForEdit(
                          editableMode ? value : getByPath(target, path),
                          property,
                          objectType,
                          handleChange,
                          customRenderer
                      )
                    : renderForDetails(target, path, property, objectType, customRenderer)}
            </Fit>
            <Fill />
            {canEdit && !editableMode && (
                <Fit>
                    <Button use="link" icon={<ToolPencilLineIcon16Regular />} onClick={handleClick} data-tid="Edit" />
                </Fit>
            )}
            {canEdit && editableMode && (
                <Fit>
                    <Button use="link" icon={<CheckAIcon16Regular />} onClick={handleSaveChanges} data-tid="Save">
                        Сохранить
                    </Button>
                </Fit>
            )}
            {canEdit && editableMode && (
                <Fit>
                    <Button
                        use="link"
                        icon={<ArrowDUturnLeftDownIcon16Regular />}
                        onClick={handleCancelChanges}
                        data-tid="Cancel">
                        Отменить
                    </Button>
                </Fit>
            )}
        </RowStack>
    );
};
