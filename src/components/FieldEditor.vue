<script setup>
import OptionsEditor from './OptionsEditor.vue';
import { useFormBuilder } from '../composables/useFormBuilder';

const props= defineProps({
    field: {
        type: Object,
        required: true
    },
    allFields:{
            type: Array,
            required: true
    }
});

const emit = defineEmits(['update-field', 'remove-field', 'add-condition']);

function update(key, value){
    emit('update-field', props.field.id, {[key]: value})
}

function updateCondition(key, value){
    emit('update-field', props.field.id, {
        condition:{
            ...props.field.condition,
            [key]: value
        }
    })
}
</script>

<template>
    <div class="field-editor">
        <input type="text"
        placeholder="Label"
        :value="field.label"
        @input="update('label', $event.target.value)">

        <select :value="field.type" @change="update('type', $event.target.value)">
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="select">Select</option>
            <option value="checkbox">Checkbox</option>
        </select>

        <button @click="$emit('add-condition', field.id)">
            Add Condition
        </button>

        <button @click="$emit('remove-field', field.id)">Remove</button>

        <div v-if="field.condition">
            <select :value="field.condition.targetFieldId" 
            @change="updateCondition('targetFieldId', $event.target.value)">

                <option value="">Select Field</option>
                <option v-for="f in allFields.filter(f=> f.id !== field.id)"
                :key="f.id"
                :value="f.id"
                >
                    {{ f.label || 'Untitled field' }}
                </option>
            </select>

            <input placeholder="Equals value"
            :value="field.condition.value"
            @input="updateCondition('value', $event.target.value)">
        </div>

        <label>
            <input type="checkbox"
            :checked="field.required"
            @change="update('required', $event.target.checked)"
        >
            Required
        </label>

        <OptionsEditor v-if="field.type === 'select'"
         :options="field.options"
          @update-options="newOptions => update('options', newOptions)">
        </OptionsEditor>
    </div>
</template>

<style scoped>
.field-editor{
    padding: 10px;
    border: 1px solid #0e0202;
    margin: 10px 0;
    display: flex;
    align-items: center;
    gap: 10px;
    border-radius: 4px;
}

input , select{
    padding: 5px;
    font-size: 14px;
    border: 1px solid #05101c;
    border-radius: 4px;
    flex-grow: 1;
}
</style>