from odoo import http
from odoo.http import request

import logging
_logger = logging.getLogger(__name__)

def generate_invoice(order_id):
    try:
        order = request.env['sale.order'].browse(order_id)
        
        if not order.exists():
            return {"status": "error", "message": "Order not found"}

        invoice = order.sudo()._create_invoices()

        if not invoice:
            return {"status": "error", "message": "Nothing to invoice"}

        return {
            "status": "success",
            "invoice_id": invoice.id,
        }
    except Exception as e:
        _logger.error(f"Error generating invoice for order {order_id}: {str(e)}")
        return {"status": "error", "message": f"Error generating invoice: {str(e)}"}
    
def confirm_invoice(invoice_id):
    try:
        invoice = request.env['account.move'].browse(invoice_id)
        
        if not invoice.exists():
            return {"status": "error", "message": "Invoice not found"}

        confirmed_invoice = invoice.sudo().action_post()

        return {
            "status": "success",
            "message": f"Invoice {invoice.name} posted successfully",
            "invoice_id": invoice.id
        }
    except Exception as e:
        _logger.error(f"Error confirming invoice {invoice_id}: {str(e)}")
        return {"status": "error", "message": f"Error confirming invoice: {str(e)}"}


class InvoiceCreateAPI(http.Controller):

    @http.route('/api/post_create_invoice', type='json', auth='jwt', methods=['POST'], csrf=False)
    def create_invoice(self, **kw):
        try:
            order_id = kw.get('order_id')
        
            if not order_id:
                return {"error": "ID not found"}

            invoice = generate_invoice(order_id)
            
            # Return the error response from generate_invoice
            if invoice.get('status') != 'success':
                return invoice  
            
            invoice_id = invoice.get('invoice_id')
            
            confirmed_invoice = confirm_invoice(invoice_id)
            return {
                "invoice_creation": invoice,
                "invoice_confirmation": confirmed_invoice
            }
        except Exception as e:
            _logger.error(f"Error in create_invoice route: {str(e)}")
            return {"status": "error", "message": f"Error during invoice creation: {str(e)}"}
        
        
        
        
        
        
        
        