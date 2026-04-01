from odoo import http
from odoo.http import request

class ProductApi(http.Controller):

    @http.route('/api/check_session', type='json', auth='jwt', methods=['POST'], csrf=False)
    def check_session(self, **kw):
        return {'status': 'success', 'message': 'Session is valid'}