<script setup>
import OptionsEditor from './OptionsEditor.vue';

const props= defineProps({
    field: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['update-field', 'remove-field']);

function handleInput(key, value){
    emit('update-field', props.field.id, {[key]: value})
}

</script>

<template>
    <div class="field-editor">
        <input type="text"
        :value="field.label"
        @input="handleInput('label', $event.target.value)">

        <select :value="field.type" @change="handleInput('type', $event.target.value)">
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="select">Select</option>
            <option value="checkbox">Checkbox</option>
        </select>

        <label>
            <input type="checkbox"
            :checked="field.required"
            @change="handleInput('required', $event.target.checked)">
            Required
        </label>

        <button @click="$emit('remove-field', field.id)">Remove</button>

        <OptionsEditor v-if="field.type === 'select'"
         :options="field.options"
          @update-options="newOptions => handleInput('options', newOptions)">
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