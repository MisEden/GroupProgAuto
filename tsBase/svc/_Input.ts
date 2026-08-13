import type { Locator } from '@playwright/test';
import _Obj from './_Obj';

export type InputValue = string | boolean | string[] | null | undefined;

export default class _Input {

    /**
     * 依控制項種類設定欄位值。
     *
     * `null`、`undefined` 可清空文字/選取/檔案欄位；checkbox 則視為未勾選。
     */
    static async setA(fid: string, value: InputValue, box: Locator) {
        const obj = _Obj.get(fid, box);
        await this.setOA(obj, value);
    }

    static async setOA(obj: Locator, value: InputValue) {
        await obj.fill('', { force: true });    //先清除
        await obj.fill(value == null ? '' : String(value), { force: true });
        /*
        const info = await obj.evaluate(elm => {
            const input = elm as HTMLInputElement;
            const select = elm as HTMLSelectElement;
            return {
                tag: elm.tagName,
                type: elm instanceof HTMLInputElement ? input.type.toLowerCase() : '',
                multiple: elm instanceof HTMLSelectElement && select.multiple,
            };
        });

        switch (info.tag) {
            case 'SELECT':
                // selectOption([]) 會清除選取項目，亦適用於多選欄位。
                await obj.selectOption(value == null ? [] : Array.isArray(value) ? value : String(value));
                return;
            case 'TEXTAREA':
                await obj.fill(value == null ? '' : String(value));
                return;
            case 'BUTTON':
                await obj.click();
                return;
            case 'INPUT':
                await _Input.setInputA(obj, info.type, value);
                return;
            default:
                // Playwright 的 fill 也支援 contenteditable 元素。
                await obj.fill(value == null ? '' : String(value));
        }
        */
    }

        /*
    private static async setInputA(obj: Locator, type: string, value: InputValue) {
        switch (type) {
            case 'checkbox':
                if (_Input.toBoolean(value))
                    await obj.check();
                else
                    await obj.uncheck();
                return;
            case 'radio':
                // radio 無法安全地「取消單一選項」；應改選同群組的另一個 radio。
                if (!_Input.toBoolean(value))
                    throw new Error('radio 欄位只能設定為選取狀態。');
                await obj.check();
                return;
            case 'file':
                await obj.setInputFiles(value == null ? [] : Array.isArray(value) ? value : String(value));
                return;
            case 'hidden':
                // hidden 欄位無法用使用者操作填入，需同步觸發一般表單監聽事件。
                await obj.evaluate((el, newValue) => {
                    const input = el as HTMLInputElement;
                    input.value = newValue;
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                }, value == null ? '' : String(value));
                return;
            case 'button':
            case 'submit':
            case 'reset':
            case 'image':
                await obj.click();
                return;
            default:
                // text、password、number、date、time、datetime-local、range、color 等皆以 fill 處理。
                await obj.fill(value == null ? '' : String(value));
        }
    }
    */

    static toBoolean(value: InputValue): boolean {
        if (typeof value === 'boolean')
            return value;
        if (value == null)
            return false;
        if (Array.isArray(value))
            return value.length > 0;

        return !['', '0', 'false', 'off', 'no', 'n'].includes(value.trim().toLowerCase());
    }

    static get(fid: string, box: Locator): Locator {
        return box.locator(`[data-fid="${fid}"]`);
    }

    static getByName(fid: string, box: Locator): Locator {
        return box.locator(`[name="${fid}"]`);
    }

    static async isHideA(field: Locator): Promise<boolean> {
        return (await field.getAttribute('type') == 'hidden');
    }
}
