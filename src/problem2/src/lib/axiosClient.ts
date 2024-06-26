import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

interface IClient {
    post<T, R>(path: string, data: T): Promise<R>;
    get<R>(path: string): Promise<R>;
    put<T, R>(path: string, data: T): Promise<R>;
}

type ClientConstructorProps = {
    baseURL: string;
    path?: string;
}


export class Client implements IClient {
    private baseURL: string;
    private axiosInstance: AxiosInstance;

    constructor(props?: ClientConstructorProps) {
        const { baseURL, path } = props || {};
        const pathName = path || "";
        const baseURLName = baseURL || "";
        this.axiosInstance = axios.create({
            baseURL: baseURLName + pathName,
            timeout: 60000,
            params: {},
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            }
        });
        this.baseURL = baseURLName;
    }

    setBaseURL(url: string) {
        this.baseURL = url
        this.axiosInstance.defaults.baseURL = url
    }
    setPath(path: string) {
        const baseURL = this.axiosInstance.defaults.baseURL || ""
        if (baseURL !== this.baseURL) {
            this.axiosInstance.defaults.baseURL = this.baseURL
        }
        this.axiosInstance.defaults.baseURL = baseURL + path
    }

    setApiKey(key: string, value: string) {
        this.axiosInstance.defaults.params[key] = value
    }

    setHeader(key: string, value: string) {
        this.axiosInstance.defaults.headers.common[key] = value
    }

    setToken(token: string) {
        this.axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    setBasicAuth(username: string, password: string) {
        this.axiosInstance.defaults.headers.common["Authorization"] = 'Basic ' + btoa(username + ':' + password)
    }
    async post<T, R>(path: string, data: T) {
        const response = await this.axiosInstance.post<R>(path, data);
        return response.data;
    }
    async get<R>(path: string, config?: AxiosRequestConfig) {
        const response = await this.axiosInstance.get<R>(path, config);
        return response.data;
    }

    async put<T, R>(path: string, data: T) {
        const response = await this.axiosInstance.put<R>(path, data);
        return response.data;
    }
}