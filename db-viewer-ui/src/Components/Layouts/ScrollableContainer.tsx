import debounce from "lodash/debounce";
import React from "react";

import styles from "./ScrollableContainer.less";

interface ScrollableContainerProps {
    className?: string;
    style?: { [key: string]: Nullable<number | string> };
    scrollStyle?: { [key: string]: Nullable<number | string> };
}

function top(element: HTMLElement): number {
    return element.getBoundingClientRect().top;
}

function bottom(element: HTMLElement): number {
    return element.getBoundingClientRect().bottom;
}

export class ScrollableContainer extends React.Component<React.PropsWithChildren<ScrollableContainerProps>> {
    public scrollLeft = 0;
    public scrollingSource: "none" | "container" | "scrollbar" = "none";

    public root: HTMLDivElement | null = null;
    public container: HTMLDivElement | null = null;
    public scrollbarChild: HTMLDivElement | null = null;
    public scrollbar: HTMLDivElement | null = null;

    public setScrollingSource = debounce(x => {
        this.scrollingSource = x;
    }, 50);

    public componentDidUpdate(): void {
        this.adjustShadows();
    }

    public componentDidMount(): void {
        this.adjustPositions();
        this.init();
        document.addEventListener("scroll", this.handlePageScroll);
        window.addEventListener("scroll", this.handlePageScroll);
        document.addEventListener("resize", this.handlePageResize);
        window.addEventListener("resize", this.handlePageResize);
    }

    public componentWillUnmount(): void {
        document.removeEventListener("scroll", this.handlePageScroll);
        window.removeEventListener("scroll", this.handlePageScroll);
        document.removeEventListener("resize", this.handlePageResize);
        window.removeEventListener("resize", this.handlePageResize);
    }

    public render(): JSX.Element {
        const { children, className, style, scrollStyle = {} } = this.props;
        return (
            <div ref={el => (this.root = el)} className={`${styles.container} ${className}`} style={style}>
                <div className={`${styles.root} ${className}`} style={style} ref={el => (this.container = el)}>
                    {children}
                    {
                        <div
                            style={{
                                overflowX: "auto",
                                position: "fixed",
                                width: "100%",
                                bottom: 0,
                                ...scrollStyle,
                            }}
                            ref={el => (this.scrollbar = el)}>
                            <div ref={el => (this.scrollbarChild = el)} style={{ height: "1px" }} />
                        </div>
                    }
                </div>
            </div>
        );
    }

    private adjustPositions() {
        const scrollLeft = this.scrollLeft;
        const container = this.container;
        const scrollbar = this.scrollbar;
        const scrollbarChild = this.scrollbarChild;
        this.showFixedScrollbar();
        if (container != null && scrollbar != null && scrollbarChild != null) {
            if (top(container) < top(scrollbar) && bottom(container) > bottom(scrollbar)) {
                scrollbarChild.style.width = container.scrollWidth + "px";
                scrollbar.style.left = container.getBoundingClientRect().left + "px";
                scrollbar.style.width =
                    container.getBoundingClientRect().right - container.getBoundingClientRect().left + "px";
                scrollbar.scrollLeft = scrollLeft;
            } else {
                this.hideFixedScrollbar();
            }
        }
    }

    private adjustShadows() {
        const container = this.container;
        const scrollbar = this.scrollbar;
        const root = this.root;
        if (scrollbar == null || root == null || container == null) {
            return;
        }
        if (container.scrollLeft > 5) {
            root.classList.add(styles.leftShadow);
        } else {
            root.classList.remove(styles.leftShadow);
        }
        if (container.scrollLeft < container.scrollWidth - container.offsetWidth - 5) {
            root.classList.add(styles.rightShadow);
        } else {
            root.classList.remove(styles.rightShadow);
        }
    }

    private handlePageScroll = () => {
        this.adjustPositions();
        this.adjustShadows();
    };

    private handlePageResize = () => {
        this.adjustPositions();
        this.adjustShadows();
    };

    private hideFixedScrollbar() {
        const scrollbar = this.scrollbar;
        if (scrollbar != null) {
            scrollbar.style.display = "none";
        }
    }

    private showFixedScrollbar() {
        const scrollbar = this.scrollbar;
        if (scrollbar != null) {
            scrollbar.style.display = "block";
        }
    }

    private init() {
        const scrollbar = this.scrollbar;
        const container = this.container;
        if (scrollbar == null || container == null) {
            return;
        }
        scrollbar.addEventListener("scroll", () => {
            if (this.scrollingSource === "scrollbar" || this.scrollingSource === "none") {
                this.scrollingSource = "scrollbar";
                container.scrollLeft = scrollbar.scrollLeft;
                this.setScrollingSource("none");
            } else {
                this.scrollLeft = scrollbar.scrollLeft;
            }
            this.adjustShadows();
        });
        container.addEventListener("scroll", () => {
            if (this.scrollingSource === "container" || this.scrollingSource === "none") {
                this.scrollingSource = "container";
                scrollbar.scrollLeft = container.scrollLeft;
                this.scrollLeft = container.scrollLeft;
                this.setScrollingSource("none");
            } else {
                this.scrollLeft = container.scrollLeft;
            }
            this.adjustShadows();
        });
    }
}
