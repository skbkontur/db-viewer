import * as React from "react";

import { BusinessObjectDescription } from "../../Domain/Api/DataTypes/BusinessObjectDescription";
import { ICustomRenderer } from "../../Domain/BusinessObjects/CustomRenderer";
import { PropertyMetaInformationUtils } from "../../Domain/BusinessObjects/PropertyMetaInformationUtils";
import { Accordion } from "../Accordion/Accordion";

import { ObjectRenderer } from "./ObjectRenderer";

interface ObjectViewerProps {
    objectInfo: object;
    objectMeta: BusinessObjectDescription;
    onChange: (value: object, path: string[]) => Promise<void>;
    customRenderer: ICustomRenderer;
    allowEdit: boolean;
}

export class ObjectViewer extends React.Component<ObjectViewerProps> {
    public handleChange = (value: any, path: string[]) => {
        if (value != null) {
            let serverValue = String(value);
            if (value instanceof Date) {
                serverValue = value.toISOString();
            }

            this.props.onChange(serverValue as any, path);
        }
    };

    public render(): JSX.Element {
        const { objectMeta, objectInfo, allowEdit, customRenderer } = this.props;
        const objectProperties = objectMeta?.typeMetaInformation?.properties;
        return (
            <div>
                <Accordion
                    data-tid="RootAccordion"
                    customRender={(target, path) => (
                        <ObjectRenderer
                            target={target}
                            path={path}
                            customRenderer={customRenderer}
                            property={PropertyMetaInformationUtils.getPropertyTypeByPath(objectProperties, path)}
                            objectType={objectMeta.identifier}
                            allowEdit={allowEdit}
                            onChange={this.handleChange}
                        />
                    )}
                    value={objectInfo}
                    defaultCollapsed
                    showToggleAll
                />
            </div>
        );
    }
}
