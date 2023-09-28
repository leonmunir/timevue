declare global {
    interface Window {
        nlapiGetFieldValue(fieldId: string): string;
        nlapiSetFieldValue(fieldId: string, value: string): void;
        nlapiDateToString(value: Date): string;
    }
};

class DateRange {
  public startDate: Date = new Date();
  public endDate: Date = new Date();
}

export class Datasource {
    // When developing locally use Mockoon app and copy-paste Suitelet data in Mockoon
    private static datasourceUrl = (window.location.href.includes('localhost')) ?
        'http://localhost:9715/timevue?' : '/app/site/hosting/scriptlet.nl?';
    private static searchParams = new URLSearchParams('script=customscript_slweeklytimesheetservice&deploy=1');

    public static getListSourceUrl() {
      const employeeId = typeof window.parent.nlapiGetFieldValue === 'function' ?
        window.parent.nlapiGetFieldValue('employee') : '';

        this.searchParams.set('employeeid', employeeId);
        this.searchParams.set('action', 'listsource');
        return this.datasourceUrl + this.searchParams.toString();
    }

    public static getTimesheetDataUrl(strDate?: string) {
      const employeeId = typeof window.parent.nlapiGetFieldValue === 'function' ?
        window.parent.nlapiGetFieldValue('employee') : '';

      const weekDate = typeof window.parent.nlapiGetFieldValue === 'function' ?
        window.parent.nlapiGetFieldValue('trandate') : '';

        this.searchParams.set('action', 'timesheet');
        this.searchParams.set('employeeid', employeeId);

        strDate ? this.searchParams.set('weekof', strDate) :
            this.searchParams.set('weekof', weekDate);

        return this.datasourceUrl + this.searchParams.toString();
    };

    public static updateHiddenJsonField(json: string): void {
      if(typeof window.parent.nlapiGetFieldValue === 'function'){
        window.parent.nlapiSetFieldValue('custpage_timesheetdata', json);
      }
    }

  /**
   * Get Week Date range from Suitelet Date field.
   */
  public static getWeekDateRange(): DateRange {
      const range = new DateRange();

      const dateParts: string[] = String(window.parent.nlapiGetFieldValue('trandate')).split('/');
      range.startDate = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]));

      const enddate = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]));
      enddate.setDate(enddate.getDate() + 6);
      range.endDate = enddate;

      return range;
    }
}
