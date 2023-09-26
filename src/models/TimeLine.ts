import {TimeEntry} from "@/models/TimeEntry";
import {ITimeEntry} from "@/models/ITimeEntry";
import {ITimeLine} from "@/models/ITimeLine";
export class TimeLine implements ITimeLine{
  public id: number = 0;
  public customer_id: number = 0;
  public customer_name: string = '';
  public item_id: number = 0;
  public item_name: string = '';
  public task_id: number = 0;
  public task_name: string = '';
  public feequote_id: number = 0;
  public feequote_name: string = '';
  public billable: boolean = false;
  public memo: string = '';
  public timebill0: ITimeEntry = new TimeEntry();
  public timebill1: ITimeEntry = new TimeEntry();
  public timebill2: ITimeEntry = new TimeEntry();
  public timebill3: ITimeEntry = new TimeEntry();
  public timebill4: ITimeEntry = new TimeEntry();
  public timebill5: ITimeEntry = new TimeEntry();
  public timebill6: ITimeEntry = new TimeEntry();
}
