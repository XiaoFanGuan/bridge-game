# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import api, fields, models

from .tools import point2imp, imp2vp

class Match(models.Model):
    _name = "og.match"
    _description = "Match"
    _order = 'number'

    name = fields.Char('Name' )
    number = fields.Integer(default=1, help="if a stage of parent." )

    open_table_id  = fields.Many2one('og.table', help="")
    close_table_id = fields.Many2one('og.table', help="")

    host_partner_id  = fields.Many2one('res.partner',
        compute='_compute_partner',
        inverse='_inverse_partner_host')
    guest_partner_id = fields.Many2one('res.partner',
        compute='_compute_partner',
        inverse='_inverse_partner_guest')

    def _inverse_partner_host(self):
        self._inverse_partner('host')

    def _inverse_partner_guest(self):
        self._inverse_partner('guest')

    def _inverse_partner(self,pos):
        for rec in self:
            team_id = rec.team_ids.filtered(lambda s: s.position==pos)

            ptns = {'host': rec.host_partner_id,
                    'guest':rec.guest_partner_id}

            if team_id:
                team_id.partner_id = ptns[pos]
            else:
                vals = {'match_id':rec.id,
                        'position':pos,
                        'partner_id':ptns[pos].id }

                team_id.create(vals)

    bam = fields.Integer(compute='_compute_imp')
    host_bam  = fields.Integer(compute='_compute_imp')
    guest_bam = fields.Integer(compute='_compute_imp')

    imp = fields.Integer(compute='_compute_imp')
    host_imp  = fields.Integer(compute='_compute_imp')
    guest_imp = fields.Integer(compute='_compute_imp')

    vp = fields.Float(compute='_compute_imp')
    host_vp  = fields.Float(compute='_compute_imp')
    guest_vp = fields.Float(compute='_compute_imp')

    line_ids = fields.One2many('og.match.line','match_id')
    team_ids = fields.One2many('og.match.team','match_id')

    #deal_count = fields.Integer(default=8, help='used for IMP 2 VP')
    deal_count = fields.Integer(compute='_compute_imp',
                   help='used for IMP 2 VP')

    @api.multi
    def _compute_imp(self):
        for rec in self:
            bam = sum(rec.line_ids.mapped('bam') )
            rec.bam = bam
            rec.host_bam  = bam
            rec.guest_bam = -bam

            imp = sum(rec.line_ids.mapped('imp') )
            host_imp = sum(rec.line_ids.mapped('host_imp') )
            guest_imp = sum(rec.line_ids.mapped('guest_imp') )
            rec.imp = imp
            rec.host_imp  = host_imp
            rec.guest_imp = guest_imp
            #rec.host_imp  = imp>0 and imp or 0
            #rec.guest_imp = imp<0 and -imp or 0
            rec.deal_count = len(rec.line_ids)
            vp = imp2vp(imp, rec.deal_count)
            rec.vp = vp
            rec.host_vp  = vp
            rec.guest_vp  = 20 - vp

    @api.multi
    def _compute_partner(self):
        def _fn(pos):
            return rec.team_ids.filtered(lambda s: s.position == pos).partner_id

        for rec in self:
            rec.host_partner_id  = _fn('host')
            rec.guest_partner_id = _fn('guest')


class MatchTeam(models.Model):
    _name = "og.match.team"
    _description = "Match Team"
    _order = 'id desc'
    _rec_name = 'partner_id'

    _inherits = {'res.partner': 'partner_id'}

    match_id = fields.Many2one('og.match', string='Match', ondelete='restrict')
    partner_id = fields.Many2one('res.partner', string='Partner', ondelete='restrict')
    position = fields.Selection([
        ('host','Host'),
        ('guest','Guest')], string='Position', default='host')

    vp = fields.Float(compute='_compute_score')
    bam = fields.Float(compute='_compute_score')

    @api.multi
    def _compute_score(self):
        def _fn(pos,match):
            return {'host': lambda m: (m.host_vp, m.host_bam),
                    'guest':lambda m: (m.guest_vp,m.guest_bam) }[pos](match)

        for rec in self:
            rec.vp,rec.bam =  _fn(rec.position,rec.match_id)

class MatchLine(models.Model):
    _name = "og.match.line"
    _description = "Match Line"

    name = fields.Char('Name' )

    match_id = fields.Many2one('og.match')
    open_table_id  = fields.Many2one(related='match_id.open_table_id')
    close_table_id = fields.Many2one(related='match_id.close_table_id')
    host_partner_id  = fields.Many2one(related='match_id.host_partner_id')
    guest_partner_id = fields.Many2one(related='match_id.guest_partner_id')

    deal_id = fields.Many2one('og.deal')
    open_board_id = fields.Many2one('og.board',compute='_compute_board')
    close_board_id = fields.Many2one('og.board',compute='_compute_board')

    open_declarer = fields.Selection(related='open_board_id.declarer')
    open_contract = fields.Selection(related='open_board_id.contract')
    open_result   = fields.Integer(  related='open_board_id.result')
    open_result2  = fields.Char(     related='open_board_id.result2')
    open_point    = fields.Integer(  related='open_board_id.point')
    open_ns_point = fields.Integer(  related='open_board_id.ns_point')
    open_ew_point = fields.Integer(  related='open_board_id.ew_point')

    close_declarer = fields.Selection(related='close_board_id.declarer')
    close_contract = fields.Selection(related='close_board_id.contract')
    close_result   = fields.Integer(  related='close_board_id.result')
    close_result2  = fields.Char(     related='close_board_id.result2')
    close_point    = fields.Integer(  related='close_board_id.point')
    close_ns_point = fields.Integer(  related='close_board_id.ns_point')
    close_ew_point = fields.Integer(  related='close_board_id.ew_point')

    @api.multi
    def _compute_board(self):
        def _fn(tbl,deal):
            return tbl.board_ids.filtered(lambda b: b.deal_id == deal)

        for rec in self:
            rec.open_board_id  = _fn(rec.open_table_id, rec.deal_id)
            rec.close_board_id = _fn(rec.close_table_id, rec.deal_id)

    point = fields.Integer(compute='_compute_point')
    host_point =  fields.Integer(compute='_compute_point')
    guest_point = fields.Integer(compute='_compute_point')

    bam = fields.Integer(compute='_compute_point')
    host_bam =  fields.Integer(compute='_compute_point')
    guest_bam = fields.Integer(compute='_compute_point')

    imp = fields.Integer(compute='_compute_point')
    host_imp  = fields.Integer(compute='_compute_point')
    guest_imp = fields.Integer(compute='_compute_point')

    @api.multi
    def _compute_point(self):
        for rec in self:
            point = rec.open_board_id.point - rec.close_board_id.point
            rec.point = point
            rec.host_point  = point>0 and point or 0
            rec.guest_point = point<0 and point or 0

            bam = point != 0 and (point>0 and 1 or -1 ) or 0
            rec.bam = bam
            rec.host_bam = bam
            rec.guest_bam = -bam

            imp = point2imp(point)
            rec.imp = imp
            rec.host_imp  = imp>0 and imp or 0
            rec.guest_imp = imp<0 and -imp or 0

