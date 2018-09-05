from odoo import api, fields, models
import random

import logging

_logger = logging.getLogger(__name__)


class IntelligentGameBoard(models.Model):
    _inherit = 'og.board'

    # create board for a table,create corresponding match line
    # num : board quantity,if needed???
    @api.model
    def create_board(self, table_id, match_id):
        self = self.sudo()
        name = self.env['og.match'].browse(match_id).name
        cs = self.env['og.table'].browse(table_id).deal_ids
        cd = [c for c in cs]
        cd.sort(key=lambda x: x.number)
        num = len(cd)
        if num > len(cd):
            return 'can not generate it'
        for i in range(num):
            name0 = name + 'board:' + str(i)
            vals = {'table_id': table_id, 'deal_id': cd[i].id}
            self.create(vals)
            self._create_match_line(match_id, cd[i].id, name0)
        return True

    # create match line for a match,same deal_id with board's
    def _create_match_line(self, match_id, deal_id, name):
        new_name = name
        vals = {'match_id': match_id, 'deal_id': deal_id, 'name': new_name}
        self.env['og.match.line'].create(vals)

    # return the points of a single board
    @api.model
    def board_points(self, board_id):
        self = self.sudo()
        board = self.browse(board_id)
        vals = {'ns_points': board.ns_point, 'ew_points': board.ew_point,
                'result': board.result2}
        return vals

    # 2018-7.17

    # showing a match score,
    @api.model
    def match_points(self, table_id):
        self = self.sudo()
        match = self.env['og.match'].search([('open_table_id', '=', table_id)])
        if match == None:
            match = self.env['og.match'].search([('close_table_id', '=', table_id)])
            if match == None:
                return False

        host_team = match.team_ids.filtered(lambda s: s.position == 'host')
        guest_team = match.team_ids.filtered(lambda s: s.position == 'guest')
        host_info = {'hostteam': host_team.partner_id.name, 'hostvp': host_team.vp, 'hostbam': host_team.bam}
        guest_info = {'guestteam': guest_team.partner_id.name, 'guestvp': guest_team.vp, 'guestbam': guest_team.bam}
        return {'host_info': host_info, 'guest_info': guest_info}

    # change 73 and change 97
    @api.model
    def table_points(self, table_id):
        self = self.sudo()
        table = self.env['og.table'].browse(table_id)
        table_partners = table.table_partner_ids
        table_info = []
        for p in table_partners:
            # p_info = {p.name: p.position}
            p_info = [p.name,p.position]
            table_info.append(p_info)

        boards = table.board_ids.sorted(lambda x: x.number)
        res = []
        for rec in boards:
            call_pos = rec.call_ids.mapped('pos')
            call_name = rec.call_ids.mapped('name')
            call_number = rec.call_ids.mapped('number')
            calls = zip(call_number, call_pos, call_name)

            # calls = (call_number, call_pos, call_name)

            play_pos = rec.card_ids.mapped('pos')
            play_name = rec.card_ids.mapped('name')
            play_number = rec.card_ids.mapped('number')

            plays = zip(play_number, play_pos, play_name)
            # plays = (play_number, play_pos, play_name)

            vals = {'dealer': rec.dealer, 'vulnerable': rec.vulnerable, 'openlead': rec.openleader,
                    'result': rec.result2, 'ns_point': rec.ns_point, 'ew_point': rec.ew_point,
                    'cards': rec.name, 'calls': [call for call in calls], 'plays': [play for play in plays], 'table_information': table_info}

            # vals = {'dealer': rec.dealer, 'vulnerable': rec.vulnerable, 'openlead': rec.openleader,
            #         'result': rec.result2, 'ns_point': rec.ns_point, 'ew_point': rec.ew_point,
            #         'cards': rec.name, 'calls': calls, 'plays': plays,
            #         'table_information': table_info}

            # vals = {'dealer':rec.dealer,'vulnerable':rec.vulnerable,'openlead':rec.openleader,
            # 			'result':rec.result2}
            res.append(vals)

        return res

    # 2018-7-19

    # create boards for a match:two tables
    @api.model
    # @api.returns('self')
    def create_table_boards(self, match_id):
        self = self.sudo()
        # if self.is_created(match_id):
        # 	return 0

        deals = []
        deal_set = []
        tmp = self.env['og.deal']
        # deals = self.env['og.deal'].search([]).mapped('number')
        deals = self.env['og.deal'].search([])
        deals_number = deals.mapped('number')
        deals_id = deals.mapped('id')
        if len(deals_number) < 8:
            return False
        s = random.randint(0, len(deals_id) - 1)
        for i in (1, 2, 3, 4, 5, 6, 7, 0):
            while deals_number[s] % 8 != i:
                s = random.randint(1, len(deals_id) - 1)
            tmp += self.env['og.deal'].search([('id', '=', deals_id[s])])

        match = self.env['og.match'].browse(match_id)
        close_table = match.close_table_id
        open_table = match.open_table_id

        close_boards = self.create_boards(tmp, close_table)
        open_boards = self.create_boards(tmp, open_table)

        match_lines = self.create_match_lines(tmp, match_id)
        return True

    # True: table has deals ,False: table do not have deals
    @api.model
    def is_created(self, match_id):
        self = self.sudo()
        match = self.env['og.match'].browse(match_id)
        nums = self.env['og.match.line'].search_count([('match_id', '=', match_id)])
        deals = len(match.open_table_id.deal_ids)
        if nums == deals:
            return True
        else:
            return False

    # create boards for a table,return these boards
    def create_boards(self, deals, table_id):
        boards = []
        deal_set = deals.mapped('id')
        table_id.deal_ids = deal_set
        for rec in deals:
            vals = {'deal_id': rec.id, 'table_id': table_id.id}
            newboard = self.env['og.board'].create(vals)
            boards.append(newboard)
        return boards

    # create lines for a match,return those new lines
    def create_match_lines(self, deals, match_id):
        lines = []
        for rec in deals:
            vals = {'deal_id': rec.id, 'match_id': match_id}
            newline = self.env['og.match.line'].create(vals)
            lines.append(newline)
        return lines
