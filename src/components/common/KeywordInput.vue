<script setup lang="ts">
import { ref } from 'vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';

const props = defineProps<{
  modelValue: string[];
  label?: string;
  placeholder?: string;
  maximum: number;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string[]];
}>();

const draft = ref('');
const inputId = `keyword-input-${Math.random().toString(36).slice(2)}`;

const addKeyword = (): void => {
  const value = draft.value.trim();
  if (!value) return;
  emit('update:modelValue', [...props.modelValue, value]);
  draft.value = '';
};

const handleKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Enter' || event.key === ',') {
    event.preventDefault();
    addKeyword();
  }
};

const removeKeyword = (index: number): void => {
  emit(
    'update:modelValue',
    props.modelValue.filter((_, itemIndex) => itemIndex !== index),
  );
};
</script>

<template>
  <div class="field-group">
    <label :for="inputId">{{ label ?? 'Keywords' }}</label>
    <p :id="`${inputId}-help`" class="field-help">
      Add with Enter or a comma. Up to {{ maximum }} keywords.
    </p>
    <div v-if="modelValue.length > 0" class="chip-list" aria-label="Selected keywords">
      <span
        v-for="(keyword, index) in modelValue"
        :key="`${keyword}-${index}`"
        class="keyword-chip"
      >
        {{ keyword }}
        <button
          type="button"
          :aria-label="`Remove keyword ${keyword}`"
          @click="removeKeyword(index)"
        >
          <i class="pi pi-times" aria-hidden="true"></i>
        </button>
      </span>
    </div>
    <div class="keyword-entry">
      <InputText
        :id="inputId"
        v-model="draft"
        :placeholder="placeholder ?? 'Enter a keyword'"
        :aria-describedby="`${inputId}-help`"
        @keydown="handleKeydown"
        @blur="addKeyword"
      />
      <Button
        type="button"
        label="Add"
        severity="secondary"
        :disabled="!draft.trim()"
        @mousedown.prevent
        @click="addKeyword"
      />
    </div>
  </div>
</template>
