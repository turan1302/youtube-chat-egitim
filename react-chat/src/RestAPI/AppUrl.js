class AppUrl{
    static baseURL = "http://127.0.0.1:8000";
    static apiURL = "http://127.0.0.1:8000/api";


    // client
    static login = this.apiURL+"/client/login";
    static register = this.apiURL+"/client/register";
    static logout = this.apiURL+"/client/logout";
    static check = this.apiURL+"/client/check";
    static profile = this.apiURL+"/client/profile";
}

export default AppUrl;
