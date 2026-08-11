import { Locator, Page } from '@playwright/test';
import _Config from '@base/svc/_Config';
import _Input from '@base/svc/_Input';
import _Ajax from '@base/svc/_Ajax';
import _Json from '@base/svc/_Json';
import _Array from '@base/svc/_Array';
import _Log from '@base/svc/_Log';
import MapDto from 'src/MapDto';
import InputTypeEstr from '@base/enum/InputTypeEstr';

/**
 * 將 GroupProg 的求職資料逐筆寫入 104，成功後才回寫 GroupProg。
 *
 * 104 的 selector 與欄位名稱與網站職缺表單有關，放在
 * `config/Hire.104.fields.json`，避免它們散落在程式中。
 */
export default abstract class BaseWrite {

    idx: number;
    compCode: string;
    page: Page|null;
    config: Json;
    //apiUrl: string;
    //chromePath: string;

    //private siteUrl: string;
    private form!: Locator;
    private mapJsons!: MapDto[];

    //抽象方法，子類別必須實作
    //abstract fnInit(): void;
    abstract fnLoginA(): Promise<boolean>;
    abstract fnSetRadioA(box:Locator, fid:string, value: string): Promise<void>;
    abstract fnSetCheckA(field:Locator, status:boolean): Promise<void>;
    abstract fnSetSelectA(field:Locator, text:string): Promise<void>;
    abstract fnSetCustomA(fid:string, field:Locator, text:string): Promise<void>;
    abstract fnToEditFormA(jobName:string): Promise<boolean>;
    abstract fnClickSaveA(): Promise<boolean>;

    constructor(idx:number, compCode: string, page: Page, config: Json) {
        this.idx = idx;
        this.compCode = compCode;
        this.page = page;
        this.config = config;
        //this.apiUrl = apiUrl;
        //this.chromePath = chromePath;
    }

    /**
     * 登入 104、寫入 rows，並傳回完整成功且已回寫 GroupProg 的筆數。
     */
    async writeA(rows: Json[]): Promise<number> {

        //this.fnInit();
        //login
        await this.fnLoginA();

        //get mapJsons
        this.mapJsons = await _Json.readFileA(`src/Hire/Map${this.compCode}.json`) as MapDto[];

        //goto siteUrl(已事先登入)
        //await this.page.goto(this.siteUrl);

        //rows loop
        let okLen = 0;
        let errors:string[] = [];
        for (const row of rows) {
            //1.trigger fnWhenFillRowA
            if (!await this.fnToEditFormA(row.jobName)){
                errors.push(`fnToEditFormA failed: ${row.jobName}`);
                continue;
            }

            //fill row
            //let errors:string[] = [];
            await this.fillRowA(row, errors);

            //2.trigger fnAfterFillRowA
            if (!await this.fnClickSaveA()){
                errors.push(`fnClickSaveA failed: ${row.jobName}`);
                continue;
            }

            //update groupProg DB
            if (!await this.updateDbA(row.Id)){
                errors.push(`updateDbA failed: ${row.jobName}`);
                continue;
            }

            //todo: temp add
            //await this.page!.pause();
        }

        //write error report
        if (errors.length > 0)
            _Log.error(`${this.compCode} error: \n${_Array.toStr(errors, '\n')}`);
            
        return okLen;
    }

    async updateDbA(id: string): Promise<boolean> {
        //call API for update GroupProg(Id,CompType)
        const data = { id: id, type: this.compCode };
        return (await _Ajax.getStrA('/api/SetHire', false, data) == '1');
    }

    /*
    private resolveEnv(value: string): string {
        return value.replace(/\$\{([A-Z0-9_]+)\}/gi, (_match, name: string) => {
            const envValue = process.env[name];
            if (!envValue)
                throw new Error(`缺少環境變數 ${name}。`);
            return envValue;
        });
    }

    private async login(config: HireConfig, map: Write104Map): Promise<void> {
        if (!/^https?:\/\//i.test(config['104Url']))
            throw new Error('Hire.config.json 的 104Url 必須是有效的 http(s) 網址。');

        await this.page.goto(config['104Url']);
        await this.page.locator(map.login.accountSelector).fill(config['104Account']);
        await this.page.locator(map.login.passwordSelector).fill(config['104Pwd']);
        await this.page.locator(map.login.submitSelector).click();

        if (map.login.successSelector)
            await this.page.locator(map.login.successSelector).waitFor({ state: 'visible' });
    }
    */

    /**
     * 寫入一筆資料到網站
     * @param row 
     * @param errors by ref
     * @param uiErrFids by ref
     * @returns 
     */
    private async fillRowA(row: Json, errors:string[]): Promise<boolean> {
        let box = this.form ?? this.page;
        let ok = true;
        for (const map of this.mapJsons) {
            //如果沒有 srcFid 則 skip
            const fid = map.srcFid;
            if (fid == null) continue;

            //for debug
            if (fid == 'calcRemoteWork'){
                debugger;
            }

            if (fid.startsWith('_')){   
                //底線開頭欄位不處理
                continue;
            } else if (!(fid in row)){
                //如果row沒有此欄位則記錄fid
                ok = false;
                errors.push(`db no fid: ${fid}`);
            } else if (row[fid] == null){   
                //row有欄位值才處理
                continue;
            }

            //如果找不到欄位則記錄fid
            const field = box.locator(map.filter);
            const fieldLen = await field.count();
            if (fieldLen == 0){
                errors.push(`ui no filter: ${map.filter}`);
                ok = false;
            } else if (await _Input.isHideA(field.first())) {
                errors.push(`field hide: ${map.filter}`);
                ok = false;
            } else if (fieldLen > 1 && map.type != InputTypeEstr.Radio) {
                errors.push(`filter many: ${map.filter}`);
                ok = false;
                /*
            } else if (!(await field.first().isVisible()) && fid != 'businessTrip') {
                errors.push(`field hide: ${map.filter}`);
                ok = false;
                */
            } else {
                //case ok
                console.log(`fill ${fid}`);
                if (map.type == InputTypeEstr.Radio){
                    //const fid2 = '_' + fid;
                    const label = this.getRadioLabel(row[fid]);
                    await this.fnSetRadioA(box, fid, label);
                } else if (map.type == InputTypeEstr.Check){
                    const status = _Input.toBoolean(row[fid]);
                    await this.fnSetCheckA(field, status);
                } else if (map.type == InputTypeEstr.Select){
                    await this.fnSetSelectA(field, row[fid]);
                } else if (map.type == InputTypeEstr.Custom){
                    await this.fnSetCustomA(fid, field, row[fid]);
                } else {
                    try{
                        //console.log(`fill ${fid}`);
                        await _Input.setOA(field, row[fid]);
                    } catch (err: any) {
                        errors.push(`fill failed: ${err.message}`);
                        ok = false;
                    }
                }
            }
        }
        return ok;
    }

    private getRadioLabel(ext:string): string {
        if (ext == null || ext.trim() == '') return '';
        const labels = ext.split(',');
        if (this.idx >= labels.length) return '';
        return labels[this.idx].trim();
    }

    /*
    private async assertSaved(map: Write104Map): Promise<void> {
        if (map.successSelector) {
            await this.page.locator(map.successSelector).waitFor({ state: 'visible' });
            return;
        }
        if (map.successText) {
            await this.page.getByText(map.successText, { exact: false }).waitFor({ state: 'visible' });
            return;
        }
        throw new Error('欄位對照檔必須設定 successSelector 或 successText 以確認儲存結果。');
    }

    private async callback(defaultUrl: string, map: Write104Map, row: Json): Promise<void> {
        const callback = map.callback;
        const url = callback?.url ?? defaultUrl;
        if (!/^https?:\/\//i.test(url))
            throw new Error('GroupProg API URL 必須是有效的 http(s) 網址。');

        const data = callback?.body === 'wrapped' ? { row } : row;
        await axios.post(url, data);
    }
    */
}
