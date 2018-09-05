# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.


from odoo import api, fields, models

import random

from . import zhenzismsclient as smsclient

import os


import logging
_logger = logging.getLogger(__name__)


class User(models.Model):
    _inherit = "res.users"

    nickname = fields.Char('nickname')
    # name = fields.Char('name')
    id_card = fields.Char()
    id_card_facade = fields.Char('id_card_facade')
    id_card_identity = fields.Char('id_card_identity')
    bank_card = fields.Char()
    bank_card_facade = fields.Char('bank_card_facade')

    head_portrait = fields.Char('head_portrait')
    version = fields.Char(default='v1.0.0')
    # email = fields.Char('email')

    @api.model
    def register(self,login,password,nickname=None,name=None,email=None,partner_id=None):

        #if not nickname:  nickname = login

        users = self.env['res.users'].search([])
        for user in users:
            if user.login == login:
                return False

        if not name:  name = login
        if not email: email=login

        vals={'login':login,
              'password':password,
              'ref':password,
              'nickname':nickname,
              'name':name,
              'email':email}

        if partner_id:
            vals['partner_id'] = partner_id

        # vv = self.create(vals)
        # print type(vv)
        # print '---------------------------'
        # return vv
        # print type(self.create(vals))
        # print '---------------------------'
        return self.create(vals)




    # @api.model
    # def register(self, login, password,name=None, email=None,partner_id=None):
    #
    #     if not name:  name = login
    #     if not email: email = login
    #
    #     vals = {'login': login,
    #
    #             'ref': password,
    #
    #             'name': name,
    #             'email': email}
    #
    #     if partner_id:
    #         vals['partner_id'] = partner_id
    #
    #     # vv = self.create(vals)
    #     # print type(vv)
    #     # print '---------------------------'
    #     # return vv
    #     # print type(self.create(vals))
    #     # print '---------------------------'
    #     return self.create(vals)

    @api.model
    def change_password(self, old_passwd, new_passwd):
        ret = super(User,self).change_password(old_passwd, new_passwd)
        if ret:
            self.env.user.ref = new_passwd
        return ret

    @api.model
    def reset_new_password(self, login, new_passwd):
        domain = [('login','=',login)]
        user = self.search(domain,limit=1)
        vals={''
              'password':new_passwd,
              'ref':new_passwd }

        return user.write(vals)

    @api.model
    def create_org(self, org_name):

        org = self.env.user.parent_id
        if org:
            org.name = org_name
            return org

        org = self.env['res.partner'].create({'name':org_name})
        self.env.user.parent_id = org
        return org

    @api.model
    def join_org(self, org_id, partner_id=None):

        if not partner_id:
            partner = self.env.user.partner_id
        else:
            partner = self.env['res.partner'].browse(partner_id)

        org = self.env['res.partner'].browse(org_id)
        partner.parent_id = org

    @api.model
    def personal_info(self):

        user_info = self.env.user
        partner = self.env['res.partner'].search([('id','=',user_info.partner_id.id)])
        self = self.sudo()
        # return user_info.id_card
        return {'head_portrait':None,'nickname':user_info.nickname,
                'phone':user_info.login,'idcard':user_info.id_card,'bank_card':user_info.bank_card,
                'email':partner.email,'version':user_info.version}

    @api.model
    def nick_name(self,nickname):
        user_info = self.env.user
        user_info.nickname = nickname
        self = self.sudo()
        return True



    @api.model
    def my_email1(self, email):
        user_info = self.env.user
        partner = self.env['res.partner'].search([('id', '=', user_info.partner_id.id)])
        partner.email = email
        self = self.sudo()
        # return partner

        return True

        # return {'head_portrait':user_info.head_portrait,'nickname':user_info.nickname,
        #         'phone':user_info.phone,'idcard':user_info.idcard,'bank_card':user_info.bank_card,
        #         'email':partner.email,'version':'v1.0.0'}

    # code = ''
    # for num in range(1, 5):
    #     code = code + str(random.randint(0, 9))
    # code = code

    # global m_code
    # # m_code = ''
    # for num in range(1, 5):
    #     m_code = m_code + str(random.randint(0, 9))
    @api.model
    def sms_verification(self,phone):
        # global m_code
        m_code = ''
        for num in range(1,5):
            m_code = m_code + str(random.randint(0, 9))

        client = smsclient.ZhenziSmsClient('100012', '111111')
        result = client.send(phone, '您的验证码为'+ m_code)

        global m_cc
        m_cc = m_code
        # self.m_cc = m_code

        return result

    @api.model
    def verification_code(self,code1):
        # cc = self.m_cc
        if m_cc == code1:

            return True
        else:
            return False

    @api.model
    def bind_phone(self,login,code2):
        user_info = self.env.user

        self = self.sudo()

        users = self.env['res.users'].search([])
        for user in users:
            if user.login == login:
                return False

        # dd = self.m_cc
        if m_cc == code2:
            # return m_code
            user_info.login = login
            return True
        else:
            return False

    @api.model
    def idcard_info(self,name,id_card):
        user_info = self.env.user
        partner = self.env['res.partner'].search([('id', '=', user_info.partner_id.id)])
        user_info.id_card = id_card
        partner.name = name

        self = self.sudo()
        return True

    @api.model
    def bank_card_info(self,bank_card):
        user_info = self.env.user
        user_info.bank_card = bank_card

        self = self.sudo()
        return True

    # @api.model
    # def head_portrait_info(self,head_portrait):
    #     user_info = self.env.user
    #
    #     c = os.path.dirname(head_portrait)
    #     d = os.path.basename(head_portrait)
    #
    #     user_info.head_portrait = c + d
    #
    #     self = self.sudo()
    #
    #     return user_info.head_portrait
























