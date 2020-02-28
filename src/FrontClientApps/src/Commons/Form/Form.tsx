import PropTypes from "prop-types";
import * as React from "react";
import { ColumnStack, Fit, Fixed, RowStack } from "ui/layout";

import cn from "./Form.less";

type CaptionColor = "normal" | "greyed";

export interface FormProps {
    children?: any;
    captionWidth?: number;
    captionColor?: CaptionColor;
    allowHangingChars?: boolean;
    gap?: number;
}

interface FormSettings {
    captionWidth: number;
    captionColor: CaptionColor;
    allowHangingChars: boolean;
    gap: number;
}

interface FormContext {
    formSettings: FormSettings;
}

export class Form extends React.Component<FormProps> {
    public static defaultProps = {
        captionWidth: 240,
        gap: 2,
    };
    public static childContextTypes = {
        formSettings: PropTypes.any,
    };

    public static Row: React.ComponentType<FormRowProps>;
    public static Section: React.ComponentType<FormSectionProps>;
    public static HangChar: React.ComponentType<FormHandCharProps>;

    public getChildContext(): FormContext {
        return {
            formSettings: {
                captionWidth: this.props.captionWidth || 240,
                captionColor: this.props.captionColor || "normal",
                gap: this.props.gap != null ? this.props.gap : 2,
                allowHangingChars: this.props.allowHangingChars || false,
            },
        };
    }

    public render(): JSX.Element {
        const { gap } = this.props;
        return (
            <ColumnStack block stretch gap={gap}>
                {this.props.children}
            </ColumnStack>
        );
    }
}

export interface FormRowProps {
    useAlignTopHack?: boolean;
    withoutCaption?: boolean;
    caption?: string | JSX.Element;
    children?: any;
    captionAlign?: "right";
    nextGap?: number;
    allowDefaultShrink?: boolean;
}

class FormRow extends React.Component<FormRowProps> {
    public static contextTypes = {
        formSettings: PropTypes.any,
    };
    public context: FormContext;

    public render(): JSX.Element {
        const {
            useAlignTopHack,
            caption,
            children,
            captionAlign,
            withoutCaption,
            nextGap,
            allowDefaultShrink,
        } = this.props;
        const { formSettings } = this.context;
        const hasHangChar = React.Children.toArray(children).some(hasHangCharTrait);

        if (useAlignTopHack) {
            return (
                <Fit nextGap={nextGap}>
                    <RowStack block gap={captionAlign != undefined ? 2 : 0}>
                        {withoutCaption !== true && (
                            <Fixed
                                style={{ textAlign: captionAlign || "left" }}
                                allowWrap
                                className={cn("caption", "hacked", formSettings.captionColor, {
                                    "with-hanging-chars": formSettings.allowHangingChars,
                                })}
                                data-tid="FormCaption"
                                width={formSettings.captionWidth}>
                                {caption}
                            </Fixed>
                        )}
                        <Fit
                            className={cn({
                                "hang-left": formSettings.allowHangingChars && hasHangChar,
                                shrinkable: allowDefaultShrink,
                            })}>
                            {children}
                        </Fit>
                    </RowStack>
                </Fit>
            );
        }
        return (
            <Fit style={{ width: "100%" }} nextGap={nextGap}>
                <RowStack baseline block gap={captionAlign != undefined ? 2 : 0}>
                    {withoutCaption !== true && (
                        <Fixed
                            style={{ textAlign: captionAlign || "left" }}
                            allowWrap
                            className={cn("caption", formSettings.captionColor, {
                                "with-hanging-chars": formSettings.allowHangingChars,
                            })}
                            data-tid="FormCaption"
                            width={formSettings.captionWidth}>
                            {caption}
                        </Fixed>
                    )}
                    <Fit
                        className={cn({
                            "hang-left": formSettings.allowHangingChars && hasHangChar,
                            shrinkable: allowDefaultShrink,
                        })}>
                        {children}
                    </Fit>
                </RowStack>
            </Fit>
        );
    }
}

interface FormSectionProps {
    title?: string | null;
    renderTitle?: () => JSX.Element;
    children?: any;
    withMargin?: boolean;
    renderElementInTopOfForm?: () => JSX.Element | null;
    shiftChildrenCaptions?: boolean;
    titleDataTid?: string;
}

class FormSection extends React.Component<FormSectionProps> {
    public static contextTypes = {
        formSettings: PropTypes.any,
    };
    public context: FormContext;

    public render(): JSX.Element {
        const {
            title,
            renderTitle,
            withMargin,
            renderElementInTopOfForm,
            children,
            shiftChildrenCaptions,
            titleDataTid,
        } = this.props;
        const { formSettings } = this.context;
        const { gap } = formSettings;
        const elementInForm =
            renderElementInTopOfForm != null ? (
                <div className={cn("another-form-element")}>{renderElementInTopOfForm()}</div>
            ) : null;
        if (title == null && renderTitle == null) {
            return (
                <Fit>
                    {elementInForm}
                    <ColumnStack block stretch gap={gap}>
                        {withMargin && <Fit />}
                        {withMargin && <Fit />}
                        {children}
                    </ColumnStack>
                </Fit>
            );
        }
        return (
            <Fit>
                <ColumnStack block stretch gap={formSettings.gap}>
                    <Fit />
                    <Fit>
                        {elementInForm}
                        {title == null && renderTitle != null ? (
                            renderTitle()
                        ) : (
                            <h4 data-tid={titleDataTid}>{title}</h4>
                        )}
                    </Fit>
                    <Fit>
                        <ColumnStack
                            gap={gap}
                            className={cn({
                                "shift-children": shiftChildrenCaptions,
                            })}>
                            {children}
                        </ColumnStack>
                    </Fit>
                </ColumnStack>
            </Fit>
        );
    }
}

export function hasHangCharTrait(x: React.ReactChild): boolean {
    if (typeof x === "string") {
        return false;
    }
    if (typeof x === "object") {
        return x.type["HangCharTrait"];
    }
    return false;
}

interface FormHandCharProps {
    children: React.ReactNode;
}

class FormHangChar extends React.Component<FormHandCharProps> {
    public static HangCharTrait = true;

    public render(): JSX.Element {
        const { children } = this.props;

        return <span style={{ display: "inline-block", width: 20, textAlign: "right" }}>{children}&nbsp;</span>;
    }
}

export { FormRow, FormSection };

Form.HangChar = FormHangChar;
Form.Row = FormRow;
Form.Section = FormSection;
