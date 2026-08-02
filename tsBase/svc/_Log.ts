import { appendFile } from "fs/promises";
import _Date from "./_Date";
import _Fun from "./_Fun";

export default class _Log {

    //log folder name
    private static folder = "_log";

    //log file name format
    private static fileFormat = "yyyy-MM-dd";

    static async infoA(msg:string) {
        await this.logFileA(this.getFilePath("info"), msg);
    }

    static async error(msg:string) {
        await this.logFileA(this.getFilePath("error"), msg);
    }

    private static getDir():string {
        return _Fun.dirRoot + this.folder;
    }

    private static getFilePath(type: string): string {
        return `${this.getDir()}/${_Date.format(new Date(), this.fileFormat)}-${type}.txt`;
    }    

    static async logFileA(path: string, msg: string) {
        if (!msg) return;

        const loops = 5;
        for (let i = 0; i < loops; i++) {
            try {
                if (!msg.endsWith("\n")) {
                    msg += "\n";
                }

                const time = new Date().toLocaleTimeString("zh-TW", {
                    hour12: false
                });

                const text = `${time}(${i}); ${msg}`;
                await appendFile(path, text, "utf8");
                break;
            }
            catch {
                if (i < loops - 1) {
                    await new Promise(r => setTimeout(r, 100));
                } else {
                    // throw new Error(`LogFile() failed: ${path}`);
                }
            }
        }
    }
}
