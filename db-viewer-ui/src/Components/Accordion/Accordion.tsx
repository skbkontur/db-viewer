import { ArrowShapeTriangleADownIcon16Regular } from "@skbkontur/icons/ArrowShapeTriangleADownIcon16Regular";
import { ArrowShapeTriangleARightIcon16Regular } from "@skbkontur/icons/ArrowShapeTriangleARightIcon16Regular";
import { Fill, Fit, RowStack } from "@skbkontur/react-stack-layout";
import { ThemeContext, Hint, Link } from "@skbkontur/react-ui";
import { Theme } from "@skbkontur/react-ui/lib/theming/Theme";
import isArray from "lodash/isArray";
import isEqual from "lodash/isEqual";
import isPlainObject from "lodash/isPlainObject";
import React from "react";

import { jsStyles } from "./Accordion.styles";

type CaptionRenderer = (path: string[]) => null | string;
type ValueRenderer = (target: { [key: string]: any }, path: string[]) => null | JSX.Element;

export interface TaskAccordionProps {
    renderCaption: null | CaptionRenderer;
    renderValue: null | ValueRenderer;
    value: { [key: string]: any };
    title: null | string;
    pathPrefix?: string[];
    defaultCollapsed?: boolean;
    showToggleAll?: boolean;
    _internalForceCollapsed?: boolean; // internal prop for recursive behaviour
}

interface TaskAccordionState {
    collapsedSelf: boolean;
    collapsedRecursive: boolean;
    isForced: boolean;
}

export class Accordion extends React.Component<TaskAccordionProps, TaskAccordionState> {
    public static defaultProps = {
        pathPrefix: [],
    };

    private theme!: Theme;

    public constructor(props: TaskAccordionProps) {
        super(props);
        const canCollapseSelf = props.title != null;
        const defaultCollapsedValue = props.defaultCollapsed || false;
        const collapsed = canCollapseSelf && defaultCollapsedValue;

        if (props._internalForceCollapsed !== undefined) {
            this.state = {
                collapsedSelf: props._internalForceCollapsed,
                collapsedRecursive: props._internalForceCollapsed,
                isForced: props._internalForceCollapsed,
            };
        } else {
            this.state = {
                collapsedSelf: collapsed,
                collapsedRecursive: defaultCollapsedValue,
                isForced: false,
            };
        }
    }

    public shouldComponentUpdate(nextProps: TaskAccordionProps, nextState: TaskAccordionState): boolean {
        const isValueChanged = !isEqual(this.props.value, nextProps.value);
        const isForceCollapsedChanged = this.props._internalForceCollapsed !== nextProps._internalForceCollapsed;
        const isDefaultCollapsedChanged = this.props.defaultCollapsed !== nextProps.defaultCollapsed;
        const isStateChanged = !isEqual(this.state, nextState);
        return isValueChanged || isForceCollapsedChanged || isDefaultCollapsedChanged || isStateChanged;
    }

    public componentDidUpdate(prevProps: TaskAccordionProps): void {
        const isForcedRecursively = this.props._internalForceCollapsed !== undefined;
        if (isForcedRecursively && this.props._internalForceCollapsed !== prevProps._internalForceCollapsed) {
            this.setState({
                collapsedSelf: this.props._internalForceCollapsed as boolean,
                collapsedRecursive: this.props._internalForceCollapsed as boolean,
                isForced: true,
            });
        }
        if (this.props.defaultCollapsed !== prevProps.defaultCollapsed) {
            this.setState({
                collapsedSelf: this.props.defaultCollapsed as boolean,
                collapsedRecursive: this.props.defaultCollapsed as boolean,
                isForced: true,
            });
        }
    }

    public render(): JSX.Element {
        return (
            <ThemeContext.Consumer>
                {theme => {
                    this.theme = theme;
                    return this.renderMain();
                }}
            </ThemeContext.Consumer>
        );
    }

    public renderMain(): JSX.Element {
        const { showToggleAll, value, title } = this.props;
        const { collapsedSelf, collapsedRecursive } = this.state;

        const isToggleLinkVisible = showToggleAll && this.isThereItemsToToggleAtFirstLevel();
        const showTitleBlock = title != null || isToggleLinkVisible;
        return (
            <div className={`${title && jsStyles.valueWrapper()}`}>
                {showTitleBlock && (
                    <RowStack
                        className={(title && jsStyles.titleBlockHasTitle(this.theme)) || undefined}
                        inline
                        verticalAlign="baseline">
                        {this.renderTitle()}
                        {isToggleLinkVisible && (
                            <span className={jsStyles.toggleAllLink()}>
                                <Link
                                    data-tid="ToggleAllLink"
                                    onClick={this.toggleCollapseAll}
                                    use={title ? "grayed" : "default"}>
                                    {collapsedRecursive ? "Развернуть всё" : "Свернуть всё"}
                                </Link>
                            </span>
                        )}
                    </RowStack>
                )}
                {value && !collapsedSelf && this.renderValue()}
            </div>
        );
    }

    public renderValue(): JSX.Element[] {
        const { value, renderCaption, renderValue, pathPrefix = [], defaultCollapsed } = this.props;
        const { collapsedRecursive, isForced } = this.state;
        const keys = Object.keys(value);

        let defaultCollapsedValue = true;
        let forceCollapsedValue: undefined | boolean;

        if (isForced) {
            defaultCollapsedValue = collapsedRecursive;
            forceCollapsedValue = collapsedRecursive;
        } else {
            defaultCollapsedValue = defaultCollapsed || false;
            forceCollapsedValue = undefined;
        }

        return keys.map(key => {
            const valueToRender = value[key];
            if (isPlainObject(valueToRender) || isArray(valueToRender)) {
                const newValueRender: null | ValueRenderer =
                    renderValue != null ? (target, path) => renderValue(value, [key, ...path]) : null;

                const newCaptionRenderer: null | CaptionRenderer =
                    renderCaption != null ? path => renderCaption([key, ...path]) : null;

                return (
                    <Accordion
                        defaultCollapsed={defaultCollapsedValue}
                        data-tid={this.getPath(pathPrefix, key)}
                        renderCaption={newCaptionRenderer}
                        renderValue={newValueRender}
                        key={key}
                        value={valueToRender}
                        title={key}
                        pathPrefix={[...pathPrefix, key]}
                        _internalForceCollapsed={forceCollapsedValue}
                    />
                );
            }
            return (
                <RowStack
                    gap={1}
                    block
                    baseline
                    key={key}
                    className={`stringWrapper ${jsStyles.stringWrapper(this.theme)}`}
                    data-tid={this.getPath(pathPrefix, key)}>
                    <Fit data-tid="Key" className={jsStyles.title()}>
                        {this.renderItemTitle(key, [key])}:
                    </Fit>
                    <Fill data-tid="Value" className={jsStyles.value()}>
                        {(renderValue && renderValue(value, [key])) ||
                            (Array.isArray(value[key]) ? value[key].join(", ") : String(value[key]))}
                    </Fill>
                </RowStack>
            );
        });
    }

    private readonly renderItemTitle = (title: string | null, path: string[]) => {
        const { renderCaption } = this.props;
        const caption = renderCaption?.(path);
        if (caption != null) {
            return <Hint text={caption}>{title}</Hint>;
        }
        return title;
    };

    private readonly renderTitle = () => {
        const { title, renderCaption } = this.props;
        const { collapsedSelf } = this.state;
        if (title == null) {
            return null;
        }
        const caption = renderCaption?.([]);
        return (
            <RowStack gap={1} verticalAlign="baseline">
                <Fit data-tid="Title" className={jsStyles.title()}>
                    <button
                        data-tid="ToggleButton"
                        className={jsStyles.toggleButton()}
                        onClick={this.toggleCollapseManual}>
                        {collapsedSelf ? (
                            <ArrowShapeTriangleARightIcon16Regular />
                        ) : (
                            <ArrowShapeTriangleADownIcon16Regular />
                        )}
                        <span data-tid="ToggleButtonText" className={jsStyles.toggleButtonText()}>
                            {title}
                        </span>
                    </button>
                </Fit>
                {caption && (
                    <Fit data-tid="Caption" className={jsStyles.mutedKeyword(this.theme)}>
                        {caption}
                    </Fit>
                )}
            </RowStack>
        );
    };

    private readonly toggleCollapseManual = () => {
        this.setState(state => ({ collapsedSelf: !state.collapsedSelf, isForced: false }));
    };

    private readonly toggleCollapseAll = () => {
        const { title } = this.props;
        const needToggleFirstLevel = title != null;
        this.setState(state => ({
            collapsedSelf: needToggleFirstLevel ? !state.collapsedRecursive : state.collapsedSelf,
            collapsedRecursive: !state.collapsedRecursive,
            isForced: true,
        }));
    };

    private getPath(pathPrefix: string[], key: string): string {
        return [...pathPrefix, key].join("_").replace("[", "").replace("]", "");
    }

    private readonly isThereItemsToToggleAtFirstLevel = (): boolean =>
        Object.values(this.props.value).some(item => isPlainObject(item) || isArray(item));
}
