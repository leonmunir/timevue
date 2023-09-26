declare global {
    interface Window {
        nlapiGetFieldValue(fieldId: string): string;
        nlapiSetFieldValue(fieldId: string, value: string): void;
        nlapiDateToString(value: Date): string;
    }
};

export class Datasource {
    // When developing locally use Mockoon app and copy-paste Suitelet data in Mockoon
    private static datasourceUrl = (window.location.href.includes('localhost')) ?
        'http://localhost:9715/timevue?' : '/app/site/hosting/scriptlet.nl?';
    private static searchParams = new URLSearchParams('script=customscript_slweeklytimesheetservice&deploy=1');

    public static getListSourceUrl() {
      const employeeId = typeof window.nlapiGetFieldValue === 'function' ?
        window.nlapiGetFieldValue('employee') : '';

        this.searchParams.set('employeeid', employeeId);
        this.searchParams.set('action', 'listsource');
        return this.datasourceUrl + this.searchParams.toString();
    }

    public static getTimesheetDataUrl(strDate?: string) {
      const employeeId = typeof window.nlapiGetFieldValue === 'function' ?
        window.nlapiGetFieldValue('employee') : '';

      const weekDate = typeof window.nlapiGetFieldValue === 'function' ?
        window.nlapiGetFieldValue('trandate') : '';

        this.searchParams.set('action', 'timesheet');
        this.searchParams.set('employeeid', employeeId);

        strDate ? this.searchParams.set('weekof', strDate) :
            this.searchParams.set('weekof', weekDate);

        return this.datasourceUrl + this.searchParams.toString();
    };

    public static updateHiddenJsonField(json: string): void {
        window?.nlapiSetFieldValue('custpage_timesheetdata', json);
    }

    public getPreviousWeek(): string {
        return '';
    }
}
