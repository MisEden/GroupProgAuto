import _Ajax from '@base/svc/_Ajax';
import BaseWrite from './BaseWrite';

/**
 * 將 GroupProg 的求職資料逐筆寫入 104，成功後才回寫 GroupProg。
 *
 * 104 的 selector 與欄位名稱與網站職缺表單有關，放在
 * `config/Hire.104.fields.json`，避免它們散落在程式中。
 */
export default class Write104 extends BaseWrite {

    async fnInit() {
        //this.form = ;
    }

    async fnToEditFormA(jobName:string):Promise<boolean> {
        //檢查職務是否已經刋登
        //移動到修改職務url
        //移動到新增職務url
        return true;
    }

    async fnClickSaveA():Promise<boolean> {
        //click save

        //check save result 

        return true;
        //const data = { id: id, type: this.compCode };
        //const status = await _Ajax.getStrA('/api/SetHire', false, data);

            /*
            try {

                await this.page.locator(map.saveSelector).click();
                await this.assertSaved(map);
                await this.callback(config.apiUrl, map, row);
                okLen++;
            } catch (error) {
                // 單筆失敗不可中斷後續資料；保留 row 方便工作紀錄追查。
                console.error('寫入 104 失敗，已略過此筆資料。', { row, error });
            }
            */

    }

}
