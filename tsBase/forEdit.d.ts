/**
 * for IDE 檢查typeScript語法
 * 個別套件做法不同:
 *  moment: UMD套件, tsconfig 加 allowUmdGlobalAccess: true
 *  Mustache: @types/mustache 已有 export as namespace Mustache, 不需要 global.d.ts 宣告
 *  chart: 是 ES Module，不提供 global namespace, 在 global.d.ts 宣告
 */

//沒有提供 @types 的第3方套件要手動加入宣告 type
//import dayjsLib, { Dayjs as DayjsType } from "dayjs";
//import type { Chart as ChartType2 } from "chart.js";

/*
import type {
    Svg as SvgType, Path as PathType, Text as TextType,
    Point as PointType, G as GType, Circle as CircleType, Rect as RectType,
    Element as ElementType, Line as LineType
} from '@svgdotjs/svg.js';

//for svg draggable 
declare module '@svgdotjs/svg.js' {
    //svg 的基底類別
    interface Element {
        draggable(): this;
    }
}
*/

declare global {
    //#region 自定型別
    type StrN = string | null;
    type StrNum = string | number;
    type StrNumB = string | number | boolean;
    type StrNumN = string | number | null;
    type NumN = number | null;
    type BoolN = boolean | null;
    type AnyN = any | null;
    type Json = { [key: string]: any };     //key為字串, value為任意值
    type JsonN = Json | null;
    //type JQueryN = JQuery | null;
    type Elm = HTMLElement;
    type ElmN = HTMLElement | null;
    type FnN = Function | null;
    type FnVoidN = ((result: any) => void) | null;
    //type OneMany = EditOne | EditMany;
    //type EvtClick = JQuery.ClickEvent;
    //#endregion 

    /*
    //chart: Chart為變數, ChartType為型別
    const Chart: typeof ChartType2;  //for js 執行的全域變數宣告
    type ChartType = ChartType2;     //左右相同會出現TS2456   
    
    //dayjs 取代 moment
    type Dayjs = DayjsType; //for ts 編譯的型別宣告    
    const dayjs: typeof dayjsLib;   //Day.js global object (window.dayjs)

    //pajx: 只有個別檔案使用, 所以用any

    //#region SVG type
    type Svg = SvgType;
    type SvgPath = PathType;
    type SvgText = TextType;    //避開衝突
    type SvgPoint = PointType;
    type SvgGroup = GType;
    type SvgCircle = CircleType;
    type SvgRect = RectType;
    type SvgElm = ElementType;
    type SvgLine = LineType;
    //#endregion 
    */

    //擴充 Window 型別
    interface Window {

        /*
        _aa: Json,  //暫存變數
        _xp: XpVo,
        _me: MeDto,
        _vo: Json,
        _BR: BaseResDto,
        */
    }

    /*
    //告訴 TypeScript 這些變數的型別是什麼
    let _aa: Json;
    let _xp: XpVo;
    let _me: MeDto;
    let _vo: Json;
    let _BR: BaseResDto;
    */
}
export { };
