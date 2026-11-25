# Skysite

Nettsider for lokale bedrifter. Live på **https://skysite.no**.

## Sider

| Side | Fil |
|---|---|
| Forside | `index.html` |
| Quick Bite-forslaget | `quick-bite/index.html` |
| Personvern | `personvern.html` |
| Feilside | `404.html` |

## Mapper og filer

```
index.html, personvern.html, 404.html   sidene
quick-bite/                             forslaget til Quick Bite
fonts/                                  skrifter (lagret lokalt)
notater/                                interne notater, publiseres ikke
logo.svg, og-image.png,
apple-touch-icon.png                    logo, delingsbilde og iPhone-ikon
sitemap.xml, robots.txt                 for Google
CNAME, _config.yml                      domene og publisering
```

## Publisering

Alt som ligger på `main` publiseres automatisk til skysite.no etter et par minutter. Filene i `notater/` og denne README-en publiseres ikke (se `_config.yml`).

## Slik endrer dere forsiden

- **Kundesitat:** Seksjonen `id="sitat"` i `index.html` er skjult. Når en kunde har sagt ja, setter dere inn det kunden faktisk sa, navn og sted, og fjerner `hidden`.
- **Bilder av dere:** Legg dem i `bilder/` (f.eks. `osman.jpg`, `hasan.jpg`) og sett dem inn under «Om oss».
- **Priser:** Siden sier at prisen avtales etter første prat. Bytt det ut når dere har faste priser.
- **Kontaktskjemaet** sender til `post@skysite.no` via Formsubmit.

Det som gjenstår, ligger under [Issues](../../issues).

## Team

- **Osman Khalid** – [@Osmantheprince](https://github.com/Osmantheprince) (også [@Ossitheprince](https://github.com/Ossitheprince))
- **Hasan Shabbir** – [@hazax123](https://github.com/hazax123)
