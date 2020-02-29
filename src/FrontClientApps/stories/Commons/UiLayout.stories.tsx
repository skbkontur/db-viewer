import { storiesOf } from "@kadira/storybook";
import * as React from "react";
import { Fit } from "Commons/Layouts/Fit";
import { RowStack } from "Commons/Layouts/RowStack";

storiesOf(module).add("Default", () => (
    <RowStack baseline block gap={2}>
        <Fit>
            <div style={{ border: "1px solid #888", padding: 5 }}>Test 1</div>
        </Fit>
        <Fit>
            <div style={{ border: "1px solid #888", padding: 5 }}>Test 2</div>
        </Fit>
    </RowStack>
));
