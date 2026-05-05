from odoo import http
from odoo.http import request

import logging
_logger = logging.getLogger(__name__)

def confirm_order(order_id):
    try:
        order = request.env['sale.order'].browse(order_id)
        
        if not order.exists():
            return {"status": "error", "message": "Order not found"}

    #    order.action_confirm()
        
        # get the latest picking associated with the order that is not cancelled
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
        # get the picking record and ensure it's not cancelled
        picking = request.env['stock.picking'].search([
                        ('id', '=', picking_id),
                        ('state', '!=', 'cancel')],
                        limit=1)
        
        if not picking.exists():
            return {"status": "error", "message": "Picking not found"}


        # this is just a double check, custom_stock_extension should have already assigned the vehicle to the picking during creation
        picking.location_id = vehicle_id  # assign the vehicle to the picking
        picking.button_validate()  # convalidate the picking

        return {
            "status": "success",
            "message": f"Picking {picking.name} marked as delivered with vehicle {vehicle_id}",
        }
    except Exception as e:
        _logger.error(f"Error delivering picking {picking_id}: {str(e)}")
        return {"status": "error", "message": f"Error delivering picking: {str(e)}"}


class OrderConfirmAPI(http.Controller):

    @http.route('/api/post_confirm_order', type='json', auth='jwt', methods=['POST'], csrf=False)
    def post_confirm_order(self, **kw):
        try:
            order_id = kw.get('order_id')
            vehicle_id = kw.get('vehicle_id')
            
            order_confirmed = confirm_order(order_id)
            
            if order_confirmed.get("status") != "success":   # Check if order confirmation was successful before proceeding to delivery
                return order_confirmed  
            picking_id = order_confirmed.get('picking_id')  # get the picking_id from the order confirmation result
            
            order_delivered = order_delivery(picking_id, vehicle_id)

            return {
                "confirmation": order_confirmed,
                "delivery": order_delivered
            }
        except Exception as e:
            _logger.error(f"Error in confirm_order route: {str(e)}")
            return {"status": "error", "message": f"Error during order confirmation: {str(e)}"}
        
    @http.route('/api/get_delivery_status', type='json', auth='jwt', methods=['POST'], csrf=False)
    def get_delivery_status(self, **kw):
        try:
            order_id = kw.get('order_id')
            order = request.env['sale.order'].browse(order_id)
            picking = order.picking_ids.filtered(lambda p: p.state != 'cancel').sorted('id')[-1] if order.picking_ids else False

            if not picking.exists():
                return {"status": "error", "message": "Picking not found"}
            
            return {
                "status": "success",
                "picking_id": picking.id,
                "picking_state": picking.state,
            }
        except Exception as e:
            _logger.error(f"Error in get_delivery_status route: {str(e)}")
            return {"status": "error", "message": f"Error retrieving delivery status: {str(e)}"}
    
    # add products to order from attempted sale

    @http.route('/api/add_products', type='json', auth='jwt', methods=['POST'], csrf=False)
    def add_products(self, **kw):
        try:
            order_id = int(kw.get('order_id'))
            products = kw.get('products', []) # this should be a list of dicts with 'product_id' and 'quantity' keys
            
            sale_order = request.env['sale.order'].sudo().browse(order_id)

            # prepare the list of lines to add in the format
            lines_to_add = []
            for item in products:
                lines_to_add.append((0, 0, {
                    'product_id': int(item.get('product_id')),
                    'product_uom_qty': float(item.get('quantity')),
                }))

            # add the lines to the order
            if lines_to_add:
                sale_order.sudo().write({
                    'order_line': lines_to_add
                })
            
            return {"status": "success", "message": f"{len(lines_to_add)} products added to order {sale_order.name}"}
            
        except Exception as e:
            _logger.error(f"Error in add_products route: {str(e)}")
            return {"status": "error", "message": f"Error during add products: {str(e)}"}