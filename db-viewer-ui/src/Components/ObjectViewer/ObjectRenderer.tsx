import { IconArrowDUturnLeftDownRegular16 } from "@skbkontur/icons/IconArrowDUturnLeftDownRegular16";
import { IconCheckARegular16 } from "@skbkontur/icons/IconCheckARegular16";
import { IconToolPencilLineRegular16 } from "@skbkontur/icons/IconToolPencilLineRegular16";
import { Fill, Fit, RowStack } from "@skbkontur/react-stack-layout";
import { Button } from "@skbkontur/react-ui";
import get from "lodash/get";
import { useState, type ReactElement } from "react";

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
}: ObjectRendererProps): ReactElement => {
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
                    <Button use="link" icon={<IconToolPencilLineRegular16 />} onClick={handleClick} data-tid="Edit" />
                </Fit>
            )}
            {canEdit && editableMode && (
                <Fit>
                    <Button use="link" icon={<IconCheckARegular16 />} onClick={handleSaveChanges} data-tid="Save">
                        Сохранить
                    </Button>
                </Fit>
            )}
            {canEdit && editableMode && (
                <Fit>
                    <Button
                        use="link"
                        icon={<IconArrowDUturnLeftDownRegular16 />}
                        onClick={handleCancelChanges}
                        data-tid="Cancel">
                        Отменить
                    </Button>
                </Fit>
            )}
        </RowStack>
    );
};
