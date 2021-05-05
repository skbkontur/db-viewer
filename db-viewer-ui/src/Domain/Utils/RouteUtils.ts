import { match } from "react-router";

export class RouteUtils {
    public static backUrl(match: match<{}>) {
        return match.url.endsWith("/") ? ".." : ".";
    }

    public static goTo(path: string, url: string): string {
        return `${path}/${url}`.replace("//", "/");
    }
}
