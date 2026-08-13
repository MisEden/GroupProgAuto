import { test, expect } from '@playwright/test';
import _Config from '@base/svc/_Config';
//import ConfigDto from '@hire/ConfigDto';
//import WriteComp from '@hire/BaseWrite';
import _Json from '@base/svc/_Json';
import Write104 from '@hire/Write104';
import _Fun from '@base/svc/_Fun';

/*
test.use({
    storageState: 'auth/DbAdm.json'
});
*/

test.setTimeout(180_000); // 整個測試最多 3 分鐘

_Fun.init();

const project = 'Hire';
test('CRUD查詢測試', async ({ page }) => {

    //read config
    //const config = _Config.read<ConfigDto>('Hire.config.json');
    const config = _Json.readFileA(`src/Hire/Config.json`) as Json;

    //讀取 GroupProg 資料
    //#region 假資料
const rows = [
  {
    "roleId": "全職",
    "jobName": "資深軟體工程師",
    "minimum":1,
    "maximum":5,
    "unlimit": false,
    "jobcat": "軟體工程師",
    "description": "負責企業 Web 系統開發、維護與 AI 功能整合。",
    "salaryType": "月薪",
    "salaryLow": 70000,
    "salaryHigh": 100000,
    "salaryIsAbove": false,
    "addrNo": "台北市大安區",
    "address": "萬和街8號4樓",
    "calcRemoteWork": false,
    "remoteWorkOption": "部分遠端",
    "freeKeyRemoteDescription": "每週可遠端工作2天。",
    "industoryArea": "",
    "manage": "4人以下",
    "businessTrip": false,
    "expatriate": false,
    "holiday": "依公司規定",
    "onboardDate": "一個月內",
    "graduate": true,
    "daySchoolStudent": false,
    "nightSchoolStudent": false,
    "RDSS": true,
    "diaspora": true,
    "foreigner": true,
    "indigenous": true,
    "newImmigrants": true,
    "reEnterWorkforce": true,
    "middleAged": true,
    "middleOldAge": false,
    "advancedAge": false,
    "rehabilitated": false,
    "intern": false,
    "disablesType": "自閉症",
    "disablesDegree": "輕度",
    "proof": false,
    "experience": "1年以上",
    "belowHighSchool": false,
    "highSchool": false,
    "juniorCollege": false,
    "bachelor": true,
    "master": true,
    "doctor": false,
    "majors": "資訊工程、資訊管理、電機相關",
    "tools": "Git, Docker, Visual Studio, VS Code",
    "skills": "ASP.NET Core、C#、TypeScript、SQL、Playwright",
    "licenses": "",
    "otherCondition": "具團隊合作精神，熟悉 Git Flow。",
    "departments": "資訊管理處",
    "contacter": "王小明",
    "emails": "hr@example.com",
    "replyDays": "3天",
    "noReply": true,
    "through104": true,
    "receiveResumeEmail": true,
    "importVipResume": true,
    "call": false,
    "phoneArea": "02",
    "phone": "27881234",
    "ext": "1234",
    "cellphone": "0912345678",
    "personally": false,
    "applyAddrNo": "",
    "applyAddr": "",
    "otherChannel": false,
    "note": "",
    "autoclose": "自動關閉",
    "subscript": "不收配對信"
    /*
    */
  }
];    
    //#endregion

    if (rows == null || rows.length == 0)
        return;

    const rowLen = rows.length;

    //要寫入的人資公司資料, 對應src/Mapxxx, 分別為104,1111,Soc(社工專協),Tw(台灣就業通)
    //write
    const apiUrl = config.apiUrl;
    //const siteUrl = config['url' + compCode];
    let okRow;
    okRow = await new Write104(0, '104', page, config).writeA(rows);
    //okRow = await new Write1111(1, '1111', config.url1111, page, apiUrl).writeA(rows);
    //okRow = await new WriteSoc(2, 'Soc', config.urlSoc, page, apiUrl).writeA(rows);
    //okRow = await new WriteTw(3, 'Tw', config.urlTw, page, apiUrl).writeA(rows);

    //check
    expect(okRow == rowLen).toBeTruthy();

});
