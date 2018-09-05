# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

{
    'name': 'OdooHT Intelligent Game',
    'version': '1.0',
    'category': 'iGame',
    'summary': 'Intelligent Game',
    'description': """
This module is for intelligent game just like go,chess,birdge,etc.
===========================================================================

Have a nice time to play game.
    """,
    'author': 'Beijing OdooHT Co. LTD.',
    'website': 'https://www.odooht.com',
    'depends': ['base', 
        #'account',
    ],
    # data file
    'data': [
        #'security/ir.model.access.csv',
        'views/top_views.xml',
        'views/deal_views.xml',
        'views/igame_views.xml',
        'views/table_views.xml',
        'views/board_views.xml',
        'views/match_views.xml',
    ],
    'demo': [
        #
        #
    ],
    'installable': True,
    'auto_install': False,
}
