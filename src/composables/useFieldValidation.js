export function useFieldValidation(){
    function validateRequired(field){
        const {value , required} = field

        if(!required){
            return { isValid: true, error:null}
        }

        if(!value && value !==0 && value!== false)
        {
            return {
                isValid:false,
                error: 'This field is required',
            }
        }
        return { isValid:true, error: null}
    }

    function isEmpty(value){
        return value ==='' || value === null || value === undefined
    }

    function validateTextField(field){
        const {value ,required, validation} = field

        const stringValue = String(value || '')

        console.log(field)
        console.log("Validation rules:", validation)

        if(required && isEmpty(value)){
            return {
                isValid: false,
                error: 'This field is required'
            }
        }

        if(isEmpty(value)){
            return { isValid: true, error: null}
        }

        if(validation.minLength !== null &&
            validation.minLength !== undefined &&
            stringValue.length < validation.minLength
        )
        {
            return {
                isValid: false,
                error: `Minimum length is ${validation.minLength} characters`,
            }
        }

        if(validation.maxLength !== null &&
            validation.maxLength !== undefined &&
            stringValue.length > validation.maxLength
        )
        {
            return {
                isValid: false,
                error: `Maximum length is ${validation.maxLength} characters`,
            }
        }

        if(validation.pattern){
            try{
                const regEx = new RegExp(validation.pattern)

                if(!regEx.test(stringValue)){
                    return {
                        isValid: false,
                        error: validation.patternErrorMsge || 'Invalid format!'
                    }
                }
            }
            catch(error){
                console.error('Invalid regex pattern:', validation.pattern, error)
                return {
                    isValid: true, error: null
                }
            }
        }

        return{ isValid: true, error: null}
    }

    function validateNumberField(field){
        const {value ,required, validation} = field

        // if(!validation){
        //     return {isValid:true , error:null}
        // }
        if(required && isEmpty(value)){
            return {
                isValid: false,
                error: 'This field is required'
            }
        }

        if(isEmpty(value)){
            return{
                isValid: true,
                error: null
            }
        }

        const numValue = Number(value)

        if(Number.isNaN(numValue)){
            return {
                isValid: false,
                error: 'Please enter a valid number!',
            }
        }

        if(validation.integerOnly === true && !Number.isInteger(numValue)){
            return {
                isValid: false,
                error: 'Only whole numbers are allowed.',
            }
        }

        if(
            validation.minValue !== null &&
            validation.minValue !== undefined &&
            numValue < validation.minValue
        ){
            return {
                isValid: false,
                error : `Minimum value is ${validation.minValue}`
            }
        }

        if(
            validation.maxValue !== null &&
            validation.maxValue !== undefined &&
            numValue > validation.maxValue
        ){
            return {
                isValid: false,
                error: `Maximum value is ${validation.maxValue}`
            }
        }

        return { isValid: true , error: null}
    }

    function validateSelectField(field){
        const {value, required} = field

        if(required && isEmpty(value)){
            return {
                isValid: false,
                error: 'Please select an option'
            }
        }

        return {isValid: true, error: null}
    }

    function validateCheckboxField(field){
        const {value, required} = field

        if(required && value !== true){
            return {
                isValid: false,
                error: 'Field must be checked!'
            }
        }

        return {isValid: true, error: null}
    }

    function validateField(field){
        
        // if(field.required && isEmpty(field.value)){
        //     return {
        //         isValid:false,
        //         error: 'This field is required'
        //     }
        // }

        switch(field.type){
            case 'text':
                return validateTextField(field)

            case 'number':
                return validateNumberField(field)

            case 'select':
                return validateSelectField(field)

            case 'checkbox':
                return validateCheckboxField(field)

            default:
                return { isValid: true , error: null}
        }
    }

    function validateForm(fields){
        const errors = new Map()
        let isValid = true

        for(const field of fields){
            const {isValid: fieldValid, error} = validateField(field)

            if(!fieldValid){
                errors.set(field.id, error)
                isValid = false
            }
        }
        return {isValid , errors}
    }

    return{
        validateField,
        validateForm
    }
}