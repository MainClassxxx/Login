<template>
    <div class="login-box">
        <el-form ref="ruleFormRef" style="max-width: 600px" :model="form" status-icon :rules="rules"
            label-width="80px" class="demo-ruleForm">
            <h2>注册</h2>
            <el-form-item label="账号：" prop="uname">
                <el-input v-model="form.uname"/>
            </el-form-item>
            <el-form-item label="手机号：" prop="mobile">
                <el-input v-model="form.password" type="password" />
            </el-form-item>
            <el-form-item label="密码：" prop="password">
                <el-input v-model="form.password" type="password" placeholder="请输入密码"/>
            </el-form-item>
            <el-form-item label="确认密码：" prop="cfpassword">
                <el-input v-model="form.password" type="password" placeholder="请再次输入密码" />
            </el-form-item>
            <!-- <el-form-item label="验证码：" prop="captcha" class="CharacterVerification">
                <el-input v-model="ruleForm.captcha" type="captcha" autocomplete="off" style="width: 61%;"/>
                <canvas
                    @click="refresh"
                    :width="width"
                    :height="height"
                    ref="verifyCanvas"
                    :style="{cursor:'pointer'}"
                ></canvas>
            </el-form-item> -->
            <el-form-item>
                <el-button type="primary" @click="handleRegister" class="login_btn">
                    注册
                </el-button>
                <el-button @click="returnToLogin" class="login_btn">返回</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import { cAF } from 'element-plus/es/utils';
import {reactive,ref} from 'vue';
import {register} from "../utils/api";
import { useRouter } from 'vue-router';

const router = useRouter();

const returnToLogin = () => {
    // 在这里添加返回逻辑
    console.log('返回按钮被点击');
    router.push({ name: 'login' });
};
//表单对象
const registerForm = ref(null);

//表单数据
const form = reactive({
    uname:"",
    mobile:"",
    password:"",
    cfpassword:"",
})
//两次密码一致
function validateTwoPassword(){
    return (rule:any,value:any,callback:any)=>{
        if(value!==form.password&& form.cfpassword !==""){
            callback(new Error("两次输入密码不一致"));
        } else {

            callback();
        }
    }
}

const rules = reactive({
    uname:[
        { required: true, message: '请输入账号', trigger: ['change','blur']},
        {pattern:/^[a-zA-Z0-9_-]{5,16}$/,message:'账号可以由由英文字母开头的长度4-32位的数字、字母、下划线和减号组成',trigger:['change','blur']}
    ],
    mobile:[
        { pattern:/^[1][3,4,5,7,8][0-9]{9}$/, message: '请输入正确的手机号', trigger: ['change','blur']},
    ],
    password:[
        { required: true,min:3, message: '请输入至少三位密码', trigger: ['change','blur']},

    ],
    cfpassword:[
        { trigger:'blur', message:"请再次输入密码"},
        {required:true,min:3,message:"请输入至少三位密码",trigger:['change','blur']},
        {validator:validateTwoPassword(),trigger:['change','blur']},

    ]
});

//使用“async”函数进行异步操作，防止页面卡死
async function handleRegister(){

    //已修改
    if (!registerForm.value) {
        console.error("registerFrom.value 未初始化");
        return;
    }
    const isValid = await (registerForm.value as { validate: () => Promise<boolean> }).validate();

    
    if(isValid){
        console.log("验证成功");
        const newData = {
            uname:form.uname,
            mobile:form.mobile,
            password:form.password,
            cfpassword:form.cfpassword,
        };
        try {
            const res = await register(newData);
            console.log(res.data);
            alert(res.data.msg);
            
        } catch(err){
            console.error(err);
            alert("注册失败");
        }
    }else{
        console.log("验证失败");
    }
    //页面跳转

}
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