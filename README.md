Natürlich — hier ist dein kompletter **Silent Santa iOS Testplan** als perfekt strukturiertes, copy-paste-fertiges **Markdown-Dokument mit Checkboxes (✓)**.

---

# 🎄 Silent Santa – Vollständiger QA Testplan

### *(Markdown-Version mit Häkchen zum Abhaken)*
✅
🚩
---

## ## 🧪 BLOCK 1 — AUTHENTICATION

### **Login**

* [✅] App starten
* [✅] Username eingeben
* [✅] Passwort eingeben
* [✅] Auf **Login** klicken
* [🚩] Erwartung: UserHomeScreen erscheint mit korrektem Namen => manchmal ist ein anderer Name, kann aber auch Simulator-Problem sein. Ich hoff der Prod wird es nicht geben.

### **Logout**

* [🚩] Auf **Logout** scrollen → drücken => keine Reaktion auf Logout-Drücken
* [🚩] Erwartung: Token gelöscht, zurück zum LoginScreen
* [🚩] Erwartung: Kein alter Benutzername erscheint

---

## 🧪 BLOCK 2 — PROFIL & AVATAR

### **Default Avatar**

* [🚩] Wenn kein Avatar gesetzt → Standard-Avatar wird angezeigt => zeigt nicht, also verweist auch nichts
* [🚩] URL verweist auf `/static/avatars/default-avatar.png`

### **Avatar ändern**

* [🚩] Avatar antippen => Avatar bleibt leer aus und lässt sich nicht ändern, keine Ahnugn was los ist
* [🚩] Bild auswählen
* [🚩] Upload erfolgreich
* [🚩] Erwartung: Neues Bild erscheint sofort
* [🚩] Neustart der App → Avatar bleibt gespeichert
* [✅] Rotes „+“ Icon sichtbar

### **Avatar Upload Fehlerfall**

* [🚩] Upload abbrechen oder ungültige Datei hochladen => da das Avatar nicht uploadbar ist un der Default nicht angezeigt wird, ist hier alles eine rote Flagge.
* [🚩] Erwartung: Fehler-Alert erscheint, App crasht nicht

---

## 🧪 BLOCK 3 — TEAMS

### **Team erstellen (Admin)**

* [ ] Admin öffnet *Meine Teams*
* [ ] „Team erstellen“
* [ ] Teamname eingeben
* [ ] Erwartung: Invite-Code wird angezeigt
* [ ] Team erscheint in Liste

### **Team beitreten (User)**

* [ ] Einladungscode eingeben
* [ ] Erwartung: User wird Mitglied
* [ ] activeTeamId wird gesetzt
* [ ] Teamname erscheint auf UserHomeScreen

### **Team aktiv setzen**

* [ ] Team auswählen → „aktiv setzen“
* [ ] Erwartung: UserHomeScreen zeigt dieses Team

### **Team verlassen**

* [ ] „Team verlassen“ drücken
* [ ] Erwartung: User ist nicht mehr Mitglied
* [ ] activeTeamId = null
* [ ] HomeScreen zeigt Hinweis „Kein aktives Team“

---

## 🧪 BLOCK 4 — WISHLIST

### **Wishlist erstellen**

* [ ] Neues Item hinzufügen
* [ ] Titel setzen
* [ ] Beschreibung setzen
* [ ] Preis setzen
* [ ] Priorität wählen (Rot/Blau/Grün)
* [ ] Bild hochladen
* [ ] Erwartung: Item erscheint sofort

### **Wishlist editieren**

* [ ] Item öffnen → bearbeiten
* [ ] Erwartung: Änderungen sofort sichtbar

### **Wishlist löschen**

* [ ] Item löschen
* [ ] Erwartung: Item verschwindet

---

## 🧪 BLOCK 5 — MATCHING (ADMIN-FUNKTIONEN)

### **Matching-Datum setzen**

* [ ] AdminDashboard öffnen
* [ ] Datum + Uhrzeit wählen (1–2 Minuten in der Zukunft)
* [ ] Erwartung:

  * [ ] Countdown erscheint im HomeScreen
  * [ ] Countdown erscheint im BetweenScreen

### **Matching automatisch laufen lassen**

* [ ] Countdown abwarten
* [ ] Erwartung:

  * [ ] executed = true
  * [ ] lastRunAt wird gesetzt
  * [ ] Partner-Zuordnung verfügbar

### **Matching manuell starten**

* [ ] „Matching jetzt ausführen“ drücken
* [ ] Erwartung:

  * [ ] Partner sofort verfügbar
  * [ ] executed = true

---

## 🧪 BLOCK 6 — PARTNER-ZUORDNUNG

### **PartnerScreen**

* [ ] *Mein Partner* öffnen
* [ ] Erwartung falls Partner existiert:

  * [ ] Name sichtbar
  * [ ] Avatar sichtbar
  * [ ] Button „Partner Wishlist anzeigen“

### **PartnerWishlist**

* [ ] PartnerWishlist öffnen
* [ ] Erwartung:

  * [ ] Items sichtbar
  * [ ] Keine Edit-Möglichkeiten

### **Falls Matching nicht executed**

* [ ] Erwartung: „Matching wurde noch nicht ausgeführt.“

---

## 🧪 BLOCK 7 — MATCHINGSTATUS CONTEXT

### **App-Neustart**

* [ ] App beenden & erneut öffnen
* [ ] Erwartung:

  * [ ] Countdown korrekt
  * [ ] Teamname korrekt
  * [ ] Avatar korrekt
  * [ ] Polling funktioniert

### **Countdown Logik testen**

* [ ] Datum auf verschiedene Zeiten stellen

  * [ ] 2 Tage → „2 Tage xx Std“
  * [ ] 0 Minuten → „Matching läuft“

---

## 🧪 BLOCK 8 — DEFAULT-IMAGES

### **User Default Avatar**

* [ ] Bild: `/static/avatars/default-avatar.png` erscheint

### **Team Default Avatar**

* [ ] Bild: `/static/avatars/default-team.png` erscheint

### **Static Resources Test**

* [ ] Browser öffnen:
  `http://localhost:8080/static/avatars/default-avatar.png`
* [ ] Erwartung: Bild lädt

---

## 🧪 BLOCK 9 — NAVIGATION

* [ ] Alle Back-Buttons funktionieren
* [ ] Navigation zwischen Home → Wishlist → Item → Back
* [ ] Navigation zu AdminDashboard funktioniert
* [ ] Navigation zu TeamList funktioniert

---

## 🧪 BLOCK 10 — PRODUCTION SIMULATION

### **Token Persistenz**

* [ ] App schließen
* [ ] Erneut öffnen
* [ ] Erwartung: User bleibt eingeloggt

### **Offline-Modus testen**

* [ ] Internet deaktivieren
* [ ] Aktionen ausführen
* [ ] Erwartung: Fehler-Alerts erscheinen, aber App bleibt stabil

---

# 🎉 Fertig!

Wenn du alle Checkboxen abhaken kannst → **App ist deploy-ready**.

---

Wenn du möchtest, mache ich dir:

📄 **Eine hübsche PDF-Version**
🧪 **Einen automatisierten QA-Testplan**
🚀 **Einen Deployment-Guide für Render, Railway oder Docker+EC2**

Sag einfach:

👉 *„Bitte PDF-Version“*
oder
👉 *„Bitte Deployment-Guide“*
