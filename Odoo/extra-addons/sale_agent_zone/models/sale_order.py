from odoo import api, fields, models


class SaleOrder(models.Model):
    _inherit = "sale.order"
    
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