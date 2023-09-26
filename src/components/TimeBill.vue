<template>
  <td v-if="isEditable" class="timecell">
    <input tabindex="0" v-model="durationdecimal" @keydown="validateInput" @input="emitData" pattern="[0-9]+|:"/>
  </td>
  <td v-else :class="[isLocked ? 'locked' : '', statusColour]">{{ timeDisplay }}</td>
</template>

<script setup lang="ts">
import {ref, computed, watch, onMounted} from "vue";
import {Helpers} from "../Helpers";
import {TimeEntry} from "@/models/TimeEntry";
import {TimeBillUpdateEvent} from "@/viewmodels/TimeBillUpdateEvent";

const props = defineProps({
  editMode: Boolean,
  hourIndex: Number,
  lineIndex: Number,
  timeRecord: TimeEntry,
  weekDate: Date,
});

let id = 0;
const durationdecimal = ref(0);
let updateEventData = new TimeBillUpdateEvent();

// When Cancel is clicked set durationdecimal to zero
watch(() => props.timeRecord, (newTimeRecord) => {
  durationdecimal.value = (newTimeRecord as TimeEntry).durationdecimal;
});

const isEditable = computed(() => {
  const iseditable = (props.timeRecord && !props.timeRecord.locked && props.editMode == true);
  return iseditable;
});

const timeDisplay = computed(() => {
  return Helpers.getTimeDisplay(Number(durationdecimal.value));
});

const statusColour = computed(() => {
  let colourClass = '';
  let approvalStatus = '';
  if (props.timeRecord) {
    approvalStatus = props.timeRecord.approvalstatus;
  }
  switch (approvalStatus) {
    case 'B':
      colourClass = 'blue';
      break;
    case 'A':
      colourClass = 'green';
      break;
    case 'st.atusD':
      colourClass = 'red';
      break;
    default:
      colourClass = '';
  }
  return colourClass;
});

const isLocked = computed(() => props.timeRecord ? props.timeRecord.locked: false);

const emit = defineEmits(['pressedenter', 'updated'])

function validateInput(event) {
  if (event.key == 'Enter') {
    emit('pressedenter');
    return;
  }
  if (!(event.key >= 0 || event.key == ':' || event.key == '.' || event.key == 'Backspace'
      || event.key == 'ArrowLeft' || event.key == 'ArrowRight' || event.key == 'Tab')) {
    event.preventDefault();
  }
}

function emitData() {
  updateEventData.durationdecimal = Number(durationdecimal.value);
  if(props.hourIndex != undefined) {
    updateEventData.hourIndex = props.hourIndex;
  }
  emit('updated', updateEventData);
}

onMounted(() => {
  if (props.timeRecord) {
    id = props.timeRecord.id;
    durationdecimal.value = props.timeRecord.durationdecimal;
  } else {
    id = 0;
    durationdecimal.value = 0;
  }
})
</script>

<style scoped>
.timecell {
  text-align: center;
}

.timecell input, .timecell input:active {
  width: 26px;
  border: thin solid lightgrey;
  padding: 5px;
}

.timecell input:active, .timecell input:focus {
  outline: none;
  border: thin solid #2C3E50;
}

.blue {
  background: #98B5E3;
}

.green {
  background: #DAEBD5;
}

.red {
  background: #E5AAAA;
}

.locked {
  background-image: url("https://5331673.app.netsuite.com/core/media/media.nl?id=703970&c=5331673&h=RPjsmjRyyT0VyC8LH5RpMumbwCzyPqYVJilwZZsoj_LNEvnc");
  background-repeat: no-repeat;
  background-size: 18px;
  font-size: 13px;
  text-align: center;
}
</style>
