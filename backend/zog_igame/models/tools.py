# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

def point2imp(point):
    p = abs(point)

    imp_min = [  20,  50,  90, 130, 170, 220,
                270, 320, 370, 430, 500, 600,
                750, 900,1100,1300,1500,1750,
               2000,2250,2500,3000,3500,4000]

    imp = sum( map(lambda a: a<=p and 1 or 0, imp_min) )
    return point > 0 and imp or -imp


import math

def imp2vp(imp,deal_count):
    """
    # N : Deal count
    # M : Imp diff
    """
    M = abs(imp)
    N = deal_count

    if not M:
        return 10
    if not N:
        return 10

    B = math.sqrt( N ) * 15
    tau = (math.sqrt(5) - 1) / 2
    x = tau ** min( [ (3*M / B),3 ] )
    y = tau ** 3
    z = 10*(1-x)/(1-y)
    z = round(z,2)

    return imp>0 and 10+z or 10-z

