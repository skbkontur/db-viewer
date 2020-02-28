import * as React from "react";
import { LinkDropdown } from "ui";

import CellsEqualHeightIcon from "@skbkontur/react-icons/CellsEqualHeight";

interface CountOfRecordsSelectorProps {
    count: number;
    onChange: (x0: number) => void;
}

const LinkDropdownMenuItem = LinkDropdown.MenuItem;

export class CountOfRecordsSelector extends React.Component<CountOfRecordsSelectorProps> {
    public renderLinkDropdownItem = (count: number): null | string | JSX.Element => {
        if (count === this.props.count) {
            return null;
        }
        return (
            <LinkDropdownMenuItem
                onClick={() => this.props.onChange(count)}
                key={`${count}Items`}
                data-tid={`${count}Items`}>
                {count}
            </LinkDropdownMenuItem>
        );
    };

    public render(): JSX.Element {
        return (
            <LinkDropdown
                renderTitle={() => (
                    <span>
                        <CellsEqualHeightIcon />
                        {` ${this.props.count}`} записей на странице
                    </span>
                )}
                data-tid="ActionsLinkDropdown">
                {[20, 50, 100].map(this.renderLinkDropdownItem)}
            </LinkDropdown>
        );
    }
}
