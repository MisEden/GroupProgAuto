import dayjs from "dayjs";

export default class _Date {

    private static dateFormat = "YYYY-MM-DD";

    static toDateStr(date: Date):string {
        return dayjs(date).format(this.dateFormat);
    }
}
