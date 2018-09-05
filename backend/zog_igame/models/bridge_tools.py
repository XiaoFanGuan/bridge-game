# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

PASS, DBL, RDB = 'Pass', 'x', 'xx'

VULNERABLES = [
        ('NO','None'),
        ('NS','NS'),
        ('EW','EW'),
        ('BO','Both'),
    ]


POSITIONS = [
        ('N', 'North'),
        ('E', 'East'),
        ('S', 'South'),
        ('W', 'West'),
    ]

TRUMPS = [
        ('C','Club'),
        ('D','Diamond'),
        ('H','Heart'),
        ('S','Spade'),
        ('NT','No Trump'),
    ]

RISKS = [
        (PASS,'Pass'),
        (DBL, 'Double'),
        (RDB, 'Redouble')
    ]

def _contracts():
    def _fn(ra,t,ri):
        return  ri == 'p'  and ra + t or ra + t + ri

    return [(PASS,'All Pass')] + [ ( _fn(rank,trump,risk) ,
               _fn(rank,trump,risk) )

        for rank in '1234567'
        for risk in ['p','x','xx']
        for trump in ( [s for s in 'CDHS'] + ['NT'] )
    ]


CONTRACTS = _contracts()

SUITS = [
        ('C','Club'),
        ('D','Diamond'),
        ('H','Heart'),
        ('S','Spade'),
    ]

RANKS = [(r,r) for r in 'AKQJT98765432']

CARDS = [(s+r,s+r) for s in 'CDHS' for r in 'AKQJT98765432' ]

_CALLS = [ r + (s=='N' and 'NT' or s)
           for r in '1234567' for s in 'CDHSN'
        ] + [PASS,DBL,RDB]

CALLS = [(c,c) for c in _CALLS]

def partner(pos):
    if not pos or not pos in 'NESW':
        return None
    return 'NESW'[ ('NESW'.index(pos) + 2 ) % 4 ]

def lho(pos):
    if not pos or not pos in 'NESW':
        return None
    return 'NESW'[ ('NESW'.index(pos) + 1 ) % 4 ]


def cmp_gt_call(first, second):
    r1, t1 = int(first[0]), first[1]
    r2, t2 = int(second[0]), second[1]
    if r1 > r2:
        return True
    if 'CDHSN'.index(t1) > 'CDHSN'.index(t2):
        return True
    return False

def get_point(vul,rank,trump,risk,result):
    """ 
    vul =1 or 0
    rank in [1,2,...,7]
    trump in [C,D,H,S,NT]
    risk in ['','x','xx']
    rank + result <= 7
    rank + 6 + result <= 13
    rank + 6 + result >= 0
    """

    fn = result >=0 and _get_point_make or _get_point_down
    return fn(vul,rank,trump,risk,result)

def _get_point_make(vul,rank,trump,risk,result):
    risk = risk and risk or 'p'
    sc = trump in 'CD' and 20 or 30
    sc *= rank
    sc += trump == 'NT' and 10 or 0
    sc *= {'p':1,'x':2,'xx':4}[risk]
    sc += sc < 100 and 50 or (vul and 500 or 300)

    sc += rank == 6 and (vul and  750 or  500) or 0
    sc += rank == 7 and (vul and 1500 or 1000) or 0
    sc += {'p':0,'x':50,'xx':100}[risk]

    ov = {'p': trump in 'CD' and 20 or 30,
          'x': vul and 200 or 100,
          'xx':vul and 400 or 200
         }[risk]
    sc += ov * result
    return sc

def _get_point_down(vul,rank,trump,risk,result):
    risk = risk and risk or 'p'
    n   = [r*50 for r in range(1,14)]
    nx  = [100,300]+[r*300-400 for r in range(3,14)]
    nxx = [r for r in map( lambda a: a*2, nx )]

    #n   = [ 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650]
    #nx  = [100, 300, 500, 800,1100,1400,1700,2000,2300,2600,2900,3200,3500]
    #nxx = [400, 600,1000,1600,2200,2800,3400,4000,4600,5200,5800,6400,7000]

    v   = [r for r in map( lambda a: a*2, n )]
    vx  = [r*300-100 for r in range(1,14)]
    vxx = [r for r in map( lambda a: a*2, vx )]

    #v   = [100, 200, 300, 400, 500, 600, 700, 800, 900,1000,1100,1200,1300]
    #vx  = [200, 500, 800,1100,1400,1700,2000,2300,2600,2900,3200,3500,3800]
    #vxx = [400,1000,1600,2200,2800,3400,4000,4600,5200,5800,6400,7000,7600]

    down = -result

    mm = {'p':  vul and v or n,
          'x':  vul and vx or nx,
          'xx': vul and vxx or nxx
         }

    return  -mm[risk][down-1]


