# Skysite

Nettsider for lokale bedrifter. Live på **https://skysite.no**.

## Sider

| Side | Fil |
|---|---|
| Forside | `index.html` |
| Tjenester | `tjenester/index.html` |
| Eksempler | `eksempler/index.html` |
| Slik foregår det | `slik-foregar-det/index.html` |
| Priser | `priser/index.html` |
| IT-støtte | `it-stotte/index.html` |
| Spørsmål og svar | `sporsmal/index.html` |
| Om oss | `om-oss/index.html` |
| Kontakt (skjema) | `kontakt/index.html` |
| Personvern | `personvern.html` |
| Feilside | `404.html` |

Eksempelsidene som vises under «Eksempler» ligger i `eksempel/` (`rorlegger/`, `frisor/`, `fastfood/`). De er oppdiktede bedrifter.

## Mapper og filer

```
index.html + én mappe per underside      sidene
style.css, main.js                       felles stil og skript (meny, skjema, årstall)
analytics.js                             besøksstatistikk (GoatCounter, uten cookies)
eksempel/                                eksempelsidene som vises på /eksempler/
quick-bite/                              forslaget til Quick Bite, publiseres ikke
fonts/                                   skrifter (lagret lokalt)
notater/                                 interne notater, publiseres ikke
logo.svg, og-image.png,
apple-touch-icon.png                     logo, delingsbilde og iPhone-ikon
sitemap.xml, robots.txt                  for Google
google23eed103bac8219a.html              beviser eierskap i Search Console, må aldri slettes
CNAME, _config.yml                       domene og publisering
```

## Publisering

Alt som ligger på `main` publiseres automatisk til skysite.no etter et par minutter. `notater/`, `quick-bite/` og denne README-en publiseres ikke (se `_config.yml`).

Når dere endrer en side, oppdater `lastmod` for den i `sitemap.xml`. Lager dere en ny underside, legg den inn i `sitemap.xml` og i menyen på alle sidene.

## Slik endrer dere sidene

- **Kundesitat:** Seksjonen `id="sitat"` i `index.html` er skjult. Når en kunde har sagt ja, setter dere inn det kunden faktisk sa, navn og sted, og fjerner `hidden`.
- **Bilder av dere:** Legg dem i `bilder/` (f.eks. `osman.jpg`, `hasan.jpg`) og bytt ut initialene (`<div class="avatar">`) i `om-oss/index.html` med bildene.
- **Priser:** Fra-prisene står i `priser/index.html` (nettsider) og `it-stotte/index.html` (IT-støtte). Endrer dere en pris, sjekk også forsiden (`Fast pris` og kortet «Priser»), `sporsmal/` og `slik-foregar-det/`, som nevner «fra 2 990 kr».
- **Kontaktskjemaet** på `/kontakt/` sender til `post@skysite.no` via Formsubmit.

## Google Search Console

Eiendommen `https://skysite.no/` er lagt til i Search Console og bekreftet med filen `google23eed103bac8219a.html`.

1. Under «Nettstedskart»: send inn `https://skysite.no/sitemap.xml`.
2. Under «URL-inspeksjon»: be om indeksering av forsiden og hver underside.
3. Få lenker til skysite.no fra andre steder: kundesidene dere lager («Laget av Skysite» i bunnen), LinkedIn, Facebook, Instagram, Gulesider og 1881.

Undersidene under søketreffet (sitelinks) bestemmes av Google og kommer vanligvis etter noen uker til måneder.

Det som gjenstår, ligger under [Issues](../../issues).

## Team

- **Osman Khalid** – [@Osmantheprince](https://github.com/Osmantheprince) (også [@Ossitheprince](https://github.com/Ossitheprince))
- **Hasan Shabbir** – [@hazax123](https://github.com/hazax123)
