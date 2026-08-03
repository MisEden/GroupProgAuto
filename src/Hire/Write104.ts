import _Ajax from '@base/svc/_Ajax';
import BaseWrite from './BaseWrite';
import _Browser from '@base/svc/_Browser';

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
        const loginUrl = 'https://bsignin.104.com.tw/login';
        const info = await _Browser.openChrome(this.config.chromePath, true, './auth/104.json', loginUrl);
        this.page = info.context.pages()[0];

        //檢查職務是否已經刋登
        const url = `https://vip.104.com.tw/job/allJobList?page=1&kws=${jobName}`;
        await this.page.goto(url);

        //check result
        //this.page.locator('.all-job-list')
        const table = this.page.locator('.all-job-list-table tbody');
        const row = table.locator('tr', {
            has: this.page.getByRole('link', {
                name: '系統分析師-軟體中心'
            })
        });

        if (await row.count() == 0) {
            //新增, 移動到新增空白職務url
            await this.page.goto('https://vip.104.com.tw/job/jobinsert?act=new');
        } else {
            //修改, 移動到修改職務url
            await row.locator('a[data-qa-id="edit"]').click();
        }
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
