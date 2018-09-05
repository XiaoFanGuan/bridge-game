# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import api, fields, models


class TableApi(models.AbstractModel):
    _name = "ogi.table"

    @api.model
    def get(self, game_id=None):
        round_id = game_id
        round = self.env['og.igame.round'].browse(round_id)
        tables = round.table_ids
        return [ dict( [('id',t.id),('number',t.number), ('name',t.name)] )
                for t in tables  ]

class DealApi(models.AbstractModel):
    _name = "ogi.deal"

    @api.model
    def get(self, game_id=None):
        round_id = game_id
        round = self.env['og.igame.round'].browse(round_id)
        deals = round.deal_ids
        return [ dict( [('id',d.id),('number',d.number), ('name',d.name)] )
                 for d in deals  ]

class PlayerApi(models.AbstractModel):
    _name = "ogi.player"

    @api.model
    def get(self, table_id=None):
        table = self.env['og.table'].browse(table_id)
        ps = table.player_ids
        return [ dict( [('partner_id',d.partner_id.id),
                        ('position',d.position), ('name',d.name)] )
                  for d in ps  ]



class BoardApi(models.AbstractModel):
    _name = "ogi.board"

    @api.model
    def post(self, table_id=None, deal_id=None,
                          contract=None, declarer=None,
                          openlead=None, result=None):

        vals = { 'table_id': table_id,  'deal_id' : deal_id }

        def fn(contract):
            contract = contract.upper()
            if contract and contract[0] == 'P':
                return 1, 0, '', 'p'

            rank = int(contract[0])
            trump = contract[1]=='N' and contract[1:3] or contract[1:2]
            risk = contract[-1]=='X' and ( contract[-2]=='X' and 'xx' or 'x' ) or 'p'

            return 0, rank, trump, risk

        all_pass, rank, trump, risk = fn(contract)

        vals_add = {
                'contract_rank':  rank,
                'contract_trump': trump,
                'contract_risk':  risk, }

        if not all_pass:
            vals_add2 = {
                'declarer': declarer,
                'open_lead_suit': openlead[0],
                'open_lead_rank': openlead[1],
                'trick_count':    result + rank + 6,
                #'tricks':  tricks,
                #'auction': auction
            }
            vals_add.update( vals_add2 )

        vals.update( vals_add )

        tbl = self.env['og.table'].browse(table_id)
        board = tbl.board_ids.filtered(lambda r: r.deal_id.id == deal_id)

        if not board:
            return board.create(vals)

        board.write(vals)
# print 'iiii'
     #    return board.id
