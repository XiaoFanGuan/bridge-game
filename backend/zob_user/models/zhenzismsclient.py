# -*- coding: utf-8 -*-
import urllib.request
import urllib.parse


class ZhenziSmsClient(object):
    url = "http://sms.zhenzikj.com";

    def __init__(self, appId, appSecret):
        self.appId = appId
        self.appSecret = appSecret

    def send(self, number, message):
        data = {
            'appId': self.appId,
            'appSecret': self.appSecret,
            'message': message,
            'number': number
        }
        # data = urllib.urlencode(data);
        # req = urllib.request.Request(self.url+'/sms/send.do', data);
        # res_data = urllib.request.urlopen(req);
        # res = res_data.read();

        data = urllib.parse.urlencode(data).encode('utf-8')
        req = urllib.request.Request(self.url + '/sms/send.do', data=data)
        res_data = urllib.request.urlopen(req)
        res = res_data.read()
        res = res.decode('utf-8')
        return res

    def balance(self):
        data = {
            'appId': self.appId,
            'appSecret': self.appSecret
        }
        data = urllib.parse.urlencode(data).encode('utf-8')
        req = urllib.request.Request(self.url + '/account/balance.do', data=data)
        res_data = urllib.request.urlopen(req)
        res = res_data.read()
        return res
