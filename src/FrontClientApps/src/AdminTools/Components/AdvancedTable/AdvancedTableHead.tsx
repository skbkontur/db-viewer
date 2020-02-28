import * as React from "react";
import { Fill } from "react-slot-fill";
import { WindowUtils } from "Commons/DomUtils";

interface AdvancedTableHeadProps {
    children?: React.ReactNode;
    stickyClassName?: string;
    className?: Nullable<string>;
}

function HeaderFill({ children }: { children?: React.ReactNode }): JSX.Element {
    return <Fill name="Header">{children}</Fill>;
}

export class AdvancedTableHead extends React.Component<AdvancedTableHeadProps> {
    public observeWidthInterval: null | IntervalID = null;
    public previousOffsetWidth: number | null = null;

    public originHead: HTMLTableSectionElement | null = null;
    public clonedHead: HTMLTableSectionElement | null = null;

    public componentDidMount() {
        this.observeWidthInterval = setInterval(this.handleOriginResize, 1000);
    }

    public handleOriginResize = () => {
        this.synchronizeTableHeaderWidths();
    };

    public synchronizeTableHeaderWidths() {
        const originHead = this.originHead;
        const clonedHead = this.clonedHead;
        if (originHead != null && clonedHead != null && originHead.children[0] && clonedHead.children[0]) {
            const originHeadCells: HTMLCollection = originHead.children[0].children;
            const clonedHeadCells: HTMLCollection = clonedHead.children[0].children;
            for (let i = 0; i < originHeadCells.length; i++) {
                const computedStyle = WindowUtils.getComputedStyle(originHeadCells[i]);
                let elementWidth = originHeadCells[i].clientWidth;
                elementWidth -=
                    parseFloat(computedStyle.paddingLeft || "0") + parseFloat(computedStyle.paddingRight || "0");
                const clonedHeadCell = clonedHeadCells[i];
                if (clonedHeadCell instanceof HTMLElement) {
                    clonedHeadCell.style.width = elementWidth.toString() + "px";
                }
            }
        }
    }

    public componentDidUpdate() {
        setTimeout(() => this.synchronizeTableHeaderWidths(), 0);
    }

    public render(): JSX.Element {
        const { children, stickyClassName } = this.props;
        return (
            <thead ref={el => (this.originHead = el)}>
                {children}
                <HeaderFill>
                    <thead ref={el => (this.clonedHead = el)} className={stickyClassName}>
                        {children}
                    </thead>
                </HeaderFill>
            </thead>
        );
    }
}
