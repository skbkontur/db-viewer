import { resolvePath } from "react-router-dom";

export class RouteUtils {
    public static backUrl = (path: string): string => (path.endsWith("/") ? ".." : resolvePath("..", path).pathname);

    public static goTo = (path: string, url: string): string => `${path}/${url}`.replace("//", "/");
}
