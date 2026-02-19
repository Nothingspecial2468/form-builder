<script setup>
const props = defineProps({
    field:{
        type: Object,
        required: true
    }
})

const emit = defineEmits(['update-field'])

function updateField(value){
    emit('update-field', props.field.id, value)
}
</script>

<template>
    <div class="field-preview">
        <label>
            {{ field.label || "Untitled field" }}
            <span v-if="field.required">*</span>
        </label>

        <template v-if="field.type === 'text'">
            <input type="text"
            :value="field.value"
            @input="updateField($event.target.value)">
        </template>

        <template v-else-if="field.type === 'number'">
            <input type="number"
            :value="field.value"
            @input="updateField($event.target.value)">
        </template>

        <template v-else-if="field.type === 'select'">
            <select :value="field.value"
            @change="updateField($event.target.value)">
            
                <option disabled value="">Select an option</option>
                <option v-for="(option , index) in field.options"
                    :key="index"
                    :value="option.value">
                    {{ option.label }}
                </option>
            </select>
        </template>

        <template v-else-if="field.type === 'checkbox'">
            <input type="checkbox"
            :checked="field.value"
            @change="updateField($event.target.checked)">
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