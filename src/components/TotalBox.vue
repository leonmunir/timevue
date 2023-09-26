<template>
  <v-table id="totalbox">
    <tr>
      <th class="day-header"></th>
      <th v-for="(weekDate, idx) in store.getWeekRange"
          :key="idx" class="day-header"
          data-id="{{idx}}">{{ Helpers.getAplhaDay(weekDate.getDay()) }}</th>
      <th class="day-header">Total</th>
    </tr>
    <tr>
      <td style="text-align: left">Billable</td>
      <td v-for="total in store.getBillableWeekTotal">{{ total || '0:00' }}</td>
      <td>{{store.getBillableGrandTotal || '0:00'}}</td>
    </tr>
    <tr>
      <td style="text-align: left">Non Billable</td>
      <td v-for="total in store.getNonBillableWeekTotal">{{ total || '0:00' }}</td>
      <td>{{store.getNonBillableGrandTotal || '0:00'}}</td>
    </tr>
  </v-table>
</template>

<script setup lang="ts">
import { timesheetStore } from '@/stores/timesheetStore';
import {Helpers} from "../Helpers";
const store = timesheetStore();
</script>

<style scoped>
#totalbox {
  float: right;
  border-collapse: collapse;
}

#totalbox th {
  background: #D6DCE5;
  color: #607799;
  font-weight: bold;
}

#totalbox th, #totalbox td {
  padding: 5px 15px;
  text-align: center;
}
</style>
