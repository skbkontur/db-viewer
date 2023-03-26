import DownloadIcon from "@skbkontur/react-icons/Download";
import { Button } from "@skbkontur/react-ui";
import React from "react";

import { Condition } from "../../Domain/Api/DataTypes/Condition";
import { Sort } from "../../Domain/Api/DataTypes/Sort";

import { Spinner } from "./Spinner";

interface DownloadButtonProps {
    action: string;
    conditions: Condition[];
    sorts: Sort[];
    hiddenColumns: string[];
}

export function DownloadButton({ action, conditions, sorts, hiddenColumns }: DownloadButtonProps): JSX.Element {
    const [downloading, setDownloading] = React.useState(false);
    return (
        <form method="post" action={action} onSubmit={e => console.info(e)}>
            <input
                type="hidden"
                name="data"
                value={JSON.stringify({
                    conditions: conditions,
                    sorts: sorts,
                    excludedFields: hiddenColumns,
                })}
            />
            <Button
                icon={downloading ? <Spinner /> : <DownloadIcon />}
                disabled={downloading}
                data-tid="DownloadLink"
                use="link"
                type="submit">
                Выгрузить всё в Excel
            </Button>
        </form>
    );
}
