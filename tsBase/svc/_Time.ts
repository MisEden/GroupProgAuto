
export default class _Time {

    static async sleep(seconds: number): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }
}
