from odoo import http
from odoo.http import request

import logging
_logger = logging.getLogger(__name__)

def confirm_order(order_id):
    try:
        order = request.env['sale.order'].browse(order_id)
        
        if not order.exists():
            return {"status": "error", "message": "Order not found"}

        order.action_confirm()
        
        pickings = order.picking_ids.filtered(lambda p: p.state != 'cancel').sorted('id')
        picking_id = pickings[-1].id if pickings else False
        
        return {
            "status": "success",
            "message": f"Order {order.name} confirmed",
            "order_id": order.id,
            "picking_id": picking_id
        }
    except Exception as e:
        _logger.error(f"Error confirming order {order_id}: {str(e)}")
        return {"status": "error", "message": f"Error confirming order: {str(e)}"}
    
def order_delivery(picking_id, vehicle_id):
    try:
        picking = request.env['stock.picking'].search([
                        ('id', '=', picking_id),
                        ('state', '!=', 'cancel')],
                        limit=1)
        
        if not picking.exists():
            return {"status": "error", "message": "Picking not found"}

        picking.location_id = vehicle_id  # Associa il magazzino (veicolo)
        picking.button_validate()  # Conferma la consegna

        return {
            "status": "success",
            "message": f"Picking {picking.name} marked as delivered with vehicle {vehicle_id}",
        }
    except Exception as e:
        _logger.error(f"Error delivering picking {picking_id}: {str(e)}")
        return {"status": "error", "message": f"Error delivering picking: {str(e)}"}


class OrderConfirmAPI(http.Controller):

    @http.route('/api/post_confirm_order', type='json', auth='jwt', methods=['POST'], csrf=False)
    def confirm_order(self, **kw):      #name has to change to avoid conflict with the function confirm_order defined above
        try:
            """
            Questa rotta è ora protetta. 
            Richiede un Header 'Authorization: Bearer <token>'
            """
            order_id = kw.get('order_id')
            vehicle_id = kw.get('vehicle_id')
            
            order_confirmed = confirm_order(order_id)
            
            if order_confirmed.get("status") != "success":   #Restituisce l'errore se la conferma dell'ordine fallisce
                return order_confirmed  
            
            picking_id = order_confirmed.get('picking_id')  # Recupera l'ID del picking creato
            order_delivered = order_delivery(picking_id, vehicle_id)

            return {
                "confirmation": order_confirmed,
                "delivery": order_delivered
            }
        except Exception as e:
            _logger.error(f"Error in confirm_order API: {str(e)}")
            return {"status": "error", "message": f"Error during order confirmation: {str(e)}"}