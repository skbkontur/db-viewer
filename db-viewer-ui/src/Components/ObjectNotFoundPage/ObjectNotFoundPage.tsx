import { ThemeContext } from "@skbkontur/react-ui";
import React from "react";
import { useLocation } from "react-router";

import { RouteUtils } from "../../Domain/Utils/RouteUtils";
import { CommonLayout } from "../Layouts/CommonLayout";

import { CloudsFar, CloudsMed, CloudsNear } from "./Clouds";
import { jsStyles } from "./ObjectNotFoundPage.styles";

export const ObjectNotFoundPage = (): React.ReactElement => {
    const theme = React.useContext(ThemeContext);
    const { pathname } = useLocation();
    return (
        <div style={{ backgroundColor: theme.bgDefault }}>
            <CommonLayout data-tid="ObjectNotFoundPage" style={{ display: "block", height: "initial" }} withArrow>
                <CommonLayout.GoBack to={RouteUtils.backUrl(pathname)} />
                <CommonLayout.Content className={jsStyles.content()}>
                    <h2 className={jsStyles.headerTitle()} data-tid="Header">
                        Страница не найдена
                        <span className={jsStyles.headerCode(theme)}> 404</span>
                    </h2>
                    <div className={jsStyles.message()}>В адресе есть ошибка или объект был удален.</div>
                </CommonLayout.Content>
            </CommonLayout>
            <svg width="100%" height="500" fill="#000">
                <svg
                    id="far"
                    width="5540"
                    height="667"
                    y={-100}
                    viewBox="0 0 5540 567"
                    xmlns="http://www.w3.org/2000/svg">
                    <CloudsFar />
                </svg>
                <svg
                    id="med"
                    width="5540"
                    height="667"
                    y={50}
                    viewBox="0 0 5540 567"
                    xmlns="http://www.w3.org/2000/svg">
                    <CloudsMed />
                </svg>
                <svg
                    id="near"
                    width="5540"
                    height="667"
                    y={-125}
                    viewBox="0 0 5540 567"
                    xmlns="http://www.w3.org/2000/svg">
                    <CloudsNear />
                </svg>
            </svg>
        </div>
    );
};
