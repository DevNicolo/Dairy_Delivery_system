from odoo import fields, models


class ResPartner(models.Model):
    _inherit = "res.partner"

    zone_id = fields.Many2one(
        comodel_name="sale.zone",
        string="Zona commerciale",
        ondelete="set null",
    )
