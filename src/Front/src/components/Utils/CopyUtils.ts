import copy from "copy-to-clipboard";

export function copyObject(object: any): void {
  const result = JSON.stringify(object, null, 4) || "null";
  copy(result);
}
