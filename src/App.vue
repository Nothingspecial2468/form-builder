<script setup>
import { useFormBuilder } from './composables/useFormBuilder';
import FieldEditor  from './components/FieldEditor.vue';
import FieldPreview from './components/FieldPreview.vue';

const{
  fields,
  addField,
  addCondition,
  evaluateCondition,
  removeField,
  updateField,
  validateFieldValue
} = useFormBuilder();

function handlePreviewUpdate(id , value){
    updateField(id , {value})
}
</script>

<template>
  <div class="container">
    <h1>Form Builder</h1>

    <div v-if="fields.length === 0" class="empty">
        <p>No fields yet!</p>
        <p>Click "Add Field" to start building your form.</p>
    </div>

    <div class="layout">
        <div class="editor-panel">

            <button class="primary-btn" @click="addField">
            Add Field
            </button>

            <FieldEditor
            v-for="field in fields"
            :key="field.id"
            :field="field"
            :all-fields="fields"
            @update-field="updateField"
            @remove-field="removeField"
            @add-condition="addCondition"
            />

        </div>

        <div class="preview-panel">

            <h2>Form Preview</h2>

            <FieldPreview
            :fields="fields"
            :evaluate-condition="evaluateCondition"
            :validate-field-value="validateFieldValue"
            @update-field="handlePreviewUpdate"
            />

        </div>
    </div>
  </div>
</template>

<style scoped>
.container{
  margin: 30px auto;
  padding: 13px;
  background: #816d6d;
  max-width: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border-radius: 8px;
}

.layout{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 21px;
    width: 100%;
}

.editor-panel{
    overflow-y: auto;
    text-align: center;
    border: 1px solid black;
    border-radius: 5px;
    padding: 14px;
}

.preview-panel{
    background: #f4f4f4;
    padding: 14px;
    border-radius: 5px;
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
  background: #e6dcdc;
  color: #05101c;
}

.primary-btn{
  background: #05101c;
  color: #fff;
}

.empty{
  text-align: center;
  padding: 4px 8px;
  border: 1px solid #05101c;
  border-radius: 7px;
  margin: 10px 0;
  font-size: 18px;
}
</style>
