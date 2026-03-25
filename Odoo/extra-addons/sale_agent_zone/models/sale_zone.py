from odoo import fields, models


class SaleZone(models.Model):
    _name = "sale.zone"
    _description = "Zona commerciale"
    _order = "name"

    name = fields.Char(string="Nome zona", required=True)
    region = fields.Char(string="Regione")
    province = fields.Char(string="Provincia")
    active = fields.Boolean(default=True)

    _sql_constraints = [
        ("name_uniq", "UNIQUE(name)", "Il nome della zona deve essere univoco."),
    ]
