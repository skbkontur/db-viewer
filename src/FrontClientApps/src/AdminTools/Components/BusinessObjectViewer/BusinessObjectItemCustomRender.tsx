import Checkbox from "@skbkontur/react-ui/Checkbox";
import Input from "@skbkontur/react-ui/Input";
import _ from "lodash";
import * as React from "react";
import { RouterLink } from "ui";
import { FormattedNumberInput } from "Commons/FormattedNumberInput/FormattedNumberInput";

import { DateTimePicker } from "../DateTimeRangePicker/DateTimePicker";

function getByPath(target: Nullable<{}>, path: string[]): mixed {
    return _.get(target, path.join("."));
}

function getBaseOnObjectType(currentType: string): string {
    return currentType.replace("WebObject", "2");
}

// eslint-disable-next-line max-statements
export function customRender(target: mixed, path: string[], objectType?: string): string | JSX.Element {
    const pathTop = path[path.length - 1];
    if (pathTop === "entityId" && path.includes("basedOnEntity") && typeof target === "object") {
        const id = getByPath(target, [...path].slice(0, -1));
        if (id != null && typeof id === "object") {
            const boxId = id.boxId;
            const entityId = id.entityId;
            if (typeof boxId === "string" && typeof entityId === "string" && objectType != null) {
                return (
                    <RouterLink
                        data-tid="GoToLink"
                        to={`/AdminTools/BusinessObjects/${getBaseOnObjectType(objectType)}/${boxId}/${entityId}`}>
                        {entityId}
                    </RouterLink>
                );
            }
        }
    }

    if (pathTop === "orderId" && path.length === 1 && typeof target === "object") {
        const scopeId = getByPath(target, ["scopeId"]);
        const orderId = getByPath(target, ["orderId"]);
        if (orderId != null) {
            return (
                <RouterLink data-tid="GoToLink" to={`/AdminTools/BusinessObjects/Order_Web/${scopeId}/${orderId}`}>
                    {orderId}
                </RouterLink>
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
                    <RouterLink
                        data-tid="GoToLink"
                        to={`/AdminTools/BusinessObjects/${webObjectName}/${scopeId}/${objectId}`}>
                        {objectId}
                    </RouterLink>
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
                    <RouterLink
                        data-tid="GoToLink"
                        to={`/AdminTools/BusinessObjects/${webObjectName}/${scopeId}/${objectId}`}>
                        {objectId}
                    </RouterLink>
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
    value: mixed,
    type: Nullable<string>,
    onChange: (x0: mixed) => void
): string | JSX.Element {
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
                <FormattedNumberInput
                    value={Number(value)}
                    onChange={(e, nextValue) => onChange(nextValue)}
                    viewFormat="0,0.00"
                    editFormat="0.00"
                />
            );

        case "Int32":
            return (
                <FormattedNumberInput
                    value={Number(value)}
                    onChange={(e, nextValue) => onChange(nextValue)}
                    viewFormat="0,0"
                    editFormat="0"
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
