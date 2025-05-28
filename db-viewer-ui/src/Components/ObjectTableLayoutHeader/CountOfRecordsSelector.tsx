import { ArrowCDownIcon16Regular } from "@skbkontur/icons/icons/ArrowCDownIcon/ArrowCDownIcon16Regular";
import { CounterIcon16Regular } from "@skbkontur/icons/icons/CounterIcon/CounterIcon16Regular";
import { DropdownMenu, Link, MenuItem } from "@skbkontur/react-ui";
import React from "react";

interface CountOfRecordsSelectorProps {
    count: number;
    onChange: (x0: number) => void;
}

export const CountOfRecordsSelector = ({
    count: currentCount,
    onChange,
}: CountOfRecordsSelectorProps): React.ReactElement => {
    const renderLinkDropdownItem = (count: number): React.ReactElement | null => {
        if (count === currentCount) {
            return null;
        }
        return (
            <MenuItem onClick={() => onChange(count)} key={`${count}Items`} data-tid={`${count}Items`}>
                {count}
            </MenuItem>
        );
    };

    return (
        <DropdownMenu
            data-tid="CountDropdown"
            menuWidth={200}
            caption={
                <Link
                    data-tid="CurrentCount"
                    rightIcon={<ArrowCDownIcon16Regular align="baseline" />}
                    icon={<CounterIcon16Regular align="baseline" />}>
                    {currentCount} записей на странице
                </Link>
            }>
            {[20, 50, 100].map(renderLinkDropdownItem)}
        </DropdownMenu>
    );
};
