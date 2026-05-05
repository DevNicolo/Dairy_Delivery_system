from odoo import models, fields, api

class StockPicking(models.Model):
    _inherit = 'stock.picking'

    @api.model_create_multi
    def create(self, vals_list):
        for vals in vals_list:
            # Search for sale_id in the provided vals
            sale_id = vals.get('sale_id')
            
            # If there's no sale_id, try to retrieve it through the origin field
            if not sale_id and vals.get('origin'):
                sale_order = self.env['sale.order'].search([('name', '=', vals['origin'])], limit=1)
            elif sale_id:
                sale_order = self.env['sale.order'].browse(sale_id)
            else:
                sale_order = False

            # If we found the sales order and it has a vehicle
            if sale_order and sale_order.vehicle_id:
                vals['location_id'] = sale_order.vehicle_id.id
                
        return super(StockPicking, self).create(vals_list)