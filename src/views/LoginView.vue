<template>
    <div class="login-box">
        <el-form ref="loginForm" style="max-width: 600px" :model="form" status-icon :rules="rules"
            label-width="80px" class="demo-ruleForm">
            <h2>登录</h2>
            <el-form-item label="账号：" prop="uname">
                <el-input v-model="form.uname" autocomplete="off" />
            </el-form-item>
            <el-form-item label="密码：" prop="password">
                <el-input v-model="form.password" type="password" autocomplete="off" />
            </el-form-item>
            <el-form-item label="验证码：" prop="captcha" class="CharacterVerification">
                <el-input v-model="form.captcha" type="captcha" autocomplete="off" style="width: 61%;"/>
                <canvas
                    @click="refresh"
                    :width="width"
                    :height="height"
                    ref="verifyCanvas"
                    :style="{cursor:'pointer'}"
                ></canvas>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="isCaptcha" class="login_btn">
                    登录
                </el-button>
                <el-button @click="redirectsForm()" class="login_btn">注册</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts">
import { reactive } from 'vue';
import { defineComponent,onMounted} from 'vue';
import { toRefs,ref} from 'vue';
import {login} from '../utils/api';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default defineComponent({

    name: "CharacterVerification",
    props: {
        width: {
            type: Number,
            default: 150,
        },
        height: {
            type: Number,
            default: 40,
        },
        type: {
            type: String,
            default: "blend", //图形验证码默认类型blend:数字字母混合类型、number:纯数字、letter:纯字母
        },
    },
    //组合式api入口 //用于在组件创建之前执行一些逻辑
    setup (props, { expose }) {
        const loginForm:any = ref(null);
        
        const form = reactive({
            uname: "",
            password: "",
            captcha: "",
        })
        const rules = reactive({
                uname: [
                    { required: true, message: '请输入账号', trigger:['change' ,'blur'],},
                    {pattern: /^[a-zA-Z0-9_-]{3,16}$/, message: '账号格式错误', trigger: ['change' ,'blur']}
                ],
                password: [
                    { required: true, message: '请输入密码', trigger:['change' ,'blur'], },
                    { min: 3, message: '密码长度至少为 ', trigger:['change' ,'blur'], },
                ],
                captcha:[
                    { required: true, message: '请输入验证码', trigger:['change' ,'blur'], },
                    { min: 4, max: 4, message: '验证码格式错误', trigger:['change' ,'blur'], },

                ]
        });
        
        //登录
        //const ruleFormRef = ref<FormInstance>()
         const router=useRouter();
        // const submitForm = (formEl: FormInstance | undefined) => {
        //     if(validate(data.ruleForm.captcha)){
        //         if (!formEl) return;
        //     //对表单的内容进行验证
        //     //valid布尔类型，true验证成功，反之失败
        //     formEl.validate((valid) => {
        //         if (valid) {
        //             //console.log('submit!');
        //             login(data.ruleForm).then((res)=>{
        //                 // console.log(res);
        //                 //保存token
        //                 localStorage.setItem('token',res.data.token);
        //                 //跳转页面
        //                 router.push('/home')
                        
        //             })
        //         } else {
        //             console.log('error submit!');
        //         }
        //     });
        //     // console.log(formEl)
        //     }else{

        //         alert("验证码错误！")
        //     }
            
        // }

        //
        function isCaptcha() {
            if (validate(form.captcha)) {
                handleLogin();//调用注册函数
                // axios.post('http://localhost:8088/user/login', {
                //     uname: form.uname,
                //     password: form.password
                // })
                //     .then(response => {
                //         console.log("登录成功");
                        
                //         // 处理响应
                //     })
                //     .catch(error => {
                //         // 处理错误
                //     });
   
            } else {
                alert("验证码错误");
            }
        }
        //使用async函数处理异步操作
        async function handleLogin() {
            const isValid = await loginForm.value.validate();
            if (isValid) {
                try {
                    console.log("校验成功");
                    const res = await login({uname: form.uname, password: form.password});
                    console.log(res.data);
                    alert("登录成功！");
                    router.push('/home');
                } catch (error) {
                    console.log(error);
                    alert("登录失败！");
                }
            } else {
                alert("表单未初始化或为空！");
            }
        }

        
        const redirectsForm = () => {
            router.push('/register')
        }

        //图形验证码
        const numArr = "0,1,2,3,4,5,6,7,8,9".split(",");
        const letterArr =
            "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z".split(
                ","
            );
        const code = ref("");
        const CharacterVerification = ref<HTMLDivElement | null>(null);
        const verifyCanvas = ref<HTMLCanvasElement | null>(null);
        // 生成验证码
        let ctx;
        onMounted(() => {
            if(loginForm.value){
                console.log(loginForm.value);
            }
            refresh();
        })
        const refresh = () => {
            code.value = "";
            if (verifyCanvas.value?.getContext) {
                ctx = verifyCanvas.value.getContext("2d") as CanvasRenderingContext2D;
            } else {
                return;
            }

            ctx.textBaseline = "middle";

            ctx.fillStyle = randomColor(180, 240);
            ctx.fillRect(0, 0, props.width, props.height);

            let  txtArr;
            if (props.type == "blend") {
                //判断验证码类型
                txtArr = numArr.concat(letterArr);
            } else if (props.type == "number") {
                txtArr = numArr;
            } else {
                txtArr = letterArr;
            }

            for (var i = 1; i <= 4; i++) {
                var txt = txtArr[randomNum(0, txtArr.length)];
                code.value += txt;
                ctx.font = randomNum(props.height / 2, props.height) + "px SimHei"; //随机生成字体大小
                ctx.fillStyle = randomColor(50, 160); //随机生成字体颜色
                ctx.shadowOffsetX = randomNum(-3, 3);
                ctx.shadowOffsetY = randomNum(-3, 3);
                ctx.shadowBlur = randomNum(-3, 3);
                ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
                var x = (props.width / 5) * i;
                var y = props.height / 2;
                var deg = randomNum(-30, 30);
                /**设置旋转角度和坐标原点**/
                ctx.translate(x, y);
                ctx.rotate((deg * Math.PI) / 180);
                ctx.fillText(txt, 0, 0);
                /**恢复旋转角度和坐标原点**/
                ctx.rotate((-deg * Math.PI) / 180);
                ctx.translate(-x, -y);
            }
            /**绘制干扰线**/
            for (let i = 0; i < 4; i++) {
                ctx.strokeStyle = randomColor(40, 180);
                ctx.beginPath();
                ctx.moveTo(randomNum(0, props.width), randomNum(0, props.height));
                ctx.lineTo(randomNum(0, props.width), randomNum(0, props.height));
                ctx.stroke();
            }
            /**绘制干扰点**/
            for (let i = 0; i < props.width / 4; i++) {
                ctx.fillStyle = randomColor(0, 255);
                ctx.beginPath();
                ctx.arc(
                    randomNum(0, props.width),
                    randomNum(0, props.height),
                    1,
                    0,
                    2 * Math.PI
                );
                ctx.fill();
            }
        };

        /**生成一个随机色**/
        const randomColor = (min: number, max: number) => {
            var r = randomNum(min, max);
            var g = randomNum(min, max);
            var b = randomNum(min, max);
            return "rgb(" + r + "," + g + "," + b + ")";
        };
        /**生成一个随机数**/
        const randomNum = (min: number, max: number) => {
            return Math.floor(Math.random() * (max - min) + min);
        };
        /**验证验证码**/
        const validate = (iptCode: string) => {
            console.log("验证码：" + iptCode);
            
            var newIptCode = iptCode.toLowerCase();
            var v_code = code.value.toLowerCase();
            if (newIptCode == v_code) {
                return true;
            } else {
                refresh();
                return false;
            }
        };

        // 暴露方法
        expose({ validate });

        //解构data使用属性
        return { 
            rules,
            form,
            loginForm,
            isCaptcha,
            redirectsForm,
            CharacterVerification,
            verifyCanvas,
            refresh,
            validate,
            handleLogin,
        }
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