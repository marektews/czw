<template>
    <div>
        <div class="mb-3">
            <label class="form-label">Numer identyfikatora parkingowego:</label>
            <div class="input-group">
                <input 
                    class="form-control text-center" 
                    type="number" 
                    v-model="pattern"
                />
                <button 
                    class="btn btn-danger"
                    :disabled="pattern===''"
                    @click="onCancellation"
                >
                    <FontAwesomeIcon :icon="faCircleXmark" /> Anuluj identyfikator
                </button>
            </div>

            <div v-if="status === 200" class="alert alert-success text-center mt-3" role="alert">
                <FontAwesomeIcon :icon="faThumbsUp" />&nbsp;&nbsp;OK
            </div>
            <div v-else-if="status === 404" class="alert alert-danger mt-3" role="alert">
                <FontAwesomeIcon :icon="faCircleInfo" /> Podany identyfikator nie jest aktualnie wykorzystywany
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCircleXmark, faCircleInfo, faThumbsUp } from '@fortawesome/free-solid-svg-icons';

const pattern = ref("")
const status = ref(undefined)
const timer = ref(undefined)

const onCancellation = () => {
    fetch("/api/czw/cancellation", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ nr_ident: pattern.value }),
    })
    .then((resp) => {
        status.value = resp.status
        timer.value = setTimeout(() => {
            status.value = undefined
            clearTimeout(timer.value)
            timer.value = undefined
        }, 3000)
    })
}

</script>