declare module "*.less" {
    export default function cn(...args: Array<null | undefined | string | { [classname: string]: any }>): string;
}
