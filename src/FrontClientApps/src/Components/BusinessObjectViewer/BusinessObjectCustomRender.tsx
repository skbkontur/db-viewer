import EditIcon from "@skbkontur/react-icons/Edit";
import OkIcon from "@skbkontur/react-icons/Ok";
import UndoIcon from "@skbkontur/react-icons/Undo";
import _ from "lodash";
import * as React from "react";
import { ButtonLink } from "Commons/ButtonLink/ButtonLink";
import { Fill } from "Commons/Layouts/Fill";
import { Fit } from "Commons/Layouts/Fit";
import { RowStack } from "Commons/Layouts/RowStack";

import { customRender, customRenderForEdit } from "./BusinessObjectItemCustomRender";

function getByPath(target: Nullable<{}>, path: string[]): any {
    return _.get(target, path.join("."));
}

interface BusinessObjectCustomRenderProps {
    // eslint-disable-next-line
    target: Object;
    path: string[];
    type: Nullable<string>;
    objectType: string;
    allowEdit: boolean;
    onChange: (value: any, path: string[]) => void;
}

interface BusinessObjectCustomRenderState {
    editableMode: boolean;
    value: any;
}

export class BusinessObjectCustomRender extends React.Component<
    BusinessObjectCustomRenderProps,
    BusinessObjectCustomRenderState
> {
    public state: BusinessObjectCustomRenderState = {
        editableMode: false,
        value: null,
    };

    public handleClick = () => {
        this.setState({
            editableMode: true,
            value: getByPath(this.props.target, this.props.path),
        });
    };

    public handleChange = (value: any) => {
        this.setState({
            value: value,
        });
    };
    public handleSaveChanges = () => {
        this.props.onChange(this.state.value, this.props.path);

        this.setState({
            editableMode: false,
            value: null,
        });
    };

    public handleCancelChanges = () => {
        this.setState({
            editableMode: false,
            value: null,
        });
    };

    public canEditProperty = () => {
        const { path, type, allowEdit } = this.props;
        return (
            type != null &&
            !type.includes("[]") &&
            !_.isEqual(path, ["id"]) &&
            !_.isEqual(path, ["scopeId"]) &&
            !_.isEqual(path, ["lastModificationDateTime"]) &&
            allowEdit
        );
    };

    public render(): JSX.Element {
        const { path, target, type, objectType } = this.props;
        const value = this.state.value != null ? this.state.value : getByPath(target, path);
        const { editableMode } = this.state;
        const canEdit = this.canEditProperty();
        return (
            <RowStack gap={2} baseline block data-tid="FieldRow">
                <Fit data-tid="FieldValue">
                    {editableMode
                        ? customRenderForEdit(value, type, this.handleChange)
                        : customRender(target, path, objectType)}
                </Fit>
                <Fill />
                {canEdit &&
                    !editableMode && (
                        <Fit>
                            <ButtonLink icon={<EditIcon />} onClick={this.handleClick} data-tid="Edit" />
                        </Fit>
                    )}
                {canEdit &&
                    editableMode && (
                        <Fit>
                            <ButtonLink icon={<OkIcon />} onClick={this.handleSaveChanges} data-tid="Save">
                                Сохранить
                            </ButtonLink>
                        </Fit>
                    )}
                {canEdit &&
                    editableMode && (
                        <Fit>
                            <ButtonLink icon={<UndoIcon />} onClick={this.handleCancelChanges} data-tid="Cancel">
                                Отменить
                            </ButtonLink>
                        </Fit>
                    )}
            </RowStack>
        );
    }
}
