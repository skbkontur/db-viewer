import { AllowCopyToClipboard } from "@skbkontur/edi-ui";
import { ColumnStack, Fit, RowStack } from "@skbkontur/react-stack-layout";
import React from "react";

interface ObjectKey {
    name: string;
    value: string;
}

interface ObjectKeysProps {
    keys: ObjectKey[];
}

export const ObjectKeys = ({ keys }: ObjectKeysProps): React.JSX.Element => (
    <ColumnStack block gap={2}>
        {keys.map(({ name, value }) => (
            <Fit key={name}>
                <RowStack gap={2}>
                    <Fit style={{ minWidth: 140 }}>{name}:</Fit>
                    <Fit>
                        <AllowCopyToClipboard data-tid={name}>{value}</AllowCopyToClipboard>
                    </Fit>
                </RowStack>
            </Fit>
        ))}
    </ColumnStack>
);
