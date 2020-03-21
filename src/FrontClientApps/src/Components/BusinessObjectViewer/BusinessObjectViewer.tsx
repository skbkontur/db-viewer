import React from "react";

import { BusinessObjectDescription } from "Domain/Api/DataTypes/BusinessObjectDescription";
import { PropertyMetaInformationUtils } from "Domain/Api/DataTypes/PropertyMetaInformationUtils";

import { Accordion } from "../Accordion/Accordion";

import { BusinessObjectCustomRender } from "./BusinessObjectCustomRender";

interface BusinessObjectViewerProps {
    objectInfo: object;
    objectMeta: BusinessObjectDescription;
    onChange: (value: object, path: string[]) => Promise<void>;
    allowEdit: boolean;
}

export class BusinessObjectViewer extends React.Component<BusinessObjectViewerProps> {
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
        const { objectMeta, objectInfo, allowEdit } = this.props;
        const objectProperties = objectMeta?.typeMetaInformation?.properties;
        return (
            <div>
                <Accordion
                    data-tid="RootAccordion"
                    customRender={(target, path) => (
                        <BusinessObjectCustomRender
                            target={target}
                            path={path}
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
