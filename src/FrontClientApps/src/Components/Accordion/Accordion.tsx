import ArrowTriangleDownIcon from "@skbkontur/react-icons/ArrowTriangleDown";
import ArrowTriangleRightIcon from "@skbkontur/react-icons/ArrowTriangleRight";
import Link from "@skbkontur/react-ui/Link";
import _ from "lodash";
import * as React from "react";
import { Fill } from "Commons/Layouts/Fill";
import { Fit } from "Commons/Layouts/Fit";
import { RowStack } from "Commons/Layouts/RowStack";

import cn from "./Accordion.less";

type CustomRenderer = (target: { [key: string]: any }, path: string[]) => JSX.Element | null;

export interface TaskAccordionProps {
    customRender?: null | undefined | CustomRenderer;
    value: { [key: string]: any };
    title?: string | JSX.Element;
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

    public constructor(props: TaskAccordionProps) {
        super(props);
        const canCollapseSelf = props.title !== undefined;
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

    public shouldComponentUpdate(
        nextProps: Readonly<TaskAccordionProps>,
        nextState: Readonly<TaskAccordionState>,
        nextContext: any
    ): boolean {
        const isValueChanged = !_.isEqual(this.props.value, nextProps.value);
        const isForceCollapsedChanged = this.props._internalForceCollapsed !== nextProps._internalForceCollapsed;
        const isDefaultCollapsedChanged = this.props.defaultCollapsed !== nextProps.defaultCollapsed;
        const isStateChanged = !_.isEqual(this.state, nextState);
        return isValueChanged || isForceCollapsedChanged || isDefaultCollapsedChanged || isStateChanged;
    }

    public componentWillReceiveProps(nextProps: Readonly<TaskAccordionProps>, nextContext: any): void {
        const isForcedRecursively = nextProps._internalForceCollapsed !== undefined;
        if (isForcedRecursively && nextProps._internalForceCollapsed !== this.props._internalForceCollapsed) {
            this.setState({
                collapsedSelf: nextProps._internalForceCollapsed as boolean,
                collapsedRecursive: nextProps._internalForceCollapsed as boolean,
                isForced: true,
            });
        }
        if (nextProps.defaultCollapsed !== this.props.defaultCollapsed) {
            this.setState({
                collapsedSelf: nextProps.defaultCollapsed as boolean,
                collapsedRecursive: nextProps.defaultCollapsed as boolean,
                isForced: true,
            });
        }
    }

    public render(): JSX.Element {
        const { showToggleAll, value, title } = this.props;
        const { collapsedSelf, collapsedRecursive } = this.state;

        const isToggleLinkVisible = showToggleAll && this.isThereItemsToToggleAtFirstLevel();
        const showTitleBlock = title != null || isToggleLinkVisible;
        return (
            <div className={cn({ "value-wrapper": title != null })}>
                {showTitleBlock && (
                    <RowStack
                        className={cn({ "title-block": true, ["has-title"]: title })}
                        inline
                        verticalAlign="baseline">
                        {title && (
                            <button
                                data-tid="ToggleButton"
                                className={cn("toggle-button")}
                                onClick={this.toggleCollapseManual}>
                                {collapsedSelf ? <ArrowTriangleRightIcon /> : <ArrowTriangleDownIcon />}
                                <span data-tid="ToggleButtonText" className={cn("toggle-button-text")}>
                                    {title}
                                </span>
                            </button>
                        )}
                        {isToggleLinkVisible && (
                            <span className={cn("toggle-all-link")}>
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
        const { value, customRender, pathPrefix = [], defaultCollapsed } = this.props;
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
            if (_.isPlainObject(valueToRender)) {
                const newCustomRender: null | CustomRenderer =
                    customRender != null ? (target, path) => customRender(value, [key, ...path]) : null;
                return (
                    <Accordion
                        defaultCollapsed={defaultCollapsedValue}
                        data-tid={this.getPath(pathPrefix, key)}
                        customRender={newCustomRender}
                        key={key}
                        value={valueToRender}
                        title={key}
                        pathPrefix={[...pathPrefix, key]}
                        _internalForceCollapsed={forceCollapsedValue}
                    />
                );
            }
            if (_.isArray(valueToRender)) {
                const newCustomRender: null | CustomRenderer = customRender
                    ? (target, path) => customRender(value, [key, ...path])
                    : null;
                return (
                    <Accordion
                        defaultCollapsed={defaultCollapsedValue}
                        data-tid={this.getPath(pathPrefix, key)}
                        customRender={newCustomRender}
                        key={key}
                        value={valueToRender
                            .map((x, index) => ({ [`[${index}]`]: x }))
                            .reduce((x, y) => ({ ...x, ...y }), {})}
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
                    className={cn("string-wrapper")}
                    data-tid={this.getPath(pathPrefix, key)}>
                    <Fit data-tid="Key" className={cn("title")}>
                        {key}:
                    </Fit>
                    <Fill data-tid="Value" className={cn("value")}>
                        {(customRender && customRender(value, [key])) ||
                            (Array.isArray(value[key]) ? value[key].join(", ") : String(value[key]))}
                    </Fill>
                </RowStack>
            );
        });
    }

    private readonly toggleCollapseManual = () => {
        this.setState(state => ({ collapsedSelf: !state.collapsedSelf, isForced: false }));
    };

    private readonly toggleCollapseAll = () => {
        const { title } = this.props;
        const needToggleFirstLevel = title !== undefined;
        this.setState(state => ({
            collapsedSelf: needToggleFirstLevel ? !state.collapsedRecursive : state.collapsedSelf,
            collapsedRecursive: !state.collapsedRecursive,
            isForced: true,
        }));
    };

    private getPath(pathPrefix: string[], key: string): string {
        return [...pathPrefix, key]
            .join("_")
            .replace("[", "")
            .replace("]", "");
    }

    private readonly isThereItemsToToggleAtFirstLevel = (): boolean =>
        Object.values(this.props.value).some(item => _.isPlainObject(item) || _.isArray(item));
}
