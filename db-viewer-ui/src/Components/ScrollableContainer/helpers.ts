const top = (element: HTMLElement): number => element.getBoundingClientRect().top;

const bottom = (element: HTMLElement): number => element.getBoundingClientRect().bottom;

export const isScrollbarInViewport = (containerElement: HTMLElement, scrollbarElement: HTMLElement): boolean => {
    const containerTop = top(containerElement);
    const containerBottom = bottom(containerElement);
    const scrollbarTop = top(scrollbarElement);
    const scrollbarBottom = bottom(scrollbarElement);

    return containerTop < scrollbarTop && containerBottom > scrollbarBottom;
};

export const updateScrollbarPosition = (
    containerElement: HTMLElement,
    scrollbarElement: HTMLElement,
    scrollbarChildElement: HTMLElement,
    currentScrollLeft: number
): void => {
    const containerRect = containerElement.getBoundingClientRect();
    const containerWidth = Math.ceil(containerRect.right - containerRect.left);

    scrollbarChildElement.style.width = `${containerElement.scrollWidth}px`;
    scrollbarElement.style.left = `${containerRect.left}px`;
    scrollbarElement.style.width = `${containerWidth}px`;
    scrollbarElement.scrollLeft = currentScrollLeft;
};
