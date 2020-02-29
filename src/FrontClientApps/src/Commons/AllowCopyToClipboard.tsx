import copy from "copy-to-clipboard";
import * as React from "react";

import CopyIcon from "@skbkontur/react-icons/Copy";
import Link from "@skbkontur/react-ui/Link";
import Toast from "@skbkontur/react-ui/Toast";

export class CopyToClipboardToast {
    public static timeout: null | NodeJS.Timer = null;

    public static copyText(value: string) {
        if (this.timeout) {
            clearTimeout(this.timeout);
            Toast.close();
        }
        copy(value);
        Toast.push("Скопировано в буфер");
        this.timeout = setTimeout(() => {
            Toast.close();
        }, 1000);
    }
}

export class AllowCopyToClipboard extends React.Component<{ children?: any }> {
    public timeout: Nullable<NodeJS.Timer> = null;
    public children: null | HTMLSpanElement = null;

    public handleCopy() {
        const childrenElement = this.children;
        if (childrenElement != null) {
            if (childrenElement.innerText != null && childrenElement.innerText !== "") {
                if (this.timeout) {
                    clearTimeout(this.timeout);
                }
                copy(childrenElement.innerText);
                Toast.push("Скопировано в буфер");
                this.timeout = setTimeout(() => {
                    Toast.close();
                }, 1000);
            }
        }
    }

    public render(): JSX.Element {
        const { children } = this.props;

        return (
            <span>
                <span ref={x => (this.children = x)}>{children}</span>{" "}
                <Link icon={<CopyIcon />} onClick={() => this.handleCopy()} />
            </span>
        );
    }
}
