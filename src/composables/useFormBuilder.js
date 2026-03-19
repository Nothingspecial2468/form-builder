import {ref , computed, watch, onMounted} from 'vue';
import { useFieldValidation } from './useFieldValidation';

export function useFormBuilder(){
    const fields = ref([]);
    const {validateField, validateForm} = useFieldValidation();

    function getDefaultValidation(){
        return {
                minLength: null,
                maxLength: null,
                minValue: null,
                maxValue: null,
                integerOnly: false,
                pattern: null,
                patternErrorMsge: null
            }
    }

    function addField(){
        const newField = {
            id : crypto.randomUUID(),
            label : '',
            type : 'text',
            options : [],
            required : false,
            value : '',
            conditions : null,
            error: null,
            validation: getDefaultValidation()
        }

        fields.value.push(newField);
    }

    watch(fields, (newValue)=>{
        localStorage.setItem("formBuilderState", JSON.stringify(newValue))
        }, {deep: true}
    )

    onMounted(()=>{
        const saved = localStorage.getItem("formBuilderState")

        if(saved){
            fields.value = JSON.parse(saved).map(f=> {
                let conditions = f.conditions || null

                if(!conditions && f.condition){
                    conditions = {
                        logic: 'AND',
                        rules: [f.condition]
                    }
                }

                return {
                    ...f,
                    conditions,
                    validation: f.validation || getDefaultValidation(),
                    error: f.error ?? null
                }
            })
        }
    })

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

        field.conditions = {
            logic: 'AND', // default
            rules:[
                {
                    targetFieldId : '',
                    operator: 'equals',
                    value: ''
                }
            ] 
        }
    }

    function evaluateRule(rule){
        const { targetFieldId , operator , value} = rule

        if(!targetFieldId || !operator) return true

        const targetField = fields.value.find(f=> f.id === targetFieldId)

        if(!targetField) return false

        const targetValue = targetField.value

        if(targetValue === null || targetValue === undefined || targetValue === ''){
            return false
        }

        switch(operator){
            case 'equals':
                return String(targetValue) === String(value)
            
            case 'notEquals':
                return String(targetValue) !== String(value)
            
            case 'greaterThan':
                return Number(targetValue) > Number(value)

            case 'lessThan':
                return Number(targetValue) < Number(value)
            
            case 'includes':
                return String(targetValue).includes(value)

            default:
                return false
        }
    }

    function evaluateCondition(field){
        // if(!field.condition) return true;

        // const {targetFieldId , operator, value} = field.condition;

        // // INcomplete condition = treat as no condition
        // if(!targetFieldId || !operator) return true;

        // const targetField = 
        //     fields.value.find(f=> f.id === targetFieldId);

        // // if dependency is broken = hide the field
        // if(!targetField) return false;

        // // if target field has no value yet = hide the field
        // if(targetField.value === null || targetField.value === undefined) return false;

        // if(operator === 'equals'){
        //     return targetField.value === value;
        // }

        // unknown operator = hide the field

        const conditions = field.conditions

        if(!conditions || !conditions.rules?.length) return true

        const { logic = 'AND' , rules } = conditions

        const results  = rules.map(rule=> evaluateRule(rule))

        if(logic === 'AND'){
            return results.every(Boolean)
        }

        if(logic === 'OR'){
            return results.some(Boolean)
        }

        return true;
    }

    function removeField(id){
        fields.value = fields.value.filter(field=> field.id !== id);
    }

    function updateField(id, updates){
        console.log("Updates received:", updates)

        const field = fields.value.find(field=> field.id === id);

        if(!field) return;

        if(updates.validation){
            Object.assign(field.validation, updates.validation)
            delete updates.validation
        }

        Object.assign(field, updates);

        if(updates.type && updates.type !== 'select'){
            field.options = [];
        }
        else if(updates.type === 'select' && !field.options.length){
            field.options = ['Option 1', 'Option 2'];
        }
    }

    function validateFieldValue(fieldId){
        const field = fields.value.find(f=> f.id === fieldId)
        if(!field) return false

        const {isValid , error} = validateField(field)
        field.error = error
        return isValid
    }

    function validateFormFields(){
        const { isValid, errors } = validateForm(fields.value);

        // Update error state for all fields
        fields.value.forEach(field => {
            field.error = errors.get(field.id) || null;
        });

        return { isValid, errors };
    }

    function clearValidationErrors(){
        fields.value.forEach(f=> {
            f.error = null
        })
    }

    return{
        fields,
        addField,
        addCondition,
        evaluateCondition,
        removeField,
        updateField,
        validateFieldValue,
        validateFormFields,
        clearValidationErrors,
        getDefaultValidation,
    }
}