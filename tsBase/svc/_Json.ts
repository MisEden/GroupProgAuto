import { readFile } from "fs/promises";

export default class _Json {

    /**
     * read json file
     * @param fileName 
     * @returns 
     */
    static async readFileA(filePath: string): Promise<Json | Json[]> {
        const json = await readFile(filePath, 'utf8');
        return JSON.parse(json);
    }
}