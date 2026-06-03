import { IconArrowCDownRegular16 } from "@skbkontur/icons/IconArrowCDownRegular16";
import { IconCounterRegular16 } from "@skbkontur/icons/IconCounterRegular16";
import { DropdownMenu, Link, MenuItem } from "@skbkontur/react-ui";
import type { ReactElement } from "react";

interface CountOfRecordsSelectorProps {
    count: number;
    onChange: (x0: number) => void;
}

export const CountOfRecordsSelector = ({
    count: currentCount,
    onChange,
}: CountOfRecordsSelectorProps): ReactElement => {
    const renderLinkDropdownItem = (count: number): ReactElement | null => {
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
                    rightIcon={<IconArrowCDownRegular16 align="baseline" />}
                    icon={<IconCounterRegular16 align="baseline" />}>
                    {currentCount} записей на странице
                </Link>
            }>
            {[20, 50, 100].map(renderLinkDropdownItem)}
        </DropdownMenu>
    );
};
