# Skysite

Nettsider for lokale bedrifter.

Skysite lager moderne, mobilvennlige nettsider for restauranter, butikker og andre lokale bedrifter.

## Se nettsidene

- **Skysite (forside):** https://skysite.no/
- **Quick Bite, Sandnes (demo):** https://skysite.no/quick-bite/

## Innhold

| Fil / mappe | Hva |
|---|---|
| `index.html` | Forsiden til Skysite |
| `quick-bite/index.html` | Nettsideforslag for Quick Bite |
| `quick-bite-meny.md` | Menyen til Quick Bite med priser |
| `Quick-bite-bilder.md` | Oversikt over bilder til Quick Bite |
| `logo.svg` | Skysite-logo |
| `og-image.png` | Delingsbilde (1200×630) for forsiden |
| `fonts/` | Skrifter lagret lokalt: Schibsted Grotesk (forsiden), Inter og Archivo Black (Quick Bite) |

## Publisering

Sidene publiseres automatisk med GitHub Pages fra `main`-grenen på domenet **skysite.no** (registrert hos Domeneshop). Endringer er ute etter et par minutter.

## Status (25.11.2026)

- **Domene:** skysite.no er registrert hos Domeneshop og publisert hos Norid 25.11. DNS peker til GitHub Pages.
- **GitHub Pages:** `CNAME`-fila med `skysite.no` er lagt inn. Noen DNS-tjenere kan bruke opptil to timer før de ser domenet.
- **HTTPS:** GitHub lager sertifikatet automatisk når domenet er synlig. Når det er klart: Settings → Pages → huk av for **Enforce HTTPS**.
- **E-post:** postkassen `post@skysite.no` finnes hos Domeneshop (IMAP/SMTP: `mail1.no1.essentialhosting.net`, port 993 / 465, brukernavn = hele e-postadressen). Passord deles ikke her.

## Neste steg

- [ ] Slå på **Enforce HTTPS** når sertifikatet er klart.
- [x] Ny forside med kontaktskjema tatt i bruk (`index (1).html` → `index.html`).
- [ ] Sjekk at https://skysite.no og https://skysite.no/quick-bite/ ser riktige ut på mobil.

## Team

- **Osman Khalid** – [@Osmantheprince](https://github.com/Osmantheprince) (også [@Ossitheprince](https://github.com/Ossitheprince))
- **Hasan Shabbir** – [@hazax123](https://github.com/hazax123)
