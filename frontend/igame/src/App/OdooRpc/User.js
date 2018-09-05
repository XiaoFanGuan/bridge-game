import Models from './OdooRpc';
const config = require('../../config');
const HOST = config.HOST;
const DATABASE = config.DATABASE;
// const HOST = 'http://124.42.117.43:8069';
// const HOST = 'http://192.168.0.20:8069';
// const HOST = 'http://192.168.0.113:8069';
// const HOST = 'http://192.168.0.114:8069';
// const DATABASE = 'TT';

export default class User extends Models {
    createData = (login, password) => ({
        'db': DATABASE,
        'login': login,
        'password': password,
    });
    createData1 = (login, password, nickname = null) => ({
        'db': DATABASE,
        'login': login,
        'password': password, 
        'nickname': nickname,
    });

    login(login, password) {
        const url = HOST + '/json/user/login';
        const data = this.createData(login, password);
        return this.m.jsonrpc(url, data)
    }
    register(login, password, nickName) {
        const url = HOST + '/json/user/register';
        const data = this.createData1(login, password, nickName);
        console.log(data)
        return this.m.jsonrpc(url, data)
    }
    resetPassword(login, password) {
        const url = HOST + '/json/user/reset/password';
        const data = this.createData(login, password);
        return this.m.jsonrpc(url, data)
    }

}