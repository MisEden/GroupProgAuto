//import {ApNameSt} from '../store/ApNameSt';
//import _AjaxBase from './_AjaxBase';
//import _Locale from './_Locale';

//static class
export default class _Fun {

    //=== constant start ===
    //傳入moment.js 的固定日期格式(moment.js語法, 與c#處理格式相同)
    static readonly MmDateFmt = 'YYYY/MM/DD';
    static readonly MmDtFmt = 'YYYY/MM/DD HH:mm:ss';

    //whether add class when input validate ok 
    static readonly AddValidClass = false;

    //field id for edit rows
    static readonly FidRows = '_rows';         //[{}..]
    static readonly FidChilds = '_childs';     //[{}..]
    static readonly FidDeletes = '_deletes';   //欄位內容為字串(逗號分隔), 不是[]
    static readonly FidFkey = '_fkeyfid';      //配合CrudEdit.cs FkeyFid
    static readonly FidIsNew = '_isNew';       //(multiple)row is new or not
    static readonly FidFileJson = '_fileJson'; //fileJson same to _FunApi.cs, 內容為server fid-row key

    //input invalid class name of bootstrap5
    static readonly InvalidClass = 'is-invalid';

    //class name for hide element in RWD phone
    static readonly HideRwd = 'xg-hide-rwd';

    //default view cols for layout(row div, label=2, input=3)(horizontal)
    static readonly DefHoriCols = [2,3];

    static readonly FadeTime = {duration:500};
    //=== constant end ===


    static appName = '';     //system name from config
    //static apiUrl:string;   //api url, no right slash

    //權限範圍, match c#, 0(無),1(ctrl),2(action),3(row)
    static authType:number; 

    //權限字串 from c#
    static authStrs = '';

    static hasPwd = false;

    //每頁default筆數
    static pageRows = 10;

    /**
     * 子畫面reload時(會進入 login form)
     * called by crudR.initA()
     */ 
    //static fnCrudRPreInitA:Function = null;

    //中間傳遞變數
    static temp:Json;    

    //static async init(apiUrl:string, locale:string = 'zh-TW'):Promise<void> {
    //static initStatus = false;
    /**
     * 進行系統初始化
     * @param authType 權限種類: 0(無),1(ctrl),2(action),3(row)
     * @param locale 語系, 預設為 zh-TW
     * @returns config.json內容
     */
    static async initA(authType:number, locale='zh-TW'):Promise<any> {
        try {
            const response = await fetch('/config.json');
            if (!response.ok)
              throw new Error('Failed to load config.json.');
            
            let json = await response.json();
            _AjaxBase.init(json.apiUrl); //important !!
            _Fun.appName = json.apName;
            _Fun.authType = authType;
    
            //ApNameSt.set(apName);   //在ts 靜態函數中必須使用.set()來設定!!
            document.title = _Fun.appName;
            await _Locale.setBrA(locale);   //立刻讀取    
            return json;
        } catch (error) {
            console.error('Failed to load config.json:', error);
            //fileContent = "Error loading file content.";
            return null;
        }      

        //_Fun.initStatus = true;
    }

} //class