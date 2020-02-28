import ArrowChevronLeftIcon from "@skbkontur/react-icons/ArrowChevronLeft";
import ArrowChevronRightIcon from "@skbkontur/react-icons/ArrowChevronRight";
import * as React from "react";
import { Link } from "react-router-dom";

import { LocationDescriptor } from "history";

import cn from "./PageNavigationList.less";
import { createPages } from "./Utils";

interface PageNavigationListProps {
    count: number;
    current: number;
    limit?: number;

    createHrefToPage: (pageNumber: number) => LocationDescriptor;
}

export class PageNavigationList extends React.Component<PageNavigationListProps> {
    public getLinkToPage(pageNumber: number): LocationDescriptor {
        return this.props.createHrefToPage(pageNumber - 1);
    }

    public renderLink(pageNumber: Nullable<number>, isCurrent: boolean, key: string): JSX.Element {
        if (pageNumber == null) {
            return (
                <span key={key} className={cn("ellipsis")}>
                    ...
                </span>
            );
        }
        return (
            <Link
                data-tid={"PageNavigationLink"}
                key={key}
                to={this.getLinkToPage(pageNumber)}
                className={cn({ active: isCurrent })}>
                {pageNumber}
            </Link>
        );
    }

    public render(): JSX.Element {
        const { count, limit } = this.props;
        const current = this.props.current + 1;

        return (
            <div data-tid={"PageNavigation"}>
                <div className={cn("pages")} data-tid="PageNavigationLinks">
                    {createPages(count, current, limit).map((pageNumber, index) =>
                        this.renderLink(pageNumber, pageNumber === current, index.toString())
                    )}
                </div>
                <div className={cn("prev-next-navigation")}>
                    <Link
                        data-tid={"PageNavigationPrevLink"}
                        to={this.getLinkToPage(current - 1)}
                        className={cn({ disabled: current === 1 })}>
                        <span>
                            <ArrowChevronLeftIcon />
                            <span className={cn("link-text")}>Предыдущая</span>
                        </span>
                    </Link>
                    <Link
                        data-tid={"PageNavigationNextLink"}
                        to={this.getLinkToPage(current + 1)}
                        className={cn({ disabled: current === count })}>
                        <span>
                            <span className={cn("link-text")}>Следующая</span>
                            <ArrowChevronRightIcon />
                        </span>
                    </Link>
                </div>
            </div>
        );
    }
}
