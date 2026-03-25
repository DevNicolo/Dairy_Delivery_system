from odoo import http
from odoo.http import request

class ProductApi(http.Controller):

    @http.route('/api/get_all_products', type='json', auth='jwt', methods=['POST'], csrf=False)
    def get_all_products(self, **kw):
        """
        Questa rotta è ora protetta. 
        Richiede un Header 'Authorization: Bearer <token>'
        """
        # Ora request.env.user è l'utente che ha generato il token!
        # Non serve .sudo() se l'utente ha i permessi di lettura sui prodotti.
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
        """
        Ora questa rotta richiede un token JWT valido.
        L'utente viene identificato dal middleware e caricato in request.env.user.
        """
        
        # 1. Recupero i dati inviati (JSON-RPC 2.0 params)
        name = kw.get('name')
        list_price = kw.get('list_price', 0.0)
        default_code = kw.get('default_code', '')
        categ_id = kw.get('categ_id')

        # Controllo minimo sui dati obbligatori
        if not name or not categ_id:
            return {'error': 'Mancano dati obbligatori: name o categ_id'}

        try:
            # 2. Creo il prodotto. 
            new_product = request.env['product.product'].create({
                'name': name,
                'list_price': list_price,
                'default_code': default_code,
                'categ_id': categ_id
            })

            # 3. Ritorno l'ID del nuovo prodotto creato
            return {
                'id': new_product.id, 
                'message': 'Prodotto creato con successo',
                'created_by': request.env.user.name # Giusto per conferma
            }
        except Exception as e:
            return {'error': str(e)}