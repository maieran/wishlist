# wishlist
my small wishlist fullstack application for friends and family so they know stuff &lt;3



🎅 Silent Santa — Matching System Documentation
Overview

Silent Santa is a Secret-Santa–style feature that automatically assigns each user in a team a gift partner. The matching can be scheduled by admins or triggered manually. Users can see a countdown until matching begins, and after the algorithm runs, each user can view their assigned partner and their wishlist.

🚀 Features
User Features

Create and manage your wishlist

View team members

See the scheduled Silent Santa date

View a countdown until matching

Once matching has executed:

See your assigned partner

View your partner’s wishlist

Admin Features

Set or clear the global Silent Santa matching date

Trigger matching manually

Manage users (create/edit/delete)

View team structure (future feature)

🧠 Architecture

Silent Santa consists of the following main components:

Backend

MatchingConfig (stores date + executed flag)

MatchingService (executes the matching algorithm)

MatchingAlgorithm (creates giver → receiver assignments)

MatchAssignmentEntity (database record)

Cron Scheduler runs every 60 seconds

Endpoints:

GET /api/matching/config → date, executed state

POST /api/matching/config → set date (admin)

POST /api/matching/run-manual → force matching (admin)

GET /api/matching/me?teamId=X → returns partner or “not found”

Frontend (React Native)

Screens:

MatchingDateScreen (admin)

MatchingInProgressScreen

WishlistScreen

MyPartnerScreen

MyPartnerWishlistScreen

TeamScreen

AdminDashboard

AdminUsersScreen

🔄 Matching Workflow
1. Admin sets a matching date

The date is stored in MatchingConfig.
Users can now see a countdown.

2. Cron job checks periodically

When current time ≥ matchDate
→ Matching runs
→ executed = true

3. Users gain access to partner

When executed = true:

WishlistScreen shows:

🎅 Show my partner


MyPartnerScreen loads real partner from backend.

4. Admin manual execution

Admins can trigger matching immediately:

POST /api/matching/run-manual


Often used during testing.

📦 Database Entities
MatchingEntity

Stores:

team reference

createdAt timestamp

MatchAssignmentEntity

Stores:

giver user ID

receiver user ID

reference to matching

MatchingConfig

Stores:

global match date

executed flag

🧪 Testing the Matching Process
Set matching date:
POST /api/matching/config
{
  "matchDate": "2025-12-15T18:00:00Z"
}

Run manually:
POST /api/matching/run-manual

Get partner:
GET /api/matching/me?teamId=1



Perfekt.
Hier bekommst du eine **strukturierte, umfassende, klar abhakebare Test-Checkliste**, die du **vor jedem Deployment** verwenden kannst.

Ich gebe dir:

✅ **Markdown-Datei (komplett kopierbar für GitHub / Notion / Confluence)**
✅ **Mit Kästchen zum Abhaken**
✅ **Nach Themen sortiert**
✅ **Kurz + klar + vollständig**

---

# 📄 **SilentSanta – MANUELLE QA / TEST CHECKLISTE (MVP)**

> **Version:** 1.0
> **Stand:** Heute
> **Nutzen:** Vor jedem Deployment ausführen

---

# 1️⃣ AUTHENTIFIZIERUNG

## 🔐 Login / Logout

* [✅] Benutzer kann sich korrekt einloggen
* [✅] Falsche Credentials → Fehlermeldung, kein Crash
* [ ] Logout entfernt Token
* [ ] Nach Logout sind geschützte Seiten nicht mehr erreichbar
* [✅] App startet korrekt in Landing/Login Screen

---

# 2️⃣ WISHLIST

## 🎁 CRUD-Funktionen

* [✅] Neues Item hinzufügen
* [✅] Item bearbeiten (Titel, Beschreibung, Preis, Priorität, Bild)
* [✅] Item löschen
* [✅] Bild wird korrekt angezeigt
* [✅] Wishlist bleibt nach Neustart bestehen

## 🔍 Suche + Sortieren

* [✅] Suche filtert korrekt
* [✅] Sortierung Priority funktioniert
* [✅] Sortierung A–Z (Asc/Desc) funktioniert
* [✅] Sortierung Price (Asc/Desc) funktioniert
* [✅] „None“ entfernt Sortierung

## 🔄 Reload Verhalten

* [✅] Zurücknavigieren lädt Daten neu
* [✅] `useFocusEffect` funktioniert zuverlässig

---

# 3️⃣ TEAMS

## 👥 Team-Management

* [✅] Team erstellen
* [✅] Invite Code kopieren
* [✅] Team beitreten funktioniert
* [✅] Mitgliederliste zeigt korrekte User
* [✅] Owner wird visuell gekennzeichnet
* [✅] Team löschen funktioniert nur für Owner
* [✅] Team verlassen funktioniert für Member
* [✅] User verlassen → activeTeamId wird zurückgesetzt

## 👢 Kick-Funktion

* [✅] Owner kann Member kicken
* [✅] Gekickter User sieht kein Team mehr
* [✅] TeamList aktualisiert sich automatisch

## 🔄 Active Team Handling

* [✅] Team aktivieren funktioniert
* [✅] activeTeamId wird gespeichert (SecureStore)
* [✅] App-Neustart → activeTeamId korrekt geladen

---

# 4️⃣ MATCHING CONFIG (ADMIN)

## 📅 Datum setzen

* [✅] Admin/Owner kann Matching-Datum setzen
* [✅] Datum erscheint in App
* [✅] iOS + Android DatePicker verhalten korrekt
* [✅] Countdown startet

## 🗑 Datum löschen
A3555688
* [✅] Admin kann Datum löschen
* [✅] Countdown verschwindet
* [ ] scheduledDate im Context = null

---

# 5️⃣ MATCHING-PROZESS

## ▶ Manual Matching

* [✅] Admin löst `/run-manual` aus
* [✅] Matching wird gespeichert
* [✅] Partner werden korrekt zugeordnet
* [✅] Partnerwunschliste wird auch korrekt angezeigt
* [] lastRunAt wird gesetzt
* [X] User erhalten einmaligen Alert „Matching wurde ausgelost“

## ⏰ Scheduled Matching

* [✅] Datum in Zukunft setzen (z. B. +1 Minute)
* [✅] Countdown läuft
* [ ] Matching startet automatisch
* [ ] executed = true
* [ ] Alerts werden angezeigt

## 🔁 Matching nach Änderungen

* [ ] Nach Teamänderung (Join/Kick/Delete) → dirty wird true
* [ ] Matching wird erneut ausgeführt
* [ ] Mapping entspricht neuer Teamgröße

---

# 6️⃣ MATCHING STATUS CONTEXT

## 🔄 Polling

* [ ] Status aktualisiert sich automatisch (alle 15s)
* [ ] executed true/false wird korrekt gesetzt
* [ ] scheduledDate wird korrekt angezeigt
* [ ] lastRunAt löst nur einen Alert aus

## 🎅 UI-Reaktionen

* [✅] Wishlist zeigt Partner-Button erst nach ausgeführtem Matching
* [ ] Partner-Button verschwindet, wenn Team gewechselt wird

---

# 7️⃣ PARTNER VIEW

## 👤 MyPartner

* [✅] „Du bist SilentSanta von X“ erscheint korrekt
* [ ] Kein Matching → korrekte Meldung
* [ ] Kein Team → korrekte Meldung

## 📜 Partner Wishlist

* [✅] Partner-Wishlist lädt Items eines anderen Users
* [✅] Bilder des Partners werden angezeigt
* [X] Sortierung funktioniert auch dort
* [✅] Kein Crash bei leerer Liste

---

# 8️⃣ MULTI-TEAM VERHALTEN

## 🔁 Szenarien

* [ ] User ist in 2+ Teams
* [ ] Aktives Team wechseln → alle Matching-FUIs reagieren
* [ ] MatchingStatusContext zeigt Status des aktiven Teams
* [ ] Partner ändert sich korrekt pro Team

---

# 9️⃣ FEHLERFÄLLE

## ❌ Netzwerk & Backend

* [ ] Kein Internet → UI bleibt stabil
* [ ] Backend down → UI zeigt Fehlermeldung statt Crash
* [ ] 401 → Benutzer wird ausgeloggt

## ❌ Datenprobleme

* [ ] MatchingConfig existiert nicht → kein Crash
* [ ] Matching ohne ausreichend Teammitglieder → keine Fehler
* [ ] Partner nicht vorhanden → saubere Anzeige

---

# 🔟 BONUS: USER EXPERIENCE

## 🎨 UX Checks

* [ ] Buttons reagieren sofort
* [ ] Ladeindikatoren überall vorhanden
* [ ] Fehlermeldungen verständlich
* [ ] Keine UI-Flashes beim Statewechsel

---

# 🌟 Abschluss-Test

Wenn **alle Häkchen gesetzt** sind:

### ⭐ Ready for Deployment

→ Backend deployen
→ Mobile App EAS Build (Android & iOS)
→ ENV Variablen prüfen
→ API-URL einstellen

---

# Willst du diese Checkliste als **.md Datei** zum Download?

Ich kann sie dir auch direkt als **Notion-Template** oder **PDF** generieren.


