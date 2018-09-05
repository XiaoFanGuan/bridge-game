# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import api, fields, models
import json
import logging
_logger = logging.getLogger(__name__)

import random

class Board(models.Model):
    _inherit = "og.board"


#for testing
    @api.multi
    def init_board(self,channel_id):
        self = self.sudo()  
        players = self.table_id.player_ids
        players_info = []
        for rec in players:
            vals=[rec.name,rec.position,rec.partner_id.id]
            players_info.append(vals)
        vals = {'cards':self.name,'dealer':self.dealer,'vulnerable':self.vulnerable,
                    'players':players_info}
        self.env['og.channel'].browse(channel_id).message_post(body=str(vals))
        return vals


#new func
    def _send_play(self,channel_id,bidinfo):
        self.env['og.channel'].browse(channel_id).message_post(body=str(bidinfo))

#modified

    @api.multi
    def play(self, pos, card):
        self = self.sudo()
        ret, ccdd = self._check_play(pos, card)
        if ret:
            return ret, ccdd
        # self.env['og.board.card'].browse(ccdd.id).write({'number':1 + max(self.card_ids.mapped('number') )})
        ccdd.number = 1 + max(self.card_ids.mapped('number'))
        return ccdd.id

    @api.multi
    def sendplay(self, ccdd_id, channel_id):
        self = self.sudo()
        ccdd = self.env['og.board.card'].browse(ccdd_id)

        vals = {'number': ccdd.number, 'card': ccdd.name, 'pos': ccdd.pos, 'suit': ccdd.suit,
                'rank': ccdd.rank, 'ns_win': self.ns_win, 'ew_win': self.ew_win,
                'nextplayer': self.player}
        self._send_play(channel_id, vals)

        return vals


    def _check_play(self, pos, card):
        if not ( self.contract and self.declarer):
            return (-1,'bidding, not Play ')

        if self.trick_count>=13:
            return (-2,'Play End')

        if pos==self.dummy:
            return (-3,'Dummy cant play')

        if pos==self.declarer and self.player==self.dummy:
            pos = self.dummy

        if self.player != pos:
            return (-4,'Wrong Player')

        ts = self._get_tricks()
        ct = ts and ts[-1] or []
        ct = [c for c in ct]
        ct.sort(key=lambda c: c.number)
        suit = ct and len(ct)<4 and ct[0].suit or None

        if suit and suit != card[0]:
            if self.card_ids.filtered(
                    lambda c: (c.suit==suit and c.pos==pos
                              ) and not c.number ):
                return (-5,'Wrong suit' )

        cs = self.card_ids.filtered(
                lambda c: (c.name==card and c.pos==pos
                          ) and not c.number)

        if not cs:
            return (-5, 'No card')

        return (0, cs[0])

    @api.multi
    def claim1(self,pos,num,channel_id):
        self = self.sudo()
        boards = self.env['og.board.card'].search([('board_id','=',self.id),('pos','=',pos)])
        bo = []
        for board in boards:
            if board.cardno == 0:
                bo.append(board.name)
            # return board.name,board.cardno

        vals={'board':bo,'pos':pos,'num':num,}
        self._send_play(channel_id,vals)
        return vals

    # def claim2(self,channel_id,agree):
    #     if agree == True:
    #         self._send_play(channel_id, agree)
    #         # self.claim2()
    #     if agree == False:
    #         self._send_play(channel_id, agree)
    #

    @api.model
    def send_message(self,channel_id,args):

        self._send_play(channel_id,args)
        return args

    @api.multi
    def claim(self,pos,num,channel_id):
        """ 
        num :  the number to get from unplayed tricks by pos
        """
        self = self.sudo()
        ret = self._check_claim(pos, num)

        if ret:
            return ret

        self.claimer = pos
        self.claim_result = num
        #self.refresh()
        vals = {'result':self.result2,'ns_point':self.ns_point,'ew_point':self.ew_point}
        self._send_play(channel_id, vals)

        return self.result2,self.ns_point,self.ew_point
        # return 0

    def _check_claim(self,pos, num):
        if self.claimer:
            return (-1,'Claim again.')

        rest = 13 - (self.ns_win + self.ew_win)
        if num<0:
            return (-1,'Claimed num must >0')
        if num>rest:
            return (-1,'Claimed num too big')

        if not pos:
            return (-2,'Claimed position is wrong')

        if pos in [self.dummy]:
            return (-3,'Claimed position is dummy')
        return 0


    def undo(self):
        #self.refresh()
        if self.claimer:
            return self._undo_claim()

        cs = [c for c in self.card_ids if c.number]
        if cs:
            return self._undo_play()
        elif self.call_ids:
            return self._undo_bid()

        return 0

    def _undo_claim(self):
        self.claimer = None
        self.claim_result = 0
        #self.refresh()
        return 1

    def _undo_play(self):
        cs = [c for c in self.card_ids if c.number]
        if not cs:
            return 0
        cs.sort(key=lambda c: c.number)
        cs[-1].number = 0
        #self.refresh()
        return 1

    def _undo_bid(self):
        if not self.call_ids:
            return None
        self.call_ids.sorted(key=lambda c: c.number)

        self.call_ids[-1].unlink()
        #self.refresh()
        return 1


    @api.multi
    @api.returns('self')
    def get_random_card(self):
        import random

        pos = self.player
        ts = self._get_tricks()
        ct = ts and ts[-1] or []
        ct = [c for c in ct]
        ct.sort(key=lambda c: c.number)
        suit = ct and len(ct)<4 and ct[0].suit or None

        cards = self.card_ids.filtered(
             lambda card: card.pos == pos and not card.number)

        cs = [c for c in cards if c.suit == suit ]

        if cs:
            card = cs[ random.randint(0,len(cs)-1 )]
        else:
            cs  = cards
            card = cs and cs[ random.randint(0,len(cs)-1) 
                            ] or self.env['og.board.card']

        return card

    @api.multi
    def get_random_claim(self):
        ps = [ p for p in 'NESW' if p != self.dummy ]
        random.shuffle(ps)
        pos = ps[0]
        rest = 13 - self.ns_win - self.ew_win
        rst = random.randint(rest - rest//5 ,rest)
        if pos == self.declarer:
            rst = rst
        else:
            rst = rest - rst
        return pos, rst

    @api.multi
    def get_random_play(self):
        self.refresh()
        r2 = [0]+[ i for i in range(60)]
        random.shuffle(r2 )
        if r2[0]:
            card = self.get_random_card()
            pos = card.pos
            pos = pos==self.dummy and self.declarer or pos
            return 1, pos, card.name
        else:
            pos, claim = self.get_random_claim()
            return 0, pos, claim



