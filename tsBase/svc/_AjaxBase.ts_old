import axios from "axios"

//ajax call(use axios)
//for both front & back-end(ssr) !!
export default class _AjaxBase {

    //error BR code, same to _Fun.PreBrError, fixed len to 2
    static readonly preBrError:string = 'B:';
    //pre string for error msg, same to c#
    static readonly preError:string = 'E:';

    //後端api url, 必須先設定
    static apiUrl:string = '';

    static async init(apiUrl:string) {
        _AjaxBase.apiUrl = apiUrl;
    }  

    /**
     * (async) get json result
     * @param url 
     * @param jsonIn (false)json input or not
     * @param data (null) input data
     * @param block (true) block ui or not
     */
    static async getJsonA(url:string, jsonIn = false, data = {}, block = false):Promise<any> {
        let config = _AjaxBase.getConfig(url, jsonIn, data, 'J');
        return await _AjaxBase.rpcA(config, true);
    }   

    /**
     * axios responseType: text,json,document(xml),arraybuffer,blob,ms-stream,(沒有number!!)
     * @param url 
     * @param jsonIn (false) input arg is json or not
     * @param data input json data
     * //@param block (false)
     * @returns 
     */
    static async getStrA(url:string, jsonIn = false, data = {}):Promise<string | null> {
        let config = _AjaxBase.getConfig(url, jsonIn, data, 'T');
        return await _AjaxBase.rpcA(config, false);
        /*
        let result = 
        if (result == null) return null;
        if (result.length > 2){
            if (result.substring(0,2) == _AjaxBase.PreError){
                _Tool.msg(result.substring(2));
                return null;    //important !!
            } else if (result.substring(0,2) == _AjaxBase.PreBrError){
                _Tool.msg(_AjaxBase.getBrMsg(result));
                return null;    //important !!
            }
        }
        //case else
        return result;
        */
    }   

    static isStrError(result:string):boolean {
        if (result.length > 2){
            let preStr = result.substring(0,2);
            return (preStr == _AjaxBase.preError || preStr == _AjaxBase.preBrError);
        } else {
            return false;
        }
    }

    static getJsonError(result:any):string {
        return (result && result.ErrorMsg)
            ? result.ErrorMsg
            : '';
    }

    /*
    // server return json file
    static async getJsonFileA(url:string):Promise<any> {
        let result = await axios.get(url);
        return result.data;
    }
    */

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
            baseURL: _AjaxBase.apiUrl,
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
                //會返回外層, 不是直接離開函數 !!
                //console.log(err); //browser會自動log error
                let msg = 'Can not Call Back-End Function.';                
                let data = jsonOut
                    ? { ErrorMsg: msg }     //for json
                    : _AjaxBase.preError + msg;  //for text
                return { data: data };
            });

        //case of ok
        return result?.data;
    }

} //class


