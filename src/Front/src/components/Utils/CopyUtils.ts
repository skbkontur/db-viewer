import copy from "copy-to-clipboard";
import trim from "lodash/trim";

export function copyObject(object: any): void {
  const result = JSON.stringify(object, null, 4) || "null";
  copy(trim(result, `"`));
}
