from odoo import http
from odoo.http import request

class ProductApi(http.Controller):

    @http.route('/api/get_all_products', type='json', auth='jwt', methods=['POST'], csrf=False)
    def get_all_products(self, **kw):
        
        vehicle_id = kw.get('vehicle_id')
        if not vehicle_id:
            return {'error': 'Vehicle is required'}
        
        location = request.env['stock.location'].search([('name', '=', vehicle_id)])
        if not location:
            return {'error': 'Location not found'}
        
        avaiability = kw.get('avaiability')
        if not avaiability or avaiability != 'virtual':
            products = request.env['product.product'].with_context(location=location.id).search([('qty_available', '>', 0)])
        elif avaiability == 'virtual':
            products = request.env['product.product'].with_context(location=location.id).search([('qty_available', '>', 0), ('virtual_available', '>', 0)])
        
        result = []
        for p in products:
            result.append({
                'id': p.id,
                'name': p.name,
                'list_price': p.list_price,
                'default_code': p.default_code or '',
                'qty_available': p.qty_available,
                'virtual_available': p.virtual_available,
                'category': p.categ_id.name
            })

        return result