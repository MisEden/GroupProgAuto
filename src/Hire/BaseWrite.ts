import { Locator, Page } from '@playwright/test';
import _Config from '@base/svc/_Config';
import _Input from '@base/svc/_Input';
import _Ajax from '@base/svc/_Ajax';
import _Json from '@base/svc/_Json';
import _Array from '@base/svc/_Array';
import _Log from '@base/svc/_Log';

/**
 * 將 GroupProg 的求職資料逐筆寫入 104，成功後才回寫 GroupProg。
 *
 * 104 的 selector 與欄位名稱與網站職缺表單有關，放在
 * `config/Hire.104.fields.json`，避免它們散落在程式中。
 */
export default abstract class BaseWrite {

    compCode: string;
    page: Page;
    apiUrl: string;

    private siteUrl: string;
    private form!: Locator;
    private mapJsons!: Json[];

    //抽象方法，子類別必須實作
    abstract fnInit(): void;
    abstract fnToEditFormA(jobName:string): Promise<boolean>;
    abstract fnClickSaveA(): Promise<boolean>;

    constructor(compCode: string, apiUrl:string, page: Page, siteUrl:string) {
        this.compCode = compCode;
        this.page = page;
        this.apiUrl = apiUrl;
        this.siteUrl = siteUrl;
    }

    /**
     * 登入 104、寫入 rows，並傳回完整成功且已回寫 GroupProg 的筆數。
     */
    async writeA(rows: Json[]): Promise<number> {

        this.fnInit();
        this.mapJsons = await _Json.readFileA(`src/Map${this.compCode}.json`) as Json[];

        //goto siteUrl(已事先登入)
        await this.page.goto(this.siteUrl);

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
            let mapFids:string[] = [];
            let uiFids:string[] = [];
            if (await this.fillRowA(row, mapFids, uiFids)){
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
            } else {
                //3.任一必填欄位無法寫入時，略過整筆，不進行儲存或 API 回寫。
                if (mapFids.length > 0)
                    errors.push(`mapFid wrong: ${_Array.toStr(mapFids)}`);
                if (uiFids.length > 0)
                    errors.push(`uiFids wrong: ${_Array.toStr(uiFids)}`);
                continue;
            }
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
     * @param mapFids by ref
     * @param uiFids by ref
     * @returns 
     */
    private async fillRowA(row: Json, mapFids:string[], uiFids:string[]): Promise<boolean> {
        let box = this.form ?? this.page;
        //let mapFids:string[] = [];
        //let uiFids:string[] = [];
        let ok = true;
        for (const map of this.mapJsons) {
            //如果沒有 srcFid 則 skip
            const fid = map.srcFid;
            if (fid == null) continue;

            if (fid in row){
                //如果row沒有此欄位則記錄fid
                ok = false;
                mapFids.push(fid);
            } else if (row[fid] != null){   //row有欄位值才處理                
                //如果找不到欄位則記錄fid
                const field = box.locator(map.filter);
                if (field == null){
                    uiFids.push(fid);
                    ok = false;
                } else {
                    await _Input.setOA(field, row[fid]);
                }
            }
        }
        return ok;
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
