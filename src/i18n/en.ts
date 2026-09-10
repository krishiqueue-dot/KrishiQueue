/**
 * English source dictionary. This file defines the key set; `hi` and `te`
 * are typed against it so a missing translation is a compile error.
 */

export const en = {
  /* ---------- brand / global ---------- */
  "brand.name": "KrishiQueue",
  "brand.tagline": "Smart Procurement. Zero Uncertainty.",
  "brand.sih": "SIH 2026 Prototype",

  "nav.home": "Home",
  "nav.problem": "Problem",
  "nav.solution": "Solution",
  "nav.how": "How It Works",
  "nav.queue": "Live Queue",
  "nav.prototype": "Prototype",
  "nav.impact": "Impact",
  "nav.cta": "Try Prototype",
  "nav.menu": "Menu",
  "nav.close": "Close",
  "nav.language": "Language",

  "tag.demo": "Demo",
  "tag.simulation": "Simulated",
  "tag.prototype": "Interactive Prototype",
  "tag.live": "Live",
  "tag.concept": "Concept",

  "common.token": "Token",
  "common.position": "Position",
  "common.estWait": "Estimated wait",
  "common.min": "min",
  "common.centre": "Procurement Centre",
  "common.status": "Status",
  "common.crop": "Crop",
  "common.quantity": "Quantity",
  "common.quintal": "Quintal",
  "common.date": "Date",
  "common.slot": "Slot",
  "common.farmer": "Farmer",
  "common.district": "District",
  "common.state": "State",
  "common.nowServing": "Now serving",
  "common.counter": "Counter",
  "common.waiting": "Waiting",
  "common.called": "Called",
  "common.completed": "Completed",
  "common.inProgress": "In progress",
  "common.yourToken": "Your token",
  "common.available": "available",
  "common.full": "Full",
  "common.reset": "Reset",
  "common.next": "Next",
  "common.back": "Back",

  "congestion.low": "Low congestion",
  "congestion.medium": "Medium congestion",
  "congestion.high": "High congestion",
  "congestion.lowShort": "Low",
  "congestion.mediumShort": "Medium",
  "congestion.highShort": "High",

  /* ---------- hero ---------- */
  "hero.badge": "Smart India Hackathon 2026 · Problem Statement 26032",
  "hero.title1": "Smart Procurement.",
  "hero.title2": "Zero Uncertainty.",
  "hero.sub":
    "One digital platform connecting farmers, procurement centres and real-time queue management — so no farmer waits without knowing when their turn will come.",
  "hero.cta1": "Explore the Solution",
  "hero.cta2": "Watch the Problem",
  "hero.scroll": "Scroll to begin",
  "hero.statCentres": "Demo centres mapped",
  "hero.statStates": "Indian states represented",
  "hero.statCrops": "Procurement crops modelled",

  /* ---------- film ---------- */
  "film.eyebrow": "The Problem, in 60 seconds",
  "film.title": "Before the harvest is sold, the day is already spent.",
  "film.sub":
    "A short film on what procurement day looks like today — and what it could look like tomorrow.",
  "film.play": "Play",
  "film.pause": "Pause",
  "film.replay": "Replay",
  "film.mute": "Mute",
  "film.unmute": "Unmute",
  "film.storyboardMode": "Animated storyboard",
  "film.storyboardNote":
    "Animated storyboard rendered in-browser. The cinematic film drops into this same player once produced.",
  "film.scene1Title": "Before sunrise",
  "film.scene1Cap": "The trolley is loaded in the dark. The centre opens at eight.",
  "film.scene2Title": "The arrival",
  "film.scene2Cap": "Forty trolleys reached the gate within the same hour.",
  "film.scene3Title": "The wait",
  "film.scene3Cap": "No number. No list. No estimate. Only the sun moving.",
  "film.scene4Title": "The uncertainty",
  "film.scene4Cap": "“Will my paddy be weighed today, or do I sleep here?”",
  "film.scene5Title": "A different design",
  "film.scene5Cap": "The same day, organised before anyone leaves home.",
  "film.scene6Title": "Zero uncertainty",
  "film.scene6Cap": "A token, a position, a time — and payment you can follow.",

  /* ---------- problem ---------- */
  "problem.eyebrow": "The Problem",
  "problem.title": "Five uncertainties stand between a harvest and its payment.",
  "problem.sub":
    "Problem Statement 26032 describes farmers facing long waiting times, missing schedule information, and no visibility of procurement status. In practice that becomes five distinct failures.",
  "problem.c1.title": "Long waiting",
  "problem.c1.body":
    "Farmers reach the centre before dawn and spend the working day — sometimes more than one — waiting for a turn that has no published order.",
  "problem.c1.stat": "A full day lost",
  "problem.c2.title": "No real-time information",
  "problem.c2.body":
    "There is no reliable way to know your position in the queue, how many are ahead, or how fast the counters are moving.",
  "problem.c2.stat": "Position unknown",
  "problem.c3.title": "Congestion",
  "problem.c3.body":
    "Everyone arrives at opening time because arriving early is the only strategy available. Demand collapses into a few hours.",
  "problem.c3.stat": "All at once",
  "problem.c4.title": "Procurement uncertainty",
  "problem.c4.body":
    "After weighment and quality check, farmers often cannot see what stage their lot has reached or what was recorded against it.",
  "problem.c4.stat": "Status unclear",
  "problem.c5.title": "Payment uncertainty",
  "problem.c5.body":
    "The crop is handed over, but the payment timeline is opaque. Following up means another trip to the centre.",
  "problem.c5.stat": "No visibility",
  "problem.cost.title": "The compounding cost",
  "problem.cost.body":
    "Waiting is not only lost hours. It is transport held on hire, produce exposed to weather, a second trip for payment confirmation, and a harvest window that closes while the queue moves.",

  /* ---------- solution ---------- */
  "solution.eyebrow": "The Solution",
  "solution.title": "From waiting in line to knowing your time.",
  "solution.sub":
    "KrishiQueue replaces an undefined physical queue with a scheduled, visible and trackable digital one.",
  "solution.oldWay": "Today",
  "solution.newWay": "With KrishiQueue",
  "solution.old1": "Arrive before dawn",
  "solution.old2": "Wait in an unordered crowd",
  "solution.old3": "Ask around for information",
  "solution.old4": "Wait again",
  "solution.old5": "Leave without knowing payment status",
  "solution.new1": "Register once",
  "solution.new2": "Book a slot",
  "solution.new3": "Receive a token",
  "solution.new4": "Track the live queue",
  "solution.new5": "Follow procurement",
  "solution.new6": "Follow payment",
  "solution.note":
    "The physical process at the centre does not change. What changes is that every farmer can see it.",

  /* ---------- how it works ---------- */
  "how.eyebrow": "How It Works",
  "how.title": "Five steps, one continuous record.",
  "how.sub": "Select any step to see what the farmer sees at that moment.",
  "how.s1.title": "Register",
  "how.s1.body":
    "The farmer registers once with their land and crop details, and their centre is mapped to their village.",
  "how.s2.title": "Book a slot",
  "how.s2.body":
    "Available time windows are shown with real capacity, so arrivals are spread across the day instead of stacking at the gate.",
  "how.s3.title": "Get a token",
  "how.s3.body":
    "A booking becomes a token — a durable identifier that follows the lot through weighment, quality check and payment.",
  "how.s4.title": "Track the live queue",
  "how.s4.body":
    "Position, counter and estimated waiting time update as the queue moves, so the farmer can travel to arrive on time.",
  "how.s5.title": "Track procurement & payment",
  "how.s5.body":
    "Quantity, rate, amount and payment status are recorded against the same token and visible to the farmer throughout.",

  /* ---------- live queue ---------- */
  "queue.eyebrow": "Live Queue",
  "queue.title": "Watch the queue move.",
  "queue.sub":
    "This is a simulation of the real-time queue board. Advance it and follow what happens to your token.",
  "queue.simulate": "Simulate next farmer",
  "queue.reset": "Reset queue",
  "queue.board": "Queue Board",
  "queue.aheadOfYou": "ahead of you",
  "queue.youAreNext": "You are next",
  "queue.yourTurn": "Your turn — proceed to the counter",
  "queue.done": "Procurement complete for your token",
  "queue.notice": "Interactive prototype. Not connected to any live procurement centre.",
  "queue.avgService": "Average service time",
  "queue.perFarmer": "per farmer",
  "queue.throughput": "Served today",
  "queue.notify": "You will be alerted at position 3, so travel time is covered.",

  /* ---------- booking ---------- */
  "booking.eyebrow": "Slot Booking",
  "booking.title": "Book the day before, not the night before.",
  "booking.sub": "Walk through a booking exactly as a farmer would.",
  "booking.step1": "Select centre",
  "booking.step2": "Select date",
  "booking.step3": "Select slot",
  "booking.step4": "Confirm",
  "booking.today": "Today",
  "booking.tomorrow": "Tomorrow",
  "booking.nextAvailable": "Next available",
  "booking.slots": "slots",
  "booking.slotsOpen": "open",
  "booking.confirmed": "Slot confirmed",
  "booking.tokenIssued": "Token issued",
  "booking.arriveBy": "Arrive by",
  "booking.smsSent": "Confirmation SMS sent (simulated)",
  "booking.startOver": "Book another slot",
  "booking.confirmCta": "Confirm booking",
  "booking.summary": "Booking summary",
  "booking.selectCrop": "Select crop",
  "booking.expectedQty": "Expected quantity",

  /* ---------- phone preview ---------- */
  "phone.eyebrow": "Farmer App Preview",
  "phone.title": "What the farmer carries.",
  "phone.sub":
    "The website is the prototype. This is the mobile product it becomes — tap through the screens.",
  "phone.tab.home": "Home",
  "phone.tab.slot": "My Slot",
  "phone.tab.token": "My Token",
  "phone.tab.procurement": "Procurement",
  "phone.tab.payment": "Payment",
  "phone.tab.alerts": "Alerts",
  "phone.greeting": "Namaste",
  "phone.todaySlot": "Today's slot",
  "phone.showAtGate": "Show this at the gate",
  "phone.noAlerts": "No new alerts",
  "phone.alertsTitle": "Alerts & SMS",
  "phone.smsPreview": "SMS preview",

  /* ---------- procurement ---------- */
  "proc.eyebrow": "Procurement Tracking",
  "proc.title": "Every stage, recorded against one token.",
  "proc.sub": "Advance the lot through the procurement workflow.",
  "proc.advance": "Advance stage",
  "proc.s1": "Slot booked",
  "proc.s2": "Checked in",
  "proc.s3": "Waiting",
  "proc.s4": "Weighment",
  "proc.s5": "Quality check",
  "proc.s6": "Procurement completed",
  "proc.s7": "Payment processing",
  "proc.s8": "Payment completed",
  "proc.grossWeight": "Gross weight",
  "proc.moisture": "Moisture",
  "proc.grade": "Grade",
  "proc.acceptedQty": "Accepted quantity",
  "proc.lotId": "Lot ID",

  /* ---------- payment ---------- */
  "pay.eyebrow": "Payment Tracking",
  "pay.title": "The payment follows the token.",
  "pay.sub": "No second trip to the centre to ask whether the money moved.",
  "pay.amount": "Procurement amount",
  "pay.actualQty": "Actual quantity",
  "pay.rate": "Rate",
  "pay.perQuintal": "per quintal",
  "pay.reference": "Reference",
  "pay.simulate": "Simulate payment",
  "pay.processing": "Payment processing",
  "pay.completed": "Payment completed",
  "pay.creditedTo": "Credited to account ending",
  "pay.msp": "Shown at the declared procurement rate for this crop",
  "pay.notify": "Farmer notified by SMS and in-app alert",
  "pay.breakdown": "Amount breakdown",

  /* ---------- congestion ---------- */
  "cong.eyebrow": "Congestion Management",
  "cong.title": "Spread the load, shrink the wait.",
  "cong.sub":
    "When a farmer can see the load at every nearby centre, the queue balances itself.",
  "cong.wait": "Expected wait",
  "cong.slotsToday": "Slots open today",
  "cong.hint": "Choose the centre with the lowest expected waiting time.",
  "cong.selected": "Selected",
  "cong.select": "Select this centre",

  /* ---------- recommendation ---------- */
  "rec.eyebrow": "Smart Recommendation",
  "rec.title": "The system suggests before the farmer travels.",
  "rec.detected": "High congestion detected",
  "rec.at": "at",
  "rec.recommended": "Recommended instead",
  "rec.switch": "Switch centre",
  "rec.switched": "Centre switched",
  "rec.saved": "Estimated waiting time reduced by",
  "rec.keep": "Keep my centre",
  "rec.distance": "Distance from village",
  "rec.km": "km",
  "rec.tryAgain": "Run the scenario again",
  "rec.explain":
    "Recommendations weigh expected wait, remaining slot capacity and travel distance — never distance alone.",

  /* ---------- impact ---------- */
  "impact.eyebrow": "Expected Impact",
  "impact.title": "What changes when the queue becomes visible.",
  "impact.sub":
    "These are the prototype's design targets, not measured field results. Real numbers will be established during pilot deployment.",
  "impact.i1": "Waiting time at the centre",
  "impact.i2": "Peak-hour congestion",
  "impact.i3": "Queue visibility for the farmer",
  "impact.i4": "Procurement transparency",
  "impact.i5": "Payment traceability",
  "impact.i6": "Repeat trips to the centre",
  "impact.reduced": "Reduced",
  "impact.increased": "Increased",
  "impact.target": "Prototype target",
  "impact.measure": "How we will measure it",
  "impact.m1": "Time between check-in and weighment, logged per token",
  "impact.m2": "Arrival distribution across slot windows",
  "impact.m3": "Share of tokens with position viewed before arrival",
  "impact.m4": "Share of lots with complete stage records",
  "impact.m5": "Time from procurement completion to payment confirmation",
  "impact.m6": "Visits per completed procurement",

  /* ---------- roadmap ---------- */
  "road.eyebrow": "Roadmap",
  "road.title": "Built for today. Designed for scale.",
  "road.sub": "What exists now, and what comes next — stated plainly.",
  "road.now": "Built now",
  "road.next": "Planned",
  "road.p1": "SIH prototype",
  "road.p1d":
    "This interactive website: booking, live queue, procurement and payment simulations.",
  "road.p2": "Pilot procurement centres",
  "road.p2d":
    "Deployment at a small set of centres with operator tablets and real queue data.",
  "road.p3": "Real SMS / OTP",
  "road.p3d":
    "Registered SMS sender ID and OTP authentication for farmers without smartphones.",
  "road.p4": "Government API integration",
  "road.p4d":
    "Farmer and land record verification through the relevant state procurement systems.",
  "road.p5": "Payment integration",
  "road.p5d":
    "Payment status pulled from the disbursing system rather than entered manually.",
  "road.p6": "Multi-district deployment",
  "road.p6d": "District-level dashboards, centre load balancing and operator management.",
  "road.p7": "State-level deployment",
  "road.p7d": "State procurement calendars, crop-wise rate configuration and reporting.",
  "road.p8": "National scale",
  "road.p8d":
    "Multi-state tenancy with per-state terminology, languages and procurement rules.",

  /* ---------- technology ---------- */
  "tech.eyebrow": "Technology",
  "tech.title": "A simple architecture that can grow.",
  "tech.sub":
    "Nothing exotic. The prototype is built on the same shape the production system would use.",
  "tech.current": "In the prototype",
  "tech.future": "Added for production",
  "tech.layerClient": "Farmer & operator clients",
  "tech.layerApi": "Application layer",
  "tech.layerData": "Data layer",
  "tech.layerExt": "External systems",
  "tech.wsNote":
    "Queue updates are designed for a WebSocket channel; the prototype simulates that channel in the browser.",

  /* ---------- trust ---------- */
  "trust.eyebrow": "Trust & Security",
  "trust.title": "Prototype security architecture.",
  "trust.sub":
    "Designed in from the start, and described honestly: this is an architecture, not a certified production system.",
  "trust.t1": "Role-based access",
  "trust.t1d":
    "Farmer, centre operator and administrator see strictly separate views and actions.",
  "trust.t2": "Secure authentication design",
  "trust.t2d":
    "OTP-based farmer sign-in and credentialed operator accounts, with session expiry.",
  "trust.t3": "Masked sensitive information",
  "trust.t3d":
    "Identifiers and account numbers are masked in all shared and printed views.",
  "trust.t4": "Audit logging",
  "trust.t4d":
    "Every stage change is written with actor, counter and timestamp against the token.",
  "trust.t5": "Privacy-aware by design",
  "trust.t5d":
    "Only fields needed for procurement are collected; no location tracking of farmers.",
  "trust.disclaimer":
    "No production security certification is claimed. Formal review and audit would precede any live deployment.",

  /* ---------- footer ---------- */
  "footer.built": "An independent prototype built for Smart India Hackathon 2026.",
  "footer.notGov":
    "KrishiQueue is not an official Government of India application. All centres, farmers, tokens, amounts and payments shown on this site are demonstration data.",
  "footer.ps": "Problem Statement 26032",
  "footer.explore": "Explore",
  "footer.about": "About",
  "footer.rights": "Built for demonstration and evaluation purposes.",

  /* ---------- disclaimers ---------- */
  "disc.sim": "Simulated for demonstration — not connected to any live system.",
  "disc.data": "Demonstration data",
} as const;

export type DictKey = keyof typeof en;
export type Dict = Record<DictKey, string>;
