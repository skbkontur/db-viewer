import * as React from "react";
import ReactDom from "react-dom";
import "ui/styles/reset.less";
import "ui/styles/typography.less";
import { WindowUtils } from "Commons/DomUtils";

import { RootEntryPoint } from "./RootEntryPoint";

ReactDom.render(<RootEntryPoint />, WindowUtils.getElementByIdToRenderApp("content"));
