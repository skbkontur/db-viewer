// tslint:disable
import { ApiError } from "./ApiError";
import 'whatwg-fetch'

interface ParamsMap {
  [key: string]: null | undefined | number | string | any[] | boolean;
}

export default class ApiBase {
  public static additionalHeaders: RequestInit = {
    headers: {
      ["Cache-Control"]: "no-cache, no-store",
      ["Pragma"]: "no-cache",
      ["Expires"]: "0",
      ["Content-Type"]: 'application/json',
    },
    ["credentials"]: "same-origin",
  };
  public prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  public async checkStatus(response: Response): Promise<void> {
    if (!(response.status >= 200 && response.status < 300)) {
      const errorText = await response.text();
      let serverResponse;
      try {
        serverResponse = JSON.parse(errorText);
      } catch (e) {
        serverResponse = null;
      }
      if (serverResponse != null) {
        throw new ApiError(
          errorText,
          serverResponse.message,
          response.status,
          serverResponse.type,
          serverResponse.stackTrace,
          serverResponse.innerErrors
        );
      }
      throw new ApiError(errorText, "Unexpected error format", response.status);
    }
  }

  public async post(url: string, body: null | undefined | {} | null | undefined | any[]): Promise<any> {
    const response = await fetch(this.prefix + url, {
      ...ApiBase.additionalHeaders,
      method: "POST",
      body: JSON.stringify(body),
    });
    await this.checkStatus(response);
    const textResult = await response.text();
    if (textResult !== "") {
      return JSON.parse(textResult);
    }
    return undefined;
  }

  public async put(url: string, body: null | undefined | {} | any[]): Promise<any> {
    const response = await fetch(this.prefix + url, {
      ...ApiBase.additionalHeaders,
      method: "PUT",
      body: JSON.stringify(body),
    });
    await this.checkStatus(response);
    const textResult = await response.text();
    if (textResult !== "") {
      return JSON.parse(textResult);
    }
    return undefined;
  }

  public createQueryString(params: null | undefined | ParamsMap): string {
    if (params == null) {
      return "";
    }
    const params2 = params;
    let result = Object.keys(params)
      .map(key => {
        const value = params2[key];
        if (typeof value === "string") {
          return encodeURIComponent(key) + "=" + encodeURIComponent(value);
        }
        if (typeof value === "number" || typeof value === "boolean") {
          return encodeURIComponent(key) + "=" + encodeURIComponent(value.toString());
        }
        if (Array.isArray(value)) {
          return value
            .map(item => {
              if (typeof item === "string") {
                return encodeURIComponent(key) + "=" + encodeURIComponent(item);
              }
              if (typeof item === "number") {
                return encodeURIComponent(key) + "=" + encodeURIComponent(item.toString());
              }
              return null;
            })
            .filter(x => x !== null)
            .join("&");
        }
        return null;
      })
      .filter(x => x !== null)
      .join("&");
    result = result ? "?" + result : "";
    return result;
  }

  public async get(url: string, params?: ParamsMap): Promise<any> {
    const response = await fetch(this.prefix + url + this.createQueryString(params), {
      ...ApiBase.additionalHeaders,
      method: "GET",
    });
    await this.checkStatus(response);
    const result = await response.json();
    return result;
  }

  public getUrl(url: string, params?: ParamsMap): string {
    return this.prefix + url + this.createQueryString(params);
  }

  public async delete(url: string, body: {}): Promise<any> {
    const response = await fetch(this.prefix + url, {
      ...ApiBase.additionalHeaders,
      method: "DELETE",
      body: JSON.stringify(body),
    });
    await this.checkStatus(response);
    const textResult = await response.text();
    if (textResult !== "") {
      return JSON.parse(textResult);
    }
    return undefined;
  }

  public async head(url: string, params?: ParamsMap): Promise<any> {
    const response = await fetch(this.prefix + url + this.createQueryString(params), {
      ...ApiBase.additionalHeaders,
      method: "HEAD",
    });
    return response.status >= 200 && response.status < 300;
  }

  public async download(url: string, params?: ParamsMap): Promise<any> {
    const headResult = await this.head(url, params);
    if(headResult) {
      location.href = this.prefix + url + this.createQueryString(params);
    } else {
      return await this.get(url, params);
    }
  }

  public async toApiResponse(requestFunc : () => Promise<any>) : Promise<any>{
    try {
      const res = await requestFunc();
      return {
        success: true,
        response: res,
      };
    } catch (e) {
      if (e instanceof ApiError) {
        if(e.statusCode == 400) {
          return {
            success: false,
            error: JSON.parse(e.responseAsText),
          };
        }
      }
      throw e;
    }
  }
}
