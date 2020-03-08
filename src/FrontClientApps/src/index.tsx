import React from "react";
import ReactDom from "react-dom";

import "./styles/reset.less";
import "./styles/typography.less";

import { AdminToolsEntryPoint } from "./AdminToolsEntryPoint";

ReactDom.render(<AdminToolsEntryPoint />, document.getElementById("content"));
