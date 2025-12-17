🔐 1. Auth & App-Flow
⬜ App-Start
✅🚩
 App startet ohne weißen Screen

 Kein Flackern zwischen Screens

 Status-Bar / Notch verdeckt nichts

⬜ Login

 Login funktioniert

 Nach Login → korrekter Screen (Load → Between → Home)

 Kein Zurückspringen auf Login

 App merkt sich Login (Token)

⬜ Logout

 Logout löscht Session

 Danach kein Zugriff mehr auf geschützte Screens

🧭 2. Navigation (kritisch vor Design!)
⬜ Stack-Navigation

 Jeder Screen ist erreichbar

 Navigation fühlt sich logisch an

 Kein Screen ist „gefangen“ (kein Back)

⬜ Back-Buttons

 iOS Back-Button sichtbar wo sinnvoll

 Custom Zurück-Button funktioniert

 replace() vs navigate() bewusst eingesetzt

⚠️ Wichtig:
Alles, was später Figma-Header bekommt → kein Default-Header nötig

⏳ 3. Lade- & Übergangszustände
⬜ LoadingBetweenScreen

 Wird immer kurz angezeigt

 Kein Standbild

 Kein doppeltes Weiterleiten

⬜ Polling

 „Aktualisiere …“ sichtbar

 UI bleibt bedienbar

 Kein Ruckeln

🎄 4. Matching-Flow (User-sichtbar!)
⬜ Ohne Team

 Kein Kalender

 Kein Countdown

 „Kein Matching aktiv“

⬜ Mit Team, ohne Datum

 Kein Countdown

 Kein Kalender

 Klar verständlicher Zustand

⬜ Mit Team + Datum

 Countdown sichtbar

 Kalender markiert korrekt

 Uhrzeit tickt live

⬜ Matching läuft

 Text „Matching wird ausgeführt …“

 Kein Freeze

⬜ Nach Matching

 „🎁 Matching wurde ausgeführt!“

 Button „Mein Partner anzeigen“

👥 5. Team-Funktionen
⬜ Team erstellen

 Direkt im Team

 Teamname sichtbar

⬜ Team beitreten

 Beitritt sichtbar

 UI aktualisiert sich automatisch

⬜ Team ändert sich

 Dirty-Status greift

 Warnung sichtbar (⚠️ Team geändert)

🎁 6. Partner & Wishlist
⬜ Mein Partner

 Nur sichtbar nach Matching

 Richtiger Partner

⬜ Partner-Wishlist

 Items sichtbar

 Kein Edit möglich

 Navigation zurück funktioniert

📋 7. Wishlist (eigene)
⬜ Liste

 Scrollbar ok

 Items korrekt

⬜ Add / Edit / Delete

 Navigation korrekt

 Änderungen sofort sichtbar

🛠 8. Admin-Features (nur sichtbar!)
⬜ MatchingDateScreen

 Datum setzen

 Countdown sichtbar

 Dirty-Status sichtbar

 „Matching neu ausführen“ nur bei dirty

⬜ Admin Dashboard

 Nur für Admin sichtbar

 Keine Leaks für User

📱 9. iOS-spezifisch (sehr wichtig)
⬜ SafeArea

 Notch verdeckt nichts

 Status-Bar korrekt

⬜ Keyboard

 Keyboard schiebt Inhalte nicht kaputt

 Login & Forms nutzbar

⬜ Rotation (optional)

 Keine UI-Explosion

🧠 10. UX-Gefühl (ehrlich testen)

Stell dir bei jedem Screen nur diese Frage:

„Wüsste ein Nicht-Tech-User, was hier gerade passiert?“

 Ladezustand erkennbar

 Kein „toter“ Screen

 Kein überraschendes Verhalten