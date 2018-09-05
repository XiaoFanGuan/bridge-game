# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import api, fields, models


class GameChannel(models.Model):
    _inherit = "og.channel"



#create a channel and creator included in the team
#could be applied when create table
#create two channels for NE and SW respectively
    @api.model
    # @api.returns('self')
    def create_channel(self,name,igame_id,table_id):
        channel_vals = {'name':name}
        ne_channel_vals = {'name':name + 'NE'}
        sw_channel_vals = {'name':name + 'SW'}
        channel = self.sudo().env['mail.channel'].create(channel_vals) 
        ne_channel = self.sudo().env['mail.channel'].create(ne_channel_vals)
        sw_channel = self.sudo().env['mail.channel'].create(sw_channel_vals)
        vals = {'igame_id':igame_id,'table_id':table_id,'mail_channel_id':channel.id}
        ne_vals = {'igame_id':igame_id,'table_id':table_id,
                    'mail_channel_id' : ne_channel.id,'type' : 'lho'}
        sw_vals = {'igame_id' : igame_id,'table_id' : table_id,
                    'mail_channel_id': sw_channel.id,'type' : 'rho'}
        self.sudo().create(vals)
        self.sudo().create(ne_vals)
        self.sudo().create(sw_vals)
        # return self._join_channel(channel.id)
        return True



    def _join_channel(self,channel_id):
        user_id = self.env.user.partner_id.id
        vals = {'channel_id':channel_id,'partner_id':user_id}
        res = self.sudo().env['mail.channel.partner'].create(vals)
        return res
###################################################################
#######                                                     #######
#######                join_channel                         #######         
#######                                                     #######
###################################################################


#2018.7.20

#for a player to join the channel. according to table_id
#warning: a table object may relate to many channels
    @api.model
    def join_channel(self,table_id):
        user_id = self.env.user.partner_id.id
        self = self.sudo()
        partners = self.env['og.table'].browse(table_id).partner_ids.mapped('id')

        if user_id not in partners:
            return False
        table = self.env['og.table'].browse(table_id)
        mail_partners = self.search([('table_id','=',table.id)])[0].mail_channel_id.channel_partner_ids.mapped('id')


        if user_id in mail_partners:
            board_ids = table.board_ids.sorted(key = lambda x : x.number)
            board_ids = board_ids.mapped('id')
            channel = self.search([('table_id','=',table.id),('type','=','all')])
            opp_channel = self.check_opp_side(user_id,table_id)
            if self.is_playing(table_id) != 'Notplaying':
                vals = self.is_playing(table_id)
                return vals, channel.id, board_ids, opp_channel
            return channel.id , board_ids, opp_channel


        board_ids = table.board_ids.sorted(key = lambda x : x.number)
        board_ids = board_ids.mapped('id')
        channel = self.search([('table_id','=',table.id),('type','=','all')])
        # vals = {'channel_id':channel.mail_channel_id.id,'partner_id':user_id}
        res = self.join_a_channel(channel.mail_channel_id.id,user_id)
        opp_channel = self.join_opp_channel(table_id,user_id)
        return channel.id , board_ids , opp_channel
        # return mail_partners

    def is_playing(self,table_id):
        table = self.env['og.table'].browse(table_id)
        boards = table.board_ids
        tmp_board = self.env['og.board']
        for board in boards:
            
            if board.result2 !=None:
                tmp_board += board
            
            if board.call_ids != None and board.result2 == None:
                boards_id = boards.mapped('id')
                played_boards = tmp_board.mapped('id')
                unplayerd_boards = boards - tmp_board -board

            if board.declarer == None :
                pos = board.call_ids.mapped('pos')
                number =board.call_ids.mapped('number')
                name =board.call_ids.mapped('name')
                call_info = list(zip(number,pos,name))
                next_bid = board.bidder
                vals = {'state':'biding','call_info':call_info,'bidder':next_bid}
                
                return vals

            if board.declarer != None:

                unplayed_cards = board.card_ids.filtered(lambda x:x.number == 0 or x.number ==None)
                unplayed_cards_name = unplayed_cards.mapped('name')
                unplayed_cards_pos = unplayed_cards.mapped('pos')
                unplayed_cards_info = list(zip(unplayed_cards_pos,unplayed_cards_name))
                next_player = board.player
                declarer = board.declarer
                last_trick = board.last_trick
                last_trick_name = board.last_trick.mapped('name')
                last_trick_pos = board.last_trick.mapped('pos')
                last_trick_info = list(zip(last_trick_pos,last_trick_name))
                vulnerable = board.vulnerable
                contract = board.contract
                current_trick = board.current_trick
                current_trick_name = current_trick.mapped('name')
                current_trick_pos = current_trick.mapped('pos')
                current_trick_no = current_trick.mapped('number')
                current_trick_info = list(zip(current_trick_no,current_trick_pos,current_trick_name))
                dealer = board.dealer
                ns_win = board.ns_win
                ew_win = board.ew_win
                vals = {'current_board':board.id,'unplayed_card':unplayed_cards_info,'last_trick':last_trick_info,'vulnerable':vulnerable,
                        'contract':contract,'current_trick':current_trick_info,'player':next_player,'dealer':dealer,
                        'ns_win':ns_win,'ew_win':ew_win}
                return vals






        return 'Notplaying'


#to join a channel
    def join_a_channel(self,mail_channel_id,partner_id):
        vals = {'channel_id':mail_channel_id,'partner_id':partner_id}
        return self.env['mail.channel.partner'].create(vals)


#judge which opp channel that player is  in 
    def check_opp_side(self,partner_id,table_id):
        channels = self.search([('table_id','=',table_id),('type','!=','all')])
        for rec in channels:
            ids = rec.mail_channel_id.channel_partner_ids.mapped('id')
            if partner_id in ids:
                return rec.id
        return None 

#join an opp channel,judge the position of player
    def join_opp_channel(self,table_id,partner_id):
        # table = self.env['og.table'].browse(table_id)
        channels = self.search([('table_id','=',table_id)])
        ne_channel = channels.filtered(lambda x : x.type == 'lho')
        sw_channel = channels.filtered(lambda x : x.type == 'rho')
        table_partner = self.env['og.table.partner'].search([('table_id','=',table_id),
                                            ('partner_id','=',partner_id)])
        pos = table_partner.position
        if pos in 'NE':
            res = self.join_a_channel(ne_channel.mail_channel_id.id,partner_id)
            return ne_channel.id
        if pos in 'SW':
            res = self.join_a_channel(sw_channel.mail_channel_id.id,partner_id)
            return sw_channel.id
        else:return False

#############################################################################    


# for a player to leave the channel
    @api.model
    def leave_channel(self,channel_id):
        partner_id = self.env.user.partner_id.id
        mail_channel = self.browse(channel_id).mail_channel_id
        res = self.env['mail.channel.partner'].search(
                            [('channel_id','=',mail_channel.id),('partner_id','=',partner_id)])
        if res and res[0] or None:
            res.unlink()
        return True


# to choose a match's closed table or open table
    @api.model
    def show_openclosed(self,match_id):
        match = self.sudo().env['og.match'].browse(match_id)
        close_table = match.close_table_id
        open_table = match.open_table_id
        res = {'close_table':close_table.id,'open_table':open_table.id}
        return res

# to list all the matches belongs to a player in a game
# able to return more infomations
    @api.model
    def show_match(self,game_id):
        user = self.env.user.partner_id
        self = self.sudo()
        teams = self.env['og.igame.team'].search([('igame_id','=',game_id)])
        for rec in teams:
            tmp = rec.player_ids
            for rec0 in tmp:
                if rec0.partner_id == user:
                    team = rec
                                    
        team_rounds = team.line_ids
        match_list = []
        for rec in team_rounds:
            match_list.append(rec.match_id.id)

        return match_list
