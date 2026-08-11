import _Ajax from '@base/svc/_Ajax';
import BaseWrite from './BaseWrite';
import _Browser from '@base/svc/_Browser';
import { Locator } from '@playwright/test';

/**
 * 將 GroupProg 的求職資料逐筆寫入 104，成功後才回寫 GroupProg。
 *
 * 104 的 selector 與欄位名稱與網站職缺表單有關，放在
 * `config/Hire.104.fields.json`，避免它們散落在程式中。
 */
export default class Write104 extends BaseWrite {

    async fnLoginA(): Promise<boolean> {
        const loginUrl = 'https://bsignin.104.com.tw/login';
        const checkUrl = 'https://vip.104.com.tw/rms/index';
        const skips = [
            'product', 'a img', '',
            'switchCompany', 'button', '確認',
            'repeatLogin', 'button', '立即登入'
        ];
        //const page = await _Browser.chromeLogin(this.config.chrome, true, './auth/104.json', loginUrl, login2Url);
        this.page = await _Browser.chromeLogin(`./auth/${this.compCode}.json`, loginUrl, checkUrl, skips);
        //this.page = info.context.pages()[0];
        //this.page = await info.context.newPage();

        /*
        //debugger;
        if (info.autoLogin){
            await this.initForm(checkUrl);
        } else {
            //check 是否登入成功, 留3分鐘給使用者操  作
            await this.page!.waitForURL(checkUrl, { timeout: 180_000 });
        }
        */

        return true;
    }

    //set radio checked
    async fnSetRadioA(box: Locator, fid: string, label: string):Promise<void> {
        //外層label, 內層input
        //await box.locator(`label:has-text("${label}") input[name="${fid}"]`).check();
        //const filter = `label:has-text("${label}") input[name="${fid}"]`;
        const filter = `div[name="${fid}"]`;
        await box.locator(filter)
            .filter({hasText:label})
            .click({ force: true });

        /*
        const filter = `label:has-text("${label}") input[name="${fid}"]`;
        const field = box.locator(filter);
        const fieldLen = await field.count();
        const isSee = await field.first().isVisible();
        await field.first().check();
        */
    }    

    async fnSetCheckA(field:Locator, status:boolean): Promise<void> {
        const len = await field.count();
        if (status) {
            await field.check({ force: true });
        } else {
            await field.uncheck({ force: true });
        }
    }

    async fnSetSelectA(field:Locator, text:string): Promise<void>{
        //const field = page.locator('div.dropdown[name="autoclose"]');
        await field.locator('button.dropdown-toggle').click();
        await field.getByRole('menuitem', { name: text, exact: true }).click();        
    }

    //自定義欄位
    async fnSetCustomA(fid:string, field:Locator, value:string): Promise<void>{
        switch (fid) {
            case 'addrNo':
                await this.setAddrNoA(field, value);
                break;
            default:
                throw new Error(`fnSetCustomA not support fid: ${fid}`);
        }
    }

    private async setAddrNoA(field:Locator, value:string): Promise<void>{
        await field.click({ force: true });

        // 清除目前已選的項目
        const modal = this.page!.locator('.category-picker__modal-dialog');
        await modal.locator('button.remove-all-btn').click();

        // 再選擇新的地區
        await modal.getByText(value, { exact: true }).click();

        await modal.locator('button', {
            hasText: '確定'
        }).click();
        /*
        const btnLen = await btn.count();

        await modal.getByRole('button', {
            name: '確定', exact: true
        }).click();
        */
    }

    private async setSelect2A(field:Locator, value:string): Promise<void>{
        //const page = this.page!;
        await field.click({ force: true });
        await field.getByRole('menuitem', {
            name: value,
            exact: true
        }).click();
    }
    
    async fnToEditFormA(jobName:string):Promise<boolean> {
        //檢查職務是否已經刋登
        const page = this.page!;
        const url = `https://vip.104.com.tw/job/allJobList?page=1&kws=${jobName}`;
        await page.goto(url);

        //check result
        //this.page.locator('.all-job-list')
        const table = page.locator('.all-job-list-table tbody');
        const row = table.locator('tr', {
            has: page.getByRole('link', {
                //name: '系統分析師-軟體中心'
                name: jobName
            })
        });
        

        if (await row.count() == 0) {
            //新增, 移動到新增空白職務url
            await this.page!.goto('https://vip.104.com.tw/job/jobinsert?act=new');
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
