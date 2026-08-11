import { chromium, Browser, BrowserContext, Page, Locator } from 'playwright';
import { existsSync, mkdirSync } from 'fs';
import { dirname, resolve } from 'path';
import _Time from './_Time';



export default class _Browser {

    //private static browser: Browser | null = null;
    //private static context: BrowserContext | null = null;

    //static page: Page | null = null;
    //private readonly statePath = 'playwright/.auth/state.json';

    //static async chromeLogin(chromePath:string, showChrome:boolean, authPath:string, 
    static async chromeLogin(authPath:string, loginUrl:string, checkUrl:string, skips:string[]): 
            Promise<Page|null> {

        // Keep the authentication file independent of the process working directory.
        // `storageState({ path })` does not create its parent directory itself.
        const authFile = resolve(authPath);
        const browser = await chromium.launch({
            channel: 'chrome',
            //executablePath: chromePath,
            headless: false,
            slowMo: 100 // 開發時方便
        });
        //await _Time.sleep(2);

        //let context: BrowserContext;
        let context: BrowserContext | null = null;
        let page: Page | null = null;
        let autoLogin = false;
        const loginAct = this.getUrlAct(loginUrl);
        const hasAuth = existsSync(authFile);
        if (hasAuth) {
            context = await browser!.newContext({ storageState: authFile });
            page = await context.newPage();
            await page.goto(checkUrl);
            if (_Browser.urlFind(page.url(), loginAct)) {
                //cookie過期, 重新登入
                page.close();
                context.close();
                context = null;
            } else {
                //如果網址不是login表示成功自動登入, 否則為cookie過期
                autoLogin = true;
            }
        }

        if (!autoLogin) {
            context = await browser.newContext();
            //加上這一段才能避免被偵測到是自動化程式 !!
            await context.addInitScript(() => {
                Object.defineProperty(navigator, 'webdriver', {
                    get: () => undefined,
                });
            });

            page = await context.newPage();
            await page.goto(loginUrl);
            
            //todo: temp add
            await page.locator('[name="email"]').fill('14700@eden.org.tw');
            await page.locator('[name="password"]').fill('ede0home66');
            await page.locator('[data-qa-id="loginButton"]').click();

            //出現非登入頁面表示成功登入
            await page.waitForURL(
                url => !url.toString().includes(loginAct),
                { timeout: 180_000 },
            );

            //await page.pause();
            //mkdirSync(dirname(authFile), { recursive: true });
            await context.storageState({ path: authFile });
        }

        //skip some forms
        if (skips.length > 0)
            await this.skipForms(page!, skips);

        //檢查登入結果
        /*
        if (page!.url() != checkUrl){
            await page!.goto(checkUrl);
            if (page!.url() != checkUrl) {
                page!.close();
                context!.close();
                context = null;
            }
        }
        */
        return page;
    }

    //check url has text or not
    static urlFind(url:string, find:string): boolean {
        return url.includes(find);
    }

    //讀取 url後面的action
    static getUrlAct(urlStr: string): string {
        const url = new URL(urlStr);
        const parts = url.pathname.split('/').filter(Boolean);
        return parts.at(-1) ?? '';
    }

    private static async skipForms(page:Page, skips:string[]) {
        const urlLen = skips.length;
        for (let i=0; i<5; i++){
            let find = false;
            for (let j=0; j<urlLen; j+=3){
                let oldUrl = page.url();
                if (_Browser.urlFind(oldUrl, skips[j])){
                    const label = skips[j+2];
                    if (label == ''){
                        await page.locator(skips[j+1]).click();
                    } else {
                        await page.locator(skips[j+1], { hasText: label }).click();
                    }

                    //等待換頁再繼續
                    find = true;
                    await page.waitForURL(
                        url => url.toString() != oldUrl,
                        { timeout: 180_000 },
                    );
                }
            }
            if (!find) break;
        }
    }
}

