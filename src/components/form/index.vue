<template>
  <el-form @submit.prevent :model="formModel" v-bind="_options" ref="formRef">
    <template v-for="(item, index) in fieldList" :key="index">
      <!-- 单选框 -->
      <el-form-item
        :label="item.label"
        v-if="item.type === 'radio'"
        :rules="item.rules"
        :prop="[item.field]"
      >
        <el-radio-group
          v-model="formModel[item.field]"
          :disabled="item.disabled"
          :style="item.style"
          v-bind="item"
        >
          <el-radio
            :label="val[item.options?.valueKey || 'value']"
            :size="val[item.options?.size]"
            v-for="val in item.options?.data"
            :key="val[item.options?.valueKey || 'value']"
            @change="handleRadioChange(item.field)"
            v-bind="val"
          >
            {{ val[item.options?.labelkey || "label"] }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 复选框 -->
      <el-form-item
        :label="item.label"
        v-else-if="item.type === 'checkbox'"
        :rules="item.rules"
        :prop="[item.field]"
      >
        <el-checkbox-group
          v-model="formModel[item.field]"
          :disabled="item.disabled"
          v-bind="item"
        >
          <el-checkbox
            v-for="c in item.options?.data"
            :key="c[item.options?.valueKey || 'value']"
            :label="c[item.options?.valueKey || 'value']"
            v-bind="c"
            >{{ c[item.options?.labelkey || "label"] }}</el-checkbox
          >
        </el-checkbox-group>
      </el-form-item>
      <!-- 下拉框 -->
      <el-form-item
        :label="item.label"
        v-else-if="item.type === 'select'"
        :rules="item.rules"
        :prop="[item.field]"
      >
        <el-select
          v-model="formModel[item.field]"
          :placeholder="item.options?.placeholder || '请选择'"
          :disabled="item.disabled"
          :filterable="item.options?.filterable"
          :style="item.options?.style"
          v-bind="item"
          v-on="bindEvents(item.events)"
        >
          <el-option
            v-for="s in item.options?.data"
            :key="s[item.options?.valueKey || 'value']"
            :label="s[item.options?.labelkey || 'label']"
            :value="s[item.options?.valueKey || 'value']"
            v-bind="s"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="item.label" v-else-if="item.type === 'time'" >
        <el-time-picker v-model="formModel.timeFront"  v-bind="item"/>
        <el-time-picker v-model="formModel.timeAfter" v-bind="item" />
      </el-form-item>
      <!-- 默认输入框 -->
      <el-form-item
        :label="item.label"
        :rules="item.rules"
        :prop="[item.field]"
        v-else
      >
        <el-input
          v-model="formModel[item.field]"
          :readonly="item.readonly"
          :type="item.type ?? 'text'"
          :placeholder="item.placeholder || item.label"
          :disabled="item.disabled"
          :showPassword="item.showPassword"
          :clearable="item.clearable"
          @keyup.enter="handleKeyUp(item.enterable)"
          v-on="bindEvents(item.events)"
          v-bind="item"
        >
          <template #prefix>
            <!-- prefix 插槽内容 -->
            <template v-if="item.prefix">{{ item.prefix.children }}</template>
          </template>
          <template #suffix>
            <!-- suffix 插槽内容 -->
            <template v-if="item.suffix">{{ item.suffix }}</template>
          </template>
          <template #prepend>
            <!-- prepend 插槽内容 -->
            <template v-if="item.prepend">{{ item.prepend }}</template>
          </template>
          <template #append>
            <!-- append 插槽内容 -->
            <template v-if="item.append">{{ item.append }}</template>
          </template>
        </el-input>
      </el-form-item>
    </template>

    <el-form-item>
      <slot name="buttons" :model="formModel" :formRef="formRef">
        <el-button type="primary" @click="onSubmit(formRef)">{{
          _options.submitButtonText
        }}</el-button>
        <el-button
          v-if="_options.showResetButton"
          type="info"
          @click="resetForm(formRef)"
        >
          {{ _options.resetButtonText }}
        </el-button>
        <el-button v-if="_options.showCancelButton" @click="emit('cancel')">
          {{ _options.cancelButtonText }}
        </el-button>
      </slot>
    </el-form-item>
  </el-form>
</template>
<script lang="ts" setup>
import type { FormInstance } from "element-plus";
import { ComputedRef, ref, computed, watch } from "vue";
// 父组件传递的值
interface Props {
  fieldList: Form.FieldItem[];
  model?: Record<Form.FieldItem["field"], Form.FieldItem["value"]>;
  options?: Form.Options;
}
// 表单的数据
const formModel = ref<Record<string, any>>({});
const formRef = ref<FormInstance>();
const props = defineProps<Props>();
// 设置option默认值，如果传入自定义的配置则合并option配置项
const _options: ComputedRef<Form.Options> = computed(() => {
  const option = {
    labelPosition: "right",
    disabled: false,
    submitButtonText: "提交",
    resetButtonText: "重置",
    cancelButtonText: "取消",
  };
  return Object.assign(option, props?.options);
});
interface EmitEvent {
  (e: "submit", params: any): void;
  (e: "reset"): void;
  (e: "cancel"): void;
}
const emit = defineEmits<EmitEvent>();
defineExpose({
  formRef,
});
// 根据fieldList初始化model， 如果formModel有传值就用传递的model数据模型，否则就给上面声明的formModel设置相应的(key,value) [item.field]， item.value是表单的默认值（选填）
watch(
  () => props.model,
  () => {
    props.fieldList.map((item: Form.FieldItem) => {
      // 如果类型为checkbox，默认值需要设置一个空数组
      const value = item.type === "checkbox" ? [] : "";
      props.model
        ? (formModel.value = props.model)
        : (formModel.value[item.field] = item.value || value);
    });
  },
  { immediate: true }
);

//动态绑定事件
const bindEvents = (events: Record<string, Function> = {}) => {
  const eventBindings: Record<string, Function> = {};
  for (const [event, handler] of Object.entries(events)) {
    eventBindings[`${event.charAt(0).toUpperCase() + event.slice(1)}`] = handler;
  }
  return eventBindings;
};

// 提交按钮
const onSubmit = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      console.log(formRef);

      emit("submit", formModel.value);
    } else {
      return false;
    }
  });
};
// 输入框回车事件
const handleKeyUp = (enterable: boolean | undefined) => {
  if (!enterable) return;
  onSubmit(formRef.value);
};
// 重置
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
const handleRadioChange = (selectedValue: any, radioItem: Form.FieldItem) => {
  if (selectedValue === "A") {
    // 找到对应的复选框选项，设置为 disabled
    formRef.value.forEach((checkbox) => {
      if (checkbox.value === "A") {
        checkbox.disabled = true;
      } else {
        checkbox.disabled = false; // 其他复选框可选
      }
    });
  } else {
    // 其他情况，复选框可选
    radioItem.options.data.forEach((checkbox) => {
      checkbox.disabled = false;
    });
  }
};
</script>
<style lang="scss" scoped>
.example-basic .el-date-editor {
  margin: 8px;
}
</style>