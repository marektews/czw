<template>
    <div class="container">
        <div class="d-flex flex-column align-items-center text-muted mt-3">
            <h5>Wjazdówki parkingowe</h5>
            <h6>sprzątanie przed kongresem</h6>
        </div>

        <div class="my-4 d-flex justify-content-center">
            <div class="btn-group">
                <button 
                    class="btn btn-outline-primary" 
                    :class="mode === 1 ? 'active' : ''"
                    @click="mode=1"
                >
                    <FontAwesomeIcon :icon="faSquareParking" /> Wydawanie
                </button>
                <button 
                    class="btn btn-outline-success" 
                    :class="mode === 2 ? 'active' : ''"
                    @click="mode=2"
                >
                    <FontAwesomeIcon :icon="faSearch" /> Wyszukiwanie
                </button>
                <button
                    class="btn btn-outline-danger"
                    :class="mode === 3 ? 'active' : ''"
                    @click="mode=3"
                >
                    <FontAwesomeIcon :icon="faCircleXmark" /> Anulowanie
                </button>
            </div>
        </div>

        <IssuingForm v-if="mode === 1" />
        <SearchForm v-else-if="mode === 2" />
        <CancellationForm v-else-if="mode === 3" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCircleXmark, faSearch, faSquareParking } from '@fortawesome/free-solid-svg-icons';
import IssuingForm from './IssuingForm.vue'
import SearchForm from './SearchForm.vue'
import CancellationForm from './CancellationForm.vue'

const mode = ref(1)

</script>

<style>
#app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.force-uppercase {
    text-transform: uppercase;
}

.btns-container {
    display: flex;
    flex-direction: row;
    gap: 4pt;
    justify-content: center;
}
</style>
