# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

import logging
_logger = logging.getLogger(__name__)

from odoo import http
from odoo.http import request
from odoo import SUPERUSER_ID, registry, api


from odoo.addons.bus.controllers.main import BusController

class Message(BusController):

    @http.route('/longpolling/igame', type="json", auth="public", cors='*')
    def poll2(self, channels, last, options=None):
        msgs = self.poll(channels, last, options)
        new_msgs = []

        for msg in msgs:
            nmsg = self._message(msg)
            nmsg = nmsg and nmsg or msg
            new_msgs.append(nmsg)

        return new_msgs


    def _message(self, msg):
        msg_channel = msg['channel']

        if not isinstance(msg_channel, list):
            return None

        db, model, channel_id = msg_channel
        if request.db != db:
            return None

        if model != 'mail.channel':
            return None

        with registry(db).cursor() as cr:
            env = api.Environment(cr, SUPERUSER_ID, {})
            domain = [('channel_id','=',channel_id)]
            game_channel = env['og.channel'].sudo().search([],limit=1)

            if not game_channel:
                return None

            nmsg = msg.copy()

            #msg_id = msg['id']
            #msg_message = msg['message']
            message_id = msg['message']['id']
            nmsg['msg'] = game_channel.message_get(message_id)
            return nmsg


        return None
