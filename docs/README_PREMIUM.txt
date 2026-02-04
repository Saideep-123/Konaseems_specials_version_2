
KONASEEMA PREMIUM – SHEET DRIVEN VERSION

WHAT'S INCLUDED
- Cart quantity bug fixed (logic prepared)
- Google Sheet as single source of truth (placeholder)
- Out of stock blocking (sheet driven)
- US weights only
- Premium scrolling info bar (mobile-first)

GOOGLE SHEET (PLACEHOLDER)
Replace SHEET_URL in:
app/lib/sheet.ts

SHEET COLUMNS
product_id | product_name | category | description | weight_lb | price_usd | out_of_stock | image_url | type | combo_items

NOTES
- DB stores only order summary + customer info
- Prices are NOT stored in DB
