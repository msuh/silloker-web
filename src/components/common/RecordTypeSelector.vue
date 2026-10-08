<script setup lang="ts">
import Checkbox from 'primevue/checkbox';
import type { RecordType } from '../../types/records';
import { RECORD_TYPE_OPTIONS } from '../../types/records';

const props = defineProps<{
  modelValue: RecordType[];
  legend?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: RecordType[]];
}>();

const updateSelection = (recordType: RecordType, checked: boolean): void => {
  const next = checked
    ? [...new Set([...props.modelValue, recordType])]
    : props.modelValue.filter((value) => value !== recordType);
  emit('update:modelValue', next);
};
</script>

<template>
  <fieldset class="record-type-selector">
    <legend>{{ legend ?? 'Record sources' }}</legend>
    <div class="record-type-grid">
      <label v-for="option in RECORD_TYPE_OPTIONS" :key="option.value" class="check-option">
        <Checkbox
          :model-value="modelValue.includes(option.value)"
          binary
          :input-id="`record-type-${option.value}`"
          @update:model-value="updateSelection(option.value, Boolean($event))"
        />
        <span>{{ option.label }}</span>
      </label>
    </div>
  </fieldset>
</template>
