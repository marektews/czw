<template>
    <div>
        <div>
            <div class="form-check">
                <input 
                    class="form-check-input"
                    type="radio"
                    name="searchMode"
                    id="searchMode1"
                    :checked="searchMode === 'nr_ident'"
                    @click="searchMode = 'nr_ident'"
                />
                <label class="form-check-label" for="searchMode1">
                    Numer identyfikatora parkingowego
                </label>
            </div>
            <div class="form-check">
                <input 
                    class="form-check-input"
                    type="radio"
                    name="searchMode"
                    id="searchMode2"
                    :checked="searchMode === 'nr_rej'"
                    @click="searchMode = 'nr_rej'"
                />
                <label class="form-check-label" for="searchMode2">
                    Numer rejestracyjny pojazdu
                </label>
            </div>
        </div>

        <div class="my-3">
            <div class="input-group">
                <input 
                    class="form-control text-center force-uppercase" 
                    :type="searchType" 
                    v-model="pattern"
                />
                <button 
                    class="btn btn-primary" 
                    :disabled="pattern===''"
                    @click="onSearching"
                >
                    <FontAwesomeIcon :icon="faSearch" /> Wyszukaj
                </button>
                <button 
                    class="btn btn-danger" 
                    :disabled="pattern===''"
                    @click="onClearPattern"
                >
                    <FontAwesomeIcon :icon="faCircleXmark" />
                </button>
            </div>
        </div>

        <div v-if="status === 200 && sinfo" class="info-container">
            <h5>Wyszukane informacje</h5>
            <div class="info">
                <div class="text-muted">Kierowca:</div>
                <div>{{ sinfo.driver }}</div>

                <div class="text-muted">Nr telefonu:</div>
                <div>{{ sinfo.phone }}</div>

                <div class="text-muted">Nr rejestracyjny:</div>
                <div class="force-uppercase">{{ sinfo.nr_rej }}</div>

                <div class="text-muted">Nr identyfikatora:</div>
                <div>{{ sinfo.nr_ident }}</div>

                <div class="text-muted">Wydany:</div>
                <div>{{ issuedTime(sinfo.issued) }}</div>
            </div>
            <button 
                class="btn btn-danger mt-3"
                @click="onClear"
            >
                <FontAwesomeIcon :icon="faBroom" /> Kasuj
            </button>
        </div>

        <div v-else-if="status !== undefined" class="alert alert-danger">
            <FontAwesomeIcon :icon="faCircleInfo" /> {{ error }}
        </div>

    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faSearch, faBroom, faCircleXmark, faCircleInfo } from '@fortawesome/free-solid-svg-icons';

const searchMode = ref("nr_ident")
const pattern = ref("")
const sinfo = ref(undefined)
const status = ref(undefined)
const error = ref("")

const searchType = computed(() => {
    return searchMode.value === "nr_ident" ? "number" : "text"
})

const issuedTime = (param) => {
    let dt = new Date(param)
    return isNaN(dt) ? "" : dt.toLocaleTimeString()
}

const onSearching = () => {
    status.value = undefined
    error.value = ""

    let body_data = {}
    body_data[searchMode.value] = pattern.value

    fetch("/api/czw/search", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body_data),
    })
    .then((resp) => {
        status.value = resp.status
        if(resp.status === 200)
            return resp.json()
        else
        if(resp.status === 205) {
            error.value = "Identyfikator o tym numerze nie jest już używany"
        }
        else
        if(resp.status === 404) {
            if(searchMode.value === "nr_ident")
                error.value = "Podany identyfikator nie jest aktualnie wykorzystywany"
            else 
            if(searchMode.value === "nr_rej")
                error.value = "Podany pojazd nie został zarejestrowany"
            else
                error.value = "Coś poszło nie tak! Spróbuj ponownie."
        }
        else {
            error.value = "Coś poszło nie tak! Spróbuj ponownie."
        }
    })
    .then((data) => sinfo.value = data)
}

const onClearPattern = () => {
    pattern.value = ""
    status.value = undefined
    error.value = ""
}

const onClear = () => {
    sinfo.value = undefined
    pattern.value = ""
    status.value = undefined
}


</script>

<style scoped>
.info-container {
    margin-top: 22pt;
    display: flex;
    flex-direction: column;
    gap: 8pt;
}

.info {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 4pt 12pt;
}
</style>