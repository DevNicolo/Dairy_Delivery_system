# License AGPL-3.0 or later (https://www.gnu.org/licenses/agpl).
{
    "name": "Sale Agent & Zone",
    "version": "18.0.1.0.0",
    "summary": "Agente di riferimento e zona geografica su ordini/preventivi di vendita",
    "author": "Custom",
    "license": "AGPL-3",
    "depends": [
        "sale_management",
        "commission_oca",
        "sale_commission_oca",
    ],
    "data": [
        "security/ir.model.access.csv",
        "views/sale_order_views.xml",
    ],
    "installable": True,
    "auto_install": False,
}
