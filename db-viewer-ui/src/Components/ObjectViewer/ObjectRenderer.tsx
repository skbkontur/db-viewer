import EditIcon from "@skbkontur/react-icons/Edit";
import OkIcon from "@skbkontur/react-icons/Ok";
import UndoIcon from "@skbkontur/react-icons/Undo";
import { Fill, Fit, RowStack } from "@skbkontur/react-stack-layout";
import Link from "@skbkontur/react-ui/Link";
import get from "lodash/get";
import React from "react";

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

interface ObjectRendererState {
    editableMode: boolean;
    value: any;
}

export class ObjectRenderer extends React.Component<ObjectRendererProps, ObjectRendererState> {
    public state: ObjectRendererState = {
        editableMode: false,
        value: undefined,
    };

    public render(): JSX.Element {
        const { path, target, property, objectType, customRenderer } = this.props;
        const value = this.state.editableMode ? this.state.value : getByPath(target, path);
        const { editableMode } = this.state;
        const canEdit = this.canEditProperty();
        return (
            <RowStack gap={2} baseline block data-tid="FieldRow">
                <Fit data-tid="FieldValue">
                    {editableMode
                        ? renderForEdit(value, property, objectType, this.handleChange, customRenderer)
                        : renderForDetails(target, path, property, objectType, customRenderer)}
                </Fit>
                <Fill />
                {canEdit && !editableMode && (
                    <Fit>
                        <Link icon={<EditIcon />} onClick={this.handleClick} data-tid="Edit" />
                    </Fit>
                )}
                {canEdit && editableMode && (
                    <Fit>
                        <Link icon={<OkIcon />} onClick={this.handleSaveChanges} data-tid="Save">
                            Сохранить
                        </Link>
                    </Fit>
                )}
                {canEdit && editableMode && (
                    <Fit>
                        <Link icon={<UndoIcon />} onClick={this.handleCancelChanges} data-tid="Cancel">
                            Отменить
                        </Link>
                    </Fit>
                )}
            </RowStack>
        );
    }

    private readonly handleClick = () => {
        this.setState({
            editableMode: true,
            value: getByPath(this.props.target, this.props.path),
        });
    };

    private readonly handleChange = (value: any) => {
        this.setState({ value: value });
    };

    private readonly handleSaveChanges = () => {
        this.props.onChange(this.state.value, this.props.path);
        this.setState({ editableMode: false, value: undefined });
    };

    private readonly handleCancelChanges = () => {
        this.setState({ editableMode: false, value: undefined });
    };

    private readonly canEditProperty = () => {
        const { property, allowEdit } = this.props;
        const type = property.type.typeName;
        return type != null && !type.includes("[]") && !property.isIdentity && property.isEditable && allowEdit;
    };
}
