# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.



import logging
_logger = logging.getLogger(__name__)


from odoo import http

from odoo.http import request


""" 
import redis

def get_message(table_id):
    red = redis.StrictRedis(host='localhost', port=6379, db=6)
    pubsub = red.pubsub()
    #pubsub.subscribe('table' + str(table_id) )
    pubsub.subscribe('chat')
    for message in pubsub.listen():
        data = bytes(message['data']).decode('utf8')
        # if 'close' in data:   # 这里可以完成 断开操作。
        #     print("llllllllllllll")
        #     data = 'id:close\n'
        #     return data
        ds = [  ord(d) for d in data ]
        _logger.error('123456789=%s--%s', type(data),ds )
        data = 'data: %s\n\n' % (data and data or '122323')

        yield data

    return 1

class GameBrg(http.Controller):
    @http.route('/game/bridge/stream/<int:table_id>',
                type='http', auth='none', cors='*',csrf=False)
    def stream(self, table_id,**kw):
        #user = request.env.user
        headers = [('Content-type','text/event-stream')]
        data = get_message(table_id)
        response = request.make_response(data, headers)
        return response


    @http.route('/game/bridge/play/<int:table_id>', 
                type='http', auth='none',cors='*',csrf=False)
    def play(self, table_id,**kw):
        #user = request.env.user
        # pos, card =E, SA
        # self.env[og.borad].play(pos, card)
        # player  = self.env[og.borad].player
        # tricks  = self.env[og.borad].tricks
        #msg =  user.name + ','+ str(kw)
        msg = str(kw)
        red = redis.StrictRedis(host='localhost', port=6379, db=6)
        red.publish('chat', msg)
        return str(1)

        #return str(game_id) + '===='+str(uid)+str(kw) 
        #return "Hello, world"

    @http.route('/game/test',type='http',auth='none',cors='*',csrf=False)
    def test1(self,**kw):
        session = request.session
        print(session.db)
        return "session:::" + session.db


"""
