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
    },
    validateFieldValue:{
        type: Function,
        required: true
    }
})

const emit = defineEmits(['update-field'])

function isVisible(field){
    return props.evaluateCondition(field)
}

</script>

<template>
     <div>
        <template v-for="field in fields" :key="field.id">
            <div
                class="field-preview"
                v-if="isVisible(field)"
            >
                <label>
                    {{ field.label || "Untitled field" }}
                    <span v-if="field.required">*</span>
                </label>

                <template v-if="field.type === 'text'">
                    <input
                        type="text"
                        :value="field.value"
                        @input="e=> emit('update-field', field.id, e.target.value)"
                        @blur="validateFieldValue(field.id)"
                    >
                </template>

                <template v-else-if="field.type === 'number'">
                    <input
                        type="number"
                        :value="field.value"
                        @input="e=> emit('update-field', field.id, e.target.value)"
                        @blur="validateFieldValue(field.id)"
                    >
                </template>

                <template v-else-if="field.type === 'select'">
                    <select
                        :value="field.value"
                        @change="e=> emit('update-field', field.id, e.target.value)"
                        @blur="validateFieldValue(field.id)"
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
                        @change="e=> emit('update-field', field.id, e.target.checked)"
                        @blur="validateFieldValue(field.id)"
                    >
                </template>

                <p v-if="field.error" class="error">
                    {{ field.error }}
                </p>
            </div>
        </template>
    </div>
</template>

<style scoped>
.field-preview{
    margin: 10px 0;
    display: flex;
    flex-direction: column;
    align-items:flex-start;
    gap: 6px;
}

label{
    font-weight: 500;
    display: block;
    margin-bottom: 4px;
}

input, select{
    padding: 6px 10px;
    border: 1px solid #05101c;
}

.error{
    color: red;
    font-size: 14px;
}

</style>