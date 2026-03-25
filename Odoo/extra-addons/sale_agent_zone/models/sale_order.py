from odoo import api, fields, models


class SaleOrder(models.Model):
    _inherit = "sale.order"

    zone_id = fields.Many2one(
        comodel_name="sale.zone",   # questo indica l'altro membro della relazione
        string="Zona commerciale",  # etichetta da visualizzare
        compute="_compute_zone_agent",  # metodo che calcola il valore del campo
        store=True, # indica che il valore calcolato deve essere memorizzato nel database
        readonly=False, # indica che il campo è modificabile dall'utente  
    )
    # Many2many relayed from partner, editable on the order
    order_agent_id = fields.Many2one(
        comodel_name="res.partner", # questo indica l'altro membro della relazione
        domain=[("agent", "=", True)], # filtro per mostrare solo i partner che sono agenti
        string="Agente", # etichetta da visualizzare
    )
    
    vehicle_id = fields.Many2one(
        comodel_name="stock.location", 
        string="Mezzo / Ubicazione", 
        domain=[('usage', '=', 'transit')], # solo mezzi mobili
    )
    
    @api.onchange('partner_id')
    def _onchange_partner_id_zone(self):
        if self.partner_id:
            self.zone_id = self.partner_id.zone_id
        else:
            self.zone_id = False