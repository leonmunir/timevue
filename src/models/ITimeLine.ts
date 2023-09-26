import {ITimeEntry} from "@/models/ITimeEntry";
export interface ITimeLine {
  id: number;
  customer_id: number;
  customer_name: string;
  item_id: number;
  item_name: string;
  task_id: number;
  task_name: string;
  feequote_id: number;
  feequote_name: string;
  billable: boolean;
  memo: string;
  timebill0: ITimeEntry;
  timebill1: ITimeEntry;
  timebill2: ITimeEntry;
  timebill3: ITimeEntry;
  timebill4: ITimeEntry;
  timebill5: ITimeEntry;
  timebill6: ITimeEntry;
}
