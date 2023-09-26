import {ITimeLine} from "@/models/ITimeLine";

interface TimesheetDataMessage {
  timeitemList: ITimeLine[];
};

export interface ITimesheetData {
  success: boolean;
  message:TimesheetDataMessage;
}
