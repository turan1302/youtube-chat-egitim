import {action, makeAutoObservable, observable} from "mobx";
import cryptoJS from 'crypto-js';
import {jwtDecode} from "jwt-decode";
import sign from 'jwt-encode';

class AuthStore{
    appState = null;

    constructor() {
        makeAutoObservable(this,{
            appState : observable,
            saveToken : action,
            getToken : action,
            removeToken : action,
        })
    }

    saveToken = (appState)=>{
        try {
            localStorage.setItem("appState",cryptoJS.AES.encrypt(sign(appState,"secret"),"chat").toString());
            this.appState = appState;
        }catch (e) {
            console.log(e);
        }
    }

    getToken = ()=>{
        try {
            const appStateData = localStorage.getItem("appState");
            if (appStateData){
                const bytes = cryptoJS.AES.decrypt(appStateData,"chat");
                const originalText = bytes.toString(cryptoJS.enc.Utf8);
                this.appState = jwtDecode(originalText);
            }else{
                this.appState = null;
            }
        }catch (e) {
            console.log(e);
        }
    }

    removeToken = ()=>{
        try {
           localStorage.removeItem("appState");
        }catch (e) {
            console.log(e);
        }
    }
}

export default new AuthStore();
