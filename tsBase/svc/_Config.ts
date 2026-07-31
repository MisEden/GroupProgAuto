import fs from 'fs';
import path from 'path';

export default class _Config {

    /**
     * 讀取組態檔並傳回 T 型態資料
     * @param fileName 
     * @returns 
     */
    static read<T>(fileName: string): T {

        const filePath = path.join(
            process.cwd(),
            'config',
            fileName
        );

        if (!fs.existsSync(filePath)) {
            throw new Error(
                `Config file not found: ${filePath}`
            );
        }

        const json = fs.readFileSync(
            filePath,
            'utf8'
        );

        return JSON.parse(json) as T;
    }
}