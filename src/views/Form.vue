<template>
<div>
    <el-card >
    <template #header> 基本表单 </template>
    <Form :fieldList="fieldList" :model="model" @submit="handleBaseSubmit" :options="{showResetButton:true,labelPosition:'left' }">
    </Form>
  </el-card>
  <el-card >
    <template #header> 自定义验证的表单 （使用slot自定义按钮） </template>
    <Form :fieldList="ruleFieldList" :options="{ labelWidth: 100 }">
      <!-- 如果不使用默认的按钮可以使用插槽自定义内容， 插槽返回的model就是当前表单的数据， formRef是当前表单的FormInstance -->
      <template #buttons="{ model, formRef }">
        <el-button @click="handleSubmit(model, formRef)">保存</el-button>
      </template>
    </Form>
  </el-card>
</div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { exampleForm } from "../config";
import Form from "../components/form/index.vue";
import { ElMessage, FormInstance } from "element-plus";
const fieldList: Form.FieldItem[] = exampleForm.base;
const ruleFieldList: Form.FieldItem[] = exampleForm.ruleForm
const model = ref<Record<string, any>>({
  name: "Kevin",
  gender: 1,
  hobbies: [1],
  job: 3,
  readonly: "只读输入框",
  summary: "尤雨溪懂个锤子vue",
});
const handleBaseSubmit = (model: Record<string, any>) => {
  console.log(model);
  ElMessage({
    message: "提交成功",
    type: "success",
  });
};
const handleSubmit = (model: any, formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            console.log('submit!', model)
            ElMessage.success('自定义验证表单')
        } else {
            console.log('error submit!')
            return false
        }
    })
}
</script>
<style lang="scss" scoped>
</style>
