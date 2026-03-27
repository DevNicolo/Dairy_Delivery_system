from odoo import http
from odoo.http import request

import logging
_logger = logging.getLogger(__name__)


class OrderConfirmAPI(http.Controller):

    @http.route('/api/post_confirm_order', type='json', auth='jwt', methods=['POST'], csrf=False)
    def confirm_order(self, **kw):
        """
        Questa rotta è ora protetta. 
        Richiede un Header 'Authorization: Bearer <token>'
        """
        order_id = kw.get('order_id')
    
        if not order_id:
            return {"error": "missing order_id"}

        order = request.env['sale.order'].browse(order_id)
    
        if order.exists():
            order.action_confirm()
            return {"status": "success", "message": f"Order {order.name} confirmed"}
        else:
            return {"error": "Order not found"}