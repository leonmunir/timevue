<template>
  <tr id="formrow" :data-id="timeLineEdit.id">
    <td class="fieldcell">
      <v-autocomplete
          tabindex="0"
          id="customer"
          name="customer"
          variant="outlined"
          :items="listStore.customers"
          item-title="name"
          item-value="id"
          return-object
          hide-details
          density="compact"
          v-model="timeLineEdit.customer"
          @update:modelValue="customerChanged"
      ></v-autocomplete>
    </td>
    <td class="fieldcell">
      <v-autocomplete
          tabindex="0"
          id="feequote"
          name="feequote"
          variant="outlined"
          item-title="name"
          item-value="id"
          :items="feequoteSelectList"
          v-model="timeLineEdit.feeQuote"
          return-object
          hide-details
          density="compact"
          @update:modelValue="feeQuoteChanged"
      ></v-autocomplete>
    </td>
    <td class="fieldcell">
      <v-autocomplete
          tabindex="0"
          id="item"
          name="item"
          variant="outlined"
          item-title="name"
          item-value="id"
          :items="itemSelectList"
          v-model="timeLineEdit.item"
          return-object
          hide-details
          density="compact"
          @update:modelValue="itemChanged"
      ></v-autocomplete>
    </td>
    <td class="fieldcell">
      <v-autocomplete
          tabindex="0"
          id="task"
          name="task"
          variant="outlined"
          item-title="name"
          item-value="id"
          :items="taskSelectList"
          v-model="timeLineEdit.task"
          return-object
          hide-details
          density="compact"
      ></v-autocomplete>
    </td>
    <td class="fieldcell">
      <v-textarea variant="outlined"
                  density="compact"
                  tabindex="0"
                  id="memo"
                  v-model="timeLineEdit.memo"
                  hide-details
                  name="memo" rows="1"></v-textarea>
    </td>
    <td class="fieldcell">
      <v-checkbox tabindex="0" id="billable" name="billable" hide-details v-model="timeLineEdit.billable"></v-checkbox>
    </td>
    <TimeBill :timeRecord="timeLineEdit.timebill0"
              :line-index="-1" :hour-index="0" :editMode="true" @pressedenter="save" @updated="updateTimeBill">
    </TimeBill>
    <TimeBill :timeRecord="timeLineEdit.timebill1"
              :line-index="-1" :hour-index="1" :editMode="true" @pressedenter="save" @updated="updateTimeBill">
    </TimeBill>
    <TimeBill :timeRecord="timeLineEdit.timebill2"
              :line-index="-1" :hour-index="2" :editMode="true" @pressedenter="save" @updated="updateTimeBill">
    </TimeBill>
    <TimeBill :timeRecord="timeLineEdit.timebill3"
              :line-index="-1" :hour-index="3" :editMode="true" @pressedenter="save" @updated="updateTimeBill">
    </TimeBill>
    <TimeBill :timeRecord="timeLineEdit.timebill4"
              :line-index="-1" :hour-index="4" :editMode="true" @pressedenter="save" @updated="updateTimeBill">
    </TimeBill>
    <TimeBill :timeRecord="timeLineEdit.timebill5"
              :line-index="-1" :hour-index="5" :editMode="true" @pressedenter="save" @updated="updateTimeBill">
    </TimeBill>
    <TimeBill :timeRecord="timeLineEdit.timebill6"
              :line-index="-1" :hour-index="6" :editMode="true" @pressedenter="save" @updated="updateTimeBill">
    </TimeBill>
    <td class="totaledit"></td>
  </tr>
  <tr id="editline">
    <td colspan="14">
      <table width="100%" id="tbl-editform">
        <tr class="buttonrow">
          <td colspan="13">
            <table class="buttonline">
              <tr>
                <td>
                  <button class="submitbutton" @click="save">Save</button>
                </td>
                <td>
                  <button class="appbutton" @click="reset">Cancel</button>
                </td>
                <td>
                  <button class="appbutton" v-if="removable" @click="remove">Remove</button>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</template>
<script setup lang="ts">
import {computed, ref, onMounted} from "vue";
import {TimeEntry} from "@/models/TimeEntry";
import {ApprovalStatus} from "@/models/ApprovalStatus";
import {listSourceStore} from "@/stores/listSourceStore";
import {timesheetStore} from "@/stores/timesheetStore";
import {RecordRef} from "@/models/RecordRef";
import {TimeLineEdit} from "@/viewmodels/TimeLineEdit";
import TimeBill from "@/components/TimeBill.vue";
import {TimeLine} from "@/models/TimeLine";
import {da} from "vuetify/locale";
import {TimeBillUpdateEvent} from "@/viewmodels/TimeBillUpdateEvent";

const EMIT_CANCEL = 'cancel';
const props = defineProps({
  savedTimeLine: TimeLine
});
const listStore = listSourceStore();
listStore.getAll();

const dataStore = timesheetStore();

//#region Data
const timeLineEdit = ref(new TimeLineEdit());
//#endregion

//#region Emits
const emit = defineEmits([EMIT_CANCEL]);
//#endregion

//#region Methods
function save() {
  if (!validate()) {
    return;
  }
  // Default ID for new line is -1.
  // When saving we still keep it negative but a random number
  // Negative so that we can identify new lines in the back-end
  if (timeLineEdit.value.id == -1) {
    timeLineEdit.value.id = Math.floor(Math.random() * -50000);
  }
  dataStore.upsertLine(timeLineEdit.value);
  emit(EMIT_CANCEL);
  reset();
}

/**
 * Cancel Button Click Handler
 * Clear select boxes, input boxes and set TimeBill duration to zero
 * This triggers props watch on TimeBill component.
 */
function reset() {
  timeLineEdit.value.id = -1;
  timeLineEdit.value.customer = new RecordRef();
  timeLineEdit.value.feeQuote = new RecordRef();
  timeLineEdit.value.item = new RecordRef();
  timeLineEdit.value.task = new RecordRef();
  timeLineEdit.value.memo = '';
  timeLineEdit.value.billable = true;
  for (let idx = 0; idx < 7; idx++) {
    timeLineEdit.value['timebill' + idx] = new TimeEntry();
  }
  emit(EMIT_CANCEL);
}

function remove() {
  dataStore.removeLine(timeLineEdit.value.id);
  emit(EMIT_CANCEL);
}

function customerChanged(customer: RecordRef) {
  timeLineEdit.value.feeQuote = new RecordRef();
  timeLineEdit.value.task = new RecordRef();
  timeLineEdit.value.item = new RecordRef();
}

function feeQuoteChanged(feeQuote: RecordRef) {
  timeLineEdit.value.task = new RecordRef();
  timeLineEdit.value.item = new RecordRef();
}

function itemChanged(item: RecordRef) {
  timeLineEdit.value.task = new RecordRef();
}

function updateTimeBill(eventData: TimeBillUpdateEvent) {
  if (eventData.hourIndex < 0) return;
  timeLineEdit.value['timebill' + eventData.hourIndex].durationdecimal = eventData.durationdecimal;
}

//#endregion

//#region Helper Functions
function validate(): boolean {
  let isValid = true;
  try {
    validateTimeEntered();
    if (!timeLineEdit.value.customer.id) throw new Error('Please select Customer');
    if (!timeLineEdit.value.feeQuote.id) throw new Error('Please select Fee Quote');
    if (!timeLineEdit.value.item.id) throw new Error('Please select Fee Quote Line');
    if (!timeLineEdit.value.task.id) throw new Error('Please select Task');
  } catch (e: any) {
    isValid = false;
    alert(e.message);
  }
  return isValid;
}

function validateTimeEntered() {
  let timeEntered = false;
  for (let timeIdx = 0; timeIdx < 7; timeIdx++) {
    if (timeLineEdit.value['timebill' + timeIdx].durationdecimal > 0) {
      timeEntered = true;
      break;
    }
  }
  if (!timeEntered) {
    throw new Error("Please enter time");
  }
}
//#endregion

//#region Computed
const removable = computed(() => {
  if (timeLineEdit.value.id == -1) {
    return false;
  }
  let deleteable = true;
  for (let timeIdx = 0; timeIdx < 7; timeIdx++) {
    const objTime = timeLineEdit.value['timebill' + timeIdx];
    if ((objTime.id && objTime.approvalstatus != ApprovalStatus.Approved) || objTime.locked) {
      deleteable = false;
      break;
    }
  }

  return deleteable;
});

const feequoteSelectList = computed(() => {
  if (!timeLineEdit.value.customer) {
    return [];
  }
  const feequotelist: RecordRef[] = [];
  listStore.feequotes.forEach(feeQuote => {
    // if already added ignore
    const isFound = feequotelist.find(x => x.id == feeQuote.id);
    // Only add feequote that are related to the customer
    if (feeQuote.company.id == Number(timeLineEdit.value.customer.id) && !isFound) {
      const feeQuoteRecordRef = new RecordRef();
      feeQuoteRecordRef.id = feeQuote.id;
      feeQuoteRecordRef.name = feeQuote.name;
      feequotelist.push(feeQuoteRecordRef);
    }
  });
  return feequotelist;
});

const itemSelectList = computed(() => {
  let items: RecordRef[] = [];
  if (!timeLineEdit.value.feeQuote) {
    return []
  }
  let foundFeeQuote = listStore.feequotes.find(function (x) {
    return x.id == timeLineEdit.value.feeQuote.id;
  });
  if (foundFeeQuote) {
    items = foundFeeQuote.items as RecordRef[];
  }
  return items;
});

const taskSelectList = computed(() => {
  if (!timeLineEdit.value.feeQuote) {
    return []
  }
  const feeQuote = listStore.feequotes.find(function (x) {
    return x.id == timeLineEdit.value.feeQuote.id;
  });
  if (!feeQuote) {
    return []
  }

  const tasks = listStore.giaTasks.filter(x => x.department_id == feeQuote.department_id) as RecordRef[];
  if (!feeQuote.isWipTaskMandatory) {
    const notRequiredTask = tasks.find(x => x.name === 'Not Required');
    if (notRequiredTask && !timeLineEdit.value.task) {
      timeLineEdit.value.task = new RecordRef();
      timeLineEdit.value.task.id = notRequiredTask.id;
      timeLineEdit.value.task.name = notRequiredTask.name;
    }
  }
  return tasks;
})
//#endregion

//#region Hooks
onMounted(() => {
  if (!props.savedTimeLine) return;
  timeLineEdit.value.id = props.savedTimeLine.id;
  timeLineEdit.value.customer.id = props.savedTimeLine.customer_id;
  timeLineEdit.value.customer.name = props.savedTimeLine.customer_name;
  timeLineEdit.value.feeQuote.id = props.savedTimeLine.feequote_id;
  timeLineEdit.value.feeQuote.name = props.savedTimeLine.feequote_name;
  timeLineEdit.value.item.id = props.savedTimeLine.item_id;
  timeLineEdit.value.item.name = props.savedTimeLine.item_name;
  timeLineEdit.value.task.id = props.savedTimeLine.task_id;
  timeLineEdit.value.task.name = props.savedTimeLine.task_name;
  timeLineEdit.value.memo = props.savedTimeLine.memo;
  timeLineEdit.value.billable = props.savedTimeLine.billable;

  for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
    timeLineEdit.value['timebill' + dayIdx] = props.savedTimeLine['timebill' + dayIdx];
  }
});
//#endregion
</script>

<style scoped>
#editline > td {
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
}

.submitbutton {
  background: linear-gradient(180deg, rgba(75, 156, 254, 1) 35%, rgba(31, 128, 244, 1) 100%);
  border: thin solid #125AB2 !important;
  border-radius: 4px;
  color: #fff;
  padding: 2px 12px 6px 12px;
  height: 26px;
  -webkit-font-smoothing: antialiased;
  font-family: Open Sans, Helvetica, sans-serif;
  letter-spacing: normal;
  cursor: pointer;
}

.appbutton {
  background: linear-gradient(180deg, rgb(247, 247, 247) 35%, rgb(232, 232, 232) 100%);
  border: thin solid #b2b2b2 !important;
  border-radius: 4px;
  color: #333333;
  padding: 2px 12px 6px 12px;
  height: 26px;
  -webkit-font-smoothing: antialiased;
  font-family: Open Sans, Helvetica, sans-serif;
  letter-spacing: normal;
  cursor: pointer;
}

.buttonline {
  background: #D2D2D2;
  border-right: solid #5C7499 1px;
  border-bottom: solid #5C7499 1px;
  border-left: solid #5C7499 1px;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
}

tr.buttonrow > td {
  padding-top: 0;
  /*background: #fff !important;*/
}

#tbl-editform {
  border-collapse: collapse;
}

#formrow {
  border: thin solid #5C7499;
  border-left: 4pt solid #5C7499;
  border-bottom-width: 0.5pt;
}

table.buttonline td {
  padding: 5px 5px;
}

#editline:hover {
  background: #FAFAFA !important;
}

.v-selection-control {
  justify-content: center;
}
</style>
