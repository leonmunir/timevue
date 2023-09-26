import {defineStore} from 'pinia';
import {computed, ref, Ref} from "vue";
import {Datasource} from "@/stores/Datasource";
import {ListSource} from "@/models/ListSource";
import {IFeequote} from "@/models/IFeequote";
import {RecordRef} from "@/models/RecordRef";
import {IGIATask} from "@/models/IGIATask";

export const listSourceStore = defineStore('listSourceStore', () => {
  const feequotes: Ref<IFeequote[]> = ref([]);
  const giaTasks: Ref<IGIATask[]> = ref([]);

  function getAll() {
    if(feequotes.value.length > 0 ) return;
    fetch(Datasource.getListSourceUrl()).then(function (response) {
      return response.json();
    }).then(function (objResponse: ListSource) {
      objResponse.message.feequotes.forEach(x => feequotes.value.push(x));
      objResponse.message.giaTasks.forEach(x => giaTasks.value.push(x));
    });
  }


  const customers = computed(() => {
    const companyList = feequotes.value.map(x => x.company);
    return companyList;
  });

  return {customers, feequotes, getAll, giaTasks};
});
