import { ArrowShapeTriangleADownIcon16Regular } from "@skbkontur/icons/ArrowShapeTriangleADownIcon16Regular";
import { CounterIcon16Regular } from "@skbkontur/icons/CounterIcon16Regular";
import { DropdownMenu, Link, MenuItem } from "@skbkontur/react-ui";
import React from "react";

interface CountOfRecordsSelectorProps {
    count: number;
    onChange: (x0: number) => void;
}

export class CountOfRecordsSelector extends React.Component<CountOfRecordsSelectorProps> {
    public renderLinkDropdownItem = (count: number): null | string | React.ReactElement => {
        if (count === this.props.count) {
            return null;
        }
        return (
            <MenuItem onClick={() => this.props.onChange(count)} key={`${count}Items`} data-tid={`${count}Items`}>
                {count}
            </MenuItem>
        );
    };

    public render(): React.ReactElement {
        return (
            <DropdownMenu
                data-tid="CountDropdown"
                menuWidth={200}
                caption={
                    <Link data-tid="CurrentCount" icon={<CounterIcon16Regular />}>
                        {this.props.count} записей на странице
                        {"\u00A0"}
                        <ArrowShapeTriangleADownIcon16Regular />
                    </Link>
                }>
                {[20, 50, 100].map(this.renderLinkDropdownItem)}
            </DropdownMenu>
        );
    }
}
