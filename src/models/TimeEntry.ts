import {ITimeEntry} from "@/models/ITimeEntry";

export class TimeEntry implements ITimeEntry{
  id: number = 0;
  durationdecimal: number = 0;
  approvalstatus: string = '';
  locked: boolean = false;
}
