import Checkbox from "@skbkontur/react-ui/Checkbox";
import CurrencyInput from "@skbkontur/react-ui/CurrencyInput";
import Input from "@skbkontur/react-ui/Input";
import Link from "@skbkontur/react-ui/Link";
import _ from "lodash";
import React from "react";

import { ICustomRenderer } from "../../Domain/Objects/CustomRenderer";
import { Property } from "../../Domain/Objects/Property";
import { FileUtils } from "../../Domain/Utils/FileUtils";
import { DateTimePicker } from "../DateTimeRangePicker/DateTimePicker";

function getByPath(target: Nullable<{}>, path: string[]): any {
    return _.get(target, path.join("."));
}

function download(objectType: string, path: string[], content: string) {
    FileUtils.downloadFile({
        name: `${objectType}-${path.join(".")}-${content.substr(0, 6)}.bin`,
        contentType: "application/octet-stream",
        content: content,
    });
}

function renderObject(
    target: any,
    path: string[],
    property: Nullable<Property>,
    objectType: string
): string | JSX.Element {
    const result = typeof target === "object" ? getByPath(target, path) : null;
    if (result == null) {
        return <span style={{ color: "#a0a0a0" }}>{String(result)}</span>;
    }

    if (property?.type === "Byte[]") {
        return (
            <Link data-tid="DownloadLink" onClick={() => download(objectType, path, result)}>
                Скачать
            </Link>
        );
    }

    return String(result);
}

export function renderForTableCell(
    target: any,
    path: string[],
    property: Nullable<Property>,
    objectType: string,
    customRenderer: ICustomRenderer
): string | JSX.Element {
    const customRender = customRenderer.renderTableCell(target, path);
    if (customRender) {
        return customRender;
    }

    return renderObject(target, path, property, objectType);
}

export function renderForDetails(
    target: any,
    path: string[],
    property: Nullable<Property>,
    objectType: string,
    customRenderer: ICustomRenderer
): string | JSX.Element {
    const customRender = customRenderer.renderDetails(target, path, objectType);
    if (customRender) {
        return customRender;
    }

    return renderObject(target, path, property, objectType);
}

export function renderForEdit(
    value: any,
    property: Nullable<Property>,
    objectType: string,
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
