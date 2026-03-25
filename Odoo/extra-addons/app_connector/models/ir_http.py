from odoo import models, http
from odoo.http import request
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

                    # --- LOGICA DI "PULIZIA" ---
                    # Se raw_uid è un dizionario (come nel tuo caso), prendiamo la chiave 'uid'
                    if isinstance(raw_uid, dict):
                        uid = raw_uid.get('uid')
                    else:
                        uid = raw_uid
                    
                    # Verifichiamo che alla fine abbiamo un intero valido
                    if uid:
                        request.update_env(user=int(uid))
                        return 
                    else:
                        raise http.exceptions.AccessDenied("ID Utente non trovato nel token")
                    # ---------------------------

                except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
                    raise http.exceptions.AccessDenied("Token non valido o scaduto")
                except (TypeError, ValueError):
                    raise http.exceptions.AccessDenied("Formato ID Utente nel token non valido")
            
            raise http.exceptions.AccessDenied("Token mancante o non autorizzato")
        
        return super(IrHttp, cls)._authenticate(endpoint)