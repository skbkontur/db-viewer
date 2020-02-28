import SearchIcon from "@skbkontur/react-icons/Search";
import * as React from "react";
import { Input } from "ui";
import { TextHighlight } from "Commons/TextHighlight";

import cn from "./HighlightSearchContainer.less";

interface HighlightSearchContainerProps<V> {
    availableValues: V[];
    renderValue: (value: V) => React.ReactNode;
}

interface HighlightSearchContainerState {
    filterText: string;
}

export function withHighlightSearchContainer<V, P extends HighlightSearchContainerProps<V>>(
    Comp: React.ComponentType<P>,
    valueRepresentation: (value: V) => string,
    representationNormalizer?: (value: string) => string
): React.ComponentType<P> {
    const normalizer = representationNormalizer == undefined ? (value: string) => value : representationNormalizer;
    return class HighlightSearchContainer extends React.Component<P, HighlightSearchContainerState> {
        public state: HighlightSearchContainerState;

        public constructor(props: P) {
            super(props);
            if (props != undefined) {
                this.state = {
                    filterText: "",
                };
            }
        }

        public render(): JSX.Element {
            const { availableValues } = this.props;
            const { filterText } = this.state;
            const valuseToShow = this.getValuesToShow(availableValues, filterText);
            return (
                <div className={cn("container")}>
                    <div className={cn("input")}>
                        <Input
                            autoFocus
                            data-tid={"Search"}
                            leftIcon={<SearchIcon />}
                            value={filterText}
                            width={300}
                            onChange={(event, value) => this.onFilterTextChange(value)}
                        />
                    </div>
                    <Comp
                        {...this.props}
                        availableValues={valuseToShow}
                        renderValue={v => this.decorateValue(v, filterText)}
                    />
                </div>
            );
        }

        private decorateValue(value: V, filterText: string): React.ReactNode {
            const { renderValue } = this.props;
            const simpleComponent = renderValue(value);
            if (typeof simpleComponent === "string") {
                return <TextHighlight highlight={filterText} text={simpleComponent} />;
            }
            return simpleComponent;
        }

        private getValuesToShow(values: V[], filterText?: string): V[] {
            if (filterText == null || filterText == undefined || filterText === "") {
                return values;
            }
            const normalizedText = normalizer(filterText);
            return values.filter(x => normalizer(valueRepresentation(x)).includes(normalizedText));
        }

        private onFilterTextChange(newFilterText: string) {
            this.setState({
                filterText: newFilterText,
            });
        }
    };
}
