from odoo import http
from odoo.http import request
from odoo import fields

import logging
_logger = logging.getLogger(__name__)


class OrderListAPI(http.Controller):

    @http.route('/api/get_all_orders', type='json', auth='jwt', methods=['POST'], csrf=False)
    def get_all_orders(self, **kw):
        try:
            date = kw.get('date_order')
            zone = kw.get('zone_id')
            
            domain = [('order_agent_id', '=', request.env.user.name)]
            
            if date:
                domain.append(('date_order', '>=', date))
            if zone:
                domain.append(('zone_id', '=', zone))
                
            if not date:
                domain.append(('date_order', '>=', fields.Date.today()))
                
            domain.append(('state', 'not in', ['cancel']))  # Escludi gli ordini con stato "cancel"

            orders = request.env['sale.order'].search(domain, order='date_order asc')

            result = []
            
            # Recupero dei prodotti associati all'ordine
            for o in orders:
                linee_prodotti = []
                for line in o.order_line:
                    linee_prodotti.append({
                        'prodotto': line.product_template_id.name,
                        'quantita': line.product_uom_qty,
                        'prezzo_unitario': line.price_unit,
                        'subtotale': line.price_subtotal,
                    })

                result.append({
                    'order_id': o.id,
                    'name': o.name,
                    'partner_id': o.partner_id.name,  
                    'date_order': o.date_order,
                    'zone_id': o.zone_id.name,
                    'vehicle_id': o.vehicle_id.name,
                    'prodotti': linee_prodotti,
                })
                
            return{
                'status': 'success',
                'orders': result
            }
            
        except Exception as e:
            _logger.error(f"Errore durante la generazione della lista degli ordini: {str(e)}")
            return {'error': 'Si è verificato un errore durante la generazione della lista degli ordini.'}