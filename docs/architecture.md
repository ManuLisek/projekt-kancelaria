# Architektura projektu

## Cel

Nowa wersja strony wizytowki kancelarii ma byc szybka, latwa do utrzymania i czytelna jako projekt portfolio frontend developera. Frontend pozostaje w Next.js, React i TypeScript, a tresci edytowalne beda zarzadzane w Sanity.

## Hosting

Domyslny kierunek to Vercel:

- darmowy start dla projektu portfolio,
- naturalne wsparcie dla Next.js,
- proste zmienne srodowiskowe,
- ISR i on-demand revalidation bez dodatkowej infrastruktury.

## Planowane podstrony

- `/` - strona glowna z hero, opisem osoby, wybranymi specjalizacjami i najnowszymi artykulami.
- `/specjalizacje` - lista specjalizacji.
- `/specjalizacje/[slug]` - szczegoly specjalizacji.
- `/blog-prawny` - lista artykulow.
- `/blog-prawny/[slug]` - szczegoly artykulu.
- `/pomoc-prawna-online` - opis uslugi online.
- `/kontakt` - dane kontaktowe i mapa.

## Model tresci Sanity

### Profile

Globalny dokument danych kancelarii:

- nazwa kancelarii,
- imie i nazwisko,
- opis osoby,
- zdjecie profilowe,
- cytat lub tekst hero,
- adres,
- telefon,
- email,
- linki social media,
- dane SEO strony glownej.

### Specialization

- nazwa,
- slug,
- krotki opis,
- pelna tresc,
- kolejnosc wyswietlania,
- dane SEO.

### Article

- tytul,
- slug,
- excerpt,
- tresc,
- glowne zdjecie,
- data publikacji,
- powiazane specjalizacje,
- dane SEO.

### Online Legal Aid

Osobny dokument dla tresci podstrony pomocy online:

- tytul,
- opis,
- kroki procesu,
- call to action,
- dane SEO.

## Zasady techniczne

- Tokeny Sanity tylko po stronie serwera.
- Publiczne moga byc jedynie project id, dataset i api version.
- Dane krytyczne nie powinny cicho zwracac pustych fallbackow.
- Tresci z CMS beda pobierane przez Server Components lub server-only data layer.
- Strony dynamiczne powinny uzywac cache tags albo ISR.
- Komponenty UI nie powinny znac szczegolow klienta CMS.
