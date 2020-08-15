import CopyIcon from "@skbkontur/react-icons/Copy";
import Link from "@skbkontur/react-ui/Link";
import Toast from "@skbkontur/react-ui/Toast";
import copy from "copy-to-clipboard";
import React, { PropsWithChildren } from "react";

import { StringUtils } from "../Domain/Utils/StringUtils";

export class CopyToClipboardToast {
    public static copyText(value: string): void {
        copy(value);
        Toast.push("Скопировано в буфер");
    }
}

export class AllowCopyToClipboard extends React.Component<PropsWithChildren<{}>> {
    public children: null | HTMLSpanElement = null;

    public render(): JSX.Element {
        return (
            <span>
                <span ref={x => (this.children = x)}>{this.props.children}</span>{" "}
                <Link icon={<CopyIcon />} onClick={this.handleCopy} />
            </span>
        );
    }

    private readonly handleCopy = () => {
        if (this.children && !StringUtils.isNullOrWhitespace(this.children.innerText)) {
            CopyToClipboardToast.copyText(this.children.innerText);
        }
    };
}
