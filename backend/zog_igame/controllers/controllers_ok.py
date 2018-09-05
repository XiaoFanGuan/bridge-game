import logging
_logger = logging.getLogger(__name__)

from odoo import http

from odoo.http import request
from odoo.service import security
from odoo.service import model


class GameBrg(http.Controller):
    @http.route('/game/bridge/login1',type='http',auth='none',cors='*',csrf=False)
    def login1(self,**kw):
        return "hello world!"

    @http.route('/game/bridge/login/',type='json', auth='none', cors='*',csrf=False)
    def login(self,**kw):
        json = http.request.jsonrequest

        #if not request.uid:
        #if request.uid and json.get('sid'):
        #    session = http.root.session_store.get(json['sid'])
        #    return { 'sid': session.sid }

        db = json['server']
        user = json['user']
        password = json['password']
        uid = odoo.env['res.users'].authenticate(db,user.password,None )
        if not uid:return False


        session = http.request.session
        session.db = db
        session.uid = uid
        session.login = user
        session.session_token = uid and security.compute_session_token(session)
        session.context = http.request.env['res.users'].context_get() or {}
        session.context['uid'] = uid
        session._fix_lang(session.context)
        http.root.session_store.save(session)
        return { 'sid': session.sid }        