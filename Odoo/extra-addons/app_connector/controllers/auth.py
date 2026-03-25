from odoo import http
from odoo.http import request
from odoo.exceptions import AccessDenied
import jwt
import datetime

class CustomJWTAuth(http.Controller):

    @http.route('/api/jwt/login', type='http', auth='none', methods=['POST'], csrf=False)
    def jwt_login(self, **kwargs):
        json_data = request.httprequest.get_json(silent=True) or {}
        login = json_data.get('login')
        password = json_data.get('password')

        if not login or not password:
            return request.make_response(
                '{"error": "Missing credentials"}',
                status=400,
                headers=[('Content-Type', 'application/json')]
            )

        try:
            # Correct authentication for Odoo 18
            credential = {'login': login, 'password': password, 'type': 'password'}
            uid = request.env['res.users'].authenticate(request.db, credential, None)
        except AccessDenied:
            return request.make_response(
                '{"error": "Invalid credentials"}',
                status=401,
                headers=[('Content-Type', 'application/json')]
            )

        # Generate JWT token (requires pyjwt installed)
        SECRET_KEY = "your-secret-key"  # Store in ir.config_parameter
        payload = {
            'uid': uid,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=2),
            'iat': datetime.datetime.utcnow()
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

        return request.make_response(
            f'{{"token": "{token}", "uid": {uid}}}',
            headers=[('Content-Type', 'application/json')]
        )