from odoo import http
from odoo.http import request
from odoo import fields

import logging
_logger = logging.getLogger(__name__)


class OrderListAPI(http.Controller):
    
    # API endpoint to retrieve all orders for the logged-in agent, with optional filters for date, zone, and order ID
    @http.route('/api/get_all_orders', type='json', auth='jwt', methods=['POST'], csrf=False)
    def get_all_orders(self, **kw):
        try:
            date = kw.get('date_order')
            zone = kw.get('zone_id')
            order_id = kw.get('order_id')
            
            domain = [('order_agent_id', '=', request.env.user.name)]
            
            #filters
            if date:
                domain.append(('date_order', '>=', date))
            else:
                domain.append(('date_order', '>=', fields.Date.today()))
            if zone:
                domain.append(('zone_id', '=', zone))

            domain.append(('state', 'not in', ['cancel']))
            
            # if order_id is provided, search for that specific order, otherwise retrieve all orders matching the filters
            if not order_id:
                orders = request.env['sale.order'].search(domain, order='date_order asc')
            else:
                orders = request.env['sale.order'].search([('id', '=', order_id)] + domain, order='date_order asc')

            result = []
            
            # get order details for each order
            for o in orders:
                linee_prodotti = []
                for line in o.order_line:
                    linee_prodotti.append({
                        'product': line.product_template_id.name,
                        'quantity': line.product_uom_qty,
                        'unit_price': line.price_unit,
                        'subtotal': line.price_subtotal,
                    })

                result.append({
                    'order_id': o.id,
                    'name': o.name,
                    'partner_id': o.partner_id.name,  
                    'date_order': o.date_order,
                    'zone_id': o.zone_id.name,
                    'street': o.partner_shipping_id.street,
                    'street2': o.partner_shipping_id.street2,
                    'shipping_city': o.partner_shipping_id.city,
                    'shipping_state': o.partner_shipping_id.state_id.name,
                    'shipping_zip': o.partner_shipping_id.zip,
                    'shipping_country': o.partner_shipping_id.country_id.name,
                    'shipping_phone': o.partner_shipping_id.phone,
                    'vehicle_id': o.vehicle_id.name,
                    'products': linee_prodotti,
                    'total': o.amount_total,

                })
                
            return{
                'status': 'success',
                'orders': result
            }
            
        except Exception as e:
            _logger.error(f"Error in get_all_orders route: {e}")
            return {"status": "error", "message": f"Error during order retrieval: {str(e)}"}