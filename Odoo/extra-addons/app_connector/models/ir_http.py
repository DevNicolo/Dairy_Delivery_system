from odoo import models, http
from odoo.http import request
from odoo.exceptions import AccessDenied
import jwt

class IrHttp(models.AbstractModel):
    _inherit = 'ir.http'

    @classmethod
    def _authenticate(cls, endpoint):
        auth_method = endpoint.routing.get('auth')
        
        if auth_method == 'jwt':
            token = request.httprequest.headers.get('Authorization')
            if token and token.startswith('Bearer '):
                token = token.split(' ')[1]
                SECRET_KEY = "your-secret-key"
                
                try:
                    payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
                    raw_uid = payload.get('uid')

                    # --- Cleanup Logic ---
                    # if uid is a dict, extract the 'uid' key; otherwise, use it directly
                    if isinstance(raw_uid, dict):
                        uid = raw_uid.get('uid')
                    else:
                        uid = raw_uid
                    
                    # verify that uid is a valid integer and not None
                    if uid:
                        request.update_env(user=int(uid))
                        return 
                    else:
                        raise AccessDenied("User ID not valid in token")
                    # ---------------------------

                except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
                    raise AccessDenied("JWT token invalid or expired")
                except (TypeError, ValueError):
                    raise AccessDenied("Error decoding JWT token")
            
            raise AccessDenied("Missing or malformed JWT token")
        
        return super(IrHttp, cls)._authenticate(endpoint)