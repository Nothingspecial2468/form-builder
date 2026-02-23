<script setup>
import { useFormBuilder } from '../composables/useFormBuilder';
const props = defineProps({
    fields:{
        type: Array,
        required: true
    },
    evaluateCondition:{
        type: Function,
        required: true
    }
})

const emit = defineEmits(['update-field'])

// function updateField(id, value){
//     emit('update-field', id, value)
// }
</script>

<template>
     <div>
        <template v-for="field in fields" :key="field.id">
            <div
                class="field-preview"
                v-if="evaluateCondition(field)"
            >
                <label>
                    {{ field.label || "Untitled field" }}
                    <span v-if="field.required">*</span>
                </label>

                <template v-if="field.type === 'text'">
                    <input
                        type="text"
                        :value="field.value"
                        @input="$emit('update-field', field.id, $event.target.value)"
                    >
                </template>

                <template v-else-if="field.type === 'number'">
                    <input
                        type="number"
                        :value="field.value"
                        @input="$emit('update-field', field.id, $event.target.value)"
                    >
                </template>

                <template v-else-if="field.type === 'select'">
                    <select
                        :value="field.value"
                        @change="$emit('update-field', field.id, $event.target.value)"
                    >
                        <option disabled value="">Select an option</option>
                        <option
                            v-for="option in field.options"
                            :key="option"
                            :value="option"
                        >
                            {{ option }}
                        </option>
                    </select>
                </template>

                <template v-else-if="field.type === 'checkbox'">
                    <input
                        type="checkbox"
                        :checked="field.value"
                        @change="$emit('update-field', field.id, $event.target.checked)"
                    >
                </template>
            </div>
        </template>
    </div>
</template>

<style scoped>
.field-preview{
    margin: 10px 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

label{
    font-weight: 500;
    display: block;
    margin-bottom: 4px;
}
</style>