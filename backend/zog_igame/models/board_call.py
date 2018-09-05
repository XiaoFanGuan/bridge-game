# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import api, fields, models

import logging
_logger = logging.getLogger(__name__)

from .bridge_tools import PASS, DBL, RDB, CALLS
from .bridge_tools import POSITIONS
from .bridge_tools import TRUMPS,RISKS,CONTRACTS
from .bridge_tools import SUITS,RANKS,CARDS
from .bridge_tools import partner, lho

class BoardCall(models.Model):
    _name = "og.board.call"
    _description = "Board Call"
    _order = 'number'

    board_id = fields.Many2one('og.board')

    number = fields.Integer()
    pos   = fields.Selection(POSITIONS)
    name  = fields.Selection(CALLS)

    rank  = fields.Integer( compute='_compute_call')
    trump = fields.Selection(TRUMPS, compute='_compute_call')
    risk  = fields.Selection(RISKS,  compute='_compute_call')


    @api.multi
    def _compute_call(self):
        for rec in self:
            if rec.name[0].isdigit():
                rec.rank  = int(rec.name[0])
                trump = rec.name[1]
                rec.trump = trump == 'N' and 'NT' or trump
                rec.risk  = None

            else:
                rec.rank  = 0
                rec.trump = None
                rec.risk  = rec.name

    def _compute_contract(self):
        """ return:   dclr,contract,rank,trump,risk """
        ret = self._compute_contract2()
        if ret:
            return ret

        return None, None, 0, None, None


    def _compute_contract2(self):
        self.sorted(key=lambda call: call.number)
        auction = self.mapped('name')

        if len(auction)==4 and auction.count(PASS) == 4:
            return None, PASS, 0, None, None

        elif len(auction) <= 3:
            return None

        elif auction[-3:].count(PASS) < 3:
            return None

        last_call = None
        risk = ''

        for call in self[-4::-1]:
            if call.name == PASS:
                continue
            elif call.name == RDB:
                risk = RDB
                continue
            elif call.name == DBL:
                risk = risk and risk or DBL
                continue
            else:
                last_call = call
                break

        def _cmp(call,last_call):
            if call.trump != last_call.trump:
                return 0
            elif call.pos in [last_call.pos, partner(last_call.pos)]:
                return 1
            else:
                return 0

        auction = self.filtered(lambda call: _cmp(call, last_call) )

        lc = last_call
        return auction[0].pos, lc.name + risk, lc.rank, lc.trump, risk


    @api.multi
    def write(self, vals):
        """ no write
        """
        return None


