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

