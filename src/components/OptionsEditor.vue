<script setup>
import { toValue } from 'vue';

const props = defineProps({
    field:{
        type: Object,
        required: true
    }
})

const emit= defineEmits(['update-options'])

function addOption(){
    emit('update-options', [...props.field.options, ''])
}

function updateOption(index, value){
    const newOptions = [...props.field.options]
    newOptions[index] = value
    emit('update-options', newOptions)
}

function removeOption(index){
    emit('update-options', 
    props.field.options.filter((_, i)=> i !== index)
    )
}
</script>

<template>
    <div class="options-section">
        <p>Options:</p>
        <div v-for="(option , index) in props.field.options"
         :key="index" 
         class="option-row">

            <input type="text" 
            :value="option" 
            @input="updateOption(index, $event.target.value)">

            <button @click="removeOption(index)">Remove</button>
        </div>
        <button @click="addOption">Add Option</button>
    </div>
</template>

<style scoped>
.options-section {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #ddd;
}

.option-row {
  display: flex;
  gap: 5px;
  margin-bottom: 5px;
}
</style>