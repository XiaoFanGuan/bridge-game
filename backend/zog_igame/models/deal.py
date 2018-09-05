# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import api, fields, models

from .bridge_tools import POSITIONS
from .bridge_tools import SUITS,RANKS,CARDS
from .bridge_tools import VULNERABLES

def get_random_deal():
    import random
    cards = [ suit+rank for suit in 'SHDC' for rank in 'AKQJT98765432']
    random.shuffle(cards)

    def fn(index):
        hand = cards[13*index:13*index+13]
        def f1(hand,index,suit):
            hcs = [ 'AKQJT98765432'.index(card[1])
                    for card in hand if card[0] == suit ]
            hcs.sort()
            return ''.join( [ 'AKQJT98765432'[i] for i in hcs ] )

        return '.'.join( [ f1(hand,index,suit) for suit in 'SHDC' ] )

    return ' '.join( [  fn(index) for index in range(4)  ] )

def _name2cards(name):
    return [ ('SHDC'[j] + rank, 'NESW'[i]) 
              for i, hand  in enumerate( name.split(' ')) 
              for j, ranks in enumerate( hand.split('.'))
              for rank  in ranks
            ]

class Deal(models.Model):
    _name = "og.deal"
    _description = "Deal"
    _order = 'number'

    @api.model
    def _default_name(self):
        return get_random_deal()

    number = fields.Integer(default=1 )
    name = fields.Char('Name', compute='_compute_name',
                               inverse='_inverse_name',
                        default=_default_name,help='Full Deal')

    notes = fields.Text('Notes')

    dealer = fields.Selection(POSITIONS, compute='_compute_dealer_vul')

    vulnerable = fields.Selection(VULNERABLES,
                              compute='_compute_dealer_vul')

    @api.multi
    def _compute_dealer_vul(self):
        vuls = ['NO','NS','EW','BO']
        for record in self:
            n = record.number
            record.dealer = 'NESW'[ (n - 1) % 4 ]
            record.vulnerable = vuls[((n-1) % 4 + (n-1)//4) % 4]

    card_ids = fields.One2many('og.deal.card', 'deal_id', string='Cards')

    board_ids = fields.One2many('og.board', 'deal_id', string='Boards')

    @api.multi
    def _compute_name(self):
        def fn2(suitcard):
            suitcard.sort(key=lambda r: 'AKQJT98765432'.index(r.rank) )
            return ''.join([c.rank for c in suitcard])

        def fn1(hand):
            return '.'.join([ fn2([c for c in hand if c.suit==suit
                                   ]) for suit in 'SHDC' ])

        for rec in self:
            rec.name =' '.join([fn1([c for c in rec.card_ids if c.pos==pos
                                     ]) for pos in 'NESW' ])

    @api.multi
    def _inverse_name(self):
        for rec in self:
            for cd in _name2cards(rec.name):
                card = rec.card_ids.filtered(lambda c: c.name==cd[0])
                if card:
                    card.pos = cd[1]
                else:
                    card.create({'name':cd[0],'pos':cd[1],
                                 'deal_id': rec.id })


class DealCard(models.Model):
    _name = "og.deal.card"
    _description = "Deal Card"

    deal_id = fields.Many2one('og.deal')
    name = fields.Selection(CARDS)
    suit = fields.Selection(SUITS,compute='_compute_suit_rank')
    rank = fields.Selection(RANKS,compute='_compute_suit_rank')
    pos  = fields.Selection(POSITIONS)

    @api.multi
    def _compute_suit_rank(self):
        for rec in self:
            rec.suit = rec.name[0]
            rec.rank = rec.name[1]


