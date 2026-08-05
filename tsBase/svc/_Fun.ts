import path from "path";

//static class
export default class _Fun {

    //=== constant start ===
    //傳入moment.js 的固定日期格式(moment.js語法, 與c#處理格式相同)
    //static readonly MmDateFmt = 'YYYY/MM/DD';
    //static readonly MmDtFmt = 'YYYY/MM/DD HH:mm:ss';

    //whether add class when input validate ok 
    static readonly AddValidClass = false;

    //field id for edit rows
    static readonly FidRows = '_rows';         //[{}..]
    static readonly FidChilds = '_childs';     //[{}..]
    static readonly FidDeletes = '_deletes';   //欄位內容為字串(逗號分隔), 不是[]
    static readonly FidFkey = '_fkeyfid';      //配合CrudEdit.cs FkeyFid
    static readonly FidIsNew = '_isNew';       //(multiple)row is new or not
    static readonly FidFileJson = '_fileJson'; //fileJson same to _FunApi.cs, 內容為server fid-row key


    static appName = '';     //system name from config
    //static apiUrl:string;   //api url, no right slash

    //權限範圍, match c#, 0(無),1(ctrl),2(action),3(row)
    static dirRoot:string; 

    //中間傳遞變數
    static temp:Json;    

    static init() {
        //加斜線??
        this.dirRoot = process.cwd() + '\\';
    }

} //class