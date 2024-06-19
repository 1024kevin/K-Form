import { h } from "vue"

// 自定义验证邮箱方法
const checkEmail = (rule: any, value: any, callback: any) => {
    if (!value) callback(new Error('Please input the email'))
    const regExp = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.(com|cn|net)$/
    regExp.test(value) ? callback() : callback(new Error('Please input the correct email address'))
}

// 表单配置示例
export const exampleForm = {
    base: [
        { label: '姓名',
         field: 'name', 
         disabled: true,
         prefix: h('i', { class: 'el-icon-user' }),
         suffix: 'suffix text',
         prepend: 'http://',
        append: '.com', },
        { label: '性别', field: 'gender', type: 'radio', options: { data: [{ label: '男', value: 1 }, { label: '女', value: 0 }] } },
        { label: '爱好', field: 'hobbies', type: 'checkbox', options: { data: [{ label: '吃饭', value: 1 }, { label: '睡觉', value: 2 }, { label: '写代码', value: 3 }] } },
        { label: '工作', field: 'job', type: 'select', options: { data: [{ id:1,label: '已通过', value: 1 , disabled: true,}, {id:2, label: '草稿', value: 2 }, {id:3, label: '已驳回', value: 3 }, {id:4, label: '审核中', value: 4 }]},clearable:true, events: {
            change: (val) => {
              console.log('select change', val);
            },
          }, },
        { label: '密码', field: 'password', type: 'password', placeholder: '这是一个密码输入框' },
        { label: '只读', field: 'readonly', readonly: true, placeholder: '这是一个只读输入框' },
        { label: '留言板', field: 'summary', type: 'textarea', placeholder: '留言板' },
        { label: '日期选择', field:'time',type:'time',placeholder:'请选择时间'},
        { label: '习惯', field: 'habits', type: 'checkbox', options: { data: [{ label: '抽烟', value: 1 }, { label: '槟榔', value: 2 }] } },
    ],
    ruleForm: [
        { label: '姓名', field: 'name', rules: [{ required: true, message: '必须输入姓名' }] },
        { label: '邮箱', field: 'email', rules: [{ required: true, validator: checkEmail }] },
    ]
} as Record<string, Form.FieldItem[]>
