<template>
    <div class="login-box">
        <el-form ref="ruleFormRef" style="max-width: 600px" :model="ruleForm" status-icon :rules="rules"
            label-width="80px" class="demo-ruleForm">
            <h2>登录</h2>
            <el-form-item label="账号：" prop="uname">
                <el-input v-model="ruleForm.uname" autocomplete="off" />
            </el-form-item>
            <el-form-item label="密码：" prop="password">
                <el-input v-model="ruleForm.password" type="password" autocomplete="off" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm(ruleFormRef)" class="login_btn">
                    登录
                </el-button>
                <el-button @click="redirectsForm()" class="login_btn">注册</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts">
import { reactive } from 'vue';
import { defineComponent } from 'vue';
import { toRefs,ref} from 'vue';
import {LoginData } from '../type/login';
import type { FormInstance, FormRules } from 'element-plus'
import {login} from '../request/api'
import { useRouter } from 'vue-router';
import { pushScopeId } from 'vue';

export default defineComponent({
    setup () {
        
        const data=reactive(new LoginData());
        const rules = {
                username: [
                    { required: true, message: '请输入账号', trigger: 'blur' },
                    { min: 3, max: 10, message: '账号长度为 3 to 10', trigger: 'blur' },
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 3, max: 10, message: '密码长度为 3 to 10', trigger: 'blur' },
                ],
        };

        //登录
        const ruleFormRef = ref<FormInstance>()
        const router=useRouter();
        const submitForm = (formEl: FormInstance | undefined) => {
            if (!formEl) return;
            //对表单的内容进行验证
            //valid布尔类型，true验证成功，反之失败
            formEl.validate((valid) => {
                if (valid) {
                    //console.log('submit!');
                    login(data.ruleForm).then((res)=>{
                        // console.log(res);
                        //保存token
                        localStorage.setItem('token',res.data.token);
                        //跳转页面
                        router.push('/home')
                        
                    })
                } else {
                    console.log('error submit!');
                }
            });
            // console.log(formEl)
        }
        const redirectsForm = () => {
            router.push('/register')
        }

        //解构data使用属性
        return {...toRefs(data),rules,ruleFormRef,submitForm,redirectsForm}
    }
})
</script>

<style lang ="scss" scoped>
    .login-box{
        width: 100%;
        height: 100%;
        background:url("../assets/Login.jpg") ;
        padding:1px;
        text-align: center;
        .demo-ruleForm{
        width: 500px;
        margin: 200px auto;
        background-color: aliceblue;
        padding: 40px;
        border-radius: 20px;
    }
    .login_btn{
        width: 48%;
    }
    h2{
        margin-bottom: 10px;
    }
    }
    
</style>