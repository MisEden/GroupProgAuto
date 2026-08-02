import dayjs from "dayjs";

export default class _Date {

    static async format(date: Date, format: string) {
        return dayjs(date).format(format);
    }
}
