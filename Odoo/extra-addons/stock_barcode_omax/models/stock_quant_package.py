# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.
import base64
from odoo import api, fields, models, _
from odoo.modules.module import get_module_resource
from io import BytesIO
import qrcode


class StockQuantPackage(models.Model):
    _inherit = "stock.quant.package"

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
            company = record.company_id if hasattr(record, 'company_id') and record.company_id else self.env.company
            if company and company.package_field_ids:
                for package_field_id in company.package_field_ids:
                    if package_field_id.ttype == 'many2one':
                        field_tech_name = package_field_id.name
                        field_label = package_field_id.field_description
                        QRData = QRData + field_label +' : '+ str(record[field_tech_name].name) +'\n'
                    elif package_field_id.ttype in ['one2many', 'many2many']:
                        field_tech_name = package_field_id.name
                        field_label = package_field_id.field_description
                        if field_tech_name == 'quant_ids':
                            QRData += field_label + ":\n"
                            if hasattr(record, 'quant_ids') and record.quant_ids:
                                for quant in record.quant_ids:
                                    if quant.product_id:
                                        qty = getattr(quant, 'quantity', 0.0)
                                        QRData += f"  - {quant.product_id.display_name} (Qty: {qty})\n"
                    else:
                        field_tech_name = package_field_id.name
                        field_label = package_field_id.field_description
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
