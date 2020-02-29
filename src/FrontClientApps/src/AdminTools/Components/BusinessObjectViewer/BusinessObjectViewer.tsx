import * as React from "react";
import { StringUtils } from "Commons/Utils/StringUtils";
import { BusinessObjectDescription } from "Domain/EDI/Api/AdminTools/DataTypes/BusinessObjectDescription";
import { PropertyMetaInformationExtensions } from "Domain/EDI/Api/AdminTools/DataTypes/PropertyMetaInformationExtensions";
import { UpdateBusinessObjectInfo } from "Domain/EDI/Api/AdminTools/DataTypes/UpdateBusinessObjectInfo";

import { Accordion } from "../Accordion/Accordion";

import { BusinessObjectCustomRender } from "./BusinessObjectCustomRender";

interface BusinessObjectViewerProps {
    objectInfo: Object;
    objectMeta: BusinessObjectDescription;
    onChange: (x0: UpdateBusinessObjectInfo) => Promise<void>;
    allowEdit: boolean;
}

export class BusinessObjectViewer extends React.Component<BusinessObjectViewerProps> {
    public handleChange = (value: mixed, path: string[]) => {
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
                            type={PropertyMetaInformationExtensions.getPropertyTypeByPath(objectProperties, path)}
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
