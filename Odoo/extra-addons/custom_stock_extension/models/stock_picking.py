from odoo import models, fields, api

# 1. INTERCEPT INDIVIDUAL PRODUCT LINES AT CREATION
class StockMove(models.Model):
    _inherit = 'stock.move'

    @api.model_create_multi
    def create(self, vals_list):
        for vals in vals_list:
            # Check if the new line comes from a sales order
            sale_line_id = vals.get('sale_line_id')
            if sale_line_id:
                sale_line = self.env['sale.order.line'].browse(sale_line_id)
                # If there is a vehicle on the order, force the location on the line IMMEDIATELY
                if sale_line.order_id.vehicle_id:
                    vals['location_id'] = sale_line.order_id.vehicle_id.id
                    
        return super(StockMove, self).create(vals_list)


# 2. INTERCEPT THE DOCUMENT HEADER (As we did before)
class StockPicking(models.Model):
    _inherit = 'stock.picking'

    @api.model_create_multi
    def create(self, vals_list):
        for vals in vals_list:
            sale_id = vals.get('sale_id')
            
            if not sale_id and vals.get('origin'):
                sale_order = self.env['sale.order'].search([('name', '=', vals['origin'])], limit=1)
            elif sale_id:
                sale_order = self.env['sale.order'].browse(sale_id)
            else:
                sale_order = False

            if sale_order and sale_order.vehicle_id:
                # Force the origin location on the document header
                vals['location_id'] = sale_order.vehicle_id.id
                
        return super(StockPicking, self).create(vals_list)