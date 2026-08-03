import { chromium, Browser, BrowserContext } from 'playwright';
import fs from 'fs';


//const authFile = './auth/user.json';


export default class _Browser {

    static async openChrome(chromePath:string, showChrome:boolean, authPath:string, loginUrl:string):
            Promise<{ browser: Browser, context: BrowserContext }> {

        const browser = await chromium.launch({
            executablePath: chromePath,
            headless: !showChrome,
            slowMo: 100 // 開發時方便
        });

        let context: BrowserContext;
        if (fs.existsSync(authPath)) {
            //console.log('使用已有登入狀態');
            context = await browser.newContext({
                storageState: authPath
            });
        } else {
            //console.log('第一次執行，需要人工登入');
            context = await browser.newContext();
            const page = await context.newPage();
            await page.goto(loginUrl);

            /*
            console.log(`
            =============================
            請人工登入網站
            登入完成後按 Resume
            =============================
            `);
            */

            await page.pause();
            await context.storageState({
                path: authPath
            });

            //console.log('登入狀態已保存');
        }

        return {
            browser,
            context
        };
    }
}

