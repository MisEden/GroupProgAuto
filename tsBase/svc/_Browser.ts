import { chromium, Browser, BrowserContext, Page } from 'playwright';
import { existsSync, mkdirSync } from 'fs';
import { dirname, resolve } from 'path';

//import { chromium, Browser as PWBrowser, BrowserContext, Page } from 'playwright';
import * as fs from 'fs';
import * as readline from 'readline';


//const authFile = './auth/user.json';


export default class _Browser {

    private static browser: Browser | null = null;
    private static context: BrowserContext | null = null;

    static page: Page | null = null;
    //private readonly statePath = 'playwright/.auth/state.json';

    static async chromeLogin(chromePath:string, showChrome:boolean, authPath:string, 
            loginUrl:string, login2Url:string): Promise<{ browser: Browser, context: BrowserContext }> {

        //this.browser = await chromium.launch({ headless });                

        /*
        // 2. 設定環境內容 (判斷是否載入 Session)
        if (fs.existsSync(authPath)) {
            console.log('--- 偵測到已存在的登入狀態，正在載入... ---');
            this.context = await this.browser.newContext({ storageState: authPath });
        } else {
            console.log('--- 建立全新瀏覽器環境 (未載入登入狀態) ---');
            this.context = await this.browser.newContext();
        }
        */

        //debugger;
        // Keep the authentication file independent of the process working directory.
        // `storageState({ path })` does not create its parent directory itself.
        const authFile = resolve(authPath);
        this.browser = await chromium.launch({
            executablePath: chromePath,
            headless: !showChrome,
            slowMo: 100 // 開發時方便
        });

        let context: BrowserContext;
        if (existsSync(authFile)) {
            //console.log('使用已有登入狀態');
            this.context = await this.browser!.newContext({
                storageState: authFile
            });
        } else {
            //console.log('第一次執行，需要人工登入');
            this.context = await this.browser.newContext();
            this.page = await this.context.newPage();
            await this.page.goto(loginUrl);

            //check 是否登入成功
            await this.page.waitForURL(login2Url);

            //await page.pause();
            mkdirSync(dirname(authFile), { recursive: true });
            await this.context.storageState({ path: authFile });

            //console.log('登入狀態已保存');
        }

        return {
            this.browser,
            this.context
        };
    }
}

