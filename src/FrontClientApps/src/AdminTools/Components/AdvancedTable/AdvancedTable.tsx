import * as React from "react";
import { Provider, Slot } from "react-slot-fill";
import { ISubscription, LayoutEvents } from "Commons/DomUtils";

import cn from "./AdvancedTable.less";
import { AdvancedTableHead } from "./AdvancedTableHead";

export { AdvancedTableHead };

interface AdvancedTableHeadCellProps {
    className?: string;
    style?: React.CSSProperties;
    rowSpan?: number | number;
    colSpan?: number | number;
}

export class AdvancedTableHeadCell extends React.Component<AdvancedTableHeadCellProps> {
    public render(): JSX.Element {
        return <th {...this.props} />;
    }
}

interface AdvancedTableRowProps {
    className?: string;
    style?: React.CSSProperties;
}

export class AdvancedTableRow extends React.Component<AdvancedTableRowProps> {
    public render(): JSX.Element {
        return <tr {...this.props} />;
    }
}

interface AdvancedTableRowProps {
    children: React.ReactNode;
}

export class AdvancedTableFakeRow extends React.Component<AdvancedTableRowProps> {
    public render(): JSX.Element {
        const { children } = this.props;

        return (
            <tr className={cn("fake-row")}>
                <td>{children}</td>
            </tr>
        );
    }
}

interface AdvancedTableBodyProps {
    className?: string;
    style?: React.CSSProperties;
}

export class AdvancedTableBody extends React.Component<AdvancedTableBodyProps> {
    public render(): JSX.Element {
        return <tbody {...this.props} />;
    }
}

interface AdvancedTableCellProps {
    className?: string;
    style?: React.CSSProperties;
    colSpan?: number;
    onClick?: (e: React.MouseEvent<any>) => void;
}

export class AdvancedTableCell extends React.Component<AdvancedTableCellProps> {
    public render(): JSX.Element {
        return <td {...this.props} />;
    }
}

interface AdvancedTableProps {
    children?: React.ReactNode;
    className?: Nullable<string>;
    fullWidth?: boolean;
    style?: React.CSSProperties;
}

export class AdvancedTable extends React.Component<AdvancedTableProps> {
    public container: HTMLDivElement | null = null;
    public stickyHeader: HTMLTableElement | null = null;

    public subcscription: Nullable<ISubscription>;

    public static Head = AdvancedTableHead;
    public static HeadCell = AdvancedTableHeadCell;
    public static Row = AdvancedTableRow;
    public static FakeRow = AdvancedTableRow;
    public static Body = AdvancedTableBody;
    public static Cell = AdvancedTableCell;

    public componentDidMount() {
        this.subcscription = LayoutEvents.listenScroll(this.handleBodyScroll);
    }

    public componentWillMount() {
        if (this.subcscription != null) {
            this.subcscription.remove();
        }
    }

    public handleBodyScroll = () => {
        this.updateStickyHeaderPosition();
    };

    public updateStickyHeaderPosition() {
        const container = this.container;
        const stickyHeader = this.stickyHeader;

        if (container && stickyHeader) {
            const containerTop = container.getBoundingClientRect().top;
            const containerBottom = container.getBoundingClientRect().bottom;
            const stickyHeaderBottom = stickyHeader.getBoundingClientRect().bottom;

            if (containerTop < 0 && containerBottom > stickyHeaderBottom) {
                stickyHeader.classList.add(cn("visible"));
                stickyHeader.style.top = (-containerTop).toString() + "px";
            } else {
                stickyHeader.classList.remove(cn("visible"));
            }
        }
    }

    public render(): JSX.Element {
        const { className, children, fullWidth, ...props } = this.props;
        const containerStyle = fullWidth ? { width: "100%" } : {};
        return (
            <Provider>
                <div ref={el => (this.container = el)} className={cn("container")} style={containerStyle}>
                    <table ref={el => (this.stickyHeader = el)} className={cn(className, "sticky")} {...props}>
                        <Slot name="Header" />
                    </table>
                    <table className={cn(className)} {...props}>
                        {children}
                    </table>
                </div>
            </Provider>
        );
    }
}
