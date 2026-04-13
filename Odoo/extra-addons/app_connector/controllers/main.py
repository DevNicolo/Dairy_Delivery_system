from odoo import http
from odoo.http import request

class ProductApi(http.Controller):

    @http.route('/api/get_all_products', type='json', auth='jwt', methods=['POST'], csrf=False)
    def get_all_products(self, **kw):
        
        products = request.env['product.product'].search([('sale_ok', '=', True)])

        result = []
        for p in products:
            result.append({
                'id': p.id,
                'name': p.name,
                'list_price': p.list_price,
                'default_code': p.default_code or '',
                'qty_available': p.qty_available,
                'category': p.categ_id.name
            })

        return result
    
    @http.route('/api/post_products', type='json', auth='jwt', methods=['POST'], csrf=False)
    def post_products(self, **kw):

        name = kw.get('name')
        list_price = kw.get('list_price', 0.0)
        default_code = kw.get('default_code', '')
        categ_id = kw.get('categ_id')

        if not name or not categ_id:
            return {'error': 'Mancano dati obbligatori: name o categ_id'}

        try:
            new_product = request.env['product.product'].create({
                'name': name,
                'list_price': list_price,
                'default_code': default_code,
                'categ_id': categ_id
            })

            return {
                'id': new_product.id, 
                'message': 'Prodotto creato con successo',
                'created_by': request.env.user.name 
            }
        except Exception as e:
            return {'error': str(e)}
        
        # Vendita aggiuntiva
        
    @http.route('/api/get_available_products', type='json', auth='jwt', methods=['POST'], csrf=False)
    def get_available_products(self, **kw):
        
        vehicle_id = kw.get('vehicle_id')
        if not vehicle_id:
            return {'error': 'Vehicle is required'}
        
        location = request.env['stock.location'].search([('name', '=', vehicle_id)])
        if not location:
            return {'error': 'Location not found'}
        
        products = request.env['product.product'].with_context(location=location.id).search([('virtual_available', '>', 0), ('qty_available', '>', 0)])
        
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