import { CopyIcon16Regular } from "@skbkontur/icons/CopyIcon16Regular";
import { Link, Toast } from "@skbkontur/react-ui";
import copy from "copy-to-clipboard";
import React, { PropsWithChildren } from "react";

import { StringUtils } from "../Domain/Utils/StringUtils";

export class CopyToClipboardToast {
    public static copyText(value: string): void {
        copy(value);
        Toast.push("Скопировано в буфер");
    }
}

export const AllowCopyToClipboard = ({ children }: PropsWithChildren<{}>): React.JSX.Element => {
    const childrenRef = React.useRef<HTMLSpanElement | null>(null);

    const handleCopy = (): void => {
        if (childrenRef.current && !StringUtils.isNullOrWhitespace(childrenRef.current.innerText)) {
            CopyToClipboardToast.copyText(childrenRef.current.innerText);
        }
    };
    return (
        <span>
            <span ref={childrenRef}>{children}</span>
            <Link icon={<CopyIcon16Regular />} onClick={handleCopy} />
        </span>
    );
};
