import {ref , computed} from 'vue';

export function useFormBuilder(){
    const fields = ref([]);

    function addField(){
        const newField = {
            id : Date.now(),
            label : '',
            type : 'text',
            options : [],
            required : false,
            value : ''
        }

        fields.value.push(newField);
    }

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

    const isFormValid = computed(()=>{
        return fields.value.every(field=>{
            if(field.required) return field.value.trim() !== '';
            return true;
        })
    })

    function resetForm(){
        fields.value = [];
    }

    return{
        fields,
        addField,
        removeField,
        updateField,
        isFormValid,
        resetForm
    }
}