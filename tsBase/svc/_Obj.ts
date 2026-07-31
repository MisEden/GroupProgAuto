import { Locator, Page } from '@playwright/test';

export default class _Obj {

    static get(fid: string, box: Locator): Locator {
        return box.locator(`[data-fid="${fid}"]`);
    }

    static getByName(fid: string, box: Locator): Locator {
        return box.locator(`[name="${fid}"]`);
    }

    static getByFt(ft: string, box: Locator): Locator {
        return box.locator(ft);
    }
}