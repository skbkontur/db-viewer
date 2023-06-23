import { ArrowShapeTriangleADownIcon } from "@skbkontur/icons/esm/icons/ArrowShapeTriangleADownIcon";
import { CounterIcon } from "@skbkontur/icons/esm/icons/CounterIcon";
import { DropdownMenu, Link, MenuItem } from "@skbkontur/react-ui";
import React from "react";

interface CountOfRecordsSelectorProps {
    count: number;
    onChange: (x0: number) => void;
}

export class CountOfRecordsSelector extends React.Component<CountOfRecordsSelectorProps> {
    public renderLinkDropdownItem = (count: number): null | string | JSX.Element => {
        if (count === this.props.count) {
            return null;
        }
        return (
            <MenuItem onClick={() => this.props.onChange(count)} key={`${count}Items`} data-tid={`${count}Items`}>
                {count}
            </MenuItem>
        );
    };

    public render(): JSX.Element {
        return (
            <DropdownMenu
                data-tid="CountDropdown"
                menuWidth={200}
                caption={
                    <Link data-tid="CurrentCount" icon={<CounterIcon />}>
                        {this.props.count} записей на странице
                        {"\u00A0"}
                        <ArrowShapeTriangleADownIcon />
                    </Link>
                }>
                {[20, 50, 100].map(this.renderLinkDropdownItem)}
            </DropdownMenu>
        );
    }
}
