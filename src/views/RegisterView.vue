<template>
    <div class="login-box">
        <el-form ref="ruleFormRef" style="max-width: 600px" :model="form" status-icon :rules="rules"
            label-width="80px" class="demo-ruleForm">
            <h2>注册</h2>
            <el-form-item label="  账号：" prop="uname" >
                <el-input v-model="form.uname" placeholder="请输入账号"/>
            </el-form-item>
            <el-form-item label="  手机号：" prop="mobile" >
                <el-input v-model="form.mobile" placeholder="请输入手机号"/>
            </el-form-item>
            <el-form-item label=" 验证码: " prop="captcha" >
                <el-input v-model="form.captcha1" placeholder="请输入验证码" style="width: 70%;"/>
                <el-button type="primary" style="width: 30%;" @click="btnTime" >{{ btnText }}</el-button>
            </el-form-item>
            <el-form-item label="  密码：" prop="password">
                <el-input v-model="form.password" type="password" placeholder="请输入密码"/>
            </el-form-item>
            <el-form-item label="确认密码:" prop="cfpassword">
                <el-input v-model="form.cfpassword" type="password" placeholder="请再次输入密码"/>
            </el-form-item>
            <el-form-item label="验证码：" prop="captcha" class="CharacterVerification">
                <el-input v-model="form.captcha2" type="captcha" autocomplete="off" style="width: 61%;" placeholder="请输入验证码"/>
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
                    注册
                </el-button>
                <el-button @click="returnToLogin" class="login_btn">返回</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import { cAF } from 'element-plus/es/utils';
import { reactive } from 'vue';
import { register } from "../utils/api";
import { useRouter } from 'vue-router';
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
    setup(props, { expose }) {
        const numArr = "0,1,2,3,4,5,6,7,8,9".split(",");
        const letterArr =
            "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z".split(
                ","
            );
            //ref创建响应式数据
        const code = ref("");
        const CharacterVerification = ref<HTMLDivElement | null>(null);
        const verifyCanvas = ref<HTMLCanvasElement | null>(null);
        // 生成验证码
        let ctx;
        onMounted(() => {
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
            var newIptCode = iptCode.toLowerCase();
            var v_code = code.value.toLowerCase();
            if (newIptCode == v_code) {
                return true;
            } else {
                refresh();
                return false;
            }
        };


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
            uname: "",
            mobile: "",
            password: "",
            cfpassword: "",
            captcha1: "",
            captcha2: "",
        })
        //两次密码一致
        function validateTwoPassword() {
            return (rule: any, value: any, callback: any) => {
                if (value !== form.password && form.cfpassword !== "") {
                    callback(new Error("两次输入密码不一致"));
                } else {

                    callback();
                }
            }
        }

        const rules = reactive({
            uname: [
                { required: true, message: '请输入账号', trigger: ['change', 'blur'] },
                { pattern: /^[a-zA-Z0-9_-]{5,16}$/, message: '账号可以由由英文字母开头的长度4-32位的数字、字母、下划线和减号组成', trigger: ['change', 'blur'] }
            ],
            mobile: [
                { pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '请输入正确的手机号', trigger: ['change', 'blur'] },
            ],
            password: [
                { required: true, min: 3, message: '请输入至少三位密码', trigger: ['change', 'blur'] },

            ],
            cfpassword: [
                { trigger: 'blur', message: "请再次输入密码" },
                { required: true, min: 3, message: "请输入至少三位密码", trigger: ['change', 'blur'] },
                { validator: validateTwoPassword(), trigger: ['change', 'blur'] },

            ],
            captcha1: [
                { required: true, message: '请输入验证码', trigger: ['change', 'blur'], },
                { min: 4, max: 4, message: '验证码格式错误', trigger: ['change', 'blur'], },
            ],
            captcha2: [
                { required: true, message: '请输入验证码', trigger: ['change', 'blur'], },
                { min: 4, max: 4, message: '验证码格式错误', trigger: ['change', 'blur'], },
            ]
        });

        function isCaptcha() {
            if (validate(form.captcha2)) {
                handleRegister();//调用注册函数
            } else {
                alert("验证码错误");
            }
        }
        //使用“async”函数进行异步操作，防止页面卡死
        async function handleRegister() {
            

            //已修改
            if (!registerForm.value) {
                console.error("registerForm.value 未初始化");
                return;
            }
            const isValid = await (registerForm.value as { validate: () => Promise<boolean> }).validate();


            if (isValid) {
                console.log("验证成功");
                const newData = {
                    uname: form.uname,
                    mobile: form.mobile,
                    password: form.password,
                    cfpassword: form.cfpassword,
                };
                try {
                    const res = await register(newData);
                    console.log(res.data);
                    alert(res.data.msg);

                } catch (err) {
                    console.error(err);
                    alert("注册失败");
                }
            } else {
                console.log("验证失败");
            }

        }


        //手机号格式验证
        function validateMobile(mobile:string):boolean {
    const mobilePattern = /^[1][3,4,5,7,8][0-9]{9}$/;
    return mobilePattern.test(mobile);
}

        //倒计时时间
        const totalTime = 60;
        //ref响应式引用,创建倒计时状态
        const countingDown = ref(false);

        // 倒计时剩余时间
        const remainingTime =  reactive({
            seconds: totalTime,
        })

        //计时器变量
        let timer: number | null = null;

        //倒计时
        const startCountingDown = () => {
            if (!countingDown.value) {
                countingDown.value = true;
                remainingTime.seconds = totalTime;
            }
            timer = setInterval(() => {
                if (remainingTime.seconds > 0) {
                    remainingTime.seconds--;
                } else {
                    stopCountingDown();
                }
            }, 1000);
        }

        //停止倒计时
        const stopCountingDown = () => {
            if(timer){
                clearInterval(timer);
                timer = null;
                countingDown.value = false;
            }
        }
        //按钮文字切换
        const btnText = computed(() => (countingDown.value ? remainingTime.seconds : "获取验证码"))

        const btnTime = () => {
            if(!validateMobile(form.mobile)){
                alert("请输入正确的手机号");
                return;
            }
            startCountingDown()
        }


        // 暴露方法
        expose({ validate });
        


        return {
            CharacterVerification,
            verifyCanvas,
            refresh,
            rules,
            form,
            registerForm,
            handleRegister,
            returnToLogin,
            isCaptcha,
            btnTime,
            btnText
            
        };
    },
});

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