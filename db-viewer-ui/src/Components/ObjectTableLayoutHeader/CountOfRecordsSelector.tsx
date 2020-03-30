import ArrowTriangleDownIcon from "@skbkontur/react-icons/ArrowTriangleDown";
import CellsEqualHeightIcon from "@skbkontur/react-icons/CellsEqualHeight";
import DropdownMenu from "@skbkontur/react-ui/DropdownMenu";
import Link from "@skbkontur/react-ui/Link";
import MenuItem from "@skbkontur/react-ui/MenuItem";
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
                menuWidth={200}
                caption={
                    <Link icon={<CellsEqualHeightIcon />}>
                        {this.props.count} записей на странице
                        {"\u00A0"}
                        <ArrowTriangleDownIcon />
                    </Link>
                }>
                {[20, 50, 100].map(this.renderLinkDropdownItem)}
            </DropdownMenu>
        );
    }
}
