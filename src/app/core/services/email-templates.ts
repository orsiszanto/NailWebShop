/**
 * Email template szövegek és sablon objektumok
 * Felhasználva: Auth, Profile adatok módosításánál
 */

export interface EmailTemplate {
  subject: string;
  plainText: string;
  htmlTemplate: (data: Record<string, string>) => string;
}

export const EMAIL_TEMPLATES = {
  /**
   * Regisztráció után verifikációs email
   */
  VERIFICATION_EMAIL: {
    subject: 'Nailshop - Email cím verifikálása',
    plainText: `Szia! 👋

Köszönjük, hogy regisztráltál a Nailshop-on!

Az alábbi linkre kattintva erősítsd meg az email címedet:
{verificationLink}

A link 24 órán keresztül érvényes.

Ha nem te regisztráltál, hagyja figyelmen kívül ezt az emailt.

Üdvözlettel,
Nailshop csapat
https://nailshop.hu`,

    htmlTemplate: (data: Record<string, string>) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #08090a; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #E87EA1; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #FCFCFA; padding: 30px; border: 1px solid #e0e4d6; }
            .button { display: inline-block; background-color: #E87EA1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0; font-weight: 600; }
            .footer { background-color: #F7F8F3; padding: 20px; text-align: center; font-size: 12px; color: #4a4f55; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">Nailshop</h1>
              <p style="margin: 10px 0 0 0;">Email cím verifikálása</p>
            </div>
            <div class="content">
              <h2>Üdvözlünk, ${data['name']}! 👋</h2>
              <p>Köszönjük, hogy regisztráltál a Nailshop-on! Az alábbi gombra kattintva erősítsd meg az email címedet.</p>
              <a href="${data['verificationLink']}" class="button">✓ Email verifikálása</a>
              <p style="color: #8a9096; font-size: 12px;">A link 24 órán keresztül érvényes.</p>
              <p style="color: #8a9096; font-size: 12px;">Ha nem te regisztráltál, kérjük, hagyja figyelmen kívül ezt az emailt.</p>
            </div>
            <div class="footer">
              <p style="margin: 0;">© 2026 Nailshop. Minden jog fenntartva.</p>
              <p style="margin: 5px 0 0 0;">Kérdéseid vannak? <a href="mailto:support@nailshop.hu" style="color: #E87EA1; text-decoration: none;">Vedd fel velünk a kapcsolatot</a></p>
            </div>
          </div>
        </body>
      </html>
    `,
  },

  /**
   * Email módosítás - régi email címre küldött verifikáció
   */
  EMAIL_CHANGE_OLD_EMAIL: {
    subject: 'Nailshop - Email cím módosítás előirányzat',
    plainText: `Szia! 👋

Az alábbi email cím módosítás inicializálva lett a Nailshop profilodon:
{newEmail}

Ezt a művelet megerősítéséhez katt az alábbi linkre:
{confirmLink}

A link 1 órán keresztül érvényes.

Ha nem te kezdeményezted ezt a módosítást, kérjük azonnal módosítsd meg a jelszavad az ügyfélszolgálat elérésével.

Üdvözlettel,
Nailshop csapat
https://nailshop.hu`,

    htmlTemplate: (data: Record<string, string>) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #08090a; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #E87EA1; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #FCFCFA; padding: 30px; border: 1px solid #e0e4d6; }
            .warning { background-color: #fce4d6; padding: 15px; border-left: 4px solid #d97706; margin: 20px 0; border-radius: 4px; }
            .button { display: inline-block; background-color: #E87EA1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0; font-weight: 600; }
            .footer { background-color: #F7F8F3; padding: 20px; text-align: center; font-size: 12px; color: #4a4f55; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">Nailshop</h1>
              <p style="margin: 10px 0 0 0;">Email cím módosítás</p>
            </div>
            <div class="content">
              <h2>Email cím módosítás előirányzat</h2>
              <p>Az alábbi email cím módosítása inicializálva lett a Nailshop profilodon:</p>
              <p style="background-color: #FFFFFF; padding: 15px; border-radius: 4px; border: 1px solid #e0e4d6; word-break: break-all;"><strong>${data['newEmail']}</strong></p>
              <p>Ezt a műveletet a következő linkre kattintva erősítsd meg:</p>
              <a href="${data['confirmLink']}" class="button">✓ Módosítás megerősítése</a>
              <p style="color: #8a9096; font-size: 12px;">A link 1 órán keresztül érvényes.</p>
              <div class="warning">
                <strong>⚠️ Fontos!</strong> Ha nem te kezdeményezted ezt a módosítást, kérjük azonnal módosítsd meg a jelszavad az <a href="mailto:support@nailshop.hu" style="color: #d97706; text-decoration: none;">ügyfélszolgálat</a> elérésével.
              </div>
            </div>
            <div class="footer">
              <p style="margin: 0;">© 2026 Nailshop. Minden jog fenntartva.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  },

  /**
   * Email módosítás - új email címre küldött verifikáció
   */
  EMAIL_CHANGE_NEW_EMAIL: {
    subject: 'Nailshop - Kérjük, erősítsd meg az új email címedet',
    plainText: `Szia! 👋

Az email cím módosítása sikeresen megtörtént! Az új email cím: {newEmail}

Az alábbi linkre kattintva erősítsd meg az új email címedet:
{verificationLink}

A link 24 órán keresztül érvényes.

Üdvözlettel,
Nailshop csapat
https://nailshop.hu`,

    htmlTemplate: (data: Record<string, string>) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #08090a; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4caf8e; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #FCFCFA; padding: 30px; border: 1px solid #e0e4d6; }
            .button { display: inline-block; background-color: #4caf8e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0; font-weight: 600; }
            .footer { background-color: #F7F8F3; padding: 20px; text-align: center; font-size: 12px; color: #4a4f55; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">Nailshop</h1>
              <p style="margin: 10px 0 0 0;">Új email cím verifikálása</p>
            </div>
            <div class="content">
              <h2>Új email cím verifikálása</h2>
              <p>Az email cím módosítása sikeresen megtörtént! Az új email cím:</p>
              <p style="background-color: #FFFFFF; padding: 15px; border-radius: 4px; border: 1px solid #e0e4d6; word-break: break-all;"><strong>${data['newEmail']}</strong></p>
              <p>Az alábbi gombra kattintva erősítsd meg az új email címedet:</p>
              <a href="${data['verificationLink']}" class="button">✓ Email verifikálása</a>
              <p style="color: #8a9096; font-size: 12px;">A link 24 órán keresztül érvényes.</p>
            </div>
            <div class="footer">
              <p style="margin: 0;">© 2026 Nailshop. Minden jog fenntartva.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  },

  /**
   * Jelszó reset email
   */
  PASSWORD_RESET: {
    subject: 'Nailshop - Jelszó módosítás',
    plainText: `Szia! 👋

Jelszó módosítást kértél. Az alábbi linkre kattintva állíthatod be az új jelszavad:
{resetLink}

A link 1 órán keresztül érvényes.

Ha nem te kezdeményezted ezt a kérelmet, kérjük, hagyja figyelmen kívül ezt az emailt.

Üdvözlettel,
Nailshop csapat
https://nailshop.hu`,

    htmlTemplate: (data: Record<string, string>) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #08090a; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #E87EA1; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #FCFCFA; padding: 30px; border: 1px solid #e0e4d6; }
            .button { display: inline-block; background-color: #E87EA1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0; font-weight: 600; }
            .footer { background-color: #F7F8F3; padding: 20px; text-align: center; font-size: 12px; color: #4a4f55; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">Nailshop</h1>
              <p style="margin: 10px 0 0 0;">Jelszó módosítás</p>
            </div>
            <div class="content">
              <h2>Jelszó módosítást kértél 👋</h2>
              <p>Az alábbi gombra kattintva állíthatod be az új jelszavad:</p>
              <a href="${data['resetLink']}" class="button">🔐 Jelszó módosítása</a>
              <p style="color: #8a9096; font-size: 12px;">A link 1 órán keresztül érvényes.</p>
              <p style="color: #8a9096; font-size: 12px;">Ha nem te kérted ezt, kérjük, hagyja figyelmen kívül ezt az emailt.</p>
            </div>
            <div class="footer">
              <p style="margin: 0;">© 2026 Nailshop. Minden jog fenntartva.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  },
};
