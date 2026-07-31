import { test, expect } from '@playwright/test';
import _Config from '@base/svc/_Config';
import ConfigDto from '@hire/ConfigDto';
import WriteComp from '@hire/BaseWrite';
import _Json from '@base/svc/_Json';
import Write104 from '@hire/Write104';

/*
test.use({
    storageState: 'auth/DbAdm.json'
});
*/

const project = 'Hire';
test('CRUD查詢測試', async ({ page }) => {

    //要寫入的人資公司資料, 對應src/Mapxxx, 分別為104,1111,Soc(社工專協),Tw(台灣就業通)
    //const comps = ['104','1111','Soc','Tw'];
    //const compFts = ['.page-container','1111','Soc','Tw'];  //filter

    //read config
    //const config = _Config.read<ConfigDto>('Hire.config.json');
    const config = _Json.readFileA(`src/Config.json`) as Json;

    //讀取 GroupProg 資料
    const rows = [{aa:'aa'}];
    
    if (rows == null || rows.length == 0)
        return;

    const rowLen = rows.length;

    //write
    const apiUrl = config.apiUrl;
    //const siteUrl = config['url' + compCode];
    let okRow;
    okRow = await new Write104('104', config.url104, page, apiUrl).writeA(rows);
    //okRow = await new Write1111('1111', config.url1111, page, apiUrl).writeA(rows);
    //okRow = await new WriteSoc('Soc', config.urlSoc, page, apiUrl).writeA(rows);
    //okRow = await new WriteTw('Tw', config.urlTw, page, apiUrl).writeA(rows);

    //check
    expect(okRow == rowLen).toBeTruthy();

});
