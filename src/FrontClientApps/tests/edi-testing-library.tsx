import { cleanup, configure, fireEvent as rtlFireEvent, render as rtlRender } from "@testing-library/react";
import * as React from "react";

configure({ testIdAttribute: "data-tid" });
beforeEach(() => {
    if (window) {
        window.document.body.innerHTML = "";
        cleanup();
    }
});

export function AccessRightsContext(hasEditAccess: boolean, hasViewAccess: boolean): any {
    return (props: any) => <div>{props.children}</div>;
}

export const renderWithFullAccess = (ui: React.ReactElement, options?: any) => {
    const { ...rest } = rtlRender(ui, {
        wrapper: AccessRightsContext(true, true),
    });
    return rest;
};

export const render = rtlRender;
export const fireEvent = rtlFireEvent;
