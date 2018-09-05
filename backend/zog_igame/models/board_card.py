# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import api, fields, models

import logging
_logger = logging.getLogger(__name__)

from .bridge_tools import POSITIONS
from .bridge_tools import SUITS,RANKS,CARDS


class BoardCard(models.Model):
    _name = "og.board.card"
    _description = "Board Card"
    _order = 'board_id desc, number, id'

    board_id = fields.Many2one('og.board')
    deal_card_id = fields.Many2one('og.deal.card')

    deal_id = fields.Many2one('og.deal', related='deal_card_id.deal_id')
    name = fields.Selection(CARDS,related='deal_card_id.name')
    suit = fields.Selection(SUITS,related='deal_card_id.suit')
    rank = fields.Selection(RANKS,related='deal_card_id.rank')
    pos  = fields.Selection(POSITIONS,related='deal_card_id.pos')

    number = fields.Integer()
    trickno = fields.Integer(compute='_compute_number')
    cardno  = fields.Integer(compute='_compute_number')

    @api.multi
    def _compute_number(self):
        for rec in self:
            num = rec.number
            rec.trickno = num and (num-1)//4 + 1 or 0
            rec.cardno  = num and (num-1)%4 + 1 or 0

    @api.multi
    def get_winner( self, trump):
        if len(self)<4:
            return None

        def cmp_gt_card( first, second, trump):
            def index(rank):
                return '23456789TJQKA'.index(rank)

            if first.suit == second.suit:
                return index(first.rank) > index(second.rank)
            else:
                return first.suit == trump

        wincard = self[0]
        for card in self[1:]:
            ret = cmp_gt_card(card, wincard, trump)
            if ret:
                wincard = card

        return wincard.pos

