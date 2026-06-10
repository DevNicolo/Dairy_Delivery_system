# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.
import base64
from odoo import api, fields, models, _
from odoo.modules.module import get_module_resource
from io import BytesIO
import qrcode


class StockPicking(models.Model):
    _inherit = "stock.picking"

    @api.model
    def _default_image(self):
        image_path = get_module_resource('stock_barcode_omax', 'static/description', 'default_image.png')
        return base64.b64encode(open(image_path, 'rb').read())

    @api.depends()
    def _get_qrcode(self):
        for record in self:
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_L,
                box_size=10,
                border=4,
            )
            QRData = ''
            if record.company_id and record.company_id.picking_field_ids:
                for picking_field_id in record.company_id.picking_field_ids:
                    if picking_field_id.ttype == 'many2one':
                        field_tech_name = picking_field_id.name
                        field_label = picking_field_id.field_description
                        QRData = QRData + field_label +' : '+ str(record[field_tech_name].name) +'\n'
                    else:
                        field_tech_name = picking_field_id.name
                        field_label = picking_field_id.field_description
                        QRData = QRData + field_label +' : '+ str(record[field_tech_name]) +'\n'
            qr.add_data(QRData)
            qr.make(fit=True)
            img = qr.make_image()
            temp = BytesIO()
            img.save(temp, format="PNG")
            qr_image = base64.b64encode(temp.getvalue())
            record.qrcode_image = qr_image

    qrcode_image = fields.Binary(default=_default_image, compute='_get_qrcode')

# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
