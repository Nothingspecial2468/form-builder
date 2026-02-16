<script setup>
import { useFormBuilder } from './composables/useFormBuilder';

const{
  fields,
  addField,
  removeField,
  updateField,
  isFormValid,
  resetForm
} = useFormBuilder();

</script>

<template>
  <div>
    <h1>Form Builder</h1>

    <div v-for="field in fields" :key="field.id" style="border: 1px solid black; padding: 10px; margin: 10px 0;">
      <input type="text"
      :value="field.label"
      @input="updateField(field.id, {label: $event.target.value})"
      placeholder="Field Label">

      <select :value="field.type"
      @change="updateField(field.id, {type: $event.target.value})">

        <option value="text">Text</option>
        <option value="number">Number</option>
        <option value="select">Select</option>
        <option value="checkbox">Checkbox</option>

      </select>

      <label>
        <input type="checkbox"
        :checked="field.required"
        @change="updateField(field.id, {required: $event.target.checked})">
        Required
      </label>

      <pre>{{ fields }}</pre>

      <button @click="removeField(field.id)">Remove</button>

    </div>
  </div>
</template>

<style scoped>
</style>
