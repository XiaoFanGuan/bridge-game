# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import api, fields, models


POSITIONS = [
        ('-',  'Neednot'),
        ('NS', 'NS'),
        ('EW', 'EW'),
        ('N', 'North'),
        ('E', 'East'),
        ('S', 'South'),
        ('W', 'West'),
    ]


class Table(models.Model):
    _name = "og.table"
    _description = "Table"
    _order = 'number'

    name = fields.Char('Name' )

    number = fields.Integer(default=1 )

    table_partner_ids = fields.One2many('og.table.partner','table_id')
    partner_ids = fields.Many2many('res.partner', compute='_compute_partner')
    player_ids = fields.Many2many('og.table.partner', compute='_compute_partner')
    ns_partner_id = fields.Many2one('res.partner', compute='_compute_partner')
    ew_partner_id = fields.Many2one('res.partner', compute='_compute_partner')

    @api.multi
    def _compute_partner(self):
        def _get(pos):
            tps = record.table_partner_ids
            tp_id = tps.filtered(lambda p: p.position in pos )
            return tp_id

        for record in self:
            players  = _get('NESW')
            record.player_ids  = players
            record.partner_ids = players.mapped('partner_id')
            record.ns_partner_id = _get( ['NS'] ).partner_id
            record.ew_partner_id = _get( ['EW'] ).partner_id

    deal_ids  = fields.Many2many('og.deal', string='Deals')
    board_ids = fields.One2many('og.board', 'table_id', string='Boards')


class TablePartner(models.Model):
    _name = "og.table.partner"
    _description = "Table Partner"
    _rec_name = 'partner_id'

    name = fields.Char('Name', related = 'partner_id.name' )

    partner_id = fields.Many2one('res.partner')
    table_id = fields.Many2one('og.table')

    position = fields.Selection(POSITIONS, string='Position', default='-')

