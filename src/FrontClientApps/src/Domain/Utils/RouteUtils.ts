import { RouteComponentProps } from "react-router";

export class RouteUtils {
    public static backUrl(props: RouteComponentProps) {
        return props.match.url.endsWith("/") ? ".." : ".";
    }

    public static goTo(path: string, url: string): string {
        return `${path}/${url}`.replace("//", "/");
    }
}
