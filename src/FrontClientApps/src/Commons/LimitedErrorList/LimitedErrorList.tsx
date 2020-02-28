import ArrowTriangleDownIcon from "@skbkontur/react-icons/ArrowTriangleDown";
import pluralize from "@skbkontur/react-ui/lib/pluralize";
import _ from "lodash";
import React, { useState } from "react";
import { ButtonLink } from "ui";
import { StringUtils } from "Commons/Utils/StringUtils";

import cn from "./LimitedErrorList.less";
import { NumerationPositionType, NumerationPositionTypes } from "./NumerationPositionType";

export interface LimitedErrorListProps {
    errors: React.ReactNode[];
    maxVisibleCount: number;
    numerationPosition?: NumerationPositionType;
}

export function LimitedErrorList(props: LimitedErrorListProps): JSX.Element | null {
    const { errors, maxVisibleCount, numerationPosition = NumerationPositionTypes.Outside } = props;
    const [showAllErrors, setShowAllErrors] = useState(false);

    const errorsMessages =
        errors != null ? errors.filter(x => !(typeof x === "string" && StringUtils.isNullOrWhitespace(x))) : [];

    if (errorsMessages.length === 0) {
        return null;
    }

    const maxCount = errorsMessages.length === maxVisibleCount + 1 ? maxVisibleCount + 1 : maxVisibleCount;
    const visibleErrorsCount = showAllErrors ? errorsMessages.length : maxCount;
    const invisibleErrorsCount = errorsMessages.length - visibleErrorsCount;

    return (
        <ol
            className={cn(
                "list-with-errors",
                numerationPosition,
                errorsMessages.length === 1 ? "without-indices" : null
            )}
            data-tid={"ErrorList"}>
            {errorsMessages.slice(0, visibleErrorsCount).map((error, index) => (
                <li className={cn("error-item")} key={`errors-list-item-${index}`}>
                    <span data-tid="ErrorItem">{error}</span>
                </li>
            ))}
            {invisibleErrorsCount > 0 && (
                <ButtonLink
                    onClick={() => setShowAllErrors(true)}
                    data-tid="ShowAllErrors"
                    rightIcon={<ArrowTriangleDownIcon />}>
                    ещё {invisibleErrorsCount} {pluralize(invisibleErrorsCount, "ошибка", "ошибки", "ошибок")}
                </ButtonLink>
            )}
        </ol>
    );
}
