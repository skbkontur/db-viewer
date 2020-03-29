import { Property } from "./Property";

export interface ICustomRenderer {
    renderTableCell: (target: any, path: string[]) => null | string | JSX.Element;
    renderDetails: (target: any, path: string[], objectType?: string) => null | string | JSX.Element;
    renderEdit: (value: any, property: Nullable<Property>, onChange: (x0: any) => void) => null | string | JSX.Element;
}

export class NullCustomRenderer implements ICustomRenderer {
    public renderTableCell() {
        return null;
    }

    public renderDetails() {
        return null;
    }

    public renderEdit() {
        return null;
    }
}
