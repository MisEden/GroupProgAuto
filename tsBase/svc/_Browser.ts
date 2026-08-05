import { chromium, Browser, BrowserContext, Page } from 'playwright';
import { existsSync, mkdirSync } from 'fs';
import { dirname, resolve } from 'path';
import _Time from './_Time';



export default class _Browser {

    private static browser: Browser | null = null;
    private static context: BrowserContext | null = null;

    static page: Page | null = null;
    //private readonly statePath = 'playwright/.auth/state.json';

    //static async chromeLogin(chromePath:string, showChrome:boolean, authPath:string, 
    static async chromeLogin(authPath:string, loginUrl:string): 
            Promise<{page:Page, autoLogin:boolean}> {
            //Promise<{ browser: Browser, context: BrowserContext }> {

        //debugger;
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
        if (existsSync(authFile)) {
            context = await browser!.newContext({ storageState: authFile });
            page = await context.newPage();
            autoLogin = true;
        } else {
            context = await browser.newContext();
            //加上這一段才能避免被偵測到是自動化程式 !!
            await context.addInitScript(() => {
                Object.defineProperty(navigator, 'webdriver', {
                    get: () => undefined,
                });
            });

            page = await context.newPage();
            //this.page = this.context.pages()[0] ?? await this.context.newPage();
            await page.goto(loginUrl);
            //await _Time.sleep(2);
            
            //todo: temp add
            await page.locator('[name="email"]').fill('14700@eden.org.tw');
            //await _Time.sleep(2);            
            await page.locator('[name="password"]').fill('ede0home66');
            //await _Time.sleep(2);
            page.locator('[data-qa-id="loginButton"]').click();

            //await this.page.pause();

            //await page.pause();
            //mkdirSync(dirname(authFile), { recursive: true });
            await context.storageState({ path: authFile });
        }
        return { page, autoLogin };
        /*{
            //browser: this.browser,
            browser: this.browser,
            context: this.context
        };
        */
    }

    //check url has text or not
    static urlFind(page:Page, find:string): boolean {
        return page.url().includes(find);
    }
}

