export class StringUtils {
  public static lowerCaseFirstLetter(s: string) {
    if (!s) {
      return s;
    }
    return s[0].toLowerCase() + s.substring(1);
  }
  public static upperCaseFirstLetter(s: string) {
    if (!s) {
      return s;
    }
    return s[0].toUpperCase() + s.substring(1);
  }
}
