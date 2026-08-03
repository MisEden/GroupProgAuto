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

    debugger;
    //read config
    //const config = _Config.read<ConfigDto>('Hire.config.json');
    const config = _Json.readFileA(`src/Hire/Config.json`) as Json;

    //讀取 GroupProg 資料
    //#region 假資料
const rows = [
  {
    "roleId": "全職",
    "jobName": "資深全端軟體工程師",
    "minimum": 1,
    "maximum": 3,
    "unlimit": false,
    "jobcat": "軟體工程師",
    "description": "負責企業 Web 系統開發、維護與 AI 功能整合。",
    "salaryType": "月薪",
    "salaryLow": 70000,
    "salaryHigh": 100000,
    "salaryIsAbove": false,
    "addrNo": "台北市內湖區",
    "address": "瑞光路100號10樓",
    "calcRemoteWork": true,
    "remoteWorkOption": "部分遠端",
    "freeKeyRemoteDescription": "每週可遠端工作2天。",
    "industoryArea": "",
    "manage": "不需負擔管理責任",
    "businessTrip": false,
    "expatriate": false,
    "holiday": "週休二日",
    "onboardDate": "一個月內",
    "graduate": true,
    "daySchoolStudent": false,
    "nightSchoolStudent": false,
    "RDSS": true,
    "diaspora": true,
    "foreigner-外籍人士": true,
    "indigenous": true,
    "newImmigrants": true,
    "reEnterWorkforce": true,
    "middleAged": true,
    "middleOldAge": false,
    "advancedAge": false,
    "rehabilitated": false,
    "intern": false,
    "disablesType": "",
    "disablesDegree": "",
    "proof": false,
    "experience": "3年以上",
    "belowHighSchool": false,
    "highSchool": false,
    "juniorCollege": false,
    "bachelor": true,
    "master": true,
    "doctor-博士": false,
    "majors": "資訊工程、資訊管理、電機相關",
    "tools": "Git, Docker, Visual Studio, VS Code",
    "skills": "ASP.NET Core、C#、TypeScript、SQL、Playwright",
    "licenses": "",
    "otherCondition": "具團隊合作精神，熟悉 Git Flow。",
    "departments": "資訊管理處",
    "contacter": "王小明",
    "emails": "hr@example.com",
    "replyDays": "7天內",
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
    "autoclose": "30天",
    "subscript": true
  }
];    
    //#endregion

    if (rows == null || rows.length == 0)
        return;

    const rowLen = rows.length;

    //write
    const apiUrl = config.apiUrl;
    //const siteUrl = config['url' + compCode];
    let okRow;
    okRow = await new Write104('104', page, config).writeA(rows);
    //okRow = await new Write1111('1111', config.url1111, page, apiUrl).writeA(rows);
    //okRow = await new WriteSoc('Soc', config.urlSoc, page, apiUrl).writeA(rows);
    //okRow = await new WriteTw('Tw', config.urlTw, page, apiUrl).writeA(rows);

    //check
    expect(okRow == rowLen).toBeTruthy();

});
