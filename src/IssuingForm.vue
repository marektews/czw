<template>
    <div>
        <div class="mb-3">
            <label class="form-label">Zbór:</label>
            <select class="form-control" name="zbor" v-model="zbor">
                <option v-for="(zb, index) of zbory" :key="index">
                    {{ zb.name }}
                </option>
            </select>
        </div>

        <div class="mb-3">
            <label class="form-label">Numer telefonu kierowcy:</label>
            <input class="form-control text-center" type="tel" name="phone" v-model="phone"/>
        </div>

        <div class="mb-3">
            <label class="form-label">Numer rejestracyjny pojazdu:</label>
            <input class="form-control text-center force-uppercase" type="text" name="nrrej" v-model="nrrej"/>
        </div>

        <div class="mb-3">
            <label class="form-label">Numer identyfikatora parkingowego:</label>
            <input class="form-control text-center force-uppercase" type="number" name="nrident" v-model="nrident"/>
        </div>

        <div class="btns-container">
            <button 
                class="btn btn-primary"
                :disabled="canIssuing"
                @click="onIssuing"
            >
                <FontAwesomeIcon :icon="faSquareParking" />
                Wydaj identyfikator
            </button>
            <button class="btn btn-danger" @click="onReset">
                <FontAwesomeIcon :icon="faBroom" />
                Wyczyść formularz
            </button>
        </div>

        <div v-if="error==='OK'" 
            class="alert alert-success mt-3 text-center" 
            role="alert"
        >
            <FontAwesomeIcon :icon="faThumbsUp" />&nbsp;&nbsp;OK
        </div>
        <div v-else-if="error==='ERR'" 
            class="alert alert-danger mt-3 text-center" 
            role="alert"
        >
            <FontAwesomeIcon :icon="faFaceFrownOpen" />&nbsp;&nbsp;Coś poszło nie tak. Spróbuj ponownie.
        </div>
        <div v-else-if="error==='ERR_in_used'" 
            class="alert alert-danger mt-3 text-center" 
            role="alert"
        >
            <FontAwesomeIcon :icon="faFaceFlushed" />&nbsp;&nbsp;Identyfikator jest już w użyciu.
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faThumbsUp, faFaceFrownOpen, faBroom, faSquareParking, faFaceFlushed } from '@fortawesome/free-solid-svg-icons'

const zbory = ref([])
const zbor = ref("")
const phone = ref("")
const nrrej = ref("")
const nrident = ref(undefined)
const error = ref(undefined)
const timer = ref(undefined)

onMounted(() => {
    fetch('/api/czw/init')
    .then((resp) => {
        if(resp.status === 200)
            return resp.json()
        else
            return []
    })
    .then((data) => {
        data.sort((a,b) => {
            if(a.name === b.name)
                return 0
            if(a.name < b.name)
                return -1
            else
                return 1
        })
        console.log(data)
        zbory.value = data
    })
})

const canIssuing = computed(() => {
    return zbor.value.length 
        && phone.value.length
        && nrrej.value.length
        && nrident.value !== undefined
        ? false : true
})

const onIssuing = () => {
    fetch("/api/czw/issuing", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            zbor: zbor.value,
            phone: phone.value,
            nr_rej: nrrej.value.toUpperCase(),
            nr_ident: nrident.value,
        }),
    })
    .then((resp) => {
        console.log("Fetch '/api/czw/issuing' Response:", resp)
        if(resp.status === 200) {
            error.value = 'OK'
        }
        else
        if(resp.status === 423) {
            error.value = 'ERR_in_used'
        }
        else {
            error.value = 'ERR'
        }

        timer.value = setTimeout(() => {
            if(error.value === 'OK') onReset()
            error.value = undefined
            clearTimeout(timer.value)
            timer.value = undefined
        }, 3000)
    })
    .catch(() => {
        error.value = 'ERR'
        timer.value = setTimeout(() => {
            error.value = undefined
            clearTimeout(timer.value)
            timer.value = undefined
        }, 3000)
    })
}

const onReset = () => {
    zbor.value = ""
    phone.value = ""
    nrrej.value = ""
    nrident.value = undefined
}

</script>