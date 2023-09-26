<template>
  <v-app>
    <v-main>
      <TotalBox></TotalBox>
      <div align="right" style="clear:both; padding: 10px 0;">
        <span class="text" style="background-color:#DAEBD5;border:thin solid; border-color:#aaaaaa;">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span>&nbsp;
        <span class="text">Approved&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <span class="text" style="background-color:#98B5E3;border:thin solid; border-color:#aaaaaa;">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span>&nbsp;
        <span class="text">Pending&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <span class="text" style="background-color:#E5AAAA;border:thin solid; border-color:#aaaaaa;">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span>&nbsp;
        <span class="text">Rejected&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <span class="text" style="background-color:#fff;border:thin solid; border-color:#aaaaaa;">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span>&nbsp;
        <span class="text">Open&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
      </div>
      <div id="timesheetoverlay">
        <table class="timeitem"
               cellspacing="0"
               style="width: auto">
          <tr>
            <th class="field-header">Job</th>
            <th class="field-header">Fee Quote</th>
            <th class="field-header">Fee Quote Line</th>
            <th class="field-header">Task</th>
            <th class="field-header longmemo">Memo</th>
            <th class="field-header center">Billable</th>
            <th v-for="(weekDate, idx) in store.getWeekRange"
                :key="idx"
                class="day-header"
                :data-id="idx">{{ weekDate.getDate() }},<br/>{{ Helpers.getAplhaDay(weekDate.getDay()) }}
            </th>
            <th class="field-total">Total</th>
          </tr>
          <template v-for="(timeItem, index) in store.records" :key="index">
            <tr @click="rowEditId = index" v-if="rowEditId != index">
              <!-- Static Display Row Template -->
              <td>{{ timeItem.customer_name }}</td>
              <td>{{ timeItem.feequote_name }}</td>
              <td>{{ timeItem.item_name }}</td>
              <td>{{ timeItem.task_name }}</td>
              <td>{{ timeItem.memo }}</td>
              <td style="text-align: center">{{ timeItem.billable ? 'Yes' : 'No' }}</td>
              <template v-for="(weekDate, idx) in store.getWeekRange" :key="idx">
                <TimeBill :time-record="timeItem['timebill' + idx] as TimeEntry" :line-index="index" :hour-index="idx"
                          :editMode="false"></TimeBill>
              </template>
              <td>{{ getLineTotal(timeItem) }}</td>
            </tr>
            <EditLine v-else @cancel="rowEditId = -1" :savedTimeLine="timeItem"></EditLine>
          </template>
          <EditLine v-if="rowEditId === -1" @cancel="rowEditId = -1"></EditLine>
          <tr v-else>
            <td colspan="14" @click="rowEditId = -1">Add New Row</td>
          </tr>
        </table>
      </div>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import {ref,onMounted} from "vue";
import TotalBox from "@/components/TotalBox.vue";
import {timesheetStore} from '@/stores/timesheetStore';
import {appState} from "@/stores/appState";
import {Helpers} from "./Helpers";
import {TimeLine} from "@/models/TimeLine";
import TimeBill from "@/components/TimeBill.vue";
import EditLine from "@/components/EditLine.vue";
import {TimeEntry} from "@/models/TimeEntry";
import {de} from "vuetify/locale";

// Load timesheet data
const store = timesheetStore();
store.getAll();

const appStateStore = appState();

const rowEditId = ref(-1);

function getLineTotal(timeLine: TimeLine) {
  let total = 0;
  for (let weekIdx = 0; weekIdx < 7; weekIdx++) {
    if(!timeLine['timebill' + weekIdx]) continue;
    total += Number(timeLine['timebill' + weekIdx].durationdecimal);
  }
  return Helpers.getTimeDisplay(total);
}

function resizeTable() {
  const elTable = document.getElementsByClassName('timeitem')[0] as HTMLElement;
  if (!elTable) return;
  const elTimesheetOverlay = document.getElementById('timesheetoverlay');
  if (!elTimesheetOverlay) {
    return;
  }
  const overlayStyles = window.getComputedStyle(elTimesheetOverlay);
  const elTableWidth = window.getComputedStyle(elTable).width;
  elTable.style.width = (elTableWidth < overlayStyles.width) ? '100%' : 'auto';
}

onMounted(()=>{
  setTimeout(() => {
    resizeTable();
  }, 1000);
})
</script>

<style scoped>
.day-header {
  text-align: left;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
  font-size: 11pt;
}

table.timeitem {
  border-collapse: collapse;
}

table.timeitem tr {
  border: inherit;
  box-sizing: border-box;
}

table.timeitem > tr:hover {
  background: #FFFFE5 !important;
}

table.timeitem tr:nth-child(even) {
  background: #FAFAFA;
}

table.timeitem td {
  text-align: left;
  padding: 10px 15px;
  font-size: 13px;
  color: #333333;
}

table.timeitem th {
  padding: 10px 15px;
  color: #fff;
  background: #607799;
  font-weight: 400;
  font-size: 11px;
  font-weight: bold;
}

.field-header {
  width: 150px;
}

.longmemo {
  min-width: 500px;
}

div#timesheetoverlay {
  clear: both;
  width: 100%;
  overflow-x: auto;
}
</style>
