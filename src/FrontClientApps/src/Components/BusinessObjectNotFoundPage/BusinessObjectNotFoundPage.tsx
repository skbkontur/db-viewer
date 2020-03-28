import React from "react";
import { RouteComponentProps, withRouter } from "react-router";

import { RouteUtils } from "../../Domain/Utils/RouteUtils";
import { CommonLayout } from "../Layouts/CommonLayout";

import SorryImage from "./Sorry.png";

class BusinessObjectNotFoundPageInternal extends React.Component<RouteComponentProps> {
    public render(): JSX.Element {
        return (
            <CommonLayout data-tid="BusinessObjectNotFoundPage">
                <CommonLayout.GoBack to={RouteUtils.backUrl(this.props)}>
                    Вернуться к списку бизнес объектов
                </CommonLayout.GoBack>
                <CommonLayout.Header title="По этому адресу ничего нет" />
                <CommonLayout.Content>{<img width={1190} height={515} src={SorryImage} />}</CommonLayout.Content>
            </CommonLayout>
        );
    }
}

export const BusinessObjectNotFoundPage = withRouter(BusinessObjectNotFoundPageInternal);
