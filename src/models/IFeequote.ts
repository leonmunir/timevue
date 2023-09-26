import {RecordRef} from "./RecordRef";
import {IItem} from "./IItem";

export interface IFeequote extends RecordRef{
    company: RecordRef;
    department_id: number;
    rate: number;
    isWipTaskMandatory: boolean;
    items: IItem[];
}
