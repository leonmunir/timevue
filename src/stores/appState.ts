import {defineStore} from 'pinia';
import {ref} from "vue";


export const appState = defineStore('appState', () => {
    const isDataLoading = ref(true);
    const isListLoading = ref(true);

    return {isDataLoading, isListLoading};
})
