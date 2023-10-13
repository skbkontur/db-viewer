import { ReactElement } from "react";

import { PropertyMetaInformation } from "../Api/DataTypes/PropertyMetaInformation";

export interface ICustomRenderer {
    renderTableCell: (
        target: any,
        path: string[],
        property: PropertyMetaInformation,
        objectType: string
    ) => null | string | ReactElement;

    renderDetails: (
        target: any,
        path: string[],
        property: PropertyMetaInformation,
        objectType: string
    ) => null | string | ReactElement;

    renderEdit: (
        value: any,
        property: PropertyMetaInformation,
        objectType: string,
        onChange: (value: any) => void
    ) => null | string | ReactElement;
}

export class NullCustomRenderer implements ICustomRenderer {
    public renderTableCell(): null | string | ReactElement {
        return null;
    }

    public renderDetails(): null | string | ReactElement {
        return null;
    }

    public renderEdit(): null | string | ReactElement {
        return null;
    }
}
