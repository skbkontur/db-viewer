import { PopupPosition } from "@skbkontur/react-ui/Popup";
import Tooltip from "@skbkontur/react-ui/Tooltip";
import * as React from "react";
import { RenderLayer } from "ui";

import { isTestingMode } from "../testing";

export interface TooltipWithOutsideClickProps {
    children?: any;
    render: any;
    onCloseClick?: (e: any) => void;
    trigger?: "hover" | "click" | "focus" | "opened" | "closed" | "hover&focus";
    pos?: PopupPosition;
    allowedPositions?: PopupPosition[];
    closeButton?: boolean;
    error?: boolean;
    useWrapper?: boolean;
}

/**
 * Компонент добавляет поведение: при нажатии за пределами тултипа, вызывается onCloseClick
 * Такое поведение не было реализованно в стандартном тултипе, если trigger='opened'
 */
export function TooltipWithOutsideClick(props: TooltipWithOutsideClickProps): JSX.Element {
    const { children, render, onCloseClick, trigger, ...tooltipProps } = props;
    const disableAnimations = isTestingMode();
    const rederedBody = render();

    if (trigger === "opened") {
        return (
            <Tooltip
                render={() => rederedBody && <RenderLayer onClickOutside={onCloseClick}>{rederedBody}</RenderLayer>}
                trigger={trigger}
                disableAnimations={disableAnimations}
                {...tooltipProps}>
                {children}
            </Tooltip>
        );
    }

    return <Tooltip disableAnimations={disableAnimations} {...props} />;
}
