class AppUrl{
    static baseURL = "http://127.0.0.1:8000";
    static apiURL = "http://127.0.0.1:8000/api";


    // client
    static login = this.apiURL+"/client/login";
    static register = this.apiURL+"/client/register";
    static logout = this.apiURL+"/client/logout";
    static check = this.apiURL+"/client/check";
    static profile = this.apiURL+"/client/profile";

    // home
    static home = this.apiURL+"/home";

    // message
    static search_receiver = this.apiURL+"/message/search-receiver";
    static get_messages = this.apiURL+"/message/get-messages";
    static send_message = this.apiURL+"/message/send-message";
    static update_read = this.apiURL+"/message/update-read";

}

export default AppUrl;
