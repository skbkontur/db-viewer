import Checkbox from "@skbkontur/react-ui/Checkbox";
import CurrencyInput from "@skbkontur/react-ui/CurrencyInput";
import Input from "@skbkontur/react-ui/Input";
import * as _ from "lodash";
import * as React from "react";

import { ICustomRenderer } from "../../Domain/BusinessObjects/CustomRenderer";
import { Property } from "../../Domain/BusinessObjects/Property";
import { DateTimePicker } from "../DateTimeRangePicker/DateTimePicker";

function getByPath(target: Nullable<{}>, path: string[]): any {
    return _.get(target, path.join("."));
}

export function renderForTableCell(target: any, path: string[], customRenderer: ICustomRenderer): string | JSX.Element {
    const customRender = customRenderer.renderTableCell(target, path);
    if (customRender) {
        return customRender;
    }

    const result = typeof target === "object" ? getByPath(target, path) : null;
    return result == null || result === false ? (
        <span style={{ color: "#a0a0a0" }}>{String(result)}</span>
    ) : (
        String(result)
    );
}

export function renderForDetails(
    target: any,
    path: string[],
    objectType: string,
    customRenderer: ICustomRenderer
): string | JSX.Element {
    const customRender = customRenderer.renderDetails(target, path, objectType);
    if (customRender) {
        return customRender;
    }

    const result = typeof target === "object" ? getByPath(target, path) : null;
    return result == null || result === false ? (
        <span style={{ color: "#a0a0a0" }}>{String(result)}</span>
    ) : (
        String(result)
    );
}

export function renderForEdit(
    value: any,
    property: Nullable<Property>,
    onChange: (x0: any) => void,
    customRenderer: ICustomRenderer
): string | JSX.Element {
    const customEdit = customRenderer.renderEdit(value, property, onChange);
    if (customEdit) {
        return customEdit;
    }

    const type = property?.type;
    switch (type) {
        case "Boolean":
            return <Checkbox checked={!!value} onChange={(e, nextValue) => onChange(nextValue)} />;
        case "DateTime":
            return (
                <DateTimePicker
                    value={value != null ? new Date(String(value)) : null}
                    onChange={(e, nextValue) => onChange(nextValue)}
                    defaultTime={""}
                />
            );
        case "Decimal":
            return (
                <CurrencyInput
                    value={Number(value)}
                    onChange={(e, nextValue) => onChange(nextValue)}
                    fractionDigits={2}
                />
            );

        case "Int32":
            return (
                <CurrencyInput
                    value={Number(value)}
                    onChange={(e, nextValue) => onChange(nextValue)}
                    fractionDigits={0}
                />
            );
        case null:
        case undefined:
            return "null";

        default:
            if (type.indexOf("[]") !== -1) {
                throw new Error("Пытаемся изменить массив");
            }
            return <Input value={String(value || "")} onChange={(e, nextValue) => onChange(nextValue)} />;
    }
}
