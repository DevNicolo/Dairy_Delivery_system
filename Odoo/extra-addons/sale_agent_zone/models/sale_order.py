from odoo import api, fields, models


class SaleOrder(models.Model):
    _inherit = "sale.order"

    zone_id = fields.Many2one(
        comodel_name="sale.zone",   # this indicates the other member of the relationship
        string="Zona commerciale",  # label to display in the form view
    )
    
    order_agent_id = fields.Many2one(
        comodel_name="res.partner",
        domain=[("agent", "=", True)], # filter to show only partners that are agents
        string="Agente", 
    )
    
    vehicle_id = fields.Many2one(
        comodel_name="stock.location", 
        string="Mezzo / Ubicazione", 
        domain=[('usage', '=', 'transit')], # only show locations that are marked as 'transit' (used for vehicles in this context)
    )
    
    @api.onchange('partner_id')
    def _onchange_partner_id_zone(self):
        if self.partner_id:
            self.zone_id = self.partner_id.zone_id
        else:
            self.zone_id = False