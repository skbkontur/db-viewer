import debounce from "lodash/debounce";
import { type CSSProperties, type PropsWithChildren, useEffect, useRef, type ReactElement } from "react";

import { jsStyles } from "./ScrollableContainer.styles";
import { updateScrollbarPosition, isScrollbarInViewport } from "./helpers";

interface ScrollableContainerProps {
    className?: string;
    style?: CSSProperties;
    scrollStyle?: CSSProperties;
}

export const ScrollableContainer = ({
    children,
    className,
    style,
    scrollStyle = {},
}: PropsWithChildren<ScrollableContainerProps>): ReactElement => {
    const scrollLeft = useRef(0);
    const scrollingSource = useRef<"none" | "container" | "scrollbar">("none");

    const setScrollingSource = debounce(x => (scrollingSource.current = x), 50, { leading: false });

    const root = useRef<HTMLDivElement | null>(null);
    const container = useRef<HTMLDivElement | null>(null);
    const scrollbarChild = useRef<HTMLDivElement | null>(null);
    const scrollbar = useRef<HTMLDivElement | null>(null);

    const handlePageResize = (): void => {
        adjustPositions();
        adjustShadows();
    };
    const resizeDebounced = debounce(handlePageResize, 10, { leading: false });

    useEffect(() => {
        init();
        document.addEventListener("scroll", resizeDebounced);
        window.addEventListener("scroll", resizeDebounced);
        document.addEventListener("resize", handlePageResize);
        window.addEventListener("resize", handlePageResize);

        return () => {
            document.removeEventListener("scroll", resizeDebounced);
            window.removeEventListener("scroll", resizeDebounced);
            document.removeEventListener("resize", handlePageResize);
            window.removeEventListener("resize", handlePageResize);
        };
    }, []);

    useEffect(() => {
        adjustShadows();
    });

    return (
        <div ref={root} data-tid="ScrollableContainer" className={`${jsStyles.root()} ${className}`} style={style}>
            <div className={jsStyles.container()} style={style} ref={container}>
                {children}
                <div
                    style={{
                        overflowX: "auto",
                        position: "fixed",
                        width: "100%",
                        bottom: 0,
                        ...scrollStyle,
                    }}
                    ref={scrollbar}>
                    <div ref={scrollbarChild} style={{ height: "1px" }} />
                </div>
            </div>
        </div>
    );

    function adjustPositions(): void {
        const currentScrollLeft = scrollLeft.current;
        const containerElement = container.current;
        const scrollbarElement = scrollbar.current;
        const scrollbarChildElement = scrollbarChild.current;

        if (!containerElement || !scrollbarElement || !scrollbarChildElement) {
            return;
        }

        showFixedScrollbar();

        const isScrollbarVisible = isScrollbarInViewport(containerElement, scrollbarElement);

        if (isScrollbarVisible) {
            updateScrollbarPosition(containerElement, scrollbarElement, scrollbarChildElement, currentScrollLeft);
        } else {
            hideFixedScrollbar();
        }
    }

    function adjustShadows(): void {
        const containerElement = container.current;
        const scrollbarElement = scrollbar.current;
        const rootElement = root.current;
        if (!scrollbarElement || !rootElement || !containerElement) {
            return;
        }

        const epsilon = 5;
        if (containerElement.scrollLeft > epsilon) {
            rootElement.classList.add(jsStyles.leftShadow());
        } else {
            rootElement.classList.remove(jsStyles.leftShadow());
        }
        const containerWidth = containerElement.scrollWidth - containerElement.offsetWidth;
        if (containerElement.scrollLeft < containerWidth - epsilon) {
            rootElement.classList.add(jsStyles.rightShadow());
        } else {
            rootElement.classList.remove(jsStyles.rightShadow());
        }
    }

    function hideFixedScrollbar(): void {
        if (scrollbar.current) {
            scrollbar.current.style.display = "none";
        }
    }

    function showFixedScrollbar(): void {
        if (scrollbar.current) {
            scrollbar.current.style.display = "block";
        }
    }

    function init(): void {
        const scrollbarElement = scrollbar.current;
        const containerElement = container.current;
        if (!scrollbarElement || !containerElement) {
            return;
        }
        scrollbarElement.addEventListener("scroll", (): void => {
            if (scrollingSource.current === "scrollbar" || scrollingSource.current === "none") {
                scrollingSource.current = "scrollbar";
                containerElement.scrollLeft = scrollbarElement.scrollLeft;
                setScrollingSource("none");
            } else {
                scrollLeft.current = scrollbarElement.scrollLeft;
            }
            adjustShadows();
        });
        containerElement.addEventListener("scroll", (): void => {
            if (scrollingSource.current === "container" || scrollingSource.current === "none") {
                scrollingSource.current = "container";
                scrollbarElement.scrollLeft = containerElement.scrollLeft;
                scrollLeft.current = containerElement.scrollLeft;
                setScrollingSource("none");
            } else {
                scrollLeft.current = containerElement.scrollLeft;
            }
            adjustShadows();
        });
    }
};
