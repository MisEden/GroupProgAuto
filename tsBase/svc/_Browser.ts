import { chromium, Browser, BrowserContext } from 'playwright';
import { existsSync, mkdirSync } from 'fs';
import { dirname, resolve } from 'path';


//const authFile = './auth/user.json';


export default class _Browser {

    static async openChrome(chromePath:string, showChrome:boolean, authPath:string, loginUrl:string):
            Promise<{ browser: Browser, context: BrowserContext }> {

        debugger;
        // Keep the authentication file independent of the process working directory.
        // `storageState({ path })` does not create its parent directory itself.
        const authFile = resolve(authPath);
        const browser = await chromium.launch({
            executablePath: chromePath,
            headless: !showChrome,
            slowMo: 100 // 開發時方便
        });

        let context: BrowserContext;
        if (existsSync(authFile)) {
            //console.log('使用已有登入狀態');
            context = await browser.newContext({
                storageState: authFile
            });
        } else {
            //console.log('第一次執行，需要人工登入');
            context = await browser.newContext();
            const page = await context.newPage();
            await page.goto(loginUrl);

            await page.pause();
            mkdirSync(dirname(authFile), { recursive: true });
            await context.storageState({
                path: authFile
            });

            //console.log('登入狀態已保存');
        }

        return {
            browser,
            context
        };
    }
}

