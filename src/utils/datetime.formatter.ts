import { GridCellValue } from "@material-ui/data-grid";

export function formatter(date: GridCellValue) {
    let formattedDatetime = '';
    if (date) {
        const dateTime = new Date(date.toString());
        const month = dateTime.getMonth() + 1;
        let monthTxt = '';
        switch (month) {
            case 1:
                monthTxt = 'Jan';
                break;
            case 2:
                monthTxt = 'Feb';
                break;
            case 3:
                monthTxt = 'Mar';
                break;
            case 4:
                monthTxt = 'Apr';
                break;
            case 5:
                monthTxt = 'May';
                break;
            case 6:
                monthTxt = 'Jun';
                break;
            case 7:
                monthTxt = 'Jul';
                break;
            case 8:
                monthTxt = 'Aug';
                break;
            case 9:
                monthTxt = 'Sep';
                break;
            case 10:
                monthTxt = 'Oct';
                break;
            case 11:
                monthTxt = 'Nov';
                break;
            case 12:
                monthTxt = 'Dec';
                break;
            default:
                break;
        }
        const dayInMonth = dateTime.getDate();
        const year = dateTime.getFullYear();
        const hour = dateTime.getHours();
        const minutes = dateTime.getMinutes();
        formattedDatetime = dayInMonth + ' ' + monthTxt + ', ' + year + ' ' + hour + ':' + minutes;
    }
    return formattedDatetime;
}