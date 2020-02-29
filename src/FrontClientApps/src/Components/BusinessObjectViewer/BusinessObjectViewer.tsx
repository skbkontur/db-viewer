import * as React from "react";
import { StringUtils } from "Commons/Utils/StringUtils";
import { BusinessObjectDescription } from "Domain/Api/DataTypes/BusinessObjectDescription";
import { PropertyMetaInformationUtils } from "Domain/Api/DataTypes/PropertyMetaInformationUtils";
import { UpdateBusinessObjectInfo } from "Domain/Api/DataTypes/UpdateBusinessObjectInfo";

import { Accordion } from "../Accordion/Accordion";

import { BusinessObjectCustomRender } from "./BusinessObjectCustomRender";

interface BusinessObjectViewerProps {
    objectInfo: Object;
    objectMeta: BusinessObjectDescription;
    onChange: (x0: UpdateBusinessObjectInfo) => Promise<void>;
    allowEdit: boolean;
}

export class BusinessObjectViewer extends React.Component<BusinessObjectViewerProps> {
    public handleChange = (value: any, path: string[]) => {
        if (value != null) {
            let serverValue = String(value);
            if (value instanceof Date) {
                serverValue = value.toISOString();
            }

            const lastModificationDateTime: string = this.props.objectInfo["lastModificationDateTime"] || "";
            this.props.onChange({
                value: serverValue,
                path: path
                    .map(StringUtils.capitalizeFirstLetter)
                    .map(x => x.replace(/\[|\]/g, ""))
                    .join("."),
                lastModificationDateTime: lastModificationDateTime,
            });
        }
    };

    public render(): JSX.Element {
        const { objectMeta, objectInfo, allowEdit } = this.props;

        const objectProperties =
            objectMeta && objectMeta.typeMetaInformation && objectMeta.typeMetaInformation.properties;
        return (
            <div>
                <Accordion
                    data-tid="RootAccordion"
                    customRender={(target, path) => (
                        <BusinessObjectCustomRender
                            target={target}
                            path={path}
                            type={PropertyMetaInformationUtils.getPropertyTypeByPath(objectProperties, path)}
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
