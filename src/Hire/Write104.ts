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

    async fnLoginA(): Promise<boolean> {
        const loginUrl = 'https://bsignin.104.com.tw/login';
        //https://bsignin.104.com.tw/login
        //const login2Url = 'https://vip.104.com.tw/rms/index';
        //const checkUrl = 'https://bsignin.104.com.tw/product'
        const checkUrl = 'https://vip.104.com.tw/rms/index';
        //const page = await _Browser.chromeLogin(this.config.chrome, true, './auth/104.json', loginUrl, login2Url);
        const info = await _Browser.chromeLogin(`./auth/${this.compCode}.json`, loginUrl);
        this.page = info.page;
        //this.page = info.context.pages()[0];
        //this.page = await info.context.newPage();

        //debugger;
        if (info.autoLogin){
            await this.initForm(checkUrl);
        } else {
            //check 是否登入成功, 留3分鐘給使用者操作
            await this.page.waitForURL(checkUrl, { timeout: 180_000 });
        }

        return true;
    }

    private async initForm(toUrl:string) {
        await this.page.goto(toUrl);
        if (_Browser.urlFind(this.page, 'switchCompany'))
            await this.page.locator('button').click();
        if (_Browser.urlFind(this.page, 'repeatLogin'))
            await this.page.getByRole('button', { name: /立即登入/ }).click();

    }


    async fnToEditFormA(jobName:string):Promise<boolean> {
        //檢查職務是否已經刋登
        const url = `https://vip.104.com.tw/job/allJobList?page=1&kws=${jobName}`;
        await this.page.goto(url);

        //check result
        //this.page.locator('.all-job-list')
        const table = this.page.locator('.all-job-list-table tbody');
        const row = table.locator('tr', {
            has: this.page.getByRole('link', {
                //name: '系統分析師-軟體中心'
                name: jobName
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
