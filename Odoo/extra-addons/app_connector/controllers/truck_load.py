from odoo import http
from odoo.http import request

class Truck_Load_Api(http.Controller):

    @http.route('/api/confirm_truck_package_load', type='json', auth='jwt', methods=['POST'], csrf=False)
    def confirm_truck_package_load(self, **kw):
        """
        Conferma il trasferimento di tipo "Pack" (confezione/imballaggio).
        Nel flusso a 3 step, è il secondo trasferimento interno.
        """
        order_id = kw.get('order_id')
        if not order_id:
            return {'error': 'order_id is required'}
        
        try:
            order_id_int = int(order_id)
            order = request.env['sale.order'].sudo().browse(order_id_int)
            if not order.exists():
                return {'error': 'Order non trovato'}
                
            pickings = order.picking_ids.filtered(lambda p: p.state != 'cancel')
            
            # Recupera tutti i trasferimenti interni ordinati per ID
            internal_pickings = pickings.filtered(lambda p: p.picking_type_id.code == 'internal').sorted('id')
            
            pack_picking = False
            
            # 1. Prova a cercarlo per nome o sequence_code
            for p in internal_pickings:
                name_lower = p.picking_type_id.name.lower()
                seq_code = (p.picking_type_id.sequence_code or '').upper()
                if 'pack' in name_lower or 'imball' in name_lower or 'confez' in name_lower or seq_code == 'PACK':
                    pack_picking = p
                    break
            
            # 2. Fallback: nel flusso a 3 step il pack è tipicamente il secondo trasferimento interno generato
            if not pack_picking and len(internal_pickings) >= 2:
                pack_picking = internal_pickings[1]
                
            if not pack_picking:
                return {'error': 'Nessun trasferimento di tipo Pack (confezione) trovato per questo ordine'}
                
            # Conferma il trasferimento
            pack_picking.sudo().button_validate()
            
            return {
                'status': 'success',
                'message': 'Trasferimento di tipo Pack confermato con successo',
                'picking_id': pack_picking.id,
                'picking_name': pack_picking.name
            }
        except Exception as e:
            return {'error': f'Errore durante la conferma del pack: {str(e)}'}