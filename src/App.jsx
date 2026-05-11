import { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'

const SUPA_URL = 'https://qzdqggemowjwneiozpvt.supabase.co'
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6ZHFnZ2Vtb3dqd25laW96cHZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxMjg2MjksImV4cCI6MjA5MzcwNDYyOX0.gxi2Oo-GCl0AXkrUXXJbR5vYW5zbOC-fR2qUgGeH87Q'
const WORKER_URL = 'https://twilight-pond-a691.louie-4b0.workers.dev/'
const sb = createClient(SUPA_URL, SUPA_KEY)

const uid = () => Math.random().toString(36).slice(2, 10)
const nowISO = () => new Date().toISOString()
const fmt = (iso) => { if (!iso) return ''; const d = new Date(iso); return d.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit' }) }
const fmtDate = (iso) => { if (!iso) return ''; return new Date(iso).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' }) }
const fmtTime = (iso) => { if (!iso) return ''; return new Date(iso).toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit' }) }
const fmtHours = (ms) => { if (!ms) return '0h 0m'; const h = Math.floor(ms / 3600000); const m = Math.floor((ms % 3600000) / 60000); return `${h}h ${m}m` }

const ROLES = { owner: 'Owner', manager: 'Manager', staff: 'Staff', mechanic: 'Mechanic' }
const ROLE_COLOR = { owner: '#a855f7', manager: '#3b82f6', staff: '#22c55e', mechanic: '#f59e0b' }
const MSG_TYPES = ['parts_request', 'supplies_request', 'product_request', 'time_log', 'note', 'concern']
const MSG_LABELS = { parts_request: 'Parts Request', supplies_request: 'Supplies Request', product_request: 'Product Request', time_log: 'Time Log', note: 'Note for Management', concern: 'Concern' }
const MSG_ICONS = { parts_request: '🔩', supplies_request: '📦', product_request: '🛒', time_log: '🕐', note: '📝', concern: '⚠️' }
const PRI_COLOR = { high: '#ef4444', medium: '#f59e0b', low: '#22c55e' }
const BUILD_STATUSES = ['Waiting for Bike', 'Bike Ordered', 'Bike Arrived', 'Build in Progress', 'Ready for Pickup', 'Completed', 'On Hold']
const BUILD_STATUS_COLOR = { 'Waiting for Bike': '#f59e0b', 'Bike Ordered': '#3b82f6', 'Bike Arrived': '#a855f7', 'Build in Progress': '#f97316', 'Ready for Pickup': '#22c55e', 'Completed': '#4b5563', 'On Hold': '#ef4444' }
const CONTACT_STATUSES = ['Not Contacted', 'Call Attempted', 'Customer Notified', 'Customer Confirmed']
const BRANDS = ['Aventon', 'ET.Cycle', 'Royal Dutch Gazelle', 'Velotric', 'Urban Arrow', 'Yuba Cargo Bikes', 'NCM', 'FOO', 'Not Listed']
const PROBLEM_CATEGORIES = ['Battery', 'Display / Console', 'Motor', 'Controller / Electrical', 'Charger', 'Brakes', 'Drivetrain / Gearing', 'Lights', 'Frame / Structural', 'Throttle / PAS Sensor', 'Wheels / Tires', 'Other']
const WARRANTY_STATUSES = ['Submitted', 'Under Review', 'Approved', 'Parts Ordered', 'Repair in Progress', 'Ready for Pickup', 'Complete', 'Denied', 'On Hold']
const SUPPLIER_STATUSES = ['Not Contacted', 'Claim Submitted to Supplier', 'Awaiting Supplier Response', 'Response Received', 'Approved by Supplier', 'Denied by Supplier', 'Parts Shipped', 'Parts Received']
const ANNOUNCE_CATEGORIES = ['Store Closure', 'Team Reminder', 'New Bike Features', 'Portal Update', 'Sale', 'General']
const SHIPMENT_STATUSES = ['In Transit', 'Out for Delivery', 'Arrived', 'Partially Received', 'Complete']

const S = {
  shell: { display: 'flex', minHeight: '100vh' },
  sidebar: { width: 220, flexShrink: 0, background: 'var(--bg2)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' },
  main: { flex: 1, overflowY: 'auto', minHeight: '100vh' },
  page: { padding: 28, maxWidth: 960 },
  card: { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '18px 20px', marginBottom: 14 },
  cardTitle: { fontSize: 11, fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: 'var(--mono)', marginBottom: 14 },
  btn: { display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 15px', borderRadius: 'var(--rs)', fontSize: 13, border: '1px solid var(--border2)', background: 'var(--bg3)', color: 'var(--text)', cursor: 'pointer', fontFamily: 'var(--font)' },
  btnP: { background: 'var(--accent)', borderColor: 'var(--accent)', color: 'white' },
  btnD: { background: 'rgba(239,68,68,0.1)', borderColor: 'var(--red)', color: '#fca5a5' },
  btnG: { background: 'rgba(34,197,94,0.15)', borderColor: 'var(--green)', color: 'var(--green)' },
  btnA: { background: 'rgba(245,158,11,0.15)', borderColor: 'var(--amber)', color: 'var(--amber)' },
  btnSm: { padding: '5px 10px', fontSize: 12 },
  input: { background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text)', fontSize: 13, padding: '8px 10px', borderRadius: 'var(--rs)', width: '100%', outline: 'none', fontFamily: 'var(--font)' },
  textarea: { background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text)', fontSize: 13, padding: '8px 10px', borderRadius: 'var(--rs)', width: '100%', outline: 'none', resize: 'vertical', minHeight: 80, fontFamily: 'var(--font)' },
  select: { background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text)', fontSize: 13, padding: '8px 10px', borderRadius: 'var(--rs)', width: '100%', outline: 'none', fontFamily: 'var(--font)' },
  badge: (c) => ({ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: 20, fontSize: 10, fontFamily: 'var(--mono)', fontWeight: 500, background: c + '22', color: c, border: `1px solid ${c}44` }),
  avatar: (c) => ({ width: 32, height: 32, borderRadius: '50%', background: c + '33', color: c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, flexShrink: 0 }),
  navItem: (a) => ({ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 10px', borderRadius: 'var(--rs)', fontSize: 13, color: a ? 'var(--accent2)' : 'var(--text2)', background: a ? 'rgba(59,130,246,0.15)' : 'transparent', border: 'none', width: '100%', textAlign: 'left', marginBottom: 1, cursor: 'pointer', fontFamily: 'var(--font)' }),
}

// ── DEFAULT CONTENT DATA ──

const OPENING = [
  { text: 'Unlock front door and flip sign to OPEN', tag: 'Front' },
  { text: 'Turn on all lights — floor, workshop, window display', tag: 'Lights' },
  { text: 'Boot up POS (Lightspeed) and confirm it loads', tag: 'Tech' },
  { text: 'Count cash drawer float and confirm the amount', tag: 'Cash' },
  { text: 'Check Shopify — any overnight orders or messages?', tag: 'Online' },
  { text: 'Check voicemail and email — log anything urgent', tag: 'Comms' },
  { text: 'Sweep front entrance and tidy display area', tag: 'Clean' },
  { text: 'Review repair queue — confirm all bikes and info are logged', tag: 'Workshop' },
  { text: 'Restock front counter — bags, receipts, pens, intake forms', tag: 'Supplies' },
  { text: 'Move display bikes outside if weather allows', tag: 'Display' },
  { text: "Read today's announcements on this portal", tag: 'Team' },
  { text: 'Confirm staff roles and repair priorities for the day', tag: 'Team' },
]
const STORE_CLOSING = [
  { text: 'Bring all display bikes inside and secure them', tag: 'Security' },
  { text: 'Sweep entire shop floor including workshop area', tag: 'Clean' },
  { text: 'Wipe down front counter and glass surfaces', tag: 'Clean' },
  { text: 'Cash out — reconcile till and log any discrepancies', tag: 'Cash' },
  { text: "Call customers whose repairs are ready — update ticket status", tag: 'Comms' },
  { text: "Check repair queue — log notes for tomorrow", tag: 'Workshop' },
  { text: 'Turn off all lights and equipment', tag: 'Close' },
  { text: 'Lock workshop and all storage areas', tag: 'Security' },
  { text: 'Set alarm and lock front door', tag: 'Security' },
  { text: 'Log any issues or notes for tomorrow', tag: 'Comms' },
]
const MORNING = [
  { text: "Review repair board — prioritize today's jobs", tag: 'Workshop' },
  { text: 'Check parts orders — any arrivals expected today?', tag: 'Inventory' },
  { text: 'Log any bikes dropped off at opening', tag: 'Intake' },
  { text: 'Shift lead confirms announcements have been read', tag: 'Team' },
  { text: 'Check floor stock — any sold bikes need replacing?', tag: 'Sales' },
  { text: 'Notify customers about any delays on their repairs', tag: 'Comms' },
]
const MIDDAY = [
  { text: 'Update repair ticket statuses — mark completed bikes', tag: 'Workshop' },
  { text: 'Tidy front counter — clear clutter between customers', tag: 'Clean' },
  { text: 'Call customers whose repairs are complete', tag: 'Comms' },
  { text: 'Log delivery arrivals — put away parts immediately', tag: 'Inventory' },
  { text: 'Check sales pace — tracking toward daily target?', tag: 'Sales' },
]
const CLOSING = [
  { text: 'Sweep entire shop floor including workshop area', tag: 'Clean' },
  { text: 'Wipe down front counter and glass surfaces', tag: 'Clean' },
  { text: 'Bring all display bikes inside and secure them', tag: 'Security' },
  { text: 'Cash out — reconcile till and log any discrepancies', tag: 'Cash' },
  { text: 'Turn off all lights and equipment', tag: 'Close' },
  { text: 'Lock workshop and all storage areas', tag: 'Security' },
  { text: 'Set alarm and lock front door', tag: 'Security' },
  { text: 'Log any issues or notes for tomorrow', tag: 'Comms' },
]
const REPAIR_EBIKE = [
  { title: '🔋 Battery Service', steps: [
    { title: 'Check voltage', desc: '48V battery should read 54.6V fully charged. Below 42V = cell issue.', img: '' },
    { title: 'Inspect terminals', desc: 'Look for corrosion, bent pins, burn marks. Clean with contact cleaner.', img: '' },
    { title: 'Charge cycle test', desc: 'Charge to 100% — charger should turn green. Draining fast = dead cell group.', img: '' },
    { title: 'Log and advise', desc: 'Quote replacement before proceeding. Get approval for repairs over $80.', img: '' },
  ]},
  { title: '⚙️ Motor and Drive System', steps: [
    { title: 'Spin wheel and listen', desc: 'Grinding or clicking from hub motor = bearing wear or loose stator.', img: '' },
    { title: 'Check motor cables', desc: 'Reconnect phase wires and hall sensor connector. Corroded = erratic power.', img: '' },
    { title: 'Read error codes', desc: 'Log the code and cross-reference with brand service manual.', img: '' },
  ]},
]
const REPAIR_MECHANICAL = [
  { title: '🔗 Brake Service', steps: [
    { title: 'Check pad thickness', desc: 'Under 1mm = replace immediately. Check rotor for warping.', img: '' },
    { title: 'Inspect hydraulic lines', desc: 'Bubbles, spongey lever, or leaks at caliper = bleed the system.', img: '' },
    { title: 'Align caliper', desc: 'Loosen bolts, squeeze lever to center, retighten. Confirm no rubbing.', img: '' },
  ]},
  { title: '🔩 Drivetrain', steps: [
    { title: 'Check chain stretch', desc: 'Over 0.75% = replace. On e-bikes replace at 0.5% due to higher torque.', img: '' },
    { title: 'Inspect cassette', desc: 'Shark-fin teeth = replace. Worn chain on worn cassette will skip.', img: '' },
    { title: 'Derailleur adjustment', desc: 'Set limit screws first, then barrel adjuster. Test under pedal load.', img: '' },
  ]},
]
const REPAIR_ELECTRICAL = [
  { title: '💡 Display and Controller', steps: [
    { title: 'Power cycle and read codes', desc: 'Turn off and on. Write down error code before clearing it.', img: '' },
    { title: 'Check all connectors', desc: 'Disconnect and reconnect each connector. Look for melted plastic, corrosion, bent pins.', img: '' },
    { title: 'Test throttle and PAS', desc: 'Throttle: activate slowly, confirm smooth response. PAS: confirm assist within 1-2 crank rotations.', img: '' },
    { title: 'Escalate if controller suspected', desc: 'Controller replacements need owner approval. Log model, voltage, wattage first.', img: '' },
  ]},
]
const DIAGNOSE = [
  { title: 'Step 1 — Customer Intake', steps: [
    { title: 'Complete the intake form', desc: "Get full name, phone, bike brand and model, description in customer's own words.", img: '' },
    { title: 'Ask the key questions', desc: 'When did it start? Did anything happen before — crash, rain, storage? Has anyone else worked on it?', img: '' },
    { title: 'Set expectations', desc: 'Standard turnaround is 24 hours. Call with estimate before any work over $80.', img: '' },
  ]},
  { title: 'Step 2 — Initial Inspection', steps: [
    { title: 'Visual check', desc: 'Look for damage, missing parts, cable fraying, tire condition, rust. Note everything.', img: '' },
    { title: 'Reproduce the issue', desc: 'Try to recreate the problem. If bike needs to be ridden, do so in the alley.', img: '' },
    { title: 'Check the obvious first', desc: 'Low tire pressure, loose bolts, and dead batteries account for a large share of complaints.', img: '' },
  ]},
  { title: 'Step 3 — Estimate and Approval', steps: [
    { title: 'Build estimate in Lightspeed', desc: 'Log all parts and labour before calling. Give a firm number or clear range.', img: '' },
    { title: 'Call the customer', desc: 'Explain what you found and the cost. Log declined work on the ticket.', img: '' },
    { title: 'Do not begin without approval', desc: 'Non-negotiable for repairs over $80.', img: '' },
  ]},
  { title: 'Step 4 — Complete and Return', steps: [
    { title: 'Test before calling', desc: 'Every repaired bike must be tested before declaring it ready.', img: '' },
    { title: 'Close the ticket', desc: 'Log all work, parts, and final total in Lightspeed before customer arrives.', img: '' },
    { title: 'Walk the customer through', desc: 'Explain what was done. Point out other issues observed but not repaired.', img: '' },
  ]},
]
const DEFAULT_AVENTON = [
  { title: '🔋 Battery and Charger Troubleshooting', steps: [
    { title: 'Inspect battery first', desc: 'Check casing for damage, swelling, or leaking. Do not charge a visibly damaged battery.', img: '' },
    { title: 'Check the battery button', desc: 'Quick press (>1sec) — red, green, or blue status light should appear.', img: '' },
    { title: 'Power on sequence', desc: 'Hold handlebar power button 3 seconds. Power off: hold battery button 2-3 seconds.', img: '' },
    { title: 'Battery not charging', desc: 'Inspect charge port and charger for debris. Try different outlet.', img: '' },
  ]},
  { title: '⚙️ Motor Not Functioning', steps: [
    { title: 'Check for visible damage', desc: 'Inspect motor assembly and all cables. Clean and reconnect any loose connections.', img: '' },
    { title: 'Hub-drive: check controller', desc: 'If motor and harness replaced and issue persists, replace controller next.', img: '' },
  ]},
  { title: '🚴 Pedal Assist Not Functioning', steps: [
    { title: 'Check all cables', desc: 'Inspect cables from display, wire harness, motor harness, sensor, and controller.', img: '' },
    { title: 'Cadence sensor bikes', desc: 'Ensure sensor on left crank arm is properly positioned and magnet is aligned.', img: '' },
    { title: 'Torque sensor bikes', desc: 'If all cables intact, torque sensor or bottom bracket likely needs replacement.', img: '' },
  ]},
  { title: '⚠️ Bike Shutting Off While Riding', steps: [
    { title: 'Check battery charge', desc: 'If battery runs out power cuts off. Recharge to 100%.', img: '' },
    { title: 'Check battery fitment', desc: 'Most common cause: battery not seated properly. Loosen terminal bolts, realign, retighten.', img: '' },
  ]},
]
const DEFAULT_EBIKE_GUIDE = [
  { title: 'Understanding Pedal Assist (PAS)', steps: [
    { title: 'What is PAS?', desc: 'Motor provides power proportional to pedaling. Most ebikes have 1-5 PAS levels.', img: '' },
    { title: 'Cadence vs Torque sensors', desc: 'Cadence sensors trigger assist when pedaling. Torque sensors measure pedal force for more natural feel.', img: '' },
  ]},
  { title: 'Battery Care and Range', steps: [
    { title: 'Maximizing battery life', desc: 'Store at 50-80% charge if not riding for extended periods. Keep at room temperature.', img: '' },
    { title: 'Range expectations', desc: 'Real-world range is typically 60-75% of manufacturer claims.', img: '' },
  ]},
  { title: 'Common Customer Questions', steps: [
    { title: 'Is my ebike waterproof?', desc: 'Water resistant, not waterproof. Light rain and puddles are fine. Do not submerge or pressure wash.', img: '' },
    { title: 'How often does it need a tune-up?', desc: 'Every 6 months for regular riders, annually for casual riders.', img: '' },
  ]},
]
const DEFAULT_SALES_GUIDE = [
  { title: 'Brake Types', steps: [
    { title: 'Hydraulic brakes', desc: 'Fluid-actuated, self-adjusting, more powerful with less hand force. Best for heavier riders and hilly terrain. Require bleeding periodically.', img: '' },
    { title: 'Mechanical disc brakes', desc: 'Cable-actuated, easier to adjust at home, reliable in most conditions. Slightly more hand effort than hydraulic. Lower maintenance cost.', img: '' },
    { title: 'Which to recommend?', desc: 'Hydraulic for cargo bikes, heavier riders, or anyone doing hills regularly. Mechanical is fine for casual flat-terrain riders and budget-conscious buyers.', img: '' },
  ]},
  { title: 'Motor Types', steps: [
    { title: 'Hub motor', desc: 'Motor sits inside the wheel hub (usually rear). Quieter, lower maintenance, good for casual riders and flat terrain. Less natural feel.', img: '' },
    { title: 'Mid-drive motor', desc: 'Motor sits at the crank. More natural pedaling feel, better hill climbing, works with gearing. Higher cost, more drivetrain wear.', img: '' },
    { title: 'Which to recommend?', desc: 'Mid-drive (Bosch, Shimano) for hills, cargo, touring, and riders who want a natural feel. Hub motor for flat commuters and budget buyers.', img: '' },
  ]},
  { title: 'Types of Ebikes', steps: [
    { title: 'City and commuter', desc: 'Upright geometry, fenders, lights, rack mounts. Built for daily use. Examples: Aventon Level, Gazelle Easyflow.', img: '' },
    { title: 'Cargo bikes', desc: 'Extended rear rack or front loader for hauling kids, groceries, or gear. Examples: Yuba, Urban Arrow. Heavy but extremely versatile.', img: '' },
    { title: 'Fat tire', desc: 'Wide tires for sand, snow, loose surfaces. Good all-season option. Examples: Aventon Aventure.', img: '' },
    { title: 'Mountain / eMTB', desc: 'Full suspension, aggressive geometry, for trails. Higher cost. Niche buyer.', img: '' },
    { title: 'Step-through', desc: 'Low standover frame for easier mounting. Popular with older riders or those with mobility considerations.', img: '' },
  ]},
  { title: 'Benefits of Cargo Bikes', steps: [
    { title: 'Replace car trips', desc: 'Most families do 80% of their trips within 10km. A cargo bike can handle groceries, school runs, errands — all without parking.', img: '' },
    { title: 'Fit for kids and gear', desc: 'Longtail bikes (Yuba) can carry two kids plus bags. Front loaders (Urban Arrow) offer a car-like enclosed front box.', img: '' },
    { title: 'Total cost comparison', desc: 'At $5-8k a cargo bike replaces a second car. No insurance, parking, or fuel costs. Frame warranties often 5 years.', img: '' },
  ]},
  { title: 'Range and Battery Questions', steps: [
    { title: 'How far will it go?', desc: 'Manufacturer claims are best-case. Real world is 60-75% of that. A 100km claimed range = 60-75km in practice at moderate PAS.', img: '' },
    { title: 'What reduces range?', desc: 'High PAS level, cold weather, hills, rider weight, headwinds, tire pressure. Combine these and range drops significantly.', img: '' },
    { title: 'How long to charge?', desc: 'Most batteries charge in 4-6 hours from empty. Partial charges are fine and do not hurt the battery.', img: '' },
    { title: 'Battery lifespan', desc: 'Quality batteries last 500-1000 charge cycles before significant capacity loss. That is roughly 3-7 years for daily riders.', img: '' },
  ]},
  { title: 'Handling Objections', steps: [
    { title: '"It is too expensive"', desc: 'Compare to car costs, transit passes, gym memberships. A $3k ebike paid over 3 years is $83/month with no gas, insurance, or parking.', img: '' },
    { title: '"What if it breaks?"', desc: 'We are here for that. Every bike we sell is serviced by our team. We stock parts for all brands we carry.', img: '' },
    { title: '"I am not sure I will use it"', desc: 'Offer a test ride. Ask what they currently do for short trips and show how the bike fits. Most people ride more than expected once they own one.', img: '' },
    { title: '"Can I try it first?"', desc: 'Always say yes and take them outside. A 5 minute test ride closes more sales than any conversation.', img: '' },
  ]},
]
const DEFAULT_TEMPLATES = [
  { id: 'bike_ready', label: 'Bike Ready for Pickup', category: 'Pickup', body: "Hi [Customer Name], great news! Your [Bike] is built and ready for pickup or a test ride at Cloud Ebikes — 1991 Main St, Vancouver. We're open Tuesday to Saturday, 11am to 5pm. Please note we are closed on stat holidays (if a stat holiday falls on a Monday, we are also closed Tuesday). See you soon! — Cloud Ebikes" },
  { id: 'service_ready', label: 'Service Ready for Pickup', category: 'Pickup', body: "Hi [Customer Name], your bike service is complete and ready for pickup at Cloud Ebikes — 1991 Main St, Vancouver. We're open Tuesday to Saturday, 11am to 5pm. Please note we are closed on stat holidays (if a stat holiday falls on a Monday, we are also closed Tuesday). Give us a call if you have any questions. — Cloud Ebikes" },
  { id: 'hours_reminder', label: 'Store Hours Reminder', category: 'Info', body: "Hi [Customer Name], just a reminder that Cloud Ebikes is open Tuesday to Saturday, 11am to 5pm at 1991 Main St, Vancouver. We are closed on stat holidays — if a stat holiday falls on a Monday we are also closed Tuesday. See you soon!" },
  { id: 'repair_update', label: 'Repair Status Update', category: 'Repair', body: "Hi [Customer Name], we wanted to give you an update on your bike repair. [Update details]. We will contact you again once it's ready. Thank you for your patience! — Cloud Ebikes" },
  { id: 'estimate_ready', label: 'Repair Estimate Ready', category: 'Repair', body: "Hi [Customer Name], we've had a chance to look at your bike and have a repair estimate ready for you. Please give us a call at your earliest convenience so we can go over the details before we proceed. — Cloud Ebikes" },
  { id: 'parts_delay', label: 'Parts Delay Notice', category: 'Repair', body: "Hi [Customer Name], we wanted to let you know that we are waiting on a part for your bike repair. We expect it to arrive [timeframe] and will contact you as soon as your bike is ready. We apologize for the delay! — Cloud Ebikes" },
]

// ── AI HELPER ──

async function askClaude(prompt) {
  const res = await fetch(WORKER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'claude', prompt })
  })
  const data = await res.json()
  return data?.text || ''
}

async function uploadToSupabase(file, folder) {
  const ext = file.name.split('.').pop()
  const filename = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
  const res = await fetch(`${SUPA_URL}/storage/v1/object/warranty-docs/${filename}`, {
    method: 'POST',
    headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}`, 'Content-Type': file.type },
    body: file,
  })
  if (!res.ok) throw new Error('Upload failed')
  return `${SUPA_URL}/storage/v1/object/public/warranty-docs/${filename}`
}

// ── SHARED COMPONENTS ──

function Spinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--text2)', fontSize: 14, gap: 10 }}>
      <div style={{ width: 18, height: 18, border: '2px solid var(--border2)', borderTop: '2px solid var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      Loading...
    </div>
  )
}

function TabRow({ tabs, active, setActive }) {
  return (
    <div style={{ display: 'flex', gap: 2, marginBottom: 18, borderBottom: '1px solid var(--border)' }}>
      {tabs.map(([k, v]) => (
        <button key={k} onClick={() => setActive(k)} style={{ padding: '8px 16px', fontSize: 13, background: 'none', border: 'none', color: active === k ? 'var(--accent2)' : 'var(--text2)', borderBottom: `2px solid ${active === k ? 'var(--accent)' : 'transparent'}`, marginBottom: -1, fontFamily: 'var(--font)', cursor: 'pointer' }}>{v}</button>
      ))}
    </div>
  )
}

function ACard({ a, onDelete, canDelete }) {
  const colors = { info: 'var(--accent)', warn: 'var(--amber)', alert: 'var(--red)', good: 'var(--green)' }
  const c = colors[a.type] || 'var(--accent)'
  const expired = a.expires_at && new Date(a.expires_at) < new Date()
  if (expired) return null
  return (
    <div style={{ borderLeft: `3px solid ${c}`, background: c + '11', borderRadius: '0 8px 8px 0', padding: '13px 15px', marginBottom: 9 }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{a.title}</div>
      <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.65 }}>{a.body}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 7, flexWrap: 'wrap', gap: 6 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>{a.author} · {fmtDate(a.created_at)}</div>
          {a.expires_at && <div style={{ fontSize: 11, color: 'var(--amber)', fontFamily: 'var(--mono)' }}>Expires {fmtDate(a.expires_at)}</div>}
          {a.category && <span style={S.badge('var(--accent2)')}>{a.category}</span>}
        </div>
        {canDelete && <button onClick={() => onDelete(a.id)} style={{ ...S.btn, ...S.btnD, ...S.btnSm }}>Remove</button>}
      </div>
    </div>
  )
}

function TItem({ task, user, users, onToggle, onDelete, onReassign, isMgr }) {
  const [reassigning, setReassigning] = useState(false)
  const [newAssignee, setNewAssignee] = useState('')
  const assignee = users.find(u => u.id === task.assigned_to)
  const assigner = users.find(u => u.id === task.assigned_by)
  const canDelete = isMgr || task.assigned_by === user.id
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
      <div onClick={() => onToggle(task)} style={{ width: 20, height: 20, border: '1.5px solid', borderColor: task.done ? 'var(--green)' : 'var(--border2)', borderRadius: 5, flexShrink: 0, marginTop: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: task.done ? 'var(--green)' : 'transparent' }}>
        {task.done && <span style={{ color: 'white', fontSize: 12, fontWeight: 700 }}>✓</span>}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500, textDecoration: task.done ? 'line-through' : 'none', color: task.done ? 'var(--text2)' : 'var(--text)' }}>{task.title}</div>
        {task.notes && <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 3 }}>{task.notes}</div>}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6, alignItems: 'center' }}>
          {task.priority && <span style={S.badge(PRI_COLOR[task.priority])}>{task.priority}</span>}
          {task.due_date && <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>Due {fmtDate(task.due_date)}</span>}
          {assigner && <span style={{ fontSize: 11, color: 'var(--text3)' }}>from {assigner.name}</span>}
          {assignee && <span style={{ fontSize: 11, color: 'var(--text2)' }}>{assignee.name}</span>}
        </div>
        {reassigning && (
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <select value={newAssignee} onChange={e => setNewAssignee(e.target.value)} style={{ ...S.select, flex: 1 }}>
              <option value="">Select person...</option>
              {users.filter(u => u.active).map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
            <button onClick={() => { if (newAssignee) { onReassign(task.id, newAssignee); setReassigning(false); setNewAssignee('') } }} style={{ ...S.btn, ...S.btnP, ...S.btnSm }}>Reassign</button>
            <button onClick={() => setReassigning(false)} style={{ ...S.btn, ...S.btnSm }}>Cancel</button>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        {isMgr && !reassigning && <button onClick={() => setReassigning(true)} style={{ ...S.btn, ...S.btnSm }}>↻</button>}
        {canDelete && <button onClick={() => onDelete(task.id)} style={{ ...S.btn, ...S.btnD, ...S.btnSm }}>✕</button>}
      </div>
    </div>
  )
}

function MItem({ msg, users, currentUser, onRead, onReply, isMgr }) {
  const [open, setOpen] = useState(false)
  const [reply, setReply] = useState('')
  const sender = users.find(u => u.id === msg.sender_id)
  const isUnread = !(msg.read_by || []).includes(currentUser.id)
  const toggle = () => { setOpen(!open); if (isUnread) onRead(msg) }
  return (
    <div style={{ ...S.card, marginBottom: 10, borderLeft: `3px solid ${isUnread ? 'var(--accent)' : 'var(--border)'}`, borderRadius: '0 12px 12px 0' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }} onClick={toggle}>
        <div style={S.avatar(ROLE_COLOR[sender?.role || 'staff'])}>{sender?.name?.[0] || '?'}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{MSG_ICONS[msg.type]} {MSG_LABELS[msg.type]}</span>
            {isUnread && <span style={S.badge('var(--accent)')}>new</span>}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>{sender?.name || 'Unknown'} · {fmt(msg.created_at)}</div>
          {!open && <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.body}</div>}
        </div>
      </div>
      {open && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: 14, lineHeight: 1.65, marginBottom: 12 }}>{msg.body}</div>
          {(msg.replies || []).map((r, i) => {
            const rs = users.find(u => u.id === r.sender_id)
            return (
              <div key={i} style={{ background: 'var(--bg3)', borderRadius: 'var(--rs)', padding: '10px 12px', marginBottom: 8 }}>
                <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 4 }}>{rs?.name || 'Management'} · {fmt(r.created_at)}</div>
                <div style={{ fontSize: 13 }}>{r.body}</div>
              </div>
            )
          })}
          {isMgr && (
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <input value={reply} onChange={e => setReply(e.target.value)} placeholder="Reply..." style={{ ...S.input, flex: 1 }} onKeyDown={e => { if (e.key === 'Enter' && reply.trim()) { onReply(msg, reply.trim()); setReply('') } }} />
              <button style={{ ...S.btn, ...S.btnP, ...S.btnSm }} onClick={() => { if (reply.trim()) { onReply(msg, reply.trim()); setReply('') } }}>Send</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function SMSModal({ build, onClose, onSent }) {
  const [templates, setTemplates] = useState(null)
  const [phone, setPhone] = useState(build.customer_phone || '')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState('')
  useEffect(() => {
    sb.from('content').select('*').eq('key', 'msg_templates').single()
      .then(({ data }) => setTemplates(data ? JSON.parse(data.value) : DEFAULT_TEMPLATES))
      .catch(() => setTemplates(DEFAULT_TEMPLATES))
  }, [])
  const applyTemplate = (t) => {
    let msg = t.body
    if (build.customer_name) msg = msg.replace(/\[Customer Name\]/g, build.customer_name)
    if (build.bike_description) msg = msg.replace(/\[Bike\]/g, build.bike_description)
    setMessage(msg)
  }
  const formatPhone = (p) => { const d = p.replace(/\D/g, ''); if (d.length === 10) return '+1' + d; if (d.length === 11 && d[0] === '1') return '+' + d; return p }
  const send = async () => {
    if (!phone.trim()) { setErr('Please enter a phone number.'); return }
    if (!message.trim()) { setErr('Please write a message.'); return }
    setSending(true); setErr('')
    try {
      const res = await fetch(WORKER_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'sms', to: formatPhone(phone), message }) })
      const data = await res.json()
      if (data.error_code || data.status === 'failed') { setErr('Failed: ' + (data.message || 'Unknown error')); setSending(false); return }
      if (phone !== build.customer_phone) await sb.from('builds').update({ customer_phone: phone }).eq('id', build.id)
      await sb.from('builds').update({ contact_status: 'Customer Notified', last_contacted: nowISO() }).eq('id', build.id)
      setSent(true); if (onSent) onSent(); setTimeout(() => onClose(), 1800)
    } catch (e) { setErr('Error: ' + e.message); setSending(false) }
  }
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: 20 }}>
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 16, padding: 24, width: '100%', maxWidth: 520 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div style={{ fontSize: 16, fontWeight: 600 }}>📱 Send Text Message</div>
          <button onClick={onClose} style={{ ...S.btn, ...S.btnSm }}>✕</button>
        </div>
        {sent ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>✅</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--green)' }}>Message sent!</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>CUSTOMER PHONE</div><input value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. 604-555-1234" style={S.input} /></div>
            {templates && templates.length > 0 && <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 8 }}>PICK A TEMPLATE</div><div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{templates.map(t => <button key={t.id} onClick={() => applyTemplate(t)} style={{ ...S.btn, ...S.btnSm, fontSize: 11 }}>{t.label}</button>)}</div></div>}
            <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>MESSAGE</div><textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Type your message or pick a template above..." style={{ ...S.textarea, minHeight: 120 }} /><div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>{message.length} characters · Sending from (604) 728-8347</div></div>
            {err && <div style={{ fontSize: 12, color: 'var(--red)', padding: '8px 10px', background: 'rgba(239,68,68,0.1)', borderRadius: 'var(--rs)' }}>{err}</div>}
            <div style={{ display: 'flex', gap: 8 }}><button onClick={send} disabled={sending} style={{ ...S.btn, ...S.btnP, flex: 1, justifyContent: 'center', opacity: sending ? 0.6 : 1 }}>{sending ? 'Sending...' : 'Send Text'}</button><button onClick={onClose} style={S.btn}>Cancel</button></div>
          </div>
        )}
      </div>
    </div>
  )
}

function BuildCard({ build, users, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ ...build })
  const [showSMS, setShowSMS] = useState(false)
  const assignee = users.find(u => u.id === build.assigned_to)
  const sc = BUILD_STATUS_COLOR[build.status] || '#94a3b8'
  const activeUsers = users.filter(u => u.active)
  const needsContact = build.status === 'Ready for Pickup' && build.contact_status !== 'Customer Notified'
  const save = () => { onUpdate(build.id, form); setEditing(false) }
  return (
    <div style={{ ...S.card, marginBottom: 12, borderLeft: `3px solid ${needsContact ? 'var(--amber)' : sc}` }}>
      {showSMS && <SMSModal build={build} onClose={() => setShowSMS(false)} onSent={() => onUpdate(build.id, { contact_status: 'Customer Notified', last_contacted: nowISO() })} />}
      {!editing ? (
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{build.bike_description}</div>
                <span style={S.badge(sc)}>{build.status}</span>
                {needsContact && <span style={S.badge('var(--amber)')}>📱 Needs Contact</span>}
                {build.contact_status === 'Customer Notified' && <span style={S.badge('var(--green)')}>✓ Notified</span>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: '3px 16px', fontSize: 12, color: 'var(--text2)' }}>
                {build.order_number && <div><span style={{ color: 'var(--text3)' }}>Order: </span>{build.order_number}</div>}
                {build.customer_name && <div><span style={{ color: 'var(--text3)' }}>Customer: </span>{build.customer_name}</div>}
                {build.customer_phone && <div><span style={{ color: 'var(--text3)' }}>Phone: </span>{build.customer_phone}</div>}
                {build.pickup_date && <div><span style={{ color: 'var(--text3)' }}>Pickup: </span>{fmtDate(build.pickup_date)}</div>}
                <div><span style={{ color: 'var(--text3)' }}>Assigned: </span>{assignee ? <strong>{assignee.name}</strong> : <span style={{ color: 'var(--red)' }}>Unassigned</span>}</div>
                {build.last_contacted && <div><span style={{ color: 'var(--text3)' }}>Texted: </span>{fmtDate(build.last_contacted)}</div>}
              </div>
              {build.notes && <div style={{ fontSize: 13, color: 'var(--text2)', padding: '8px 10px', background: 'var(--bg3)', borderRadius: 'var(--rs)', lineHeight: 1.6, marginTop: 8 }}>{build.notes}</div>}
            </div>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              <button onClick={() => setShowSMS(true)} style={{ ...S.btn, ...S.btnSm, ...(needsContact ? S.btnA : {}) }}>📱</button>
              <button onClick={() => { setForm({ ...build }); setEditing(true) }} style={{ ...S.btn, ...S.btnSm }}>✏️</button>
              <button onClick={() => onDelete(build.id)} style={{ ...S.btn, ...S.btnD, ...S.btnSm }}>✕</button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, paddingTop: 10, borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 140 }}><div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>STATUS</div><select value={build.status} onChange={e => onUpdate(build.id, { status: e.target.value })} style={{ ...S.select, fontSize: 12, padding: '5px 8px' }}>{BUILD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
            <div style={{ flex: 1, minWidth: 140 }}><div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>ASSIGNED TO</div><select value={build.assigned_to || ''} onChange={e => onUpdate(build.id, { assigned_to: e.target.value })} style={{ ...S.select, fontSize: 12, padding: '5px 8px' }}><option value="">Unassigned</option>{activeUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}</select></div>
            <div style={{ flex: 1, minWidth: 140 }}><div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>CONTACT STATUS</div><select value={build.contact_status || 'Not Contacted'} onChange={e => onUpdate(build.id, { contact_status: e.target.value })} style={{ ...S.select, fontSize: 12, padding: '5px 8px' }}>{CONTACT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>BIKE DESCRIPTION</div><input value={form.bike_description || ''} onChange={e => setForm({ ...form, bike_description: e.target.value })} style={S.input} /></div>
            <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>ORDER NUMBER</div><input value={form.order_number || ''} onChange={e => setForm({ ...form, order_number: e.target.value })} style={S.input} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>CUSTOMER NAME</div><input value={form.customer_name || ''} onChange={e => setForm({ ...form, customer_name: e.target.value })} style={S.input} /></div>
            <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>CUSTOMER PHONE</div><input value={form.customer_phone || ''} onChange={e => setForm({ ...form, customer_phone: e.target.value })} style={S.input} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>PICKUP DATE</div><input type="date" value={form.pickup_date || ''} onChange={e => setForm({ ...form, pickup_date: e.target.value })} style={S.input} /></div>
            <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>STATUS</div><select value={form.status || 'Waiting for Bike'} onChange={e => setForm({ ...form, status: e.target.value })} style={S.select}>{BUILD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>ASSIGNED TO</div><select value={form.assigned_to || ''} onChange={e => setForm({ ...form, assigned_to: e.target.value })} style={S.select}><option value="">Unassigned</option>{activeUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}</select></div>
            <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>CONTACT STATUS</div><select value={form.contact_status || 'Not Contacted'} onChange={e => setForm({ ...form, contact_status: e.target.value })} style={S.select}>{CONTACT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
          </div>
          <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>NOTES</div><textarea value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} style={S.textarea} /></div>
          <div style={{ display: 'flex', gap: 8 }}><button onClick={save} style={{ ...S.btn, ...S.btnP }}>Save Changes</button><button onClick={() => setEditing(false)} style={S.btn}>Cancel</button></div>
        </div>
      )}
    </div>
  )
}

function EditableChecklist({ listKey, defaultItems, isMgr }) {
  const [items, setItems] = useState(null)
  const [checks, setChecks] = useState({})
  const [editMode, setEditMode] = useState(false)
  const [newText, setNewText] = useState('')
  const [newTag, setNewTag] = useState('')
  const [editIdx, setEditIdx] = useState(null)
  const [editVal, setEditVal] = useState({ text: '', tag: '' })
  useEffect(() => {
    sb.from('content').select('*').eq('key', listKey).single()
      .then(({ data }) => setItems(data ? JSON.parse(data.value) : defaultItems))
      .catch(() => setItems(defaultItems))
    const saved = localStorage.getItem('ce_chk_' + listKey)
    if (saved) try { setChecks(JSON.parse(saved)) } catch { }
  }, [listKey])
  const saveItems = async (next) => { setItems(next); await sb.from('content').upsert({ key: listKey, value: JSON.stringify(next) }, { onConflict: 'key' }) }
  const toggle = (i) => { const next = { ...checks, [i]: !checks[i] }; setChecks(next); localStorage.setItem('ce_chk_' + listKey, JSON.stringify(next)) }
  const reset = () => { setChecks({}); localStorage.removeItem('ce_chk_' + listKey) }
  const addItem = () => { if (!newText.trim()) return; saveItems([...(items || []), { text: newText.trim(), tag: newTag.trim() || 'General' }]); setNewText(''); setNewTag('') }
  const removeItem = (i) => saveItems((items || []).filter((_, j) => j !== i))
  const moveItem = (i, dir) => { const a = [...(items || [])]; const j = i + dir; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; saveItems(a) }
  const startEdit = (i) => { setEditIdx(i); setEditVal({ ...items[i] }) }
  const saveEdit = () => { saveItems(items.map((x, i) => i === editIdx ? editVal : x)); setEditIdx(null) }
  if (!items) return <div style={{ fontSize: 13, color: 'var(--text2)', padding: 16 }}>Loading...</div>
  const done = Object.values(checks).filter(Boolean).length
  const pct = items.length ? Math.round((done / items.length) * 100) : 0
  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <button onClick={reset} style={S.btn}>↺ Reset</button>
        {isMgr && <button onClick={() => setEditMode(!editMode)} style={{ ...S.btn, ...(editMode ? S.btnP : {}) }}>{editMode ? 'Done' : '✏️ Edit'}</button>}
      </div>
      {!editMode && (
        <div style={S.card}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 6 }}>{done} of {items.length} complete</div>
            <div style={{ background: 'var(--bg3)', borderRadius: 20, height: 5, overflow: 'hidden' }}><div style={{ height: '100%', background: 'var(--green)', borderRadius: 20, width: pct + '%', transition: 'width 0.35s' }} /></div>
          </div>
          {items.map((item, i) => (
            <div key={i} onClick={() => toggle(i)} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '11px 0', borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none', cursor: 'pointer', opacity: checks[i] ? 0.42 : 1 }}>
              <div style={{ width: 20, height: 20, border: '1.5px solid', borderColor: checks[i] ? 'var(--green)' : 'var(--border2)', borderRadius: 5, flexShrink: 0, marginTop: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: checks[i] ? 'var(--green)' : 'transparent' }}>
                {checks[i] && <span style={{ color: 'white', fontSize: 12, fontWeight: 700 }}>✓</span>}
              </div>
              <div style={{ flex: 1, fontSize: 14, textDecoration: checks[i] ? 'line-through' : 'none', color: checks[i] ? 'var(--text2)' : 'var(--text)' }}>{item.text}</div>
              <span style={{ fontSize: 10, fontFamily: 'var(--mono)', padding: '2px 8px', borderRadius: 20, background: 'var(--bg3)', color: 'var(--text2)', border: '1px solid var(--border)', flexShrink: 0 }}>{item.tag}</span>
            </div>
          ))}
        </div>
      )}
      {editMode && (
        <div>
          <div style={S.card}>
            <div style={S.cardTitle}>Add Item</div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: 10, alignItems: 'end' }}>
              <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>TASK</div><input value={newText} onChange={e => setNewText(e.target.value)} placeholder="What needs to be done?" style={S.input} onKeyDown={e => e.key === 'Enter' && addItem()} /></div>
              <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>TAG</div><input value={newTag} onChange={e => setNewTag(e.target.value)} placeholder="e.g. Clean" style={S.input} /></div>
              <button onClick={addItem} style={{ ...S.btn, ...S.btnP }}>Add</button>
            </div>
          </div>
          <div style={S.card}>
            {items.map((item, i) => (
              <div key={i} style={{ padding: '10px 0', borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none' }}>
                {editIdx === i ? (
                  <div style={{ display: 'grid', gap: 8 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 8 }}>
                      <input value={editVal.text} onChange={e => setEditVal({ ...editVal, text: e.target.value })} style={S.input} />
                      <input value={editVal.tag} onChange={e => setEditVal({ ...editVal, tag: e.target.value })} style={S.input} />
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}><button onClick={saveEdit} style={{ ...S.btn, ...S.btnP, ...S.btnSm }}>Save</button><button onClick={() => setEditIdx(null)} style={{ ...S.btn, ...S.btnSm }}>Cancel</button></div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, fontSize: 13 }}>{item.text}<span style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginLeft: 6 }}>{item.tag}</span></div>
                    <button onClick={() => moveItem(i, -1)} style={{ ...S.btn, ...S.btnSm }} disabled={i === 0}>↑</button>
                    <button onClick={() => moveItem(i, 1)} style={{ ...S.btn, ...S.btnSm }} disabled={i === items.length - 1}>↓</button>
                    <button onClick={() => startEdit(i)} style={{ ...S.btn, ...S.btnSm }}>✏️</button>
                    <button onClick={() => removeItem(i)} style={{ ...S.btn, ...S.btnD, ...S.btnSm }}>✕</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function EditableSteps({ listKey, defaultSections, isMgr }) {
  const [sections, setSections] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [newSec, setNewSec] = useState('')
  const [newStep, setNewStep] = useState({})
  const [editing, setEditing] = useState(null)
  useEffect(() => {
    sb.from('content').select('*').eq('key', listKey).single()
      .then(({ data }) => setSections(data ? JSON.parse(data.value) : defaultSections))
      .catch(() => setSections(defaultSections))
  }, [listKey])
  const save = async (next) => { setSections(next); await sb.from('content').upsert({ key: listKey, value: JSON.stringify(next) }, { onConflict: 'key' }) }
  const addSection = () => { if (!newSec.trim()) return; save([...(sections || []), { title: newSec.trim(), steps: [] }]); setNewSec('') }
  const removeSection = (si) => save((sections || []).filter((_, i) => i !== si))
  const updateSecTitle = (si, t) => save((sections || []).map((s, i) => i === si ? { ...s, title: t } : s))
  const addStep = (si) => { const v = newStep[si] || { title: '', desc: '', img: '' }; if (!v.title.trim()) return; save((sections || []).map((s, i) => i === si ? { ...s, steps: [...s.steps, { title: v.title, desc: v.desc, img: v.img || '' }] } : s)); setNewStep({ ...newStep, [si]: { title: '', desc: '', img: '' } }) }
  const removeStep = (si, sti) => save((sections || []).map((s, i) => i === si ? { ...s, steps: s.steps.filter((_, j) => j !== sti) } : s))
  const startEdit = (si, sti) => setEditing({ si, sti, ...sections[si].steps[sti], img: sections[si].steps[sti].img || '' })
  const saveEdit = () => { save((sections || []).map((s, i) => i === editing.si ? { ...s, steps: s.steps.map((st, j) => j === editing.sti ? { title: editing.title, desc: editing.desc, img: editing.img || '' } : st) } : s)); setEditing(null) }
  const moveStep = (si, sti, dir) => { save((sections || []).map((s, i) => { if (i !== si) return s; const a = [...s.steps]; const j = sti + dir; if (j < 0 || j >= a.length) return s; [a[sti], a[j]] = [a[j], a[sti]]; return { ...s, steps: a } })) }
  if (!sections) return <div style={{ fontSize: 13, color: 'var(--text2)', padding: 16 }}>Loading...</div>
  return (
    <div>
      {isMgr && <div style={{ marginBottom: 14 }}><button onClick={() => setEditMode(!editMode)} style={{ ...S.btn, ...(editMode ? S.btnP : {}) }}>{editMode ? 'Done Editing' : '✏️ Edit'}</button></div>}
      {!editMode && sections.map((sec, si) => (
        <div key={si} style={S.card}>
          <div style={S.cardTitle}>{sec.title}</div>
          {sec.steps.map((s, i) => (
            <div key={i} style={{ padding: '13px 0', borderBottom: i < sec.steps.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ display: 'flex', gap: 14 }}>
                <div style={{ width: 26, height: 26, background: 'rgba(59,130,246,0.15)', color: 'var(--accent2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 500, flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 3 }}>{s.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.65 }}>{s.desc}</div>
                  {s.img && <img src={s.img} alt={s.title} style={{ marginTop: 10, maxWidth: '100%', maxHeight: 300, borderRadius: 'var(--rs)', border: '1px solid var(--border)', objectFit: 'contain', background: 'var(--bg3)' }} onError={e => { e.target.style.display = 'none' }} />}
                </div>
              </div>
            </div>
          ))}
          {sec.steps.length === 0 && <div style={{ fontSize: 13, color: 'var(--text3)' }}>No steps yet. Use ✏️ Edit to add content.</div>}
        </div>
      ))}
      {editMode && (
        <div>
          <div style={S.card}>
            <div style={S.cardTitle}>Add Section</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10 }}>
              <input value={newSec} onChange={e => setNewSec(e.target.value)} placeholder="e.g. 🔋 Battery Service" style={S.input} onKeyDown={e => e.key === 'Enter' && addSection()} />
              <button onClick={addSection} style={{ ...S.btn, ...S.btnP }}>Add</button>
            </div>
          </div>
          {sections.map((sec, si) => (
            <div key={si} style={S.card}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                <input value={sec.title} onChange={e => updateSecTitle(si, e.target.value)} style={{ ...S.input, fontWeight: 600 }} />
                <button onClick={() => removeSection(si)} style={{ ...S.btn, ...S.btnD, ...S.btnSm, flexShrink: 0 }}>Remove</button>
              </div>
              {sec.steps.map((s, sti) => (
                <div key={sti} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  {editing?.si === si && editing?.sti === sti ? (
                    <div style={{ display: 'grid', gap: 8 }}>
                      <input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} placeholder="Step title" style={S.input} />
                      <textarea value={editing.desc} onChange={e => setEditing({ ...editing, desc: e.target.value })} placeholder="Step description" style={{ ...S.textarea, minHeight: 60 }} />
                      <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>IMAGE URL (optional)</div><input value={editing.img || ''} onChange={e => setEditing({ ...editing, img: e.target.value })} placeholder="https://..." style={S.input} /></div>
                      <div style={{ display: 'flex', gap: 8 }}><button onClick={saveEdit} style={{ ...S.btn, ...S.btnP, ...S.btnSm }}>Save</button><button onClick={() => setEditing(null)} style={{ ...S.btn, ...S.btnSm }}>Cancel</button></div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 500 }}>{s.title}</div><div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>{s.desc}</div></div>
                      <button onClick={() => moveStep(si, sti, -1)} style={{ ...S.btn, ...S.btnSm }} disabled={sti === 0}>↑</button>
                      <button onClick={() => moveStep(si, sti, 1)} style={{ ...S.btn, ...S.btnSm }} disabled={sti === sec.steps.length - 1}>↓</button>
                      <button onClick={() => startEdit(si, sti)} style={{ ...S.btn, ...S.btnSm }}>✏️</button>
                      <button onClick={() => removeStep(si, sti)} style={{ ...S.btn, ...S.btnD, ...S.btnSm }}>✕</button>
                    </div>
                  )}
                </div>
              ))}
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 8 }}>ADD STEP</div>
                <div style={{ display: 'grid', gap: 8 }}>
                  <input value={(newStep[si] || {}).title || ''} onChange={e => setNewStep({ ...newStep, [si]: { ...(newStep[si] || {}), title: e.target.value } })} placeholder="Step title" style={S.input} />
                  <textarea value={(newStep[si] || {}).desc || ''} onChange={e => setNewStep({ ...newStep, [si]: { ...(newStep[si] || {}), desc: e.target.value } })} placeholder="Step description" style={{ ...S.textarea, minHeight: 60 }} />
                  <button onClick={() => addStep(si)} style={{ ...S.btn, ...S.btnP, ...S.btnSm, width: 'fit-content' }}>Add Step</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function BrandGuidePage({ title, icon, listKey, externalLink, externalLabel, isMgr }) {
  return (
    <div style={S.page}>
      <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>{icon} {title}</div>
      {externalLink
        ? <div style={{ marginBottom: 18 }}><a href={externalLink} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: 'var(--accent2)', textDecoration: 'none', fontFamily: 'var(--mono)' }}>{externalLabel || 'Official Resource'} ↗</a></div>
        : <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 18 }}>Add sections and steps using ✏️ Edit below</div>}
      <EditableSteps listKey={listKey} defaultSections={[{ title: 'Getting Started', steps: [{ title: 'Add your first section', desc: 'Click ✏️ Edit above to start adding content.', img: '' }] }]} isMgr={isMgr} />
    </div>
  )
}

function LoginScreen({ users, onLogin }) {
  const [code, setCode] = useState('')
  const [dots, setDots] = useState([false, false, false, false])
  const [err, setErr] = useState('')
  const press = (n) => { if (code.length >= 4) return; const next = code + n; setCode(next); setDots([...Array(4)].map((_, i) => i < next.length)); if (next.length === 4) setTimeout(() => check(next), 120) }
  const del = () => { const next = code.slice(0, -1); setCode(next); setDots([...Array(4)].map((_, i) => i < next.length)); setErr('') }
  const check = (c) => { const u = users.find(u => u.code === c && u.active); if (u) { onLogin(u) } else { setErr('Incorrect code — try again'); setCode(''); setDots([false, false, false, false]) } }
  useEffect(() => { const h = (e) => { if (e.key >= '0' && e.key <= '9') press(e.key); if (e.key === 'Backspace') del() }; window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h) }, [code])
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 20, padding: '40px 44px', width: 340, textAlign: 'center' }}>
        <div style={{ fontSize: 38, marginBottom: 14 }}>⚡</div>
        <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>Cloud Ebikes</div>
        <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 28 }}>Enter your 4-digit access code</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
          {dots.map((f, i) => <div key={i} style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid', borderColor: f ? 'var(--accent)' : 'var(--border2)', background: f ? 'var(--accent)' : 'transparent' }} />)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((k, i) => (
            <button key={i} onClick={() => k === '⌫' ? del() : k ? press(k) : null} style={{ ...S.btn, justifyContent: 'center', fontSize: 20, fontFamily: 'var(--mono)', padding: 16, opacity: k ? 1 : 0, pointerEvents: k ? 'auto' : 'none' }}>{k}</button>
          ))}
        </div>
        {err && <div style={{ fontSize: 12, color: 'var(--red)', fontFamily: 'var(--mono)', marginTop: 14 }}>{err}</div>}
      </div>
    </div>
  )
}

// ── SIDEBAR ──

function Sidebar({ user, page, setPage, unread, onLock, pendingBuilds }) {
  const isOwner = user.role === 'owner'
  const isMgr = isOwner || user.role === 'manager'
  const [time, setTime] = useState(new Date())
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 30000); return () => clearInterval(t) }, [])
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const N = (id, label, icon, badge, bc) => (
    <button style={S.navItem(page === id)} onClick={() => setPage(id)}>
      <span style={{ fontSize: 15, width: 18, textAlign: 'center' }}>{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
      {badge > 0 && <span style={{ fontSize: 10, fontFamily: 'var(--mono)', padding: '1px 6px', borderRadius: 20, background: bc || 'var(--red)', color: 'white' }}>{badge}</span>}
    </button>
  )
  const L = (label) => <div style={{ fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text3)', fontFamily: 'var(--mono)', padding: '8px 10px 4px', marginTop: 6 }}>{label}</div>
  return (
    <aside style={S.sidebar}>
      <div style={{ padding: '18px 18px 14px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, background: 'var(--accent)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>⚡</div>
          <div><div style={{ fontSize: 14, fontWeight: 600 }}>Cloud Ebikes</div><div style={{ fontSize: 10, color: 'var(--text2)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--mono)' }}>Staff Portal</div></div>
        </div>
      </div>
      <div style={{ padding: '10px 8px', flex: 1 }}>
        {L('My Area')}
        {N('home', 'Home', '🏠')}
        {N('tasks', 'My Tasks', '✅')}
        {N('timeclock', 'Check In / Out', '🕐')}
        {N('messages', 'Send Message', '💬')}
        {L('Store')}
        {N('announcements', 'Announcements', '📢')}
        {N('opening', 'Store Open/Close', '🔓')}
        {N('checklist', 'Daily Checklist', '📋')}
        {N('builds', 'Bike Builds', '🔨', pendingBuilds, 'var(--amber)')}
        {N('templates', 'Message Templates', '💬')}
        {N('parts', 'Parts to Order', '🔩')}
        {N('bikes', 'Bikes to Order', '🚲')}
        {N('shipments', 'Incoming Shipments', '📬')}
        {L('Guides')}
        {N('workshop', 'Workshop Guides', '🔧')}
        {N('salesguide', 'Sales Guides', '💡')}
        {N('warranty-submit', 'Submit Warranty', '🛡️')}
        {isMgr && <>
          {L('Management')}
          {N('assign', 'Assign Tasks', '🎯')}
          {N('inbox', 'Team Inbox', '📥', unread)}
          {N('broadcast', 'Announcements', '📣')}
          {N('warranty-claims', 'Warranty Claims', '🛡️')}
          {N('hours', 'Staff Hours', '📊')}
        </>}
        {isOwner && <>
          {L('Owner')}
          {N('users', 'Manage Users', '👥')}
        </>}
      </div>
      <div style={{ padding: '14px 18px', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 20, fontWeight: 500, letterSpacing: '0.04em' }}>{String(time.getHours()).padStart(2, '0')}:{String(time.getMinutes()).padStart(2, '0')}</div>
        <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2, fontFamily: 'var(--mono)' }}>{days[time.getDay()]} · {months[time.getMonth()]} {time.getDate()}</div>
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={S.avatar(ROLE_COLOR[user.role])}>{user.name[0]}</div>
          <div style={{ fontSize: 13, fontWeight: 500 }}>{user.name}</div>
        </div>
        <button onClick={onLock} style={{ ...S.btn, ...S.btnSm, marginTop: 10, width: '100%', justifyContent: 'center', color: 'var(--text3)' }}>🔒 Lock</button>
      </div>
    </aside>
  )
}

// ── HOME PAGE ──

function HomePage({ user, announcements, myTasks, builds, users }) {
  const hr = new Date().getHours()
  const g = hr < 12 ? 'Good morning ☀️' : hr < 17 ? 'Good afternoon ⚡' : 'Good evening 🌙'
  const open = myTasks.filter(t => !t.done)
  const activeBuilds = builds.filter(b => b.status !== 'Completed')
  const liveAnnouncements = announcements.filter(a => !a.expires_at || new Date(a.expires_at) > new Date())
  return (
    <div style={{ padding: 24, maxWidth: 1200 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 22, fontWeight: 600 }}>{g}, {user.name}</div>
        <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 3 }}>1991 Main St · Vancouver</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 280px', gap: 16 }}>
        <div style={S.card}>
          <div style={S.cardTitle}>📢 Announcements</div>
          {liveAnnouncements.length === 0 && <div style={{ fontSize: 13, color: 'var(--text2)' }}>No announcements yet.</div>}
          {liveAnnouncements.slice(0, 4).map(a => <ACard key={a.id} a={a} />)}
        </div>
        <div style={S.card}>
          <div style={S.cardTitle}>🔨 Pending Bike Builds ({activeBuilds.length})</div>
          {activeBuilds.length === 0 && <div style={{ fontSize: 13, color: 'var(--text2)' }}>No pending builds.</div>}
          {activeBuilds.map(b => {
            const assignee = users.find(u => u.id === b.assigned_to)
            const sc = BUILD_STATUS_COLOR[b.status] || '#94a3b8'
            const needsContact = b.status === 'Ready for Pickup' && b.contact_status !== 'Customer Notified'
            return (
              <div key={b.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{b.bike_description}</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={S.badge(sc)}>{b.status}</span>
                  {needsContact && <span style={S.badge('var(--amber)')}>📱 Needs Contact</span>}
                  {b.customer_name && <span style={{ fontSize: 11, color: 'var(--text2)' }}>{b.customer_name}</span>}
                  {assignee && <span style={{ fontSize: 11, color: 'var(--text2)' }}>→ {assignee.name}</span>}
                </div>
              </div>
            )
          })}
        </div>
        <div style={{ ...S.card, marginBottom: 0 }}>
          <div style={{ ...S.cardTitle, marginBottom: 10 }}>✅ My Tasks<span style={{ marginLeft: 8, fontSize: 10, padding: '2px 7px', borderRadius: 20, background: open.length > 0 ? 'rgba(245,158,11,0.2)' : 'rgba(34,197,94,0.2)', color: open.length > 0 ? 'var(--amber)' : 'var(--green)', fontWeight: 500 }}>{open.length} open</span></div>
          {open.length === 0 && <div style={{ fontSize: 13, color: 'var(--text2)', padding: '6px 0' }}>All caught up!</div>}
          {open.map((t, i) => (
            <div key={t.id} style={{ padding: '9px 0', borderBottom: i < open.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{t.title}</div>
              {t.notes && <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>{t.notes}</div>}
              {t.priority && <div style={{ marginTop: 4 }}><span style={S.badge(PRI_COLOR[t.priority])}>{t.priority}</span></div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── TIMECLOCK PAGE ──

function TimeclockPage({ user, isMgr, users }) {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [clocked, setClocked] = useState(null)
  const [notes, setNotes] = useState('')
  const [editEntry, setEditEntry] = useState(null)
  const [viewUser, setViewUser] = useState(user.id)

  const fetchEntries = async () => {
    setLoading(true)
    const uid = isMgr ? viewUser : user.id
    const { data } = await sb.from('timeclocks').select('*').eq('user_id', uid).order('clock_in', { ascending: false }).limit(30)
    setEntries(data || [])
    const open = (data || []).find(e => !e.clock_out)
    setClocked(open || null)
    setLoading(false)
  }

  useEffect(() => { fetchEntries() }, [viewUser])

  const clockIn = async () => {
    const item = { id: uid(), user_id: user.id, clock_in: nowISO(), notes: notes.trim(), created_at: nowISO() }
    await sb.from('timeclocks').insert(item)
    setNotes(''); fetchEntries()
  }

  const clockOut = async () => {
    await sb.from('timeclocks').update({ clock_out: nowISO() }).eq('id', clocked.id)
    fetchEntries()
  }

  const saveEdit = async () => {
    await sb.from('timeclocks').update({ clock_in: editEntry.clock_in, clock_out: editEntry.clock_out, notes: editEntry.notes, edited: true, edited_by: user.name }).eq('id', editEntry.id)
    setEditEntry(null); fetchEntries()
  }

  const weekMs = entries.reduce((acc, e) => {
    if (!e.clock_out) return acc
    const start = new Date(e.clock_in)
    const end = new Date(e.clock_out)
    const weekAgo = new Date(Date.now() - 7 * 86400000)
    if (start < weekAgo) return acc
    return acc + (end - start)
  }, 0)

  const viewedUser = users.find(u => u.id === viewUser)

  return (
    <div style={S.page}>
      <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>🕐 Check In / Out</div>
      <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 22 }}>Track your hours — edit the next day if you forgot</div>

      {isMgr && (
        <div style={{ ...S.card, marginBottom: 16 }}>
          <div style={S.cardTitle}>View Staff Hours</div>
          <select value={viewUser} onChange={e => setViewUser(e.target.value)} style={S.select}>
            {users.filter(u => u.active).map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
      )}

      {viewUser === user.id && (
        <div style={S.card}>
          <div style={S.cardTitle}>Status</div>
          {clocked ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--green)', animation: 'pulse 2s infinite' }} />
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--green)' }}>Clocked In</div>
                <div style={{ fontSize: 13, color: 'var(--text2)' }}>since {fmtTime(clocked.clock_in)}</div>
              </div>
              <button onClick={clockOut} style={{ ...S.btn, ...S.btnD }}>Clock Out</button>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--border2)' }} />
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text2)' }}>Not Clocked In</div>
              </div>
              <div style={{ marginBottom: 10 }}><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>NOTES (optional)</div><input value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. Opening shift" style={S.input} /></div>
              <button onClick={clockIn} style={{ ...S.btn, ...S.btnG }}>Clock In</button>
            </div>
          )}
        </div>
      )}

      <div style={S.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={S.cardTitle}>{viewedUser?.name || 'Staff'} — Recent Entries</div>
          <div style={{ fontSize: 13, color: 'var(--green)', fontWeight: 600 }}>This week: {fmtHours(weekMs)}</div>
        </div>
        {loading && <div style={{ fontSize: 13, color: 'var(--text2)' }}>Loading...</div>}
        {!loading && entries.length === 0 && <div style={{ fontSize: 13, color: 'var(--text2)' }}>No entries yet.</div>}
        {entries.map(e => {
          const duration = e.clock_out ? new Date(e.clock_out) - new Date(e.clock_in) : null
          const canEdit = isMgr || (e.user_id === user.id && new Date(e.clock_in) > new Date(Date.now() - 2 * 86400000))
          return (
            <div key={e.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              {editEntry?.id === e.id ? (
                <div style={{ display: 'grid', gap: 10 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 4 }}>CLOCK IN</div><input type="datetime-local" value={editEntry.clock_in?.slice(0, 16) || ''} onChange={ev => setEditEntry({ ...editEntry, clock_in: new Date(ev.target.value).toISOString() })} style={S.input} /></div>
                    <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 4 }}>CLOCK OUT</div><input type="datetime-local" value={editEntry.clock_out?.slice(0, 16) || ''} onChange={ev => setEditEntry({ ...editEntry, clock_out: new Date(ev.target.value).toISOString() })} style={S.input} /></div>
                  </div>
                  <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 4 }}>NOTES</div><input value={editEntry.notes || ''} onChange={ev => setEditEntry({ ...editEntry, notes: ev.target.value })} style={S.input} /></div>
                  <div style={{ display: 'flex', gap: 8 }}><button onClick={saveEdit} style={{ ...S.btn, ...S.btnP, ...S.btnSm }}>Save</button><button onClick={() => setEditEntry(null)} style={{ ...S.btn, ...S.btnSm }}>Cancel</button></div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{fmtDate(e.clock_in)} · {fmtTime(e.clock_in)} {e.clock_out ? `→ ${fmtTime(e.clock_out)}` : <span style={{ color: 'var(--green)' }}>→ still in</span>}</div>
                    <div style={{ display: 'flex', gap: 10, marginTop: 4, flexWrap: 'wrap' }}>
                      {duration && <span style={{ fontSize: 12, color: 'var(--accent2)', fontFamily: 'var(--mono)' }}>{fmtHours(duration)}</span>}
                      {e.notes && <span style={{ fontSize: 12, color: 'var(--text2)' }}>{e.notes}</span>}
                      {e.edited && <span style={S.badge('var(--amber)')}>edited</span>}
                    </div>
                  </div>
                  {canEdit && <button onClick={() => setEditEntry({ ...e })} style={{ ...S.btn, ...S.btnSm }}>✏️</button>}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── STAFF HOURS SUMMARY (manager view) ──

function StaffHoursPage({ users }) {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [weekOffset, setWeekOffset] = useState(0)

  useEffect(() => {
    setLoading(true)
    const weekStart = new Date(Date.now() - (weekOffset + 1) * 7 * 86400000)
    const weekEnd = new Date(Date.now() - weekOffset * 7 * 86400000)
    sb.from('timeclocks').select('*').gte('clock_in', weekStart.toISOString()).lte('clock_in', weekEnd.toISOString())
      .then(({ data }) => { setEntries(data || []); setLoading(false) })
  }, [weekOffset])

  const weekStart = new Date(Date.now() - (weekOffset + 1) * 7 * 86400000)
  const weekEnd = new Date(Date.now() - weekOffset * 7 * 86400000)

  const byUser = users.filter(u => u.active).map(u => {
    const ue = entries.filter(e => e.user_id === u.id && e.clock_out)
    const total = ue.reduce((acc, e) => acc + (new Date(e.clock_out) - new Date(e.clock_in)), 0)
    return { user: u, total, entries: ue }
  })

  return (
    <div style={S.page}>
      <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>📊 Staff Hours</div>
      <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 22 }}>Weekly hours summary for all staff</div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' }}>
        <button onClick={() => setWeekOffset(w => w + 1)} style={S.btn}>← Previous</button>
        <div style={{ fontSize: 13, fontWeight: 600, padding: '0 8px' }}>{fmtDate(weekStart.toISOString())} — {fmtDate(weekEnd.toISOString())}</div>
        <button onClick={() => setWeekOffset(w => Math.max(0, w - 1))} style={S.btn} disabled={weekOffset === 0}>Next →</button>
        {weekOffset > 0 && <button onClick={() => setWeekOffset(0)} style={{ ...S.btn, ...S.btnSm }}>This week</button>}
      </div>
      {loading ? <div style={{ fontSize: 13, color: 'var(--text2)' }}>Loading...</div> : (
        <div style={{ display: 'grid', gap: 12 }}>
          {byUser.map(({ user: u, total, entries: ue }) => (
            <div key={u.id} style={S.card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: total > 0 ? 12 : 0 }}>
                <div style={S.avatar(ROLE_COLOR[u.role])}>{u.name[0]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{u.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)' }}>{ue.length} shifts</div>
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: total > 0 ? 'var(--green)' : 'var(--text3)', fontFamily: 'var(--mono)' }}>{fmtHours(total)}</div>
              </div>
              {ue.map(e => (
                <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--text2)' }}>
                  <span>{fmtDate(e.clock_in)} · {fmtTime(e.clock_in)} → {fmtTime(e.clock_out)}</span>
                  <span style={{ fontFamily: 'var(--mono)', color: 'var(--accent2)' }}>{fmtHours(new Date(e.clock_out) - new Date(e.clock_in))}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── BROADCAST PAGE (with AI drafting + expiry) ──

function BroadcastPage({ user, announcements, onAdd, onDelete }) {
  const [form, setForm] = useState({ type: 'info', category: 'General', title: '', body: '', expires_at: '' })
  const [aiLoading, setAiLoading] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')

  const generateDraft = async () => {
    if (!aiPrompt.trim()) return
    setAiLoading(true)
    try {
      const text = await askClaude(`You are writing a staff announcement for Cloud Ebikes, a bike shop in Vancouver at 1991 Main St. 
Write a short, clear, professional announcement for staff based on this prompt: "${aiPrompt}"
Category hint: ${form.category}
Keep it under 80 words. Write only the announcement body text, no title, no preamble.
Vary the wording so it does not sound repetitive or robotic. Keep a friendly but professional tone.`)
      const titleText = await askClaude(`Write a short 5-8 word title for this staff announcement: "${text}". Return only the title, nothing else.`)
      setForm(f => ({ ...f, body: text.trim(), title: titleText.trim() }))
    } catch (e) {
      console.error(e)
    }
    setAiLoading(false)
  }

  const submit = () => { if (!form.title.trim() || !form.body.trim()) return; onAdd(form); setForm({ type: 'info', category: 'General', title: '', body: '', expires_at: '' }); setAiPrompt('') }
  const liveAnnouncements = announcements.filter(a => !a.expires_at || new Date(a.expires_at) > new Date())

  const printClosure = (a) => {
    const w = window.open('', '_blank')
    w.document.write(`<html><head><title>Store Closure Notice</title><style>body{font-family:Arial,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#fff;}div{text-align:center;padding:60px;}h1{font-size:72px;font-weight:900;margin:0 0 24px;}p{font-size:36px;color:#333;margin:0 0 16px;line-height:1.4;}small{font-size:20px;color:#666;}</style></head><body><div><h1>STORE CLOSED</h1><p>${a.body}</p><small>Cloud Ebikes · 1991 Main St, Vancouver</small></div></body></html>`)
    w.document.close(); w.print()
  }

  return (
    <div style={S.page}>
      <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>📣 Announcements</div>
      <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 22 }}>Post to all staff on every tablet instantly</div>
      <div style={S.card}>
        <div style={S.cardTitle}>New Announcement</div>
        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 'var(--rs)', padding: '12px 14px' }}>
            <div style={{ fontSize: 11, color: 'var(--accent2)', fontFamily: 'var(--mono)', marginBottom: 8 }}>✨ AI DRAFT</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={{ ...S.select, width: 160, flexShrink: 0 }}>
                {ANNOUNCE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} placeholder={`e.g. "We are closed this Monday for Victoria Day"`} style={{ ...S.input, flex: 1 }} onKeyDown={e => e.key === 'Enter' && generateDraft()} />
              <button onClick={generateDraft} disabled={aiLoading || !aiPrompt.trim()} style={{ ...S.btn, ...S.btnP, flexShrink: 0, opacity: aiLoading ? 0.6 : 1 }}>{aiLoading ? 'Drafting...' : '✨ Draft'}</button>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 12 }}>
            <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>TYPE</div>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={S.select}>
                <option value="info">Info (blue)</option><option value="warn">Warning (amber)</option><option value="alert">Alert (red)</option><option value="good">Good news (green)</option>
              </select>
            </div>
            <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>TITLE</div><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Announcement title" style={S.input} /></div>
          </div>
          <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>MESSAGE</div><textarea value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} placeholder="Full announcement text..." style={S.textarea} /></div>
          <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>EXPIRY DATE (optional — auto-removes after this date)</div><input type="date" value={form.expires_at} onChange={e => setForm({ ...form, expires_at: e.target.value })} style={S.input} /></div>
          <button onClick={submit} style={{ ...S.btn, ...S.btnP, width: 'fit-content' }}>Post to All Staff</button>
        </div>
      </div>
      <div style={S.card}>
        <div style={S.cardTitle}>Live Announcements ({liveAnnouncements.length})</div>
        {liveAnnouncements.length === 0 && <div style={{ fontSize: 13, color: 'var(--text2)' }}>None posted.</div>}
        {liveAnnouncements.map(a => (
          <div key={a.id}>
            <ACard a={a} onDelete={onDelete} canDelete={true} />
            {a.category === 'Store Closure' && (
              <div style={{ marginTop: -6, marginBottom: 10 }}>
                <button onClick={() => printClosure(a)} style={{ ...S.btn, ...S.btnSm, fontSize: 11 }}>🖨️ Print Closure Notice</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── ASSIGN TASKS PAGE (with task templates) ──

function AssignPage({ user, users, tasks, onAdd, onToggle, onDelete, onReassign }) {
  const [form, setForm] = useState({ assigned_to: '', title: '', notes: '', priority: 'medium', due_date: '' })
  const [filter, setFilter] = useState('all')
  const [formErr, setFormErr] = useState('')
  const [showTemplates, setShowTemplates] = useState(false)
  const [templates, setTemplates] = useState([])
  const [newTpl, setNewTpl] = useState({ title: '', notes: '', priority: 'medium', category: '' })
  const [editingTpl, setEditingTpl] = useState(null)
  const [tplFilter, setTplFilter] = useState('All')
  const eligible = users.filter(u => u.active)

  useEffect(() => {
    sb.from('task_templates').select('*').order('category').then(({ data }) => setTemplates(data || []))
  }, [])

  const applyTemplate = (t) => { setForm(f => ({ ...f, title: t.title, notes: t.notes || '', priority: t.priority || 'medium' })); setShowTemplates(false) }

  const addTemplate = async () => {
    if (!newTpl.title.trim()) return
    const item = { id: uid(), ...newTpl, created_at: nowISO() }
    await sb.from('task_templates').insert(item)
    setTemplates(t => [...t, item]); setNewTpl({ title: '', notes: '', priority: 'medium', category: '' })
  }

  const deleteTemplate = async (id) => { await sb.from('task_templates').delete().eq('id', id); setTemplates(t => t.filter(x => x.id !== id)) }

  const saveEditTpl = async () => {
    await sb.from('task_templates').update({ title: editingTpl.title, notes: editingTpl.notes, priority: editingTpl.priority, category: editingTpl.category }).eq('id', editingTpl.id)
    setTemplates(t => t.map(x => x.id === editingTpl.id ? editingTpl : x)); setEditingTpl(null)
  }

  const submit = () => {
    if (!form.assigned_to) { setFormErr('Please select a person.'); return }
    if (!form.title.trim()) { setFormErr('Please enter a task title.'); return }
    setFormErr(''); onAdd({ ...form, assigned_by: user.id })
    setForm({ assigned_to: '', title: '', notes: '', priority: 'medium', due_date: '' })
  }

  const open = tasks.filter(t => !t.done)
  const done = tasks.filter(t => t.done)
  const filt = (list) => filter === 'all' ? list : list.filter(t => t.assigned_to === filter)
  const tplCategories = ['All', ...[...new Set(templates.map(t => t.category).filter(Boolean))]]
  const filteredTpls = tplFilter === 'All' ? templates : templates.filter(t => t.category === tplFilter)

  return (
    <div style={S.page}>
      <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>🎯 Assign Tasks</div>
      <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 22 }}>Create and manage tasks for the team</div>
      <div style={S.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={S.cardTitle}>New Task</div>
          <button onClick={() => setShowTemplates(!showTemplates)} style={{ ...S.btn, ...S.btnSm, ...(showTemplates ? S.btnP : {}) }}>📋 Templates</button>
        </div>
        {showTemplates && (
          <div style={{ background: 'var(--bg3)', borderRadius: 'var(--rs)', padding: '14px 16px', marginBottom: 16, border: '1px solid var(--border2)' }}>
            <div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 10 }}>TASK TEMPLATES — tap to apply</div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
              {tplCategories.map(c => <button key={c} onClick={() => setTplFilter(c)} style={{ ...S.btn, ...S.btnSm, fontSize: 11, borderColor: tplFilter === c ? 'var(--accent)' : 'var(--border2)', color: tplFilter === c ? 'var(--accent2)' : 'var(--text2)' }}>{c}</button>)}
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              {filteredTpls.map(t => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: 'var(--bg2)', borderRadius: 'var(--rs)', border: '1px solid var(--border)' }}>
                  {editingTpl?.id === t.id ? (
                    <div style={{ flex: 1, display: 'grid', gap: 6 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 6 }}>
                        <input value={editingTpl.title} onChange={e => setEditingTpl({ ...editingTpl, title: e.target.value })} style={{ ...S.input, fontSize: 12 }} />
                        <input value={editingTpl.category || ''} onChange={e => setEditingTpl({ ...editingTpl, category: e.target.value })} placeholder="Category" style={{ ...S.input, fontSize: 12 }} />
                        <select value={editingTpl.priority} onChange={e => setEditingTpl({ ...editingTpl, priority: e.target.value })} style={{ ...S.select, fontSize: 12 }}><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select>
                      </div>
                      <input value={editingTpl.notes || ''} onChange={e => setEditingTpl({ ...editingTpl, notes: e.target.value })} placeholder="Notes..." style={{ ...S.input, fontSize: 12 }} />
                      <div style={{ display: 'flex', gap: 6 }}><button onClick={saveEditTpl} style={{ ...S.btn, ...S.btnP, ...S.btnSm }}>Save</button><button onClick={() => setEditingTpl(null)} style={{ ...S.btn, ...S.btnSm }}>Cancel</button></div>
                    </div>
                  ) : (
                    <>
                      <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => applyTemplate(t)}>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{t.title}</div>
                        {t.notes && <div style={{ fontSize: 11, color: 'var(--text2)' }}>{t.notes}</div>}
                        <div style={{ display: 'flex', gap: 6, marginTop: 3 }}>
                          {t.category && <span style={S.badge('var(--accent2)')}>{t.category}</span>}
                          <span style={S.badge(PRI_COLOR[t.priority] || 'var(--text2)')}>{t.priority}</span>
                        </div>
                      </div>
                      <button onClick={() => setEditingTpl({ ...t })} style={{ ...S.btn, ...S.btnSm }}>✏️</button>
                      <button onClick={() => deleteTemplate(t.id)} style={{ ...S.btn, ...S.btnD, ...S.btnSm }}>✕</button>
                    </>
                  )}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 8 }}>ADD TEMPLATE</div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 8 }}>
                <input value={newTpl.title} onChange={e => setNewTpl({ ...newTpl, title: e.target.value })} placeholder="Task title" style={{ ...S.input, fontSize: 12 }} />
                <input value={newTpl.category} onChange={e => setNewTpl({ ...newTpl, category: e.target.value })} placeholder="Category" style={{ ...S.input, fontSize: 12 }} />
                <select value={newTpl.priority} onChange={e => setNewTpl({ ...newTpl, priority: e.target.value })} style={{ ...S.select, fontSize: 12 }}><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select>
                <button onClick={addTemplate} style={{ ...S.btn, ...S.btnP, ...S.btnSm }}>Add</button>
              </div>
            </div>
          </div>
        )}
        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
            <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>ASSIGN TO</div><select value={form.assigned_to} onChange={e => setForm({ ...form, assigned_to: e.target.value })} style={S.select}><option value="">Select person...</option>{eligible.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}</select></div>
            <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>PRIORITY</div><select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} style={S.select}><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></div>
          </div>
          <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>TASK</div><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="What needs to be done?" style={S.input} onKeyDown={e => e.key === 'Enter' && submit()} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
            <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>NOTES</div><input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Additional details..." style={S.input} /></div>
            <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>DUE DATE</div><input type="date" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} style={S.input} /></div>
          </div>
          {formErr && <div style={{ fontSize: 12, color: 'var(--red)' }}>{formErr}</div>}
          <button onClick={submit} style={{ ...S.btn, ...S.btnP, width: 'fit-content' }}>Assign Task</button>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        <button onClick={() => setFilter('all')} style={{ ...S.btn, ...S.btnSm, borderColor: filter === 'all' ? 'var(--accent)' : 'var(--border2)', color: filter === 'all' ? 'var(--accent2)' : 'var(--text2)' }}>All</button>
        {eligible.map(u => <button key={u.id} onClick={() => setFilter(u.id)} style={{ ...S.btn, ...S.btnSm, borderColor: filter === u.id ? 'var(--accent)' : 'var(--border2)', color: filter === u.id ? 'var(--accent2)' : 'var(--text2)' }}>{u.name}</button>)}
      </div>
      <div style={S.card}><div style={S.cardTitle}>Open ({filt(open).length})</div>{filt(open).length === 0 && <div style={{ fontSize: 13, color: 'var(--text2)' }}>No open tasks.</div>}{filt(open).map(t => <TItem key={t.id} task={t} user={user} users={users} onToggle={onToggle} onDelete={onDelete} onReassign={onReassign} isMgr={true} />)}</div>
      {filt(done).length > 0 && <div style={S.card}><div style={S.cardTitle}>✅ Completed ({filt(done).length})</div>{filt(done).map(t => <TItem key={t.id} task={t} user={user} users={users} onToggle={onToggle} onDelete={onDelete} onReassign={onReassign} isMgr={true} />)}</div>}
    </div>
  )
}

// ── PARTS PAGE (read only for staff) ──

function PartsPage({ user, parts, onAdd, onToggle, onDelete, isMgr }) {
  const [form, setForm] = useState({ part_name: '', brand: '', qty: 1, reason: '', priority: 'medium', ticket: '' })
  const submit = () => { if (!form.part_name.trim()) return; onAdd(form); setForm({ part_name: '', brand: '', qty: 1, reason: '', priority: 'medium', ticket: '' }) }
  const pending = parts.filter(p => !p.ordered)
  const ordered = parts.filter(p => p.ordered)
  return (
    <div style={S.page}>
      <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>🔩 Parts to Order</div>
      <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 22 }}>Track parts that need to be sourced or reordered</div>
      {isMgr && (
        <div style={S.card}>
          <div style={S.cardTitle}>Add Part</div>
          <div style={{ display: 'grid', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 80px', gap: 12 }}>
              <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>PART NAME</div><input value={form.part_name} onChange={e => setForm({ ...form, part_name: e.target.value })} placeholder="e.g. Brake caliper BR-M315" style={S.input} /></div>
              <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>BRAND</div><input value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} placeholder="e.g. Shimano" style={S.input} /></div>
              <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>QTY</div><input type="number" min="1" value={form.qty} onChange={e => setForm({ ...form, qty: parseInt(e.target.value) || 1 })} style={S.input} /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>TICKET #</div><input value={form.ticket} onChange={e => setForm({ ...form, ticket: e.target.value })} placeholder="e.g. TKT-2204" style={S.input} /></div>
              <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>REASON</div><input value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} placeholder="Why is this needed?" style={S.input} /></div>
              <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>PRIORITY</div><select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} style={S.select}><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></div>
            </div>
            <button onClick={submit} style={{ ...S.btn, ...S.btnP, width: 'fit-content' }}>Add to List</button>
          </div>
        </div>
      )}
      {!isMgr && <div style={{ ...S.card, fontSize: 13, color: 'var(--text2)', marginBottom: 14 }}>📋 Read only — contact a manager to add or update parts.</div>}
      <div style={S.card}>
        <div style={S.cardTitle}>Pending ({pending.length})</div>
        {pending.length === 0 && <div style={{ fontSize: 13, color: 'var(--text2)' }}>Nothing pending.</div>}
        {pending.map(p => (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{p.part_name} <span style={{ color: 'var(--text2)', fontWeight: 400 }}>×{p.qty}</span></div>
              <div style={{ display: 'flex', gap: 10, marginTop: 3, flexWrap: 'wrap' }}>
                {p.brand && <span style={{ fontSize: 12, color: 'var(--text2)' }}>{p.brand}</span>}
                {p.ticket && <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>Ticket: {p.ticket}</span>}
                {p.reason && <span style={{ fontSize: 12, color: 'var(--text2)' }}>{p.reason}</span>}
              </div>
              <div style={{ marginTop: 5 }}><span style={S.badge(PRI_COLOR[p.priority])}>{p.priority}</span></div>
            </div>
            {isMgr && <>
              <button onClick={() => onToggle(p)} style={{ ...S.btn, ...S.btnSm, ...S.btnG }}>Mark Ordered</button>
              <button onClick={() => onDelete(p.id)} style={{ ...S.btn, ...S.btnD, ...S.btnSm }}>✕</button>
            </>}
          </div>
        ))}
      </div>
      {ordered.length > 0 && <div style={S.card}>
        <div style={S.cardTitle}>Ordered ({ordered.length})</div>
        {ordered.map(p => (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: '1px solid var(--border)', opacity: 0.45 }}>
            <div style={{ flex: 1, fontSize: 14 }}>{p.part_name} ×{p.qty}{p.brand && <span style={{ color: 'var(--text2)', fontSize: 12 }}> — {p.brand}</span>}</div>
            {isMgr && <button onClick={() => onDelete(p.id)} style={{ ...S.btn, ...S.btnD, ...S.btnSm }}>✕</button>}
          </div>
        ))}
      </div>}
    </div>
  )
}

// ── BIKES PAGE (read only for staff) ──

function BikesPage({ user, bikes, onAdd, onToggle, onDelete, isMgr }) {
  const [form, setForm] = useState({ brand: '', model: '', qty: 1, reason: '', priority: 'medium' })
  const submit = () => { if (!form.model.trim()) return; onAdd(form); setForm({ brand: '', model: '', qty: 1, reason: '', priority: 'medium' }) }
  const pending = bikes.filter(b => !b.ordered)
  const ordered = bikes.filter(b => b.ordered)
  return (
    <div style={S.page}>
      <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>🚲 Bikes to Order</div>
      <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 22 }}>Track bikes that need to be sourced or reordered</div>
      {isMgr && (
        <div style={S.card}>
          <div style={S.cardTitle}>Add Bike</div>
          <div style={{ display: 'grid', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px', gap: 12 }}>
              <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>BRAND</div><input value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} placeholder="e.g. Aventon" style={S.input} /></div>
              <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>MODEL</div><input value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} placeholder="e.g. Pace 500.3" style={S.input} /></div>
              <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>QTY</div><input type="number" min="1" value={form.qty} onChange={e => setForm({ ...form, qty: parseInt(e.target.value) || 1 })} style={S.input} /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
              <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>REASON</div><input value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} placeholder="Why is this needed?" style={S.input} /></div>
              <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>PRIORITY</div><select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} style={S.select}><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></div>
            </div>
            <button onClick={submit} style={{ ...S.btn, ...S.btnP, width: 'fit-content' }}>Add to List</button>
          </div>
        </div>
      )}
      {!isMgr && <div style={{ ...S.card, fontSize: 13, color: 'var(--text2)', marginBottom: 14 }}>📋 Read only — contact a manager to add or update bikes.</div>}
      <div style={S.card}>
        <div style={S.cardTitle}>Pending ({pending.length})</div>
        {pending.length === 0 && <div style={{ fontSize: 13, color: 'var(--text2)' }}>Nothing pending.</div>}
        {pending.map(b => (
          <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{b.brand} {b.model} <span style={{ color: 'var(--text2)', fontWeight: 400 }}>×{b.qty}</span></div>
              {b.reason && <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>{b.reason}</div>}
              <div style={{ marginTop: 5 }}><span style={S.badge(PRI_COLOR[b.priority])}>{b.priority}</span></div>
            </div>
            {isMgr && <>
              <button onClick={() => onToggle(b)} style={{ ...S.btn, ...S.btnSm, ...S.btnG }}>Mark Ordered</button>
              <button onClick={() => onDelete(b.id)} style={{ ...S.btn, ...S.btnD, ...S.btnSm }}>✕</button>
            </>}
          </div>
        ))}
      </div>
      {ordered.length > 0 && <div style={S.card}>
        <div style={S.cardTitle}>Ordered ({ordered.length})</div>
        {ordered.map(b => (
          <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: '1px solid var(--border)', opacity: 0.45 }}>
            <div style={{ flex: 1, fontSize: 14 }}>{b.brand} {b.model} ×{b.qty}</div>
            {isMgr && <button onClick={() => onDelete(b.id)} style={{ ...S.btn, ...S.btnD, ...S.btnSm }}>✕</button>}
          </div>
        ))}
      </div>}
    </div>
  )
}

// ── INCOMING SHIPMENTS PAGE ──

function ShipmentsPage({ user, isMgr }) {
  const [shipments, setShipments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [file, setFile] = useState(null)
  const [extracting, setExtracting] = useState(false)
  const [form, setForm] = useState({ supplier: '', items: [], expected_date: '', notes: '', status: 'In Transit' })
  const [saving, setSaving] = useState(false)
  const fileRef = useRef()

  const fetchShipments = async () => {
    setLoading(true)
    const { data } = await sb.from('shipments').select('*').order('created_at', { ascending: false })
    setShipments(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchShipments() }, [])

  const extractFromInvoice = async () => {
    if (!file) return
    setExtracting(true)
    try {
      let invoiceUrl = ''
      if (file.type.startsWith('image/')) {
        invoiceUrl = await uploadToSupabase(file, 'invoices')
      }
      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64 = e.target.result.split(',')[1]
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1000,
            messages: [{
              role: 'user',
              content: [
                { type: 'image', source: { type: 'base64', media_type: file.type, data: base64 } },
                { type: 'text', text: 'Extract the key information from this supplier invoice. Return ONLY a JSON object with these fields: supplier (string), items (array of objects with name, qty, description), expected_date (string or null), notes (any relevant notes). No preamble, just JSON.' }
              ]
            }]
          })
        })
        const data = await res.json()
        const text = data?.content?.[0]?.text || '{}'
        try {
          const clean = text.replace(/```json|```/g, '').trim()
          const parsed = JSON.parse(clean)
          setForm(f => ({ ...f, supplier: parsed.supplier || '', items: parsed.items || [], expected_date: parsed.expected_date || '', notes: parsed.notes || '' }))
        } catch (e) {
          console.error('Parse error', e)
        }
        setExtracting(false)
      }
      reader.readAsDataURL(file)
    } catch (e) {
      setExtracting(false)
    }
  }

  const submit = async () => {
    if (!form.supplier.trim()) return
    setSaving(true)
    let invoiceUrl = ''
    if (file) {
      try { invoiceUrl = await uploadToSupabase(file, 'invoices') } catch (e) { }
    }
    const item = { id: uid(), ...form, invoice_url: invoiceUrl, added_by: user.name, created_at: nowISO() }
    await sb.from('shipments').insert(item)
    setShipments(s => [item, ...s])
    setForm({ supplier: '', items: [], expected_date: '', notes: '', status: 'In Transit' })
    setFile(null); setSaving(false); setShowForm(false)
  }

  const updateStatus = async (id, status) => {
    setShipments(s => s.map(x => x.id === id ? { ...x, status } : x))
    await sb.from('shipments').update({ status }).eq('id', id)
  }

  const active = shipments.filter(s => s.status !== 'Complete')
  const completed = shipments.filter(s => s.status === 'Complete')

  return (
    <div style={S.page}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 600 }}>📬 Incoming Shipments</div>
          <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 4 }}>Track what is on its way — upload an invoice and Claude reads it for you</div>
        </div>
        {isMgr && <button onClick={() => setShowForm(!showForm)} style={{ ...S.btn, ...S.btnP }}>+ Add Shipment</button>}
      </div>

      {showForm && isMgr && (
        <div style={S.card}>
          <div style={S.cardTitle}>New Incoming Shipment</div>
          <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 'var(--rs)', padding: '12px 14px', marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: 'var(--accent2)', fontFamily: 'var(--mono)', marginBottom: 8 }}>✨ UPLOAD INVOICE — CLAUDE WILL READ IT</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <input ref={fileRef} type="file" accept="image/*,application/pdf" onChange={e => setFile(e.target.files[0])} style={{ display: 'none' }} />
              <button onClick={() => fileRef.current?.click()} style={S.btn}>{file ? `📄 ${file.name}` : '📎 Choose Invoice'}</button>
              {file && <button onClick={extractFromInvoice} disabled={extracting} style={{ ...S.btn, ...S.btnP, opacity: extracting ? 0.6 : 1 }}>{extracting ? 'Reading...' : '✨ Extract Info'}</button>}
              {file && <button onClick={() => setFile(null)} style={{ ...S.btn, ...S.btnD, ...S.btnSm }}>✕</button>}
            </div>
            {extracting && <div style={{ fontSize: 12, color: 'var(--accent2)', marginTop: 8 }}>Claude is reading the invoice...</div>}
          </div>
          <div style={{ display: 'grid', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>SUPPLIER</div><input value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })} placeholder="e.g. Leon Cycle" style={S.input} /></div>
              <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>EXPECTED DATE</div><input type="date" value={form.expected_date} onChange={e => setForm({ ...form, expected_date: e.target.value })} style={S.input} /></div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 8 }}>ITEMS IN SHIPMENT</div>
              {form.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                  <input value={item.name || ''} onChange={e => setForm(f => ({ ...f, items: f.items.map((x, j) => j === i ? { ...x, name: e.target.value } : x) }))} placeholder="Item name" style={{ ...S.input, flex: 2 }} />
                  <input value={item.qty || ''} onChange={e => setForm(f => ({ ...f, items: f.items.map((x, j) => j === i ? { ...x, qty: e.target.value } : x) }))} placeholder="Qty" style={{ ...S.input, flex: 0, width: 60 }} />
                  <button onClick={() => setForm(f => ({ ...f, items: f.items.filter((_, j) => j !== i) }))} style={{ ...S.btn, ...S.btnD, ...S.btnSm }}>✕</button>
                </div>
              ))}
              <button onClick={() => setForm(f => ({ ...f, items: [...f.items, { name: '', qty: 1 }] }))} style={{ ...S.btn, ...S.btnSm }}>+ Add Item</button>
            </div>
            <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>NOTES</div><textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ ...S.textarea, minHeight: 60 }} /></div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={submit} disabled={saving} style={{ ...S.btn, ...S.btnP, opacity: saving ? 0.6 : 1 }}>{saving ? 'Saving...' : 'Save Shipment'}</button>
              <button onClick={() => setShowForm(false)} style={S.btn}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {loading ? <div style={{ fontSize: 13, color: 'var(--text2)' }}>Loading...</div> : (
        <>
          {active.length === 0 && <div style={{ ...S.card, fontSize: 13, color: 'var(--text2)' }}>No active shipments.</div>}
          {active.map(s => (
            <div key={s.id} style={S.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{s.supplier}</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>Added by {s.added_by} · {fmtDate(s.created_at)}{s.expected_date && ` · Expected ${fmtDate(s.expected_date)}`}</div>
                </div>
                {isMgr && (
                  <select value={s.status} onChange={e => updateStatus(s.id, e.target.value)} style={{ ...S.select, width: 160, fontSize: 12 }}>
                    {SHIPMENT_STATUSES.map(st => <option key={st} value={st}>{st}</option>)}
                  </select>
                )}
                {!isMgr && <span style={S.badge('var(--accent2)')}>{s.status}</span>}
              </div>
              {s.items && s.items.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 6 }}>ITEMS</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {s.items.map((item, i) => (
                      <span key={i} style={{ fontSize: 12, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', padding: '3px 10px' }}>
                        {item.name}{item.qty && ` ×${item.qty}`}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {s.notes && <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 10, padding: '8px 10px', background: 'var(--bg3)', borderRadius: 'var(--rs)' }}>{s.notes}</div>}
              {s.invoice_url && <div style={{ marginTop: 10 }}><a href={s.invoice_url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: 'var(--accent2)', textDecoration: 'none' }}>📄 View Invoice ↗</a></div>}
            </div>
          ))}
          {completed.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 8 }}>COMPLETED SHIPMENTS ({completed.length})</div>
              {completed.map(s => (
                <div key={s.id} style={{ ...S.card, opacity: 0.5 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{s.supplier} · {fmtDate(s.created_at)}</div>
                  {s.items && s.items.length > 0 && <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>{s.items.map(i => i.name).join(', ')}</div>}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ── WARRANTY SYSTEM ──

function WarrantySubmitPage({ user }) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ customer_name: '', customer_phone: '', customer_email: '', preferred_contact: 'text', brand: '', model: '', serial_number: '', purchase_date: '', purchased_from: 'Cloud Ebikes', invoice_not_found: false, problem_category: '', problem_description: '', problem_start: '', bike_rideable: '', third_party_work: false, third_party_notes: '', service_tag: '', supplier: '', internal_notes: '' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const submit = async () => {
    setLoading(true); setError('')
    try {
      const id = 'wc_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7)
      const res = await fetch(`${SUPA_URL}/rest/v1/warranty_claims`, { method: 'POST', headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' }, body: JSON.stringify({ ...form, id, status: 'Submitted', supplier_status: 'Not Contacted', assigned_to: user.name }) })
      if (!res.ok) throw new Error('Failed to save')
      setDone(true)
    } catch (e) { setError(e.message) }
    setLoading(false)
  }

  if (done) return <div style={{ ...S.page, textAlign: 'center', paddingTop: 60 }}><div style={{ fontSize: 48 }}>✅</div><h3 style={{ marginTop: 12 }}>Warranty Claim Logged</h3><p style={{ color: 'var(--text2)', marginTop: 8 }}>The claim has been added to the queue.</p></div>

  return (
    <div style={S.page}>
      <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>🛡️ Submit Warranty Claim</div>
      <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 22 }}>Log a warranty claim on behalf of a customer</div>
      {error && <div style={{ ...S.card, color: 'var(--red)', marginBottom: 14 }}>{error}</div>}
      <div style={S.card}>
        <div style={S.cardTitle}>Customer Info</div>
        <div style={{ display: 'grid', gap: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}><div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 4 }}>NAME</div><input style={S.input} value={form.customer_name} onChange={e => set('customer_name', e.target.value)} /></div><div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 4 }}>PHONE</div><input style={S.input} value={form.customer_phone} onChange={e => set('customer_phone', e.target.value)} /></div></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}><div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 4 }}>EMAIL</div><input style={S.input} type="email" value={form.customer_email} onChange={e => set('customer_email', e.target.value)} /></div><div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 4 }}>PREFERRED CONTACT</div><select style={S.select} value={form.preferred_contact} onChange={e => set('preferred_contact', e.target.value)}><option value="text">Text</option><option value="call">Call</option><option value="email">Email</option></select></div></div>
        </div>
      </div>
      <div style={S.card}>
        <div style={S.cardTitle}>Bike Info</div>
        <div style={{ display: 'grid', gap: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}><div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 4 }}>BRAND</div><select style={S.select} value={form.brand} onChange={e => set('brand', e.target.value)}><option value="">Select...</option>{BRANDS.map(b => <option key={b} value={b}>{b}</option>)}</select></div><div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 4 }}>MODEL</div><input style={S.input} value={form.model} onChange={e => set('model', e.target.value)} /></div></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}><div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 4 }}>SERIAL NUMBER</div><input style={S.input} value={form.serial_number} onChange={e => set('serial_number', e.target.value)} /></div><div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 4 }}>SERVICE TAG</div><input style={S.input} value={form.service_tag} onChange={e => set('service_tag', e.target.value)} placeholder="Optional" /></div></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}><div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 4 }}>PURCHASE DATE</div><input style={S.input} type="date" value={form.purchase_date} onChange={e => set('purchase_date', e.target.value)} /></div><div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 4 }}>PURCHASED FROM</div><select style={S.select} value={form.purchased_from} onChange={e => set('purchased_from', e.target.value)}><option value="Cloud Ebikes">Cloud Ebikes</option><option value="Cloud Ebikes Online">Cloud Ebikes Online</option><option value="Other">Other</option></select></div></div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}><input type="checkbox" checked={form.invoice_not_found} onChange={e => set('invoice_not_found', e.target.checked)} />Invoice not found</label>
        </div>
      </div>
      <div style={S.card}>
        <div style={S.cardTitle}>Problem</div>
        <div style={{ display: 'grid', gap: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}><div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 4 }}>CATEGORY</div><select style={S.select} value={form.problem_category} onChange={e => set('problem_category', e.target.value)}><option value="">Select...</option>{PROBLEM_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div><div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 4 }}>BIKE RIDEABLE?</div><select style={S.select} value={form.bike_rideable} onChange={e => set('bike_rideable', e.target.value)}><option value="">Select...</option><option value="Yes">Yes</option><option value="Partially">Partially</option><option value="No">No</option></select></div></div>
          <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 4 }}>DESCRIPTION</div><textarea style={S.textarea} value={form.problem_description} onChange={e => set('problem_description', e.target.value)} /></div>
          <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 4 }}>WHEN DID IT START?</div><input style={S.input} type="date" value={form.problem_start} onChange={e => set('problem_start', e.target.value)} /></div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer', fontWeight: 600 }}><input type="checkbox" checked={form.third_party_work} onChange={e => set('third_party_work', e.target.checked)} />Third party has worked on this bike</label>
          {form.third_party_work && <textarea style={{ ...S.textarea, minHeight: 60 }} value={form.third_party_notes} onChange={e => set('third_party_notes', e.target.value)} placeholder="Who and what was done..." />}
        </div>
      </div>
      <div style={S.card}>
        <div style={S.cardTitle}>Internal</div>
        <div style={{ display: 'grid', gap: 10 }}>
          <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 4 }}>SUPPLIER</div><input style={S.input} value={form.supplier} onChange={e => set('supplier', e.target.value)} placeholder="e.g. Leon Cycle, Aventon, Bosch" /></div>
          <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 4 }}>INTERNAL NOTES</div><textarea style={S.textarea} value={form.internal_notes} onChange={e => set('internal_notes', e.target.value)} placeholder="Initial assessment, diagnostic notes..." /></div>
        </div>
      </div>
      <button onClick={submit} disabled={loading} style={{ ...S.btn, ...S.btnP, opacity: loading ? 0.6 : 1 }}>{loading ? 'Saving...' : '🛡️ Log Warranty Claim'}</button>
    </div>
  )
}

function WarrantyClaimsPage({ user, isMgr }) {
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('Open')
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [followupDraft, setFollowupDraft] = useState('')
  const [followupCopied, setFollowupCopied] = useState(false)

  const fetchClaims = async () => {
    setLoading(true)
    const { data } = await sb.from('warranty_claims').select('*').order('created_at', { ascending: false })
    setClaims(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { fetchClaims() }, [])

  const openStatuses = ['Submitted', 'Under Review', 'Approved', 'Parts Ordered', 'Repair in Progress', 'Ready for Pickup', 'On Hold']
  const closedStatuses = ['Complete', 'Denied']

  const filtered = claims.filter(c => {
    const matchFilter = filter === 'Open' ? openStatuses.includes(c.status) : closedStatuses.includes(c.status)
    const matchSearch = !search || [c.customer_name, c.brand, c.model, c.problem_category, c.supplier].join(' ').toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const updateClaim = async (id, updates) => {
    setSaving(true)
    setClaims(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c))
    if (selected?.id === id) setSelected(s => ({ ...s, ...updates }))
    await sb.from('warranty_claims').update(updates).eq('id', id)
    setSaving(false)
  }

  const daysSince = (d) => d ? Math.floor((Date.now() - new Date(d)) / 86400000) : null
  const statusColor = (s) => ({ 'Submitted': '#f59e0b', 'Under Review': '#3b82f6', 'Approved': '#8b5cf6', 'Parts Ordered': '#06b6d4', 'Repair in Progress': '#f97316', 'Ready for Pickup': '#22c55e', 'Complete': '#6b7280', 'Denied': '#ef4444', 'On Hold': '#9ca3af' }[s] || '#6b7280')

  const generateFollowup = async (c) => {
    setAiLoading(true); setFollowupDraft('')
    const days = daysSince(c.supplier_last_followup) || daysSince(c.supplier_submitted_date)
    try {
      const text = await askClaude(`Write a short professional warranty follow up email for Cloud Ebikes (Vancouver bike shop) to send to supplier "${c.supplier}".
Claim: ${c.brand} ${c.model}, serial ${c.serial_number}. Problem: ${c.problem_category} — ${c.problem_description}.
Days since last contact: ${days}. Keep it under 120 words. Polite but firm. Sign off as Cloud Ebikes Service Team. Body only, no subject line.`)
      setFollowupDraft(text.trim())
    } catch (e) { setFollowupDraft('Could not generate draft.') }
    setAiLoading(false)
  }

  const copyFollowup = async (c) => {
    await navigator.clipboard.writeText(followupDraft)
    setFollowupCopied(true)
    await updateClaim(c.id, { supplier_last_followup: nowISO() })
    setTimeout(() => setFollowupCopied(false), 2000)
  }

  if (selected) {
    const c = selected
    const days = daysSince(c.supplier_submitted_date)
    const daysFu = daysSince(c.supplier_last_followup)
    const needsFollowup = c.supplier_status === 'Awaiting Supplier Response' && (daysFu || days || 0) >= 7

    return (
      <div style={S.page}>
        <button onClick={() => { setSelected(null); setFollowupDraft('') }} style={{ ...S.btn, ...S.btnSm, marginBottom: 16 }}>← Back to Claims</button>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
          <div><div style={{ fontSize: 20, fontWeight: 700 }}>{c.customer_name}</div><div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>{c.brand} {c.model} · S/N: {c.serial_number}</div></div>
          <span style={{ ...S.badge(statusColor(c.status)), fontSize: 12, padding: '4px 12px' }}>{c.status}</span>
        </div>
        {needsFollowup && <div style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: 'var(--rs)', padding: '10px 14px', marginBottom: 14, fontSize: 13, color: '#f97316', fontWeight: 600 }}>⚠️ {daysFu || days} days with no supplier response — follow up recommended</div>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          <div style={S.card}><div style={S.cardTitle}>Customer</div><div style={{ fontSize: 14 }}>{c.customer_phone}</div><div style={{ fontSize: 14 }}>{c.customer_email}</div><div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>Prefers: {c.preferred_contact}</div></div>
          <div style={S.card}><div style={S.cardTitle}>Claim Details</div><div style={{ fontSize: 14 }}>{c.problem_category}</div><div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>Rideable: {c.bike_rideable}</div>{c.invoice_not_found && <div style={{ fontSize: 12, color: 'var(--amber)', marginTop: 4 }}>⚠️ No invoice</div>}{c.third_party_work && <div style={{ fontSize: 12, color: 'var(--red)', marginTop: 4 }}>⚠️ Third party work done</div>}</div>
        </div>
        <div style={S.card}><div style={S.cardTitle}>Problem Description</div><div style={{ fontSize: 14, lineHeight: 1.65 }}>{c.problem_description}</div></div>
        <div style={S.card}>
          <div style={S.cardTitle}>Internal Processing</div>
          <div style={{ display: 'grid', gap: 10 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 4 }}>STATUS</div><select style={S.select} value={c.status} onChange={e => updateClaim(c.id, { status: e.target.value })}>{WARRANTY_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
              <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 4 }}>ASSIGNED TO</div><input style={S.input} defaultValue={c.assigned_to || ''} onBlur={e => updateClaim(c.id, { assigned_to: e.target.value })} /></div>
            </div>
            <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 4 }}>SERVICE TAG</div><input style={S.input} defaultValue={c.service_tag || ''} onBlur={e => updateClaim(c.id, { service_tag: e.target.value })} placeholder="Lightspeed ticket number" /></div>
            <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 4 }}>DIAGNOSTIC NOTES</div><textarea style={S.textarea} defaultValue={c.diagnostic_notes || ''} onBlur={e => updateClaim(c.id, { diagnostic_notes: e.target.value })} placeholder="Findings from inspection..." /></div>
            <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 4 }}>INTERNAL NOTES</div><textarea style={S.textarea} defaultValue={c.internal_notes || ''} onBlur={e => updateClaim(c.id, { internal_notes: e.target.value })} /></div>
          </div>
        </div>
        <div style={S.card}>
          <div style={S.cardTitle}>Supplier Follow Up</div>
          <div style={{ display: 'grid', gap: 10 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 4 }}>SUPPLIER</div><input style={S.input} defaultValue={c.supplier || ''} onBlur={e => updateClaim(c.id, { supplier: e.target.value })} /></div>
              <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 4 }}>SUPPLIER STATUS</div><select style={S.select} value={c.supplier_status || 'Not Contacted'} onChange={e => updateClaim(c.id, { supplier_status: e.target.value })}>{SUPPLIER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 4 }}>SUBMITTED TO SUPPLIER</div><input style={S.input} type="date" defaultValue={c.supplier_submitted_date || ''} onBlur={e => updateClaim(c.id, { supplier_submitted_date: e.target.value, supplier_status: 'Awaiting Supplier Response' })} /></div>
              <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 4 }}>LAST FOLLOW UP</div><input style={S.input} type="date" defaultValue={c.supplier_last_followup ? c.supplier_last_followup.slice(0, 10) : ''} onBlur={e => updateClaim(c.id, { supplier_last_followup: e.target.value })} /></div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer', fontWeight: 600 }}><input type="checkbox" checked={c.supplier_response_received || false} onChange={e => updateClaim(c.id, { supplier_response_received: e.target.checked, supplier_status: e.target.checked ? 'Response Received' : 'Awaiting Supplier Response' })} />Supplier has responded</label>
            {c.supplier && c.supplier_submitted_date && !c.supplier_response_received && (
              <div style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: 'var(--rs)', padding: '14px 16px' }}>
                <div style={{ fontSize: 12, color: 'var(--amber)', fontWeight: 600, marginBottom: 10 }}>📧 Follow Up Email — {daysFu || days} days with no response</div>
                {!followupDraft && <button onClick={() => generateFollowup(c)} disabled={aiLoading} style={{ ...S.btn, ...S.btnA, opacity: aiLoading ? 0.6 : 1 }}>{aiLoading ? 'Drafting...' : '✨ Generate Follow Up Email'}</button>}
                {followupDraft && (
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 6 }}>Review and copy to send from service@cloudebikes.ca</div>
                    <textarea value={followupDraft} onChange={e => setFollowupDraft(e.target.value)} style={{ ...S.textarea, minHeight: 140, border: '1px solid rgba(249,115,22,0.3)' }} />
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <button onClick={() => generateFollowup(c)} style={{ ...S.btn, ...S.btnSm }}>Regenerate</button>
                      <button onClick={() => copyFollowup(c)} style={{ ...S.btn, ...S.btnA, flex: 1, justifyContent: 'center' }}>{followupCopied ? '✅ Copied and Logged' : '📋 Copy and Log Follow Up'}</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {saving && <div style={{ fontSize: 13, color: 'var(--green)', marginTop: 8 }}>Saving...</div>}
      </div>
    )
  }

  return (
    <div style={S.page}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
        <div style={{ fontSize: 22, fontWeight: 600 }}>🛡️ Warranty Claims</div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        {['Open', 'Closed'].map(f => <button key={f} onClick={() => setFilter(f)} style={{ ...S.btn, ...S.btnSm, borderColor: filter === f ? 'var(--accent)' : 'var(--border2)', color: filter === f ? 'var(--accent2)' : 'var(--text2)' }}>{f} ({f === 'Open' ? claims.filter(c => openStatuses.includes(c.status)).length : claims.filter(c => closedStatuses.includes(c.status)).length})</button>)}
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." style={{ ...S.input, maxWidth: 200, marginLeft: 'auto' }} />
      </div>
      {loading ? <div style={{ fontSize: 13, color: 'var(--text2)' }}>Loading...</div> : filtered.length === 0 ? <div style={{ ...S.card, fontSize: 13, color: 'var(--text2)' }}>No {filter.toLowerCase()} claims.</div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(c => {
            const days = daysSince(c.supplier_last_followup) || daysSince(c.supplier_submitted_date)
            const overdue = c.supplier_status === 'Awaiting Supplier Response' && (days || 0) >= 7
            return (
              <div key={c.id} onClick={() => setSelected(c)} style={{ ...S.card, cursor: 'pointer', borderLeft: `3px solid ${overdue ? 'var(--amber)' : statusColor(c.status)}`, marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{c.customer_name}</div>
                    <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>{c.brand} {c.model}</div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                      <span style={S.badge(statusColor(c.status))}>{c.status}</span>
                      {c.problem_category && <span style={S.badge('var(--text2)')}>{c.problem_category}</span>}
                      {c.supplier && <span style={S.badge('var(--accent2)')}>{c.supplier}</span>}
                      {overdue && <span style={S.badge('var(--amber)')}>⚠️ Follow up needed</span>}
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text3)', textAlign: 'right' }}>{fmtDate(c.created_at)}{c.assigned_to && <div style={{ marginTop: 4 }}>{c.assigned_to}</div>}</div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── REMAINING PAGES (unchanged from original) ──

function BuildsPage({ user, users, builds, onAdd, onUpdate, onDelete }) {
  const [tab, setTab] = useState('active')
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ order_number: '', bike_description: '', customer_name: '', customer_phone: '', pickup_date: '', notes: '', status: 'Waiting for Bike', assigned_to: '' })
  const activeUsers = users.filter(u => u.active)
  const submit = () => { if (!form.bike_description.trim()) return; onAdd({ ...form, assigned_by: user.id, contact_status: 'Not Contacted' }); setForm({ order_number: '', bike_description: '', customer_name: '', customer_phone: '', pickup_date: '', notes: '', status: 'Waiting for Bike', assigned_to: '' }); setShowForm(false); setTab('active') }
  const active = builds.filter(b => b.status !== 'Completed')
  const completed = builds.filter(b => b.status === 'Completed')
  const filterBuilds = (list) => { if (!search.trim()) return list; const q = search.toLowerCase(); return list.filter(b => (b.bike_description || '').toLowerCase().includes(q) || (b.customer_name || '').toLowerCase().includes(q) || (b.order_number || '').toLowerCase().includes(q)) }
  return (
    <div style={S.page}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
        <div><div style={{ fontSize: 22, fontWeight: 600 }}>🔨 Bike Builds</div><div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 4 }}>Track all builds — assign, update status, text customers, view history</div></div>
        <button onClick={() => setShowForm(!showForm)} style={{ ...S.btn, ...S.btnP }}>+ New Build</button>
      </div>
      {showForm && (
        <div style={S.card}>
          <div style={S.cardTitle}>New Bike Build</div>
          <div style={{ display: 'grid', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}><div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>BIKE DESCRIPTION *</div><input value={form.bike_description} onChange={e => setForm({ ...form, bike_description: e.target.value })} placeholder="e.g. Aventon Pace 500.3 — Blue" style={S.input} /></div><div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>ORDER NUMBER</div><input value={form.order_number} onChange={e => setForm({ ...form, order_number: e.target.value })} placeholder="e.g. LS-10482" style={S.input} /></div></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}><div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>CUSTOMER NAME</div><input value={form.customer_name} onChange={e => setForm({ ...form, customer_name: e.target.value })} placeholder="Customer name" style={S.input} /></div><div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>CUSTOMER PHONE</div><input value={form.customer_phone} onChange={e => setForm({ ...form, customer_phone: e.target.value })} placeholder="604-555-1234" style={S.input} /></div></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}><div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>PICKUP DATE</div><input type="date" value={form.pickup_date} onChange={e => setForm({ ...form, pickup_date: e.target.value })} style={S.input} /></div><div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>STATUS</div><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={S.select}>{BUILD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}</select></div></div>
            <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>ASSIGN TO</div><select value={form.assigned_to} onChange={e => setForm({ ...form, assigned_to: e.target.value })} style={S.select}><option value="">Unassigned</option>{activeUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}</select></div>
            <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>NOTES</div><textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={S.textarea} /></div>
            <div style={{ display: 'flex', gap: 8 }}><button onClick={submit} style={{ ...S.btn, ...S.btnP }}>Create Build</button><button onClick={() => setShowForm(false)} style={S.btn}>Cancel</button></div>
          </div>
        </div>
      )}
      <div style={{ marginBottom: 14 }}><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by bike, customer, or order number..." style={S.input} /></div>
      <TabRow tabs={[['active', `Active (${active.length})`], ['completed', `History (${completed.length})`]]} active={tab} setActive={setTab} />
      {tab === 'active' && <div>{filterBuilds(active).length === 0 && <div style={{ ...S.card, fontSize: 13, color: 'var(--text2)' }}>No active builds{search ? ' matching your search' : ''}.</div>}{filterBuilds(active).map(b => <BuildCard key={b.id} build={b} users={users} user={user} onUpdate={onUpdate} onDelete={onDelete} />)}</div>}
      {tab === 'completed' && <div><div style={{ ...S.card, marginBottom: 14, background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)' }}><div style={{ fontSize: 13, color: 'var(--text2)' }}><strong style={{ color: 'var(--green)' }}>{completed.length}</strong> builds completed · Full history</div></div>{filterBuilds(completed).length === 0 && <div style={{ ...S.card, fontSize: 13, color: 'var(--text2)' }}>No completed builds{search ? ' matching your search' : ''}.</div>}{filterBuilds(completed).map(b => <BuildCard key={b.id} build={b} users={users} user={user} onUpdate={onUpdate} onDelete={onDelete} />)}</div>}
    </div>
  )
}

function TasksPage({ user, tasks, users, onToggle, onDelete, onReassign, isMgr }) {
  const open = tasks.filter(t => !t.done)
  const done = tasks.filter(t => t.done)
  return (
    <div style={S.page}>
      <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>✅ My Tasks</div>
      <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 22 }}>Tasks assigned to you</div>
      <div style={S.card}><div style={S.cardTitle}>Open ({open.length})</div>{open.length === 0 && <div style={{ fontSize: 13, color: 'var(--text2)', padding: '8px 0' }}>No open tasks — all caught up.</div>}{open.map(t => <TItem key={t.id} task={t} user={user} users={users} onToggle={onToggle} onDelete={onDelete} onReassign={onReassign} isMgr={isMgr} />)}</div>
      {done.length > 0 && <div style={S.card}><div style={S.cardTitle}>✅ Completed ({done.length})</div>{done.map(t => <TItem key={t.id} task={t} user={user} users={users} onToggle={onToggle} onDelete={onDelete} onReassign={onReassign} isMgr={isMgr} />)}</div>}
    </div>
  )
}

function SendPage({ user, messages, onSend, onRead, users }) {
  const [type, setType] = useState('parts_request')
  const [body, setBody] = useState('')
  const [tab, setTab] = useState('send')
  const mine = [...messages].filter(m => m.sender_id === user.id)
  const send = () => { if (!body.trim()) return; onSend({ type, body }); setBody(''); setTab('sent') }
  return (
    <div style={S.page}>
      <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>💬 Messages</div>
      <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 18 }}>Send requests and notes to management</div>
      <TabRow tabs={[['send', 'New Message'], ['sent', 'My Messages']]} active={tab} setActive={setTab} />
      {tab === 'send' && <div style={S.card}><div style={S.cardTitle}>New Message to Management</div><div style={{ display: 'grid', gap: 12 }}><div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>TYPE</div><select value={type} onChange={e => setType(e.target.value)} style={S.select}>{MSG_TYPES.map(t => <option key={t} value={t}>{MSG_ICONS[t]} {MSG_LABELS[t]}</option>)}</select></div><div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>MESSAGE</div><textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Describe your request..." style={S.textarea} /></div><button onClick={send} style={{ ...S.btn, ...S.btnP, width: 'fit-content' }}>Send to Management</button></div></div>}
      {tab === 'sent' && <div>{mine.length === 0 && <div style={{ ...S.card, fontSize: 13, color: 'var(--text2)' }}>No messages sent yet.</div>}{mine.map(m => <MItem key={m.id} msg={m} users={users} currentUser={user} onRead={onRead} onReply={() => { }} isMgr={false} />)}</div>}
    </div>
  )
}

function InboxPage({ user, messages, users, onRead, onReply }) {
  const sorted = [...messages].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  const unread = sorted.filter(m => !(m.read_by || []).includes(user.id)).length
  return (
    <div style={S.page}>
      <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>📥 Team Inbox</div>
      <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 22 }}>{unread} unread · {sorted.length} total</div>
      {sorted.length === 0 && <div style={{ ...S.card, fontSize: 13, color: 'var(--text2)' }}>No messages yet.</div>}
      {sorted.map(m => <MItem key={m.id} msg={m} users={users} currentUser={user} onRead={onRead} onReply={onReply} isMgr={true} />)}
    </div>
  )
}

function TemplatesPage({ isMgr }) {
  const [templates, setTemplates] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [editing, setEditing] = useState(null)
  const [newForm, setNewForm] = useState({ label: '', category: '', body: '' })
  const [showNew, setShowNew] = useState(false)
  const [copied, setCopied] = useState(null)
  const [filter, setFilter] = useState('All')
  useEffect(() => { sb.from('content').select('*').eq('key', 'msg_templates').single().then(({ data }) => setTemplates(data ? JSON.parse(data.value) : DEFAULT_TEMPLATES)).catch(() => setTemplates(DEFAULT_TEMPLATES)) }, [])
  const save = async (next) => { setTemplates(next); await sb.from('content').upsert({ key: 'msg_templates', value: JSON.stringify(next) }, { onConflict: 'key' }) }
  const copy = (t) => { navigator.clipboard.writeText(t.body).then(() => { setCopied(t.id); setTimeout(() => setCopied(null), 2000) }) }
  const saveEdit = () => { save(templates.map(t => t.id === editing.id ? editing : t)); setEditing(null) }
  const deleteTemplate = (id) => save(templates.filter(t => t.id !== id))
  const addTemplate = () => { if (!newForm.label.trim() || !newForm.body.trim()) return; save([...templates, { ...newForm, id: uid() }]); setNewForm({ label: '', category: '', body: '' }); setShowNew(false) }
  if (!templates) return <div style={{ fontSize: 13, color: 'var(--text2)', padding: 28 }}>Loading...</div>
  const categories = ['All', ...[...new Set(templates.map(t => t.category).filter(Boolean))]]
  const filtered = filter === 'All' ? templates : templates.filter(t => t.category === filter)
  return (
    <div style={S.page}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
        <div><div style={{ fontSize: 22, fontWeight: 600 }}>💬 Message Templates</div><div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 4 }}>Tap Copy to copy any template</div></div>
        {isMgr && <div style={{ display: 'flex', gap: 8 }}><button onClick={() => setShowNew(!showNew)} style={{ ...S.btn, ...S.btnP }}>+ New</button><button onClick={() => setEditMode(!editMode)} style={{ ...S.btn, ...(editMode ? S.btnP : {}) }}>{editMode ? 'Done' : '✏️ Edit'}</button></div>}
      </div>
      {showNew && <div style={S.card}><div style={S.cardTitle}>New Template</div><div style={{ display: 'grid', gap: 12 }}><div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}><div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>TEMPLATE NAME</div><input value={newForm.label} onChange={e => setNewForm({ ...newForm, label: e.target.value })} style={S.input} /></div><div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>CATEGORY</div><input value={newForm.category} onChange={e => setNewForm({ ...newForm, category: e.target.value })} style={S.input} /></div></div><div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>MESSAGE</div><textarea value={newForm.body} onChange={e => setNewForm({ ...newForm, body: e.target.value })} style={{ ...S.textarea, minHeight: 120 }} /></div><div style={{ display: 'flex', gap: 8 }}><button onClick={addTemplate} style={{ ...S.btn, ...S.btnP }}>Save Template</button><button onClick={() => setShowNew(false)} style={S.btn}>Cancel</button></div></div></div>}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>{categories.map(c => <button key={c} onClick={() => setFilter(c)} style={{ ...S.btn, ...S.btnSm, borderColor: filter === c ? 'var(--accent)' : 'var(--border2)', color: filter === c ? 'var(--accent2)' : 'var(--text2)' }}>{c}</button>)}</div>
      <div style={{ display: 'grid', gap: 12 }}>{filtered.map(t => { const isEdit = editMode && editing?.id === t.id; return (<div key={t.id} style={{ ...S.card, marginBottom: 0, borderLeft: '3px solid var(--accent)' }}>{isEdit ? (<div style={{ display: 'grid', gap: 12 }}><div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}><div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>TEMPLATE NAME</div><input value={editing.label} onChange={e => setEditing({ ...editing, label: e.target.value })} style={S.input} /></div><div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>CATEGORY</div><input value={editing.category || ''} onChange={e => setEditing({ ...editing, category: e.target.value })} style={S.input} /></div></div><div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>MESSAGE</div><textarea value={editing.body} onChange={e => setEditing({ ...editing, body: e.target.value })} style={{ ...S.textarea, minHeight: 120 }} /></div><div style={{ display: 'flex', gap: 8 }}><button onClick={saveEdit} style={{ ...S.btn, ...S.btnP, ...S.btnSm }}>Save</button><button onClick={() => setEditing(null)} style={{ ...S.btn, ...S.btnSm }}>Cancel</button><button onClick={() => deleteTemplate(t.id)} style={{ ...S.btn, ...S.btnD, ...S.btnSm, marginLeft: 'auto' }}>Delete</button></div></div>) : (<div><div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}><div><div style={{ fontSize: 14, fontWeight: 600 }}>{t.label}</div>{t.category && <span style={{ ...S.badge('var(--accent2)'), marginTop: 4, display: 'inline-flex' }}>{t.category}</span>}</div><div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>{editMode && <button onClick={() => setEditing({ ...t })} style={{ ...S.btn, ...S.btnSm }}>✏️</button>}<button onClick={() => copy(t)} style={{ ...S.btn, ...S.btnSm, ...(copied === t.id ? S.btnG : {}) }}>{copied === t.id ? '✓ Copied!' : '📋 Copy'}</button></div></div><div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7, background: 'var(--bg3)', padding: '10px 12px', borderRadius: 'var(--rs)', whiteSpace: 'pre-wrap' }}>{t.body}</div></div>)}</div>) })}</div>
    </div>
  )
}

function UsersPage({ users, onAdd, onToggle, onUpdate, onDelete }) {
  const [form, setForm] = useState({ name: '', code: '', role: 'staff' })
  const [err, setErr] = useState('')
  const [editing, setEditing] = useState(null)
  const [editErr, setEditErr] = useState('')
  const submit = () => { if (!form.name.trim() || form.code.length !== 4) { setErr('Name and 4-digit code required.'); return }; if (users.find(u => u.code === form.code)) { setErr('Code already taken.'); return }; onAdd(form); setForm({ name: '', code: '', role: 'staff' }); setErr('') }
  const saveEdit = () => { if (!editing.name.trim() || editing.code.length !== 4) { setEditErr('Name and 4-digit code required.'); return }; const conflict = users.find(u => u.code === editing.code && u.id !== editing.id); if (conflict) { setEditErr('Code taken by ' + conflict.name + '.'); return }; onUpdate(editing.id, { name: editing.name, code: editing.code }); setEditing(null); setEditErr('') }
  return (
    <div style={S.page}>
      <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>👥 Manage Users</div>
      <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 22 }}>Only the owner can create, edit, or deactivate logins</div>
      <div style={S.card}><div style={S.cardTitle}>Add New User</div><div style={{ display: 'grid', gap: 12 }}><div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12 }}><div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>FULL NAME</div><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Staff member name" style={S.input} /></div><div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>4-DIGIT CODE</div><input value={form.code} onChange={e => setForm({ ...form, code: e.target.value.replace(/\D/g, '').slice(0, 4) })} placeholder="e.g. 2204" style={S.input} maxLength={4} /></div><div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>ROLE</div><select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} style={S.select}><option value="staff">Staff</option><option value="mechanic">Mechanic</option><option value="manager">Manager</option><option value="owner">Owner</option></select></div></div>{err && <div style={{ fontSize: 12, color: 'var(--red)' }}>{err}</div>}<button onClick={submit} style={{ ...S.btn, ...S.btnP, width: 'fit-content' }}>Create Login</button></div></div>
      <div style={S.card}><div style={S.cardTitle}>All Users ({users.length})</div>{users.map(u => (<div key={u.id} style={{ borderBottom: '1px solid var(--border)', padding: '12px 0', opacity: u.active ? 1 : 0.5 }}>{editing?.id === u.id ? (<div style={{ display: 'grid', gap: 10 }}><div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}><div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 4 }}>NAME</div><input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} style={S.input} autoFocus /></div><div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 4 }}>CODE</div><input value={editing.code} onChange={e => setEditing({ ...editing, code: e.target.value.replace(/\D/g, '').slice(0, 4) })} style={S.input} maxLength={4} /></div></div>{editErr && <div style={{ fontSize: 12, color: 'var(--red)' }}>{editErr}</div>}<div style={{ display: 'flex', gap: 8 }}><button onClick={saveEdit} style={{ ...S.btn, ...S.btnP, ...S.btnSm }}>Save</button><button onClick={() => { setEditing(null); setEditErr('') }} style={{ ...S.btn, ...S.btnSm }}>Cancel</button></div></div>) : (<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><div style={S.avatar(ROLE_COLOR[u.role])}>{u.name[0]}</div><div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 500 }}>{u.name}</div><div style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'center', flexWrap: 'wrap' }}><span style={S.badge(ROLE_COLOR[u.role])}>{ROLES[u.role]}</span><span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>Code: {u.code}</span>{!u.active && <span style={S.badge('#ef4444')}>Inactive</span>}</div></div><button onClick={() => setEditing({ id: u.id, name: u.name, code: u.code })} style={{ ...S.btn, ...S.btnSm }}>✏️ Edit</button><button onClick={() => onToggle(u)} style={{ ...S.btn, ...S.btnSm }}>{u.active ? 'Deactivate' : 'Activate'}</button><button onClick={() => onDelete(u.id)} style={{ ...S.btn, ...S.btnD, ...S.btnSm }}>Delete</button></div>)}</div>))}</div>
    </div>
  )
}

// ── MAIN APP ──

export default function App() {
  const [users, setUsers] = useState([])
  const [tasks, setTasks] = useState([])
  const [messages, setMessages] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [bikes, setBikes] = useState([])
  const [parts, setParts] = useState([])
  const [builds, setBuilds] = useState([])
  const [user, setUser] = useState(null)
  const [page, setPage] = useState('home')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const [u, t, m, a, b, p, bl] = await Promise.all([
      sb.from('users').select('*').order('created_at'),
      sb.from('tasks').select('*').order('created_at', { ascending: false }),
      sb.from('messages').select('*').order('created_at', { ascending: false }),
      sb.from('announcements').select('*').order('created_at', { ascending: false }),
      sb.from('bikes').select('*').order('created_at', { ascending: false }),
      sb.from('parts').select('*').order('created_at', { ascending: false }),
      sb.from('builds').select('*').order('created_at', { ascending: false }),
    ])
    const lu = u.data || []
    setUsers(lu); setTasks(t.data || []); setMessages(m.data || [])
    setAnnouncements(a.data || []); setBikes(b.data || []); setParts(p.data || []); setBuilds(bl.data || [])
    const saved = localStorage.getItem('ce_session')
    if (saved) { try { const s = JSON.parse(saved); const live = lu.find(u => u.id === s.id && u.active); if (live) setUser(live); else localStorage.removeItem('ce_session') } catch { localStorage.removeItem('ce_session') } }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    const ref = (table, setter) => () => sb.from(table).select('*').order('created_at', { ascending: false }).then(r => setter(r.data || []))
    const reloadUsers = () => sb.from('users').select('*').order('created_at').then(r => {
      const live = r.data || []; setUsers(live)
      const saved = localStorage.getItem('ce_session')
      if (saved) { try { const s = JSON.parse(saved); const fresh = live.find(u => u.id === s.id); if (fresh && fresh.active) { setUser(fresh); localStorage.setItem('ce_session', JSON.stringify(fresh)) } else { setUser(null); localStorage.removeItem('ce_session') } } catch { } }
    })
    const ch = sb.channel('ce_rt_' + Math.random().toString(36).slice(2, 6))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, ref('tasks', setTasks))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, ref('messages', setMessages))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, ref('announcements', setAnnouncements))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, reloadUsers)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bikes' }, ref('bikes', setBikes))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'parts' }, ref('parts', setParts))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'builds' }, ref('builds', setBuilds))
      .subscribe()
    return () => sb.removeChannel(ch)
  }, [])

  const isOwner = user?.role === 'owner'
  const isMgr = isOwner || user?.role === 'manager'
  const myTasks = tasks.filter(t => t.assigned_to === user?.id)
  const unread = messages.filter(m => !(m.read_by || []).includes(user?.id)).length
  const pendingBuilds = builds.filter(b => b.status !== 'Completed').length

  const addTask = async (f) => { const item = { id: uid(), ...f, done: false, created_at: nowISO() }; setTasks(p => [item, ...p]); const { error } = await sb.from('tasks').insert(item); if (error) alert('Error saving task: ' + error.message) }
  const toggleTask = async (t) => { setTasks(p => p.map(x => x.id === t.id ? { ...x, done: !x.done } : x)); await sb.from('tasks').update({ done: !t.done }).eq('id', t.id) }
  const deleteTask = async (id) => { setTasks(p => p.filter(x => x.id !== id)); await sb.from('tasks').delete().eq('id', id) }
  const reassignTask = async (id, to) => { setTasks(p => p.map(x => x.id === id ? { ...x, assigned_to: to } : x)); await sb.from('tasks').update({ assigned_to: to }).eq('id', id) }
  const sendMsg = async (f) => { const item = { id: uid(), ...f, sender_id: user.id, read_by: [user.id], replies: [], created_at: nowISO() }; setMessages(p => [item, ...p]); await sb.from('messages').insert(item) }
  const readMsg = async (m) => { const rb = [...(m.read_by || []), user.id]; setMessages(p => p.map(x => x.id === m.id ? { ...x, read_by: rb } : x)); await sb.from('messages').update({ read_by: rb }).eq('id', m.id) }
  const replyMsg = async (m, body) => { const rep = [...(m.replies || []), { sender_id: user.id, body, created_at: nowISO() }]; setMessages(p => p.map(x => x.id === m.id ? { ...x, replies: rep } : x)); await sb.from('messages').update({ replies: rep }).eq('id', m.id) }
  const addAnnounce = async (f) => { const item = { id: uid(), ...f, author: user.name, created_at: nowISO() }; setAnnouncements(p => [item, ...p]); await sb.from('announcements').insert(item) }
  const deleteAnnounce = async (id) => { setAnnouncements(p => p.filter(x => x.id !== id)); await sb.from('announcements').delete().eq('id', id) }
  const addUser = async (f) => { const item = { id: uid(), ...f, active: true, created_at: nowISO() }; setUsers(p => [...p, item]); await sb.from('users').insert(item) }
  const toggleUser = async (u) => { setUsers(p => p.map(x => x.id === u.id ? { ...x, active: !x.active } : x)); await sb.from('users').update({ active: !u.active }).eq('id', u.id) }
  const updateUser = async (id, fields) => { setUsers(p => p.map(x => x.id === id ? { ...x, ...fields } : x)); if (user.id === id) { const up = { ...user, ...fields }; setUser(up); localStorage.setItem('ce_session', JSON.stringify(up)) } await sb.from('users').update(fields).eq('id', id) }
  const deleteUser = async (id) => { setUsers(p => p.filter(x => x.id !== id)); await sb.from('users').delete().eq('id', id) }
  const addBike = async (f) => { const item = { id: uid(), ...f, added_by: user.id, ordered: false, created_at: nowISO() }; setBikes(p => [item, ...p]); await sb.from('bikes').insert(item) }
  const toggleBike = async (b) => { setBikes(p => p.map(x => x.id === b.id ? { ...x, ordered: !x.ordered } : x)); await sb.from('bikes').update({ ordered: !b.ordered }).eq('id', b.id) }
  const deleteBike = async (id) => { setBikes(p => p.filter(x => x.id !== id)); await sb.from('bikes').delete().eq('id', id) }
  const addPart = async (f) => { const item = { id: uid(), ...f, added_by: user.id, ordered: false, created_at: nowISO() }; setParts(p => [item, ...p]); await sb.from('parts').insert(item) }
  const togglePart = async (p) => { setParts(prev => prev.map(x => x.id === p.id ? { ...x, ordered: !x.ordered } : x)); await sb.from('parts').update({ ordered: !p.ordered }).eq('id', p.id) }
  const deletePart = async (id) => { setParts(p => p.filter(x => x.id !== id)); await sb.from('parts').delete().eq('id', id) }
  const addBuild = async (f) => { const item = { id: uid(), ...f, created_at: nowISO() }; setBuilds(p => [item, ...p]); const { error } = await sb.from('builds').insert(item); if (error) alert('Error saving build: ' + error.message) }
  const updateBuild = async (id, fields) => { setBuilds(p => p.map(x => x.id === id ? { ...x, ...fields } : x)); await sb.from('builds').update(fields).eq('id', id) }
  const deleteBuild = async (id) => { setBuilds(p => p.filter(x => x.id !== id)); await sb.from('builds').delete().eq('id', id) }

  if (loading) return <Spinner />
  if (!user) return <LoginScreen users={users} onLogin={u => { setUser(u); localStorage.setItem('ce_session', JSON.stringify(u)); setPage('home') }} />
  const lock = () => { setUser(null); localStorage.removeItem('ce_session') }
  const P = ({ id, children }) => page === id ? children : null

  return (
    <div style={S.shell}>
      <Sidebar user={user} page={page} setPage={setPage} unread={unread} onLock={lock} pendingBuilds={pendingBuilds} />
      <main style={S.main}>
        <P id="home"><HomePage user={user} announcements={announcements} myTasks={myTasks} builds={builds} users={users} /></P>
        <P id="tasks"><TasksPage user={user} tasks={myTasks} users={users} onToggle={toggleTask} onDelete={deleteTask} onReassign={reassignTask} isMgr={isMgr} /></P>
        <P id="timeclock"><TimeclockPage user={user} isMgr={isMgr} users={users} /></P>
        <P id="messages"><SendPage user={user} messages={messages} users={users} onSend={sendMsg} onRead={readMsg} /></P>
        <P id="builds"><BuildsPage user={user} users={users} builds={builds} onAdd={addBuild} onUpdate={updateBuild} onDelete={deleteBuild} /></P>
        <P id="templates"><TemplatesPage isMgr={isMgr} /></P>
        <P id="parts"><PartsPage user={user} parts={parts} onAdd={addPart} onToggle={togglePart} onDelete={deletePart} isMgr={isMgr} /></P>
        <P id="bikes"><BikesPage user={user} bikes={bikes} onAdd={addBike} onToggle={toggleBike} onDelete={deleteBike} isMgr={isMgr} /></P>
        <P id="shipments"><ShipmentsPage user={user} isMgr={isMgr} /></P>
        <P id="warranty-submit"><WarrantySubmitPage user={user} /></P>
        <P id="announcements">
          <div style={S.page}>
            <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>📢 Announcements</div>
            <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 22 }}>From ownership and management</div>
            <div style={S.card}>{announcements.filter(a => !a.expires_at || new Date(a.expires_at) > new Date()).length === 0 && <div style={{ fontSize: 13, color: 'var(--text2)' }}>No announcements yet.</div>}{announcements.map(a => <ACard key={a.id} a={a} />)}</div>
          </div>
        </P>
        <P id="opening">
          <div style={S.page}>
            <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>🔓 Store Open / Close</div>
            <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 18 }}>Opening and closing checklists</div>
            <TabRow tabs={[['open', '🔓 Opening'], ['close', '🔒 Closing']]} active="open" setActive={() => { }} />
            <EditableChecklist listKey="opening" defaultItems={OPENING} isMgr={isMgr} />
          </div>
        </P>
        <P id="checklist">
          <div style={S.page}>
            <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>📋 Daily Checklist</div>
            <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 18 }}>Morning, midday, and closing</div>
            <StoreOpenClose isMgr={isMgr} />
          </div>
        </P>
        <P id="workshop"><WorkshopGuidesPage isMgr={isMgr} /></P>
        <P id="salesguide">
          <div style={S.page}>
            <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>💡 Sales Guides</div>
            <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 18 }}>How to answer customer questions and handle objections — editable by management</div>
            <EditableSteps listKey="salesguide" defaultSections={DEFAULT_SALES_GUIDE} isMgr={isMgr} />
          </div>
        </P>
        {isMgr && <P id="assign"><AssignPage user={user} users={users} tasks={tasks} onAdd={addTask} onToggle={toggleTask} onDelete={deleteTask} onReassign={reassignTask} /></P>}
        {isMgr && <P id="inbox"><InboxPage user={user} messages={messages} users={users} onRead={readMsg} onReply={replyMsg} /></P>}
        {isMgr && <P id="broadcast"><BroadcastPage user={user} announcements={announcements} onAdd={addAnnounce} onDelete={deleteAnnounce} /></P>}
        {isMgr && <P id="warranty-claims"><WarrantyClaimsPage user={user} isMgr={isMgr} /></P>}
        {isMgr && <P id="hours"><StaffHoursPage users={users} /></P>}
        {isOwner && <P id="users"><UsersPage users={users} onAdd={addUser} onToggle={toggleUser} onUpdate={updateUser} onDelete={deleteUser} /></P>}
      </main>
      <style>{`
        :root{--bg:#0f1117;--bg2:#181c25;--bg3:#1e2330;--border:rgba(255,255,255,0.07);--border2:rgba(255,255,255,0.13);--accent:#3b82f6;--accent2:#60a5fa;--green:#22c55e;--amber:#f59e0b;--red:#ef4444;--purple:#a855f7;--text:#f1f5f9;--text2:#94a3b8;--text3:#4b5563;--font:'DM Sans',sans-serif;--mono:'DM Mono',monospace;--r:12px;--rs:8px;}
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:var(--bg);color:var(--text);font-family:var(--font);min-height:100vh;}
        ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:var(--border2);border-radius:10px;}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
        @media print{aside,button:not(.print-keep){display:none!important;}main{padding:0!important;}}
      `}</style>
    </div>
  )
}

function StoreOpenClose({ isMgr }) {
  const [tab, setTab] = useState('open')
  return (
    <div>
      <TabRow tabs={[['open', '🔓 Opening'], ['close', '🔒 Closing']]} active={tab} setActive={setTab} />
      {tab === 'open' && <EditableChecklist listKey="opening" defaultItems={OPENING} isMgr={isMgr} />}
      {tab === 'close' && <EditableChecklist listKey="store_closing" defaultItems={STORE_CLOSING} isMgr={isMgr} />}
    </div>
  )
}

function BrandAccordion({ isMgr }) {
  const [open, setOpen] = useState(null)
  const brands = [
    { id: 'aventon', label: 'Aventon', icon: '⚡', listKey: 'aventon_guide', defaultSections: DEFAULT_AVENTON, externalLink: 'https://rideaventon.zendesk.com/hc/en-us/sections/28557324966427', externalLabel: 'Full Aventon Help Desk' },
    { id: 'gazelle', label: 'Gazelle', icon: '🚲', listKey: 'gazelle_guide', defaultSections: null, externalLink: 'https://www.gazellebikes.com/en-us/service', externalLabel: 'Gazelle Service Site' },
    { id: 'bosch', label: 'Bosch', icon: '⚙️', listKey: 'bosch_guide', defaultSections: null, externalLink: 'https://www.bosch-ebike.com/en/service', externalLabel: 'Bosch eBike Service' },
    { id: 'yuba', label: 'Yuba', icon: '📦', listKey: 'yuba_guide', defaultSections: null, externalLink: 'https://yubabikes.com/support', externalLabel: 'Yuba Support' },
    { id: 'velotric', label: 'Velotric', icon: '🔵', listKey: 'velotric_guide', defaultSections: null, externalLink: 'https://www.velotricbike.com/pages/support', externalLabel: 'Velotric Support' },
    { id: 'ebikeguide', label: 'eBike Guide', icon: '📖', listKey: 'ebikeguide', defaultSections: DEFAULT_EBIKE_GUIDE, externalLink: null },
  ]
  const toggle = (id) => setOpen(o => o === id ? null : id)
  return (
    <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
      <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Brand Guides</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        {brands.map(b => (
          <button key={b.id} onClick={() => toggle(b.id)} style={{ ...S.btn, ...(open === b.id ? S.btnP : {}), fontSize: 13 }}>
            {b.icon} {b.label} <span style={{ fontSize: 10, opacity: 0.6, marginLeft: 2 }}>{open === b.id ? '▲' : '▼'}</span>
          </button>
        ))}
      </div>
      {brands.map(b => open === b.id && (
        <div key={b.id} style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 'var(--r)', padding: '18px 20px', marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 16, fontWeight: 600 }}>{b.icon} {b.label}</div>
            {b.externalLink && <a href={b.externalLink} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: 'var(--accent2)', textDecoration: 'none', fontFamily: 'var(--mono)' }}>{b.externalLabel} ↗</a>}
          </div>
          <EditableSteps listKey={b.listKey} defaultSections={b.defaultSections || [{ title: 'Getting Started', steps: [{ title: 'Add your first section', desc: 'Click ✏️ Edit to start adding content.', img: '' }] }]} isMgr={isMgr} />
        </div>
      ))}
    </div>
  )
}

function WorkshopGuidesPage({ isMgr }) {
  const [tab, setTab] = useState('ebike')
  const tabs = {
    ebike: { label: 'E-Bike Systems', key: 'repair_ebike', def: REPAIR_EBIKE },
    mechanical: { label: 'Mechanical', key: 'repair_mechanical', def: REPAIR_MECHANICAL },
    electrical: { label: 'Electrical', key: 'repair_electrical', def: REPAIR_ELECTRICAL },
    diagnose: { label: 'Diagnose', key: 'diagnose', def: DIAGNOSE },
  }
  const cur = tabs[tab]
  return (
    <div style={S.page}>
      <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>🔧 Workshop Guides</div>
      <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 18 }}>Repair procedures, diagnostics, and brand-specific guides</div>
      <TabRow tabs={Object.entries(tabs).map(([k, v]) => [k, v.label])} active={tab} setActive={setTab} />
      <EditableSteps key={cur.key} listKey={cur.key} defaultSections={cur.def} isMgr={isMgr} />
      <BrandAccordion isMgr={isMgr} />
    </div>
  )
}

function RepairGuides({ isMgr }) {
  const [tab, setTab] = useState('ebike')
  const tabs = { ebike: { label: 'E-Bike Systems', key: 'repair_ebike', def: REPAIR_EBIKE }, mechanical: { label: 'Mechanical', key: 'repair_mechanical', def: REPAIR_MECHANICAL }, electrical: { label: 'Electrical', key: 'repair_electrical', def: REPAIR_ELECTRICAL } }
  const cur = tabs[tab]
  return (
    <div>
      <TabRow tabs={Object.entries(tabs).map(([k, v]) => [k, v.label])} active={tab} setActive={setTab} />
      <EditableSteps key={cur.key} listKey={cur.key} defaultSections={cur.def} isMgr={isMgr} />
    </div>
  )
}
