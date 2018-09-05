# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

{
    'name': 'OdooHT iGame Message',
    'version': '1.0',
    'category': 'iGame',
    'summary': 'Intelligent Game Message',
    'description': """
This module is for igame Message.
===========================================================================

Send message to anyone in Table or Game.
    """,
    'author': 'Beijing OdooHT Co. LTD.',
    'website': 'https://www.odooht.com',
    'depends': ['base', 'zog_igame',
    ],
    'data': [
        #'security/ir.model.access.csv',
        'views/channel_views.xml',
    ],
    'demo': [
        #
        #
    ],
    'installable': True,
    'auto_install': False,
}
