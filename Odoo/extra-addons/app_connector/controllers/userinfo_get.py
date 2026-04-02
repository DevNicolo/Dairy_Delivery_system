from odoo import http
from odoo.http import request

class ProductApi(http.Controller):

    @http.route('/api/get_user_info', type='json', auth='jwt', methods=['POST'], csrf=False)
    def get_user_info(self, **kw):
        user = request.env['res.users'].sudo().browse(request.uid)
        user_info = {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'phone': user.phone,
            'mobile': user.mobile,
            'lang': user.lang,
            'cod_fis': user.l10n_it_codice_fiscale,    
        }
        return {'status': 'success', 'message': 'Session is valid', 'user_info': user_info}