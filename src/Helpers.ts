export class Helpers {
  public static getTimeDisplay(durationdecimal: number): string {
    const duration = parseFloat(durationdecimal.toString() || '0').toFixed(2);
    const timeParts = duration.split('.');
    const minutes = Math.round(parseFloat('0.' + timeParts[1]) * 60);

    let prettyPrint = (timeParts[0] || '0') + ':';
    prettyPrint += ((minutes < 10) ? ('0' + minutes) : minutes);

    if (prettyPrint === '0:00') {
      prettyPrint = '';
    }

    return prettyPrint;
  }

  public static getAplhaDay(numericDay: number) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[numericDay];
  }
}
