# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import api, fields, models

from .tools import point2imp

POSITIONS = [
        ('-',  'Neednot'),
        ('NS', 'NS'),
        ('EW', 'EW'),
        ('N', 'North'),
        ('E', 'East'),
        ('S', 'South'),
        ('W', 'West'),
    ]

class IntelligentGameTeam(models.Model):
    _name = "og.igame.team"
    _description = "Ientelligent Game Team"
    _order = 'id desc'
    _rec_name = 'partner_id'
    _inherits = {'res.partner': 'partner_id'}

    igame_id = fields.Many2one('og.igame', string='Game', ondelete='restrict')
    partner_id = fields.Many2one('res.partner', string='Partner', ondelete='restrict')
    group_id = fields.Many2one('og.igame.group')
    player_ids = fields.One2many('og.igame.team.player','team_id')
    number = fields.Char('Number', default='0')

    # name = fields.Char('name')

    # position = fields.Selection(POSITIONS, string='Position', default='-', help='used for pair match')

    # state = fields.Selection([
    #     ('draft', 'Draft'),
    #     ('conformed', 'Confirmed'),
    #     ('done', 'Locked'),
    #     ('cancel', 'Cancelled')
    #     ], string='Status', readonly=True,
    #     index=True, copy=False, default='draft')

    notes = fields.Text('Notes')

    score = fields.Float(compute='_compute_score')

    score_uom = fields.Selection(related='igame_id.score_uom')

    # rank = fields.Integer()
    # ns_rank = fields.Integer()
    # ew_rank = fields.Integer()

    line_ids = fields.One2many('og.igame.team.line', 'team_id', string='Lines')

    @api.multi
    def _compute_score(self):
        for rec in self:
            rec.score = sum( rec.line_ids.mapped('score') )


class IntelligentGameTeamPlayer(models.Model):
    _name = "og.igame.team.player"
    _description = "Ientelligent Game Team Player"
    _order = 'id desc'

    _inherits = {'res.partner': 'partner_id'}

    team_id = fields.Many2one('og.igame.team', string='Team', ondelete='restrict')

    partner_id = fields.Many2one('res.partner', string='Partner', ondelete='restrict')

    role = fields.Selection([
        ('coach',      'Coach'),
        ('leader',  'Leader'),
        ('player',     'Player')

        ], string='Role')


class IntelligentGameTeamLine(models.Model):
    _name = "og.igame.team.line"
    _description = "Ientelligent Game Team Line"
    _order = 'round_id'

    # name = fields.Char()
    team_id = fields.Many2one('og.igame.team', string='team', ondelete='restrict')
    igame_id = fields.Many2one('og.igame', related='team_id.igame_id')
    partner_id = fields.Many2one('res.partner', related='team_id.partner_id')

    #For Team Match
    group_id = fields.Many2one('og.igame.group', related='team_id.group_id')
    round_id = fields.Many2one('og.igame.round', string='Round')
    match_id = fields.Many2one('og.match', string='Match')

    #For Pair Match
    # position = fields.Selection(related='team_id.position')
    # table_id = fields.Many2one('og.table')
    # deal_id = fields.Many2one('og.deal')
    # board_id = fields.Many2one('og.board',compute='_compute_board')

    # @api.multi
    # def _compute_board(self):
    #     for rec in self:
    #         rec.board_id = rec.table_id.board_ids.filtered(
    #             lambda b: b.deal_id == rec.deal_id )

    score = fields.Float(compute='_compute_score')
    score_uom = fields.Selection(related='team_id.score_uom')
    # rank = fields.Integer()
    # ns_rank = fields.Integer()
    # ew_rank = fields.Integer()

    @api.multi
    def _compute_score(self):
        def fn_team(rec):
            p = rec.match_id.team_ids.filtered(
                    lambda s: s.partner_id == rec.partner_id )
            rec.score = {'IMP':p.vp,'MP':p.bam}[rec.igame_id.score_type]

        def fn_pair(rec):
            board_ids = rec.igame_id.table_ids.mapped('board_ids').filtered(
                lambda b: b.deal_id == rec.deal_id and b != rec.board_id )

            def f_mp(b):
                diff = rec.board_id.point - b.point
                return diff != 0 and (diff>0 and 1 or -1) or 0

            def fn_mp(bs):
                return sum( [f_mp(b) for b in bs] ) / len(bs.ids) / 2 + 0.5

            def f_imp(b):
                diff = rec.board_id.point - b.point
                return point2imp(diff)

            def fn_imp(bs):
                return sum( [f_imp(b) for b in bs] ) / len(bs.ids)

            if board_ids:
                st = rec.igame_id.score_type
                rec.score = {'IMP':fn_imp,'MP':fn_mp}[st](board_ids)


        for rec in self:
            g = rec.igame_id
            if g.game_type == 'bridge':
                if g.match_type == 'team' :
                    if g.org_type in ['swiss','circle']:
                        fn_team(rec)
                    else:
                        pass # how to sum score
                elif g.match_type == 'pair':
                    fn_pair(rec)
