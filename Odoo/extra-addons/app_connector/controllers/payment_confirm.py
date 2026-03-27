from odoo import http
from odoo.http import request

import logging
_logger = logging.getLogger(__name__)

def register_payment(invoice_id, payment_method, amount):
    invoice = request.env['account.move'].sudo().browse(invoice_id)
    
    if not invoice.exists():
        return {"status": "error", "message": "Invoice not found"}

    if invoice.state != 'posted':
        return {"status": "error", "message": "Invoice must be posted before registering payment"}
    
    payment_registered = request.env['account.payment.register'].with_context(
        active_model='account.move',
        active_ids=[invoice.id]
        ).sudo().create({
        'journal_id': int(payment_method),
        'amount': float(amount),
        })
    
    payment_confirmed = payment_registered.sudo().action_create_payments()
    
    return {
            "status": "success",
            "message": f"Pagamento registrato per la fattura {invoice.name}",
            "new_payment_state": invoice.payment_state
        }

class PaymentConfirmAPI(http.Controller):

    @http.route('/api/post_confirm_payment', type='json', auth='jwt', methods=['POST'], csrf=False)
    def confirm_payment(self, **kw):
        """
        Questa rotta è ora protetta. 
        Richiede un Header 'Authorization: Bearer <token>'
        """
        invoice_id = kw.get('invoice_id')
        payment_method = kw.get('payment_method')
        amount = kw.get('amount')
    
        if not payment_method:
            return {"error": "Payment method not found"}
        if not invoice_id:
            return {"error": "Invoice ID not found"}
        if not amount:
            return {"error": "Amount not found"}
        
        payment_result = register_payment(invoice_id, payment_method, amount)
        
        return payment_result
        
        