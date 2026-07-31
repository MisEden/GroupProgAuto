import axios from "axios"
//import _Fun from "./_Fun"

//ajax call(use axios) for client only !!
//for Playwright 前端不顯示視窗 ex: _Tool
export default class _Ajax {

    //後端api url, 必須先設定
    private static apiUrl:string = '';

    static async init(apiUrl:string) {
        _Ajax.apiUrl = apiUrl;
    }  

    /**
     * axios responseType: text,json,document(xml),arraybuffer,blob,ms-stream,(沒有number!!)
     * @param url 
     * @param jsonIn (false) input arg is json or not
     * @param data input json data
     * @returns 
     */
    static async getStrA(url:string, jsonIn = false, data = {}):Promise<StrN> {
        let config = _Ajax.getConfig(url, jsonIn, data, 'T');
        return await _Ajax.rpcA(config, false);
    }   

    /**
     * get json result
     * @param url 
     * @param jsonIn (false)json input or not
     * @param data (null) input data
     */
    static async getJsonA(url:string, jsonIn = false, data = {}):Promise<Json> {
        let config = _Ajax.getConfig(url, jsonIn, data, 'J');
        return await _Ajax.rpcA(config, true);
    }   

    /**
     * get json result
     * @param url 
     * @param jsonIn (false)json input or not
     * @param data (null) input data
     */
    static async getJsonsA(url:string, jsonIn = false, data = {}):Promise<Json[]> {
        let config = _Ajax.getConfig(url, jsonIn, data, 'J');
        return await _Ajax.rpcA(config, true);
    }   

    /**
     * get axios config
     * @param url 
     * @param jsonIn 
     * @param data 
     * @param returnType T(text), J(json),B(binary)
     * @returns 
     */
    static getConfig(url:string, jsonIn:boolean, data:object, returnType:string):any {
        //必須宣告為any type
        let config:any = {
            baseURL: _Ajax.apiUrl,
            url: url,
            method: 'post',
            //timeout: 1000,  //milliseconds     
            responseType: (returnType=='J') ? 'json' : 
            (returnType=='B') ? 'arraybuffer' :
            'text',
            withCredentials: true,  //also send cookie
        };
        if (jsonIn){
            config.data = data;
            config.headers = {
                'Content-Type': 'application/json; charset=UTF-8',
                //"Access-Control-Allow-Origin": "*",
            };
        } else {
            config.params = data;
            config.headers = {
                'Content-Type': 'application/text; charset=UTF-8',
                //"Access-Control-Allow-Origin": "*",
            };
        }

        //add jwt token if need
        //_AjaxBase.headerAddJwt(config);
        //if (_Ajax._token)
        //    config.headers['Authorization'] = 'Bearer ' + _Ajax._token;
        return config;
    }

    //remote call
    //jsonOut: return json or not
    static async rpcA(config:any, jsonOut:boolean):Promise<any> {
        let result = await axios(config)
            .catch(err => {
                console.log('error:');
                //會返回外層, 不是直接離開函數 !!
                //console.log(err); //browser會自動log error
                let msg = 'Can not Call Back-End Function.';                
                let data = jsonOut
                    ? { ErrorMsg: msg }     //for json
                    : msg;  //for text
                return { data: data };
            });

        //case of ok
        return result?.data;
    }

} //class


