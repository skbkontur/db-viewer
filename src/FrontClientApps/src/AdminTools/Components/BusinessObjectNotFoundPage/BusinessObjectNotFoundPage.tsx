import { LocationDescriptor } from "history";
import * as React from "react";
import { CommonLayout } from "Commons/Layouts";

import SorryImage from "./Sorry.png";

interface BusinessObjectNotFoundPageProps {
    parentLocation: LocationDescriptor;
}

export class BusinessObjectNotFoundPage extends React.Component<BusinessObjectNotFoundPageProps> {
    public render(): JSX.Element {
        const { parentLocation } = this.props;

        return (
            <CommonLayout data-tid="BusinessObjectNotFoundPage">
                <CommonLayout.GoBack to={parentLocation}> Вернуться к списку бизнес объектов </CommonLayout.GoBack>
                <CommonLayout.Header title="По этому адресу ничего нет" />
                <CommonLayout.Content>{<img width={1190} height={515} src={SorryImage} />}</CommonLayout.Content>
            </CommonLayout>
        );
    }
}
