import {ref , computed} from 'vue';

export function useFormBuilder(){
    const fields = ref([]);

    function addField(){
        const newField = {
            id : crypto.randomUUID(),
            label : '',
            type : 'text',
            options : [],
            required : false,
            value : '',
            condition : null
        }

        fields.value.push(newField);
    }

    // feature: conditional logic building
    //     . field has optional conditioning rules
    //     . condition consists of:
    //        . field's id
    //        . operator 
    //        . value
    //     .field is visible only if condition evaluates
    //     .condition evaluation would be based on if:
    //          . field is checked
    //          . or not checked
             
    //     .hidden fields here shows the validation for the visibility case
    //     . a field can't depend on itself or on a field that depends on it (to avoid circular dependencies)
    // 

     function addCondition(fieldId){
        const field = fields.value.find(field=> field.id === fieldId);

        if(!field) return;

        field.condition = {
                targetFieldId : '',
                operator: 'equals',
                value: ''
            }
    }

    function evaluateCondition(field){
        if(!field.condition) return true;

        const {targetFieldId , operator, value} = field.condition;

        // INcomplete condition = treat as no condition
        if(!targetFieldId || !operator) return true;

        const targetField = 
            fields.value.find(f=> f.id === targetFieldId);

        // if dependency is broken = hide the field
        if(!targetField) return false;

        // if target field has no value yet = hide the field
        if(targetField.value === null || targetField.value === '') return false;

        if(operator === 'equals'){
            return targetField.value === value;
        }

        // unknown operator = hide the field
        return false;
    }

    // const visibleFields = computed(()=>{
    //     return fields.value.filter(f=> evaluateCondition(f));
    // })

    // function validateForm(){
    //     let isValid = true;

    //     visibleFields.value.forEach(f=>{
    //         if(f.required && f.value.trim() === ''){
    //             isValid = false;
    //         }
    //     })
    //     return isValid;
    // }

    function removeField(id){
        fields.value = fields.value.filter(field=> field.id !== id);
    }

    function updateField(id, updates){
        const field = fields.value.find(field=> field.id === id);

        if(!field) return;

        Object.assign(field, updates);

        if(updates.type && updates.type !== 'select'){
            field.options = [];
        }
        else if(updates.type === 'select' && !field.options.length){
            field.options = ['Option 1', 'Option 2'];
        }
    }

    // const isFormValid = computed(()=>{
    //     return fields.value.every(field=>{
    //         if(field.required) return field.value.trim() !== '';
    //         return true;
    //     })
    // })

    // function resetForm(){
    //     fields.value = [];
    // }

    return{
        fields,
        addField,
        addCondition,
        evaluateCondition,
        // visibleFields,
        // validateForm,
        removeField,
        updateField,
        // isFormValid,
        // resetForm
    }
}