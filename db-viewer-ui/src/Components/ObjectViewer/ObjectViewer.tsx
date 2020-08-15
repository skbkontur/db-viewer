import { Fit, RowStack } from "@skbkontur/react-stack-layout";
import Hint from "@skbkontur/react-ui/Hint";
import React from "react";

import { ObjectDescription } from "../../Domain/Api/DataTypes/ObjectDescription";
import { ICustomRenderer } from "../../Domain/Objects/CustomRenderer";
import { PropertyMetaInformationUtils } from "../../Domain/Objects/PropertyMetaInformationUtils";
import { Accordion } from "../Accordion/Accordion";

import { ObjectRenderer } from "./ObjectRenderer";
import styles from "./ObjectViewer.less";

interface ObjectViewerProps {
    objectInfo: object;
    objectMeta: ObjectDescription;
    onChange: (value: string, path: string[]) => Promise<void>;
    customRenderer: ICustomRenderer;
    allowEdit: boolean;
}

export class ObjectViewer extends React.Component<ObjectViewerProps> {
    public render(): JSX.Element {
        const { objectInfo } = this.props;
        return (
            <div>
                <Accordion
                    data-tid="RootAccordion"
                    renderTitle={this.renderTitle}
                    renderValue={this.renderValue}
                    title={null}
                    value={objectInfo}
                    defaultCollapsed
                    showToggleAll
                />
            </div>
        );
    }

    private handleChange = (value: any, path: string[]) => {
        let serverValue = value;
        if (value != null) {
            serverValue = String(value);
            if (value instanceof Date) {
                serverValue = value.toISOString();
            }
        }
        this.props.onChange(serverValue, path);
    };

    private renderTitle = (title: null | string, isObject: boolean, path: string[]) => {
        const { objectMeta } = this.props;
        const propertyMeta = PropertyMetaInformationUtils.getPropertyTypeByPath(objectMeta.typeMetaInformation, path);
        let typeName = propertyMeta.type.originalTypeName;
        if (typeName === "Byte[]") {
            typeName = propertyMeta.type.typeName;
        }
        if (isObject) {
            return (
                <RowStack gap={1} data-tid="Title">
                    <Fit data-tid="Title" className={styles.title}>
                        {title}
                    </Fit>
                    <Fit data-tid="Type" className={styles.mutedKeyword}>
                        Тип: {typeName}
                    </Fit>
                </RowStack>
            );
        }
        return <Hint text={`Тип: ${typeName}`}>{title}</Hint>;
    };

    private renderValue = (target: { [key: string]: any }, path: string[]) => {
        const { objectMeta, allowEdit, customRenderer } = this.props;
        const typeMeta = objectMeta.typeMetaInformation;
        return (
            <ObjectRenderer
                target={target}
                path={path}
                customRenderer={customRenderer}
                property={PropertyMetaInformationUtils.getPropertyTypeByPath(typeMeta, path)}
                objectType={objectMeta.identifier}
                allowEdit={allowEdit}
                onChange={this.handleChange}
            />
        );
    };
}
