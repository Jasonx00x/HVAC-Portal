# Google Invoice Sync

FieldCore can send portal-created invoices to a Google Sheet through Google Apps Script.

## Google Sheet Setup

1. Open the Google Sheet that should receive invoice backups.
2. Go to `Extensions -> Apps Script`.
3. Paste the Apps Script webhook code.
4. Use a private shared secret in the script, for example `hotcool-fieldcore-invoices-2026`.
5. Deploy as a `Web app`.
6. Set `Execute as` to `Me`.
7. Set `Who has access` to `Anyone`.
8. Copy the Web App URL.

The script creates a separate tab named `FieldCore Invoice Sync`, so the original invoice tracker tab is not changed.

## Netlify Environment Variables

Add these private environment variables in Netlify:

```env
GOOGLE_INVOICE_WEBHOOK_URL="https://script.google.com/macros/s/.../exec"
GOOGLE_INVOICE_SYNC_SECRET="same-secret-used-in-apps-script"
```

## FieldCore Behavior

- Invoices created from completed jobs auto-sync to Google Sheets.
- Blank draft invoices stay in FieldCore until staff review them and click `Sync`.
- Portal-created invoices show a `Google sync` status in the invoice table.
- Imported spreadsheet invoices are protected and are not pushed back into Google.
- If Google rejects the request or the secret does not match, the invoice stays in FieldCore and shows `Failed`.
