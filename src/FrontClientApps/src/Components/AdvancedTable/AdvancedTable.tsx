import React from "react";

import cn from "./AdvancedTable.less";

interface AdvancedTableHeadProps {
    children?: React.ReactNode;
    stickyClassName?: string;
    className?: Nullable<string>;
}

export class AdvancedTableHead extends React.Component<AdvancedTableHeadProps> {
    public render(): JSX.Element {
        return <thead>{this.props.children}</thead>;
    }
}

interface AdvancedTableHeadCellProps {
    className?: string;
    style?: React.CSSProperties;
    rowSpan?: number | number;
    colSpan?: number | number;
}

class AdvancedTableHeadCell extends React.Component<AdvancedTableHeadCellProps> {
    public render(): JSX.Element {
        return <th {...this.props} />;
    }
}

interface AdvancedTableRowProps {
    className?: string;
    style?: React.CSSProperties;
}

class AdvancedTableRow extends React.Component<AdvancedTableRowProps> {
    public render(): JSX.Element {
        return <tr {...this.props} />;
    }
}

interface AdvancedTableBodyProps {
    className?: string;
    style?: React.CSSProperties;
}

class AdvancedTableBody extends React.Component<AdvancedTableBodyProps> {
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

class AdvancedTableCell extends React.Component<AdvancedTableCellProps> {
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
    public static Head = AdvancedTableHead;
    public static HeadCell = AdvancedTableHeadCell;
    public static Row = AdvancedTableRow;
    public static Body = AdvancedTableBody;
    public static Cell = AdvancedTableCell;

    public render(): JSX.Element {
        const { className, children, fullWidth, ...props } = this.props;
        const containerStyle = fullWidth ? { width: "100%" } : {};
        return (
            <div className={cn("container")} style={containerStyle}>
                <table className={cn(className)} {...props}>
                    {children}
                </table>
            </div>
        );
    }
}
