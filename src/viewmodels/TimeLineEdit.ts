import {RecordRef} from "@/models/RecordRef";
import {TimeEntry} from "@/models/TimeEntry";

export class TimeLineEdit {
  public id:number = -1;
  public customer: RecordRef = new RecordRef();
  public feeQuote: RecordRef = new RecordRef();
  public item: RecordRef = new RecordRef();
  public task: RecordRef = new RecordRef();
  public memo: string = '';
  public billable: boolean = true;
  public timebill0: TimeEntry = new TimeEntry();
  public timebill1: TimeEntry = new TimeEntry();
  public timebill2: TimeEntry = new TimeEntry();
  public timebill3: TimeEntry = new TimeEntry();
  public timebill4: TimeEntry = new TimeEntry();
  public timebill5: TimeEntry = new TimeEntry();
  public timebill6: TimeEntry = new TimeEntry();
}
