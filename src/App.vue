<script setup>
import { useFormBuilder } from './composables/useFormBuilder';
import FieldEditor  from './components/FieldEditor.vue';
import FieldPreview from './components/FieldPreview.vue';

const{
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
} = useFormBuilder();

const A = 'whatever'
const conditionValue = 'hello'
console.log(A === conditionValue)
</script>

<template>
  <div class="container">
    <h1>Form Builder</h1>

    <div v-if="fields.length === 0" class="empty">
        <p>No fields yet!</p>
        <p>Click "Add Field" to start building your form.</p>
    </div>

    <button @click="addField">Add Field</button>

    <FieldEditor v-for="field in fields"
     :key="field.id"
      :field="field"
      :all-fields="fields"
       @update-field="updateField"
        @remove-field="removeField"
        @add-condition="addCondition"
        >
      </FieldEditor>

    <h2>Form Preview</h2>
    <FieldPreview :fields="fields"
      :evaluate-condition="evaluateCondition"
        @update-field="(id, value)=> updateField(id, {value})">
    </FieldPreview>

    <pre>{{ fields }}</pre>
  </div>
</template>

<style scoped>
.container{
  margin: 0 auto;
  padding: 10px;
  max-width: 600px;
  display: flex;
  align-items: center;
  flex-direction: column;
}

h1{
  font-size: 30px;
  font-weight: 600;
  margin: 10px 0;
}

button{
  margin: 10px 0;
  padding: 8px 16px;
  font-size: 15px;
  cursor: pointer;
  border-radius: 3px;
  border: 1px solid #05101c;
}

button:hover{
  background: #816d6d;
  color: #05101c;
}

.empty{
  text-align: center;
  padding: 4px 8px;
  border: 1px solid #05101c;
  border-radius: 3px;
  margin: 10px 0;
}
</style>
