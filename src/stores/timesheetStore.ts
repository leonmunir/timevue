import {defineStore} from 'pinia';
import {ref, Ref, computed} from "vue";
import {Datasource} from "./Datasource";
import {TimeLine} from "@/models/TimeLine";
import {ITimesheetData} from "@/models/ITimesheetData";
import {Helpers} from "@/Helpers";
import {TimeLineEdit} from "@/viewmodels/TimeLineEdit";
import {ITimeLine} from "@/models/ITimeLine";
import {da} from "vuetify/locale";

export const timesheetStore = defineStore('timesheetStore', () => {
  const records: Ref<TimeLine[]> = ref([]);
  const startDate: Ref<Date> = ref(new Date(2022, 1, 8));
  const endDate: Ref<Date> = ref(new Date(2022, 1, 14));

  //#region Actions
  function getAll() {
    if (records.value.length > 0) {
      return;
    }
    fetch(Datasource.getTimesheetDataUrl()).then(function (response) {
      return response.json();
    }).then(function (objResponse: ITimesheetData) {
      objResponse.message.timeitemList.forEach(timeline => {
        records.value.push(timeline)
      });
      Datasource.updateHiddenJsonField(JSON.stringify(records.value));
    });
  }

  function convertTimeToFloat(timeDuration: number) {
    if(timeDuration.toString().indexOf(':')> -1){
      const parts = timeDuration.toString().split(':');
      return Number(parts[0]) + Number(parts[1])/60
    }
    return timeDuration;
  }

  function upsertLine(timeLine: TimeLineEdit) {
    let timeLineIdx = -1;
    for (let idx = 0; idx < records.value.length; idx++) {
      if (records.value[idx].id === timeLine.id) {
        timeLineIdx = idx;
        break;
      }
    }

    if (timeLineIdx > -1) {
      records.value[timeLineIdx].customer_id = timeLine.customer.id;
      records.value[timeLineIdx].customer_name = timeLine.customer.name;
      records.value[timeLineIdx].feequote_id = timeLine.feeQuote.id;
      records.value[timeLineIdx].feequote_name = timeLine.feeQuote.name;
      records.value[timeLineIdx].item_id = timeLine.item.id;
      records.value[timeLineIdx].item_name = timeLine.item.name;
      records.value[timeLineIdx].task_id = timeLine.task.id;
      records.value[timeLineIdx].task_name = timeLine.task.name;
      records.value[timeLineIdx].billable = timeLine.billable;
      records.value[timeLineIdx].memo = timeLine.memo;

      for(let dayIdx = 0; dayIdx < 7; dayIdx++) {
        timeLine['timebill' + dayIdx].durationdecimal
          = convertTimeToFloat(timeLine['timebill' + dayIdx].durationdecimal);
        records.value[timeLineIdx]['timebill' + dayIdx] = timeLine['timebill' + dayIdx];
      }

    } else {
      const objTime = new TimeLine();
      objTime.id = timeLine.id;
      objTime.customer_id = timeLine.customer.id;
      objTime.customer_name = timeLine.customer.name;
      objTime.feequote_id = timeLine.feeQuote.id;
      objTime.feequote_name = timeLine.feeQuote.name;
      objTime.item_id = timeLine.item.id;
      objTime.item_name = timeLine.item.name;
      objTime.task_id = timeLine.task.id;
      objTime.task_name = timeLine.task.name;
      objTime.billable = timeLine.billable;
      objTime.memo = timeLine.memo;
      for(let dayIdx = 0; dayIdx < 7; dayIdx++) {
        timeLine['timebill' + dayIdx].durationdecimal
          = convertTimeToFloat(timeLine['timebill' + dayIdx].durationdecimal);
        objTime['timebill' + dayIdx] = timeLine['timebill' + dayIdx];
      }
      records.value.push(objTime);
    }

    Datasource.updateHiddenJsonField(JSON.stringify(records.value));
  }

  function removeLine(lineId: number) {
    records.value = records.value.filter(x => x.id != lineId);
    Datasource.updateHiddenJsonField(JSON.stringify(records.value));
  }

  function getPreviousWeek() {
    const lastWeekStartDate = new Date(startDate.value.getTime());
    lastWeekStartDate.setDate(lastWeekStartDate.getDate() - 7);
    fetch(Datasource.getTimesheetDataUrl(window.nlapiDateToString(lastWeekStartDate))).then(function (response) {
      return response.json();
    }).then(function (objResponse) {
      objResponse.message.timeitemList.forEach(timeline => {
        records.value.push(timeline)
      });
      Datasource.updateHiddenJsonField(JSON.stringify(records.value));
    });
  }
  //#endregion

  const getWeekRange = computed(() => {
    let weekRange: Date[] = [];
    let iterDate: Date = new Date(startDate.value.getTime());

    while (iterDate <= endDate.value) {
      weekRange.push(new Date(iterDate.valueOf()));
      iterDate.setDate(iterDate.getDate() + 1);
    }
    return weekRange;
  });

  const getBillableWeekTotal = computed(() => {
    let totals: number[] = [];
    for (let idx = 0; idx < 7; idx++) {
      totals.push(records.value.reduce(function (total: number, currentValue: TimeLine) {
        if (currentValue.billable === true && !!currentValue['timebill' + idx]) {
            total += Number(currentValue['timebill' + idx].durationdecimal);
        }
        return total;
      }, 0));
    }

    return totals.map(x => Helpers.getTimeDisplay(x));
  });

  const getNonBillableWeekTotal = computed(() => {
    let totals: number[] = [];
    for (let idx = 0; idx < 7; idx++) {
      totals.push(records.value.reduce(function (total, currentValue) {
        if (currentValue.billable === false && !!currentValue['timebill' + idx]) {
            total += Number(currentValue['timebill' + idx].durationdecimal);
        }
        return total;
      }, 0));
    }

    return totals.map(x => Helpers.getTimeDisplay(x));
  });

  const getBillableGrandTotal = computed(() => {
    let grandTotal = 0;
    for (let idx = 0; idx < 7; idx++) {
      grandTotal += records.value.reduce(function (total, currentValue) {
        if (currentValue.billable === true) {
          total += Number(currentValue['timebill' + idx].durationdecimal);
        }
        return total;
      }, 0);
    }
    return Helpers.getTimeDisplay(grandTotal);
  });

  const getNonBillableGrandTotal = computed(() => {
    let grandTotal = 0;
    for (let idx = 0; idx < 7; idx++) {
      grandTotal += records.value.reduce(function (total, currentValue) {
        if (currentValue.billable === false) {
          total += Number(currentValue['timebill' + idx].durationdecimal);
        }
        return total;
      }, 0);
    }
    return Helpers.getTimeDisplay(grandTotal);
  });

  return {
    records,
    getAll,
    getPreviousWeek,
    getWeekRange,
    getBillableWeekTotal,
    getNonBillableWeekTotal,
    getBillableGrandTotal,
    getNonBillableGrandTotal,
    removeLine,
    upsertLine
  };
});
