import { ColumnStack, Fit, RowStack } from "@skbkontur/react-stack-layout";
import React from "react";

import { AllowCopyToClipboard } from "../AllowCopyToClipboard";

interface ObjectKey {
    name: string;
    value: string;
}

interface ObjectKeysProps {
    keys: ObjectKey[];
}

export function ObjectKeys({ keys }: ObjectKeysProps) {
    return (
        <ColumnStack block gap={2}>
            {keys.map(x => (
                <Fit key={x.name}>
                    <RowStack gap={2}>
                        <Fit style={{ minWidth: 140 }}>{x.name}:</Fit>
                        <Fit>
                            <AllowCopyToClipboard data-tid={x.name}>{x.value}</AllowCopyToClipboard>
                        </Fit>
                    </RowStack>
                </Fit>
            ))}
        </ColumnStack>
    );
}
