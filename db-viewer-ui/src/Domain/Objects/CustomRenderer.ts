import { PropertyMetaInformation } from "../Api/DataTypes/PropertyMetaInformation";

export interface ICustomRenderer {
    renderTableCell: (
        target: any,
        path: string[],
        property: PropertyMetaInformation,
        objectType: string
    ) => null | string | JSX.Element;

    renderDetails: (
        target: any,
        path: string[],
        property: PropertyMetaInformation,
        objectType: string
    ) => null | string | JSX.Element;

    renderEdit: (
        value: any,
        property: PropertyMetaInformation,
        objectType: string,
        onChange: (value: any) => void
    ) => null | string | JSX.Element;
}

export class NullCustomRenderer implements ICustomRenderer {
    public renderTableCell(): null | string | JSX.Element {
        return null;
    }

    public renderDetails(): null | string | JSX.Element {
        return null;
    }

    public renderEdit(): null | string | JSX.Element {
        return null;
    }
}
