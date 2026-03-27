from odoo import http
from odoo.http import request

import logging
_logger = logging.getLogger(__name__)


class OrderListAPI(http.Controller):

    @http.route('/api/get_all_orders', type='json', auth='jwt', methods=['POST'], csrf=False)
    def get_all_orders(self, **kw):
        """
        Questa rotta è ora protetta. 
        Richiede un Header 'Authorization: Bearer <token>'
        """
        
        date = kw.get('date', False)
        zone = kw.get('zone', False)
        
        domain = [('order_agent_id', '=', request.env.user.name)]
        if date:
            domain.append(('date_order', '>=', date))
        if zone:
            domain.append(('zone_id', '=', zone))

        # order_agent_id è un campo Char, quindi confrontiamo con il nome dell'utente (clean code)
        orders = request.env['sale.order'].search(domain, order='date_order asc')

        result = []
        for o in orders:
            result.append({
                'partner_id': o.partner_id.name,        
                'date_order': o.date_order,
                'zone_id': o.zone_id.name,
            })

        return result