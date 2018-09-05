import Models from './OdooRpc';
export default class My extends Models {
    constructor(...args) {
        super(...args);
        this.model = 'res.users';
        // this.model = 'og.igame';
    }
    /*
    参数： 无
    返回值： {[]}
     */



    personal_info() {
        //查询个人信息
        this.exec('personal_info', {}, []);
        // const obj = this.with_model('res.users');  //模型名
        // obj.exec('personal_info', {},[]);
        /**
        * params:
        * return:
       */
    }
    // bind_phone() {
    //     //绑定修改手机号

    // }

    email(email) {
        //邮箱绑定修改
        this.exec('email', {}, email);
    }

    nick_name(nickname) {
        //修改姓名
        this.exec('nick_name', {}, nickname);
    }

    //发送验证码
    sms_verification(phone) {
        this.exec('sms_verification', {}, phone);
    }
    //验证码
    verification_code(code1) {
        this.exec('verification_code', {}, code1);
    }

    //保存手机号
    bind_phone(login, code1) {
        this.exec('bind_phone', {}, login, code1)
    }
    //保存邮箱 
    my_email1(email) {
        this.exec('my_email1', {}, email)
    }
    //修改密码
    change_password(old_passwd, new_passwd) {
        this.exec('change_password', {}, old_passwd, new_passwd);
    }

    //绑定身份证
    idcard_info(name, id_card) {
        this.exec('idcard_info', {}, name, id_card);
    }

    //绑定 银行卡
    bank_card_info(bank_card) {
        this.exec("bank_card_info", {}, bank_card)
    }

}