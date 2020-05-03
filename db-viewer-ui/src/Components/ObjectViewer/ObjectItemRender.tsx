import CurrencyInput from "@skbkontur/react-ui/CurrencyInput";
import Input from "@skbkontur/react-ui/Input";
import Link from "@skbkontur/react-ui/Link";
import Select from "@skbkontur/react-ui/Select";
import get from "lodash/get";
import React from "react";

import { PropertyMetaInformation } from "../../Domain/Api/DataTypes/PropertyMetaInformation";
import { ICustomRenderer } from "../../Domain/Objects/CustomRenderer";
import { FileUtils } from "../../Domain/Utils/FileUtils";
import { DateTimePicker } from "../DateTimeRangePicker/DateTimePicker";

function getByPath(target: Nullable<{}>, path: string[]): any {
    return get(target, path.join("."));
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
    property: PropertyMetaInformation,
    objectType: string
): string | JSX.Element {
    const result = typeof target === "object" ? getByPath(target, path) : null;
    if (result == null) {
        return <span style={{ color: "#a0a0a0" }}>{String(result)}</span>;
    }

    if (property.type.typeName === "Byte[]") {
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
    property: PropertyMetaInformation,
    objectType: string,
    customRenderer: ICustomRenderer
): string | JSX.Element {
    const customRender = customRenderer.renderTableCell(target, path, property, objectType);
    if (customRender) {
        return customRender;
    }

    return renderObject(target, path, property, objectType);
}

export function renderForDetails(
    target: any,
    path: string[],
    property: PropertyMetaInformation,
    objectType: string,
    customRenderer: ICustomRenderer
): string | JSX.Element {
    const customRender = customRenderer.renderDetails(target, path, property, objectType);
    if (customRender) {
        return customRender;
    }

    return renderObject(target, path, property, objectType);
}

export function renderForEdit(
    value: any,
    property: PropertyMetaInformation,
    objectType: string,
    onChange: (value: any) => void,
    customRenderer: ICustomRenderer
): string | JSX.Element {
    const customEdit = customRenderer.renderEdit(value, property, objectType, onChange);
    if (customEdit) {
        return customEdit;
    }

    if (property != null && property.availableValues.length > 0) {
        const values = property.type.isNullable ? ["null", ...property.availableValues] : property.availableValues;
        return (
            <Select
                data-tid="EnumSelect"
                items={values.map(x => [x, String(x)])}
                onChange={(e: any, nextValue: any) => onChange(nextValue === "null" ? null : nextValue)}
                value={String(value)}
            />
        );
    }

    const type = property.type.typeName;
    switch (type) {
        case "Boolean": {
            let values = ["true", "false"];
            values = property.type.isNullable ? ["null", ...values] : values;
            return (
                <Select
                    data-tid="BooleanSelect"
                    items={values.map(x => [x, String(x)])}
                    onChange={(e: any, nextValue: any) => onChange(nextValue === "null" ? null : nextValue)}
                    value={String(value)}
                />
            );
        }
        case "DateTime":
        case "DateTimeOffset":
            return (
                <DateTimePicker
                    value={value != null ? new Date(String(value)) : null}
                    onChange={(e, nextValue) => onChange(nextValue)}
                    defaultTime={""}
                />
            );
        case "Float":
        case "Double":
        case "Decimal":
            return (
                <CurrencyInput
                    value={Number(value)}
                    onChange={(e, nextValue) => onChange(nextValue)}
                    fractionDigits={4}
                />
            );

        case "Byte":
        case "UInt16":
        case "UInt32":
        case "UInt64":
            return (
                <CurrencyInput
                    width={300}
                    value={Number(value)}
                    onChange={(e, nextValue) => onChange(nextValue)}
                    fractionDigits={0}
                />
            );
        case "SByte":
        case "Int16":
        case "Int32":
        case "Int64":
            return (
                <CurrencyInput
                    width={300}
                    value={Number(value)}
                    onChange={(e, nextValue) => onChange(nextValue)}
                    fractionDigits={0}
                    signed
                />
            );
        case null:
        case undefined:
            return "null";

        default:
            if (type.indexOf("[]") !== -1) {
                throw new Error("Пытаемся изменить массив");
            }
            return <Input width={300} value={String(value || "")} onChange={(e, nextValue) => onChange(nextValue)} />;
    }
}
