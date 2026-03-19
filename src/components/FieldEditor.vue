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

// function updateCondition(key, value){
//      emit('update-field', props.field.id, {
//          condition:{
//              ...props.field.condition,
//              [key]: value
//          }
//      })
//  }

function updateConditionRoot(key, value){
    emit('update-field', props.field.id ,{
        conditions:{
            ...props.field.conditions,
            [key]:value
        }
    })
}

function updateRule(index, key, value){
    const updatedRules = [...props.field.conditions.rules]

    updatedRules[index] = {
        ...updatedRules[index],
        [key]: value
    }

    emit('update-field', props.field.id, {
        conditions:{
            ...props.field.conditions,
            rules: updatedRules
        }
    })
}

function getFieldLabel(fieldId){
    const field = props.allFields.find(f=> f.id === fieldId)
    return field?.label || 'Unknown field'
}

function formatOperator(op){
    const map = {
        equals : 'equals',
        notEquals: 'does not equal',
        greaterThan: 'is greater than',
        lessThan: 'is less than',
        includes: 'includes'
    }
    return map[op] || op
}

function addRule(){
    const newRule = {
        targetFieldId: '',
        operator: 'equals',
        value: ''
    }

    emit('update-field', props.field.id, {
        conditions:{
            ...props.field.conditions,
            rules: [...props.field.conditions.rules, newRule]
        }
    })
}

function removeRule(index){
    const updatedRules = props.field.conditions.rules.filter((_, i)=> i !== index)

    emit('update-field', props.field.id, {
        conditions:{
            ...props.field.conditions,
            rules: updatedRules
        }
    })
}

function updateValidation(key,value){
    emit('update-field', props.field.id, {
        validation:{
            ...(props.field.validation || {}),
            [key]:value
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

        
        <label>
            <input type="checkbox"
            :checked="field.required"
            @change="update('required', $event.target.checked)"
        >
            Required
        </label>

        <div class="validation-section">
            <div v-if="field.type === 'text'">
                <input 
                type="number"
                placeholder="Min Length"
                :value="field.validation?.minLength"
                @input="updateValidation('minLength', Number($event.target.value))"
                >

                <input
                type="number"
                placeholder="Max Length"
                :value="field.validation?.maxLength"
                @input="updateValidation('maxLength', Number($event.target.value))"
                >

            </div>

            <div v-if="field.type === 'number'">
                <input 
                type="number"
                placeholder="Min Value"
                :value="field.validation?.minValue"
                @input="updateValidation('minValue',Number($event.target.value))"
                >

                <input
                type="number"
                placeholder="Max Value"
                :value="field.validation?.maxValue"
                @input="updateValidation('maxValue', Number($event.target.value))"
                >
            </div>
        </div>

        <button class="secondary-btn"  @click="$emit('add-condition', field.id)">
            Add Condition
        </button>

        <button class="remove-btn"  @click="$emit('remove-field', field.id)">Remove</button>

        <div v-if="field.conditions" class="condition-section">
            <h3>Visibility Rules</h3>

            <p class="condition-title">Show this field IF:</p>

            <select :value="field.conditions.logic" 
            @change="updateConditionRoot('logic', $event.target.value)">

                <option value="AND">AND</option>
                <option value="OR">OR</option>
            </select>

            <div v-for="(rule , index) in field.conditions.rules || []" :key="index" class="rule-box">
                <div class="rule-row">
                    <select
                    :value="rule.targetFieldId"
                    @change="updateRule(index, 'targetFieldId', $event.target.value)"
                    >
                        <option disabled value="">Select Field</option>
                        <option
                        v-for="f in allFields.filter(f=> f.id !== field.id)"
                        :key="f.id"
                        :value="f.id"
                        >
                            {{ f.label || 'Untitled field' }}
                        </option>
                    </select>

                    <select 
                    :value="rule.operator"
                    @change="updateRule(index, 'operator', $event.target.value)">

                        <option value="equals">Equals</option>
                        <option value="notEquals">Not Equals</option>
                        <option value="greaterThan">Greater Than</option>
                        <option value="lessThan">Less Than</option>
                        <option value="includes">Includes</option>

                    </select>
                </div>

                <div class="rule-row">

                    <input placeholder="Value"
                    :value="rule.value"
                    @input="updateRule(index , 'value', $event.target.value)">

                    <button @click="removeRule(index)">❌</button>

                    <p class="rule-preview">
                        {{ getFieldLabel(rule.targetFieldId) }}
                        {{ formatOperator(rule.operator) }}
                        "{{ rule.value }}"
                    </p>

                    <p v-if="!rule.targetFieldId || !rule.value" class="rule-warning">
                        ⚠️ Incomplete rule
                    </p>
                </div>
            </div>

            <button @click="addRule">➕ Add Rule</button>
        </div>

        <OptionsEditor v-if="field.type === 'select'"
         :options="field.options"
          @update-options="newOptions => update('options', newOptions)">
        </OptionsEditor>
    </div>
</template>

<style scoped>
*{
    box-sizing: border-box;
}

.field-editor{
    padding: 12px;
    border: 1px solid #0e0202;
    margin: 12px 0;
    display: flex;
    /* align-items: center; */
    flex-direction: column;
    /* flex-wrap: wrap; */
    gap: 13px;
    border-radius: 5px;
    box-shadow: 2px 2px 5px rgba(0,0, 0, 0.6);
    width: 100%;
}

input , select{
    padding: 5px;
    font-size: 15px;
    border: 1px solid #05101c;
    border-radius: 4px;
    /* flex-grow: 1;
    gap: 10px; */
    width: 100%;
}

.condition-section{
    padding: 10px;
    margin-top: 11px;
    background: #f0f0f0;
    display: flex;
    flex-direction: column; 
    gap: 10px;
    border: 1px solid #0e0202;
    border-radius: 4px;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.6);
}

button{
    padding: 5px 10px;
    font-size: 14px;
    cursor: pointer;
    border-radius: 3px;
    border: 1px solid #05101c;
    width: fit-content;
}

button:hover{
    background: #e6dcdc;
    color: #05101c;
}

.secondary-btn{
    background: #f0f0f0;
    color: #333;
}

.remove-btn{
    background: #dc3545;
    color: #fff;
}

.rule-box{
    border: 1px solid #ccc;
    padding: 10px;
    margin: 10px 0;
    border-radius: 4px;
    background: #fff;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.rule-row{
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.rule-row select, 
.rule-row input{
    flex: 1;
    min-width: 110px;
}

.remove-rule-btn{
    background: #dc3545;
    color: white;
    border: none;
    padding: 5px 8px;
    width: fit-content;
}

.condition-title{
    font-weight: bold;
    
}

.rule-preview{
    font-size: 14px;
    color:#05101c;
    margin-top: 4px;
}

.rule-warning{
    font-weight: bold;
    color: #dc3545;
}
</style>