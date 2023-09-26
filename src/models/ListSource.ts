import {IFeequote} from "@/models/IFeequote";
import {IGIATask} from "@/models/IGIATask";

export interface ListSourceMessage {
  feequotes: IFeequote[];
  giaTasks: IGIATask[];
}
export interface ListSource {
    success: boolean,
    message: ListSourceMessage
}
