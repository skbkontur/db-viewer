import Checkbox from "@skbkontur/react-ui/Checkbox";
import CurrencyInput from "@skbkontur/react-ui/CurrencyInput";
import Input from "@skbkontur/react-ui/Input";
import _ from "lodash";
import React from "react";
import { Link } from "react-router-dom";

import { Property } from "Domain/BusinessObjects/Property";

import { DateTimePicker } from "../DateTimeRangePicker/DateTimePicker";

function getByPath(target: Nullable<{}>, path: string[]): any {
    return _.get(target, path.join("."));
}

function getBaseOnObjectType(currentType: string): string {
    return currentType.replace("WebObject", "2");
}

// eslint-disable-next-line max-statements
export function customRender(target: any, path: string[], objectType?: string): string | JSX.Element {
    const pathTop = path[path.length - 1];
    if (pathTop === "entityId" && path.includes("basedOnEntity") && typeof target === "object") {
        const id = getByPath(target, [...path].slice(0, -1));
        if (id != null && typeof id === "object") {
            const boxId = id.boxId;
            const entityId = id.entityId;
            if (typeof boxId === "string" && typeof entityId === "string" && objectType != null) {
                return (
                    <Link
                        data-tid="GoToLink"
                        to={`/BusinessObjects/${getBaseOnObjectType(objectType)}/${boxId}/${entityId}`}>
                        {entityId}
                    </Link>
                );
            }
        }
    }

    if (pathTop === "orderId" && path.length === 1 && typeof target === "object") {
        const scopeId = getByPath(target, ["scopeId"]);
        const orderId = getByPath(target, ["orderId"]);
        if (orderId != null) {
            return (
                <Link data-tid="GoToLink" to={`/BusinessObjects/Order_Web/${scopeId}/${orderId}`}>
                    {orderId}
                </Link>
            );
        }
    }

    if (
        pathTop === "objectId" &&
        (path.includes("basedOnObject") || path.includes("replacedByObject") || path.includes("objectMetas")) &&
        typeof target === "object"
    ) {
        const id = getByPath(target, [...path].slice(0, -1));
        if (target != null && id != null && typeof id === "object") {
            const webObjectName = id.webObjectName;
            const scopeId = target.scopeId;
            const objectId = id.objectId;
            if (typeof webObjectName === "string" && typeof scopeId === "string" && typeof objectId === "string") {
                return (
                    <Link data-tid="GoToLink" to={`/BusinessObjects/${webObjectName}/${scopeId}/${objectId}`}>
                        {objectId}
                    </Link>
                );
            }
        }
    }

    if (pathTop === "objectId" && path.some(x => x.endsWith("References")) && typeof target === "object") {
        const id = getByPath(target, [...path].slice(0, -1));
        if (target != null && id != null && typeof id === "object") {
            const webObjectName = id.webObjectName;
            const scopeId = target.scopeId;
            const objectId = id.objectId;
            if (typeof webObjectName === "string" && typeof scopeId === "string" && typeof objectId === "string") {
                return (
                    <Link data-tid="GoToLink" to={`/BusinessObjects/${webObjectName}/${scopeId}/${objectId}`}>
                        {objectId}
                    </Link>
                );
            }
        }
    }

    const result = typeof target === "object" ? getByPath(target, path) : null;
    return result == null || result === false ? (
        <span style={{ color: "#a0a0a0" }}>{String(result)}</span>
    ) : (
        String(result)
    );
}

export function customRenderForEdit(
    value: any,
    property: Nullable<Property>,
    onChange: (x0: any) => void
): string | JSX.Element {
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
