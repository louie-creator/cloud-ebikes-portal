import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const SUPA_URL = 'https://qzdqggemowjwneiozpvt.supabase.co'
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6ZHFnZ2Vtb3dqd25laW96cHZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxMjg2MjksImV4cCI6MjA5MzcwNDYyOX0.gxi2Oo-GCl0AXkrUXXJbR5vYW5zbOC-fR2qUgGeH87Q'
const WORKER_URL = 'https://twilight-pond-a691.louie-4b0.workers.dev/'
const sb = createClient(SUPA_URL, SUPA_KEY)

const uid = () => Math.random().toString(36).slice(2, 10)
const nowISO = () => new Date().toISOString()
const fmt = (iso) => { if (!iso) return ''; const d = new Date(iso); return d.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit' }) }
const fmtDate = (iso) => { if (!iso) return ''; return new Date(iso).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' }) }

const ROLES = { owner: 'Owner', manager: 'Manager', staff: 'Staff', mechanic: 'Mechanic' }
const ROLE_COLOR = { owner: '#a855f7', manager: '#3b82f6', staff: '#22c55e', mechanic: '#f59e0b' }
const MSG_TYPES = ['parts_request', 'supplies_request', 'product_request', 'time_log', 'note', 'concern']
const MSG_LABELS = { parts_request: 'Parts Request', supplies_request: 'Supplies Request', product_request: 'Product Request', time_log: 'Time Log', note: 'Note for Management', concern: 'Concern' }
const MSG_ICONS = { parts_request: '🔩', supplies_request: '📦', product_request: '🛒', time_log: '🕐', note: '📝', concern: '⚠️' }
const PRI_COLOR = { high: '#ef4444', medium: '#f59e0b', low: '#22c55e' }
const BUILD_STATUSES = ['Waiting for Bike', 'Bike Ordered', 'Bike Arrived', 'Build in Progress', 'Ready for Pickup', 'Completed', 'On Hold']
const BUILD_STATUS_COLOR = { 'Waiting for Bike': '#f59e0b', 'Bike Ordered': '#3b82f6', 'Bike Arrived': '#a855f7', 'Build in Progress': '#f97316', 'Ready for Pickup': '#22c55e', 'Completed': '#4b5563', 'On Hold': '#ef4444' }
const CONTACT_STATUSES = ['Not Contacted', 'Call Attempted', 'Customer Notified', 'Customer Confirmed']

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
const DEFAULT_TEMPLATES = [
  { id: 'bike_ready', label: 'Bike Ready for Pickup', category: 'Pickup', body: "Hi [Customer Name], great news! Your [Bike] is built and ready for pickup or a test ride at Cloud Ebikes — 1991 Main St, Vancouver. We're open Tuesday to Saturday, 11am to 5pm. Please note we are closed on stat holidays (if a stat holiday falls on a Monday, we are also closed Tuesday). See you soon! — Cloud Ebikes" },
  { id: 'service_ready', label: 'Service Ready for Pickup', category: 'Pickup', body: "Hi [Customer Name], your bike service is complete and ready for pickup at Cloud Ebikes — 1991 Main St, Vancouver. We're open Tuesday to Saturday, 11am to 5pm. Please note we are closed on stat holidays (if a stat holiday falls on a Monday, we are also closed Tuesday). Give us a call if you have any questions. — Cloud Ebikes" },
  { id: 'hours_reminder', label: 'Store Hours Reminder', category: 'Info', body: "Hi [Customer Name], just a reminder that Cloud Ebikes is open Tuesday to Saturday, 11am to 5pm at 1991 Main St, Vancouver. We are closed on stat holidays — if a stat holiday falls on a Monday we are also closed Tuesday. See you soon!" },
  { id: 'repair_update', label: 'Repair Status Update', category: 'Repair', body: "Hi [Customer Name], we wanted to give you an update on your bike repair. [Update details]. We will contact you again once it's ready. Thank you for your patience! — Cloud Ebikes" },
  { id: 'estimate_ready', label: 'Repair Estimate Ready', category: 'Repair', body: "Hi [Customer Name], we've had a chance to look at your bike and have a repair estimate ready for you. Please give us a call at your earliest convenience so we can go over the details before we proceed. — Cloud Ebikes" },
  { id: 'parts_delay', label: 'Parts Delay Notice', category: 'Repair', body: "Hi [Customer Name], we wanted to let you know that we are waiting on a part for your bike repair. We expect it to arrive [timeframe] and will contact you as soon as your bike is ready. We apologize for the delay! — Cloud Ebikes" },
]

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
  return (
    <div style={{ borderLeft: `3px solid ${c}`, background: c + '11', borderRadius: '0 8px 8px 0', padding: '13px 15px', marginBottom: 9 }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{a.title}</div>
      <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.65 }}>{a.body}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 7 }}>
        <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>{a.author} · {fmtDate(a.created_at)}</div>
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

  const formatPhone = (p) => {
    const d = p.replace(/\D/g, '')
    if (d.length === 10) return '+1' + d
    if (d.length === 11 && d[0] === '1') return '+' + d
    return p
  }

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
      setSent(true)
      if (onSent) onSent()
      setTimeout(() => onClose(), 1800)
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
            <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 6 }}>Customer notified — build status updated</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>CUSTOMER PHONE</div>
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. 604-555-1234" style={S.input} />
            </div>
            {templates && templates.length > 0 && (
              <div>
                <div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 8 }}>PICK A TEMPLATE</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {templates.map(t => <button key={t.id} onClick={() => applyTemplate(t)} style={{ ...S.btn, ...S.btnSm, fontSize: 11 }}>{t.label}</button>)}
                </div>
              </div>
            )}
            <div>
              <div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>MESSAGE</div>
              <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Type your message or pick a template above..." style={{ ...S.textarea, minHeight: 120 }} />
              <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>{message.length} characters · Sending from (604) 728-8347</div>
            </div>
            {err && <div style={{ fontSize: 12, color: 'var(--red)', padding: '8px 10px', background: 'rgba(239,68,68,0.1)', borderRadius: 'var(--rs)' }}>{err}</div>}
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={send} disabled={sending} style={{ ...S.btn, ...S.btnP, flex: 1, justifyContent: 'center', opacity: sending ? 0.6 : 1 }}>{sending ? 'Sending...' : 'Send Text'}</button>
              <button onClick={onClose} style={S.btn}>Cancel</button>
            </div>
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
            <div style={{ flex: 1, minWidth: 140 }}>
              <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>STATUS</div>
              <select value={build.status} onChange={e => onUpdate(build.id, { status: e.target.value })} style={{ ...S.select, fontSize: 12, padding: '5px 8px' }}>
                {BUILD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ flex: 1, minWidth: 140 }}>
              <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>ASSIGNED TO</div>
              <select value={build.assigned_to || ''} onChange={e => onUpdate(build.id, { assigned_to: e.target.value })} style={{ ...S.select, fontSize: 12, padding: '5px 8px' }}>
                <option value="">Unassigned</option>
                {activeUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
            <div style={{ flex: 1, minWidth: 140 }}>
              <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>CONTACT STATUS</div>
              <select value={build.contact_status || 'Not Contacted'} onChange={e => onUpdate(build.id, { contact_status: e.target.value })} style={{ ...S.select, fontSize: 12, padding: '5px 8px' }}>
                {CONTACT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
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
            <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>CUSTOMER PHONE</div><input value={form.customer_phone || ''} onChange={e => setForm({ ...form, customer_phone: e.target.value })} placeholder="604-555-1234" style={S.input} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>PICKUP DATE</div><input type="date" value={form.pickup_date || ''} onChange={e => setForm({ ...form, pickup_date: e.target.value })} style={S.input} /></div>
            <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>STATUS</div><select value={form.status || 'Waiting for Bike'} onChange={e => setForm({ ...form, status: e.target.value })} style={S.select}>{BUILD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>ASSIGNED TO</div><select value={form.assigned_to || ''} onChange={e => setForm({ ...form, assigned_to: e.target.value })} style={S.select}><option value="">Unassigned</option>{activeUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}</select></div>
            <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>CONTACT STATUS</div><select value={form.contact_status || 'Not Contacted'} onChange={e => setForm({ ...form, contact_status: e.target.value })} style={S.select}>{CONTACT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
          </div>
          <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>NOTES</div><textarea value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Build notes, waiting on parts..." style={S.textarea} /></div>
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
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={saveEdit} style={{ ...S.btn, ...S.btnP, ...S.btnSm }}>Save</button>
                      <button onClick={() => setEditIdx(null)} style={{ ...S.btn, ...S.btnSm }}>Cancel</button>
                    </div>
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
                      <div>
                        <div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>IMAGE URL (optional)</div>
                        <input value={editing.img || ''} onChange={e => setEditing({ ...editing, img: e.target.value })} placeholder="https://..." style={S.input} />
                        {editing.img && <img src={editing.img} alt="" style={{ marginTop: 8, maxWidth: '100%', maxHeight: 160, borderRadius: 'var(--rs)', border: '1px solid var(--border)', objectFit: 'contain', background: 'var(--bg3)' }} onError={e => { e.target.style.display = 'none' }} />}
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={saveEdit} style={{ ...S.btn, ...S.btnP, ...S.btnSm }}>Save</button>
                        <button onClick={() => setEditing(null)} style={{ ...S.btn, ...S.btnSm }}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{s.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>{s.desc}</div>
                        {s.img && <div style={{ fontSize: 11, color: 'var(--accent2)', marginTop: 3, fontFamily: 'var(--mono)' }}>📷 Image attached</div>}
                      </div>
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
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>IMAGE URL (optional)</div>
                    <input value={(newStep[si] || {}).img || ''} onChange={e => setNewStep({ ...newStep, [si]: { ...(newStep[si] || {}), img: e.target.value } })} placeholder="https://..." style={S.input} />
                  </div>
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
        : <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 18 }}>Add sections and steps using ✏️ Edit below</div>
      }
      <EditableSteps listKey={listKey} defaultSections={[{ title: 'Getting Started', steps: [{ title: 'Add your first section', desc: 'Click ✏️ Edit above to start adding content, sections, and images to this guide.', img: '' }] }]} isMgr={isMgr} />
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
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Cloud Ebikes</div>
            <div style={{ fontSize: 10, color: 'var(--text2)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--mono)' }}>Staff Portal</div>
          </div>
        </div>
      </div>
      <div style={{ padding: '10px 8px', flex: 1 }}>
        {L('My Area')}
        {N('home', 'Home', '🏠')}
        {N('tasks', 'My Tasks', '✅')}
        {N('messages', 'Send Message', '💬')}
        {L('Store')}
        {N('announcements', 'Announcements', '📢')}
        {N('opening', 'Store Open/Close', '🔓')}
        {N('checklist', 'Daily Checklist', '📋')}
        {N('builds', 'Bike Builds', '🔨', pendingBuilds, 'var(--amber)')}
        {N('templates', 'Message Templates', '💬')}
        {L('Workshop')}
        {N('repair', 'Repair Guides', '🔧')}
        {N('diagnose', 'Diagnose Protocol', '🔍')}
        {L('Brand Guides')}
        {N('aventon', 'Aventon', '⚡')}
        {N('gazelle', 'Gazelle', '🚲')}
        {N('bosch', 'Bosch', '⚙️')}
        {N('yuba', 'Yuba', '📦')}
        {N('velotric', 'Velotric', '🔵')}
        {N('ebikeguide', 'eBike Guide', '📖')}
        {isMgr && <>
          {L('Management')}
          {N('assign', 'Assign Tasks', '🎯')}
          {N('inbox', 'Team Inbox', '📥', unread)}
          {N('parts', 'Parts to Order', '🔩')}
          {N('bikes', 'Bikes to Order', '🚲')}
          {N('broadcast', 'Announcements', '📣')}
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

function HomePage({ user, announcements, myTasks, builds, users }) {
  const hr = new Date().getHours()
  const g = hr < 12 ? 'Good morning ☀️' : hr < 17 ? 'Good afternoon ⚡' : 'Good evening 🌙'
  const open = myTasks.filter(t => !t.done)
  const activeBuilds = builds.filter(b => b.status !== 'Completed')
  return (
    <div style={{ padding: 24, maxWidth: 1200 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 22, fontWeight: 600 }}>{g}, {user.name}</div>
        <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 3 }}>1991 Main St · Vancouver</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 280px', gap: 16 }}>
        <div style={S.card}>
          <div style={S.cardTitle}>📢 Announcements</div>
          {announcements.length === 0 && <div style={{ fontSize: 13, color: 'var(--text2)' }}>No announcements yet.</div>}
          {announcements.slice(0, 4).map(a => <ACard key={a.id} a={a} />)}
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
                  {b.pickup_date && <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>Pickup: {fmtDate(b.pickup_date)}</span>}
                  {assignee && <span style={{ fontSize: 11, color: 'var(--text2)' }}>→ {assignee.name}</span>}
                </div>
                {b.notes && <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 3, fontStyle: 'italic' }}>{b.notes.slice(0, 80)}{b.notes.length > 80 ? '...' : ''}</div>}
              </div>
            )
          })}
        </div>
        <div style={{ ...S.card, marginBottom: 0 }}>
          <div style={{ ...S.cardTitle, marginBottom: 10 }}>
            ✅ My Tasks
            <span style={{ marginLeft: 8, fontSize: 10, padding: '2px 7px', borderRadius: 20, background: open.length > 0 ? 'rgba(245,158,11,0.2)' : 'rgba(34,197,94,0.2)', color: open.length > 0 ? 'var(--amber)' : 'var(--green)', fontWeight: 500 }}>{open.length} open</span>
          </div>
          {open.length === 0 && <div style={{ fontSize: 13, color: 'var(--text2)', padding: '6px 0' }}>All caught up!</div>}
          {open.map((t, i) => (
            <div key={t.id} style={{ padding: '9px 0', borderBottom: i < open.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{t.title}</div>
              {t.notes && <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>{t.notes}</div>}
              {t.priority && <div style={{ marginTop: 4 }}><span style={S.badge(PRI_COLOR[t.priority])}>{t.priority}</span></div>}
            </div>
          ))}
          {myTasks.filter(t => t.done).length > 0 && <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 10, fontFamily: 'var(--mono)' }}>{myTasks.filter(t => t.done).length} completed</div>}
        </div>
      </div>
    </div>
  )
}

function BuildsPage({ user, users, builds, onAdd, onUpdate, onDelete }) {
  const [tab, setTab] = useState('active')
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ order_number: '', bike_description: '', customer_name: '', customer_phone: '', pickup_date: '', notes: '', status: 'Waiting for Bike', assigned_to: '' })
  const activeUsers = users.filter(u => u.active)

  const submit = () => {
    if (!form.bike_description.trim()) return
    onAdd({ ...form, assigned_by: user.id, contact_status: 'Not Contacted' })
    setForm({ order_number: '', bike_description: '', customer_name: '', customer_phone: '', pickup_date: '', notes: '', status: 'Waiting for Bike', assigned_to: '' })
    setShowForm(false); setTab('active')
  }

  const active = builds.filter(b => b.status !== 'Completed')
  const completed = builds.filter(b => b.status === 'Completed')
  const filterBuilds = (list) => {
    if (!search.trim()) return list
    const q = search.toLowerCase()
    return list.filter(b => (b.bike_description || '').toLowerCase().includes(q) || (b.customer_name || '').toLowerCase().includes(q) || (b.order_number || '').toLowerCase().includes(q))
  }

  return (
    <div style={S.page}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 600 }}>🔨 Bike Builds</div>
          <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 4 }}>Track all builds — assign, update status, text customers, view history</div>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ ...S.btn, ...S.btnP }}>+ New Build</button>
      </div>
      {showForm && (
        <div style={S.card}>
          <div style={S.cardTitle}>New Bike Build</div>
          <div style={{ display: 'grid', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>BIKE DESCRIPTION *</div><input value={form.bike_description} onChange={e => setForm({ ...form, bike_description: e.target.value })} placeholder="e.g. Aventon Pace 500.3 — Blue" style={S.input} /></div>
              <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>ORDER NUMBER</div><input value={form.order_number} onChange={e => setForm({ ...form, order_number: e.target.value })} placeholder="e.g. LS-10482" style={S.input} /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>CUSTOMER NAME</div><input value={form.customer_name} onChange={e => setForm({ ...form, customer_name: e.target.value })} placeholder="Customer name" style={S.input} /></div>
              <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>CUSTOMER PHONE</div><input value={form.customer_phone} onChange={e => setForm({ ...form, customer_phone: e.target.value })} placeholder="604-555-1234" style={S.input} /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>PICKUP DATE</div><input type="date" value={form.pickup_date} onChange={e => setForm({ ...form, pickup_date: e.target.value })} style={S.input} /></div>
              <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>STATUS</div><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={S.select}>{BUILD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
            </div>
            <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>ASSIGN TO</div><select value={form.assigned_to} onChange={e => setForm({ ...form, assigned_to: e.target.value })} style={S.select}><option value="">Unassigned</option>{activeUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}</select></div>
            <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>NOTES</div><textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Build notes, waiting on parts, special requirements..." style={S.textarea} /></div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={submit} style={{ ...S.btn, ...S.btnP }}>Create Build</button>
              <button onClick={() => setShowForm(false)} style={S.btn}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      <div style={{ marginBottom: 14 }}><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by bike, customer, or order number..." style={S.input} /></div>
      <TabRow tabs={[['active', `Active (${active.length})`], ['completed', `History (${completed.length})`]]} active={tab} setActive={setTab} />
      {tab === 'active' && <div>
        {filterBuilds(active).length === 0 && <div style={{ ...S.card, fontSize: 13, color: 'var(--text2)' }}>No active builds{search ? ' matching your search' : ''}.</div>}
        {filterBuilds(active).map(b => <BuildCard key={b.id} build={b} users={users} user={user} onUpdate={onUpdate} onDelete={onDelete} />)}
      </div>}
      {tab === 'completed' && <div>
        <div style={{ ...S.card, marginBottom: 14, background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)' }}>
          <div style={{ fontSize: 13, color: 'var(--text2)' }}><strong style={{ color: 'var(--green)' }}>{completed.length}</strong> builds completed · Full history</div>
        </div>
        {filterBuilds(completed).length === 0 && <div style={{ ...S.card, fontSize: 13, color: 'var(--text2)' }}>No completed builds{search ? ' matching your search' : ''}.</div>}
        {filterBuilds(completed).map(b => <BuildCard key={b.id} build={b} users={users} user={user} onUpdate={onUpdate} onDelete={onDelete} />)}
      </div>}
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
      <div style={S.card}>
        <div style={S.cardTitle}>Open ({open.length})</div>
        {open.length === 0 && <div style={{ fontSize: 13, color: 'var(--text2)', padding: '8px 0' }}>No open tasks — all caught up.</div>}
        {open.map(t => <TItem key={t.id} task={t} user={user} users={users} onToggle={onToggle} onDelete={onDelete} onReassign={onReassign} isMgr={isMgr} />)}
      </div>
      {done.length > 0 && <div style={S.card}>
        <div style={S.cardTitle}>✅ Completed ({done.length})</div>
        {done.map(t => <TItem key={t.id} task={t} user={user} users={users} onToggle={onToggle} onDelete={onDelete} onReassign={onReassign} isMgr={isMgr} />)}
      </div>}
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
      {tab === 'send' && <div style={S.card}>
        <div style={S.cardTitle}>New Message to Management</div>
        <div style={{ display: 'grid', gap: 12 }}>
          <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>TYPE</div>
            <select value={type} onChange={e => setType(e.target.value)} style={S.select}>
              {MSG_TYPES.map(t => <option key={t} value={t}>{MSG_ICONS[t]} {MSG_LABELS[t]}</option>)}
            </select>
          </div>
          <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>MESSAGE</div><textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Describe your request..." style={S.textarea} /></div>
          <button onClick={send} style={{ ...S.btn, ...S.btnP, width: 'fit-content' }}>Send to Management</button>
        </div>
      </div>}
      {tab === 'sent' && <div>
        {mine.length === 0 && <div style={{ ...S.card, fontSize: 13, color: 'var(--text2)' }}>No messages sent yet.</div>}
        {mine.map(m => <MItem key={m.id} msg={m} users={users} currentUser={user} onRead={onRead} onReply={() => { }} isMgr={false} />)}
      </div>}
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

function AssignPage({ user, users, tasks, onAdd, onToggle, onDelete, onReassign }) {
  const [form, setForm] = useState({ assigned_to: '', title: '', notes: '', priority: 'medium', due_date: '' })
  const [filter, setFilter] = useState('all')
  const [formErr, setFormErr] = useState('')
  const eligible = users.filter(u => u.active)
  const submit = () => {
    if (!form.assigned_to) { setFormErr('Please select a person.'); return }
    if (!form.title.trim()) { setFormErr('Please enter a task title.'); return }
    setFormErr('')
    onAdd({ ...form, assigned_by: user.id })
    setForm({ assigned_to: '', title: '', notes: '', priority: 'medium', due_date: '' })
  }
  const open = tasks.filter(t => !t.done)
  const done = tasks.filter(t => t.done)
  const filt = (list) => filter === 'all' ? list : list.filter(t => t.assigned_to === filter)
  return (
    <div style={S.page}>
      <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>🎯 Assign Tasks</div>
      <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 22 }}>Create and manage tasks for the team</div>
      <div style={S.card}>
        <div style={S.cardTitle}>New Task</div>
        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
            <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>ASSIGN TO</div>
              <select value={form.assigned_to} onChange={e => setForm({ ...form, assigned_to: e.target.value })} style={S.select}>
                <option value="">Select person...</option>
                {eligible.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
            <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>PRIORITY</div>
              <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} style={S.select}>
                <option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
              </select>
            </div>
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
      <div style={S.card}>
        <div style={S.cardTitle}>Open ({filt(open).length})</div>
        {filt(open).length === 0 && <div style={{ fontSize: 13, color: 'var(--text2)' }}>No open tasks.</div>}
        {filt(open).map(t => <TItem key={t.id} task={t} user={user} users={users} onToggle={onToggle} onDelete={onDelete} onReassign={onReassign} isMgr={true} />)}
      </div>
      {filt(done).length > 0 && <div style={S.card}>
        <div style={S.cardTitle}>✅ Completed ({filt(done).length})</div>
        {filt(done).map(t => <TItem key={t.id} task={t} user={user} users={users} onToggle={onToggle} onDelete={onDelete} onReassign={onReassign} isMgr={true} />)}
      </div>}
    </div>
  )
}

function PartsPage({ user, parts, onAdd, onToggle, onDelete }) {
  const [form, setForm] = useState({ part_name: '', brand: '', qty: 1, reason: '', priority: 'medium', ticket: '' })
  const submit = () => { if (!form.part_name.trim()) return; onAdd(form); setForm({ part_name: '', brand: '', qty: 1, reason: '', priority: 'medium', ticket: '' }) }
  const pending = parts.filter(p => !p.ordered)
  const ordered = parts.filter(p => p.ordered)
  return (
    <div style={S.page}>
      <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>🔩 Parts to Order</div>
      <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 22 }}>Track parts that need to be sourced or reordered</div>
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
            <button onClick={() => onToggle(p)} style={{ ...S.btn, ...S.btnSm, ...S.btnG }}>Mark Ordered</button>
            <button onClick={() => onDelete(p.id)} style={{ ...S.btn, ...S.btnD, ...S.btnSm }}>✕</button>
          </div>
        ))}
      </div>
      {ordered.length > 0 && <div style={S.card}>
        <div style={S.cardTitle}>Ordered ({ordered.length})</div>
        {ordered.map(p => (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: '1px solid var(--border)', opacity: 0.45 }}>
            <div style={{ flex: 1, fontSize: 14 }}>{p.part_name} ×{p.qty}{p.brand && <span style={{ color: 'var(--text2)', fontSize: 12 }}> — {p.brand}</span>}</div>
            <button onClick={() => onDelete(p.id)} style={{ ...S.btn, ...S.btnD, ...S.btnSm }}>✕</button>
          </div>
        ))}
      </div>}
    </div>
  )
}

function BikesPage({ user, bikes, onAdd, onToggle, onDelete }) {
  const [form, setForm] = useState({ brand: '', model: '', qty: 1, reason: '', priority: 'medium' })
  const submit = () => { if (!form.model.trim()) return; onAdd(form); setForm({ brand: '', model: '', qty: 1, reason: '', priority: 'medium' }) }
  const pending = bikes.filter(b => !b.ordered)
  const ordered = bikes.filter(b => b.ordered)
  return (
    <div style={S.page}>
      <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>🚲 Bikes to Order</div>
      <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 22 }}>Track bikes that need to be sourced or reordered</div>
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
            <button onClick={() => onToggle(b)} style={{ ...S.btn, ...S.btnSm, ...S.btnG }}>Mark Ordered</button>
            <button onClick={() => onDelete(b.id)} style={{ ...S.btn, ...S.btnD, ...S.btnSm }}>✕</button>
          </div>
        ))}
      </div>
      {ordered.length > 0 && <div style={S.card}>
        <div style={S.cardTitle}>Ordered ({ordered.length})</div>
        {ordered.map(b => (
          <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: '1px solid var(--border)', opacity: 0.45 }}>
            <div style={{ flex: 1, fontSize: 14 }}>{b.brand} {b.model} ×{b.qty}</div>
            <button onClick={() => onDelete(b.id)} style={{ ...S.btn, ...S.btnD, ...S.btnSm }}>✕</button>
          </div>
        ))}
      </div>}
    </div>
  )
}

function UsersPage({ users, onAdd, onToggle, onUpdate, onDelete }) {
  const [form, setForm] = useState({ name: '', code: '', role: 'staff' })
  const [err, setErr] = useState('')
  const [editing, setEditing] = useState(null)
  const [editErr, setEditErr] = useState('')
  const submit = () => {
    if (!form.name.trim() || form.code.length !== 4) { setErr('Name and 4-digit code required.'); return }
    if (users.find(u => u.code === form.code)) { setErr('Code already taken.'); return }
    onAdd(form); setForm({ name: '', code: '', role: 'staff' }); setErr('')
  }
  const saveEdit = () => {
    if (!editing.name.trim() || editing.code.length !== 4) { setEditErr('Name and 4-digit code required.'); return }
    const conflict = users.find(u => u.code === editing.code && u.id !== editing.id)
    if (conflict) { setEditErr('Code taken by ' + conflict.name + '.'); return }
    onUpdate(editing.id, { name: editing.name, code: editing.code }); setEditing(null); setEditErr('')
  }
  return (
    <div style={S.page}>
      <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>👥 Manage Users</div>
      <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 22 }}>Only the owner can create, edit, or deactivate logins</div>
      <div style={S.card}>
        <div style={S.cardTitle}>Add New User</div>
        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12 }}>
            <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>FULL NAME</div><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Staff member name" style={S.input} /></div>
            <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>4-DIGIT CODE</div><input value={form.code} onChange={e => setForm({ ...form, code: e.target.value.replace(/\D/g, '').slice(0, 4) })} placeholder="e.g. 2204" style={S.input} maxLength={4} /></div>
            <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>ROLE</div>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} style={S.select}>
                <option value="staff">Staff</option><option value="mechanic">Mechanic</option><option value="manager">Manager</option><option value="owner">Owner</option>
              </select>
            </div>
          </div>
          {err && <div style={{ fontSize: 12, color: 'var(--red)' }}>{err}</div>}
          <button onClick={submit} style={{ ...S.btn, ...S.btnP, width: 'fit-content' }}>Create Login</button>
        </div>
      </div>
      <div style={S.card}>
        <div style={S.cardTitle}>All Users ({users.length})</div>
        {users.map(u => (
          <div key={u.id} style={{ borderBottom: '1px solid var(--border)', padding: '12px 0', opacity: u.active ? 1 : 0.5 }}>
            {editing?.id === u.id ? (
              <div style={{ display: 'grid', gap: 10 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>
                  <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 4 }}>NAME</div><input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} style={S.input} autoFocus /></div>
                  <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 4 }}>CODE</div><input value={editing.code} onChange={e => setEditing({ ...editing, code: e.target.value.replace(/\D/g, '').slice(0, 4) })} style={S.input} maxLength={4} /></div>
                </div>
                {editErr && <div style={{ fontSize: 12, color: 'var(--red)' }}>{editErr}</div>}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={saveEdit} style={{ ...S.btn, ...S.btnP, ...S.btnSm }}>Save</button>
                  <button onClick={() => { setEditing(null); setEditErr('') }} style={{ ...S.btn, ...S.btnSm }}>Cancel</button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={S.avatar(ROLE_COLOR[u.role])}>{u.name[0]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{u.name}</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={S.badge(ROLE_COLOR[u.role])}>{ROLES[u.role]}</span>
                    <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>Code: {u.code}</span>
                    {!u.active && <span style={S.badge('#ef4444')}>Inactive</span>}
                  </div>
                </div>
                <button onClick={() => setEditing({ id: u.id, name: u.name, code: u.code })} style={{ ...S.btn, ...S.btnSm }}>✏️ Edit</button>
                <button onClick={() => onToggle(u)} style={{ ...S.btn, ...S.btnSm }}>{u.active ? 'Deactivate' : 'Activate'}</button>
                <button onClick={() => onDelete(u.id)} style={{ ...S.btn, ...S.btnD, ...S.btnSm }}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function BroadcastPage({ user, announcements, onAdd, onDelete }) {
  const [form, setForm] = useState({ type: 'info', title: '', body: '' })
  const submit = () => { if (!form.title.trim() || !form.body.trim()) return; onAdd(form); setForm({ type: 'info', title: '', body: '' }) }
  return (
    <div style={S.page}>
      <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>📣 Announcements</div>
      <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 22 }}>Post to all staff on every tablet instantly</div>
      <div style={S.card}>
        <div style={S.cardTitle}>New Announcement</div>
        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 12 }}>
            <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>TYPE</div>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={S.select}>
                <option value="info">Info (blue)</option><option value="warn">Warning (amber)</option><option value="alert">Alert (red)</option><option value="good">Good news (green)</option>
              </select>
            </div>
            <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>TITLE</div><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Announcement title" style={S.input} /></div>
          </div>
          <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>MESSAGE</div><textarea value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} placeholder="Full announcement text..." style={S.textarea} /></div>
          <button onClick={submit} style={{ ...S.btn, ...S.btnP, width: 'fit-content' }}>Post to All Staff</button>
        </div>
      </div>
      <div style={S.card}>
        <div style={S.cardTitle}>Live Announcements ({announcements.length})</div>
        {announcements.length === 0 && <div style={{ fontSize: 13, color: 'var(--text2)' }}>None posted.</div>}
        {announcements.map(a => <ACard key={a.id} a={a} onDelete={onDelete} canDelete={true} />)}
      </div>
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

  useEffect(() => {
    sb.from('content').select('*').eq('key', 'msg_templates').single()
      .then(({ data }) => setTemplates(data ? JSON.parse(data.value) : DEFAULT_TEMPLATES))
      .catch(() => setTemplates(DEFAULT_TEMPLATES))
  }, [])

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
        <div>
          <div style={{ fontSize: 22, fontWeight: 600 }}>💬 Message Templates</div>
          <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 4 }}>Tap Copy to copy any template — paste into Podium or your text app</div>
        </div>
        {isMgr && <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setShowNew(!showNew)} style={{ ...S.btn, ...S.btnP }}>+ New</button>
          <button onClick={() => setEditMode(!editMode)} style={{ ...S.btn, ...(editMode ? S.btnP : {}) }}>{editMode ? 'Done' : '✏️ Edit'}</button>
        </div>}
      </div>
      {showNew && (
        <div style={S.card}>
          <div style={S.cardTitle}>New Template</div>
          <div style={{ display: 'grid', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
              <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>TEMPLATE NAME</div><input value={newForm.label} onChange={e => setNewForm({ ...newForm, label: e.target.value })} placeholder="e.g. Bike Ready for Pickup" style={S.input} /></div>
              <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>CATEGORY</div><input value={newForm.category} onChange={e => setNewForm({ ...newForm, category: e.target.value })} placeholder="e.g. Pickup, Repair, Info" style={S.input} /></div>
            </div>
            <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>MESSAGE</div><textarea value={newForm.body} onChange={e => setNewForm({ ...newForm, body: e.target.value })} placeholder="Type your message template here..." style={{ ...S.textarea, minHeight: 120 }} /></div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={addTemplate} style={{ ...S.btn, ...S.btnP }}>Save Template</button>
              <button onClick={() => setShowNew(false)} style={S.btn}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {categories.map(c => <button key={c} onClick={() => setFilter(c)} style={{ ...S.btn, ...S.btnSm, borderColor: filter === c ? 'var(--accent)' : 'var(--border2)', color: filter === c ? 'var(--accent2)' : 'var(--text2)' }}>{c}</button>)}
      </div>
      <div style={{ display: 'grid', gap: 12 }}>
        {filtered.map(t => {
          const isEdit = editMode && editing?.id === t.id
          return (
            <div key={t.id} style={{ ...S.card, marginBottom: 0, borderLeft: '3px solid var(--accent)' }}>
              {isEdit ? (
                <div style={{ display: 'grid', gap: 12 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
                    <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>TEMPLATE NAME</div><input value={editing.label} onChange={e => setEditing({ ...editing, label: e.target.value })} style={S.input} /></div>
                    <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>CATEGORY</div><input value={editing.category || ''} onChange={e => setEditing({ ...editing, category: e.target.value })} style={S.input} /></div>
                  </div>
                  <div><div style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 5 }}>MESSAGE</div><textarea value={editing.body} onChange={e => setEditing({ ...editing, body: e.target.value })} style={{ ...S.textarea, minHeight: 120 }} /></div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={saveEdit} style={{ ...S.btn, ...S.btnP, ...S.btnSm }}>Save</button>
                    <button onClick={() => setEditing(null)} style={{ ...S.btn, ...S.btnSm }}>Cancel</button>
                    <button onClick={() => deleteTemplate(t.id)} style={{ ...S.btn, ...S.btnD, ...S.btnSm, marginLeft: 'auto' }}>Delete</button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{t.label}</div>
                      {t.category && <span style={{ ...S.badge('var(--accent2)'), marginTop: 4, display: 'inline-flex' }}>{t.category}</span>}
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      {editMode && <button onClick={() => setEditing({ ...t })} style={{ ...S.btn, ...S.btnSm }}>✏️</button>}
                      <button onClick={() => copy(t)} style={{ ...S.btn, ...S.btnSm, ...(copied === t.id ? S.btnG : {}) }}>{copied === t.id ? '✓ Copied!' : '📋 Copy'}</button>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7, background: 'var(--bg3)', padding: '10px 12px', borderRadius: 'var(--rs)', whiteSpace: 'pre-wrap' }}>{t.body}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 8, fontFamily: 'var(--mono)' }}>Replace [brackets] with actual details before sending</div>
                </div>
              )}
            </div>
          )
        })}
      </div>
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

function DailyChecklist({ isMgr }) {
  const [tab, setTab] = useState('morning')
  const lists = { morning: { label: 'Morning', key: 'daily_morning', def: MORNING }, midday: { label: 'Midday', key: 'daily_midday', def: MIDDAY }, closing: { label: 'Closing', key: 'daily_closing', def: CLOSING } }
  const cur = lists[tab]
  return (
    <div>
      <TabRow tabs={Object.entries(lists).map(([k, v]) => [k, v.label])} active={tab} setActive={setTab} />
      <EditableChecklist key={cur.key} listKey={cur.key} defaultItems={cur.def} isMgr={isMgr} />
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
    const ref = (table, setter, order = { ascending: false }) => () => sb.from(table).select('*').order('created_at', order).then(r => setter(r.data || []))
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

  const addTask = async (f) => { const item = { id: uid(), ...f, done: false, created_at: nowISO() }; setTasks(p => [item, ...p]); const { error } = await sb.from('tasks').insert(item); if (error) { console.error('Task error:', error); alert('Error saving task: ' + error.message) } }
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
  const addBuild = async (f) => { const item = { id: uid(), ...f, created_at: nowISO() }; setBuilds(p => [item, ...p]); const { error } = await sb.from('builds').insert(item); if (error) { console.error('Build error:', error); alert('Error saving build: ' + error.message) } }
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
        <P id="messages"><SendPage user={user} messages={messages} users={users} onSend={sendMsg} onRead={readMsg} /></P>
        <P id="builds"><BuildsPage user={user} users={users} builds={builds} onAdd={addBuild} onUpdate={updateBuild} onDelete={deleteBuild} /></P>
        <P id="templates"><TemplatesPage isMgr={isMgr} /></P>
        <P id="announcements">
          <div style={S.page}>
            <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>📢 Announcements</div>
            <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 22 }}>From ownership and management</div>
            <div style={S.card}>{announcements.length === 0 && <div style={{ fontSize: 13, color: 'var(--text2)' }}>No announcements yet.</div>}{announcements.map(a => <ACard key={a.id} a={a} />)}</div>
          </div>
        </P>
        <P id="opening">
          <div style={S.page}>
            <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>🔓 Store Open / Close</div>
            <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 18 }}>Opening and closing checklists</div>
            <StoreOpenClose isMgr={isMgr} />
          </div>
        </P>
        <P id="checklist">
          <div style={S.page}>
            <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>📋 Daily Checklist</div>
            <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 18 }}>Morning, midday, and closing</div>
            <DailyChecklist isMgr={isMgr} />
          </div>
        </P>
        <P id="repair">
          <div style={S.page}>
            <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>🔧 Repair Guides</div>
            <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 18 }}>Standard procedures for common repairs</div>
            <RepairGuides isMgr={isMgr} />
          </div>
        </P>
        <P id="diagnose">
          <div style={S.page}>
            <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>🔍 Diagnose Protocol</div>
            <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 18 }}>Follow this for every bike that comes in for service</div>
            <EditableSteps listKey="diagnose" defaultSections={DIAGNOSE} isMgr={isMgr} />
          </div>
        </P>
        <P id="aventon">
          <div style={S.page}>
            <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>⚡ Aventon Guides</div>
            <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 4 }}>Troubleshooting and service guides for Aventon ebikes</div>
            <div style={{ marginBottom: 18 }}><a href="https://rideaventon.zendesk.com/hc/en-us/sections/28557324966427" target="_blank" rel="noreferrer" style={{ fontSize: 12, color: 'var(--accent2)', textDecoration: 'none', fontFamily: 'var(--mono)' }}>Full Aventon Help Desk ↗</a></div>
            <EditableSteps listKey="aventon_guide" defaultSections={DEFAULT_AVENTON} isMgr={isMgr} />
          </div>
        </P>
        <P id="gazelle"><BrandGuidePage title="Gazelle Guide" icon="🚲" listKey="gazelle_guide" externalLink="https://www.gazellebikes.com/en-us/service" externalLabel="Gazelle Service Site" isMgr={isMgr} /></P>
        <P id="bosch"><BrandGuidePage title="Bosch Guide" icon="⚙️" listKey="bosch_guide" externalLink="https://www.bosch-ebike.com/en/service" externalLabel="Bosch eBike Service" isMgr={isMgr} /></P>
        <P id="yuba"><BrandGuidePage title="Yuba Guide" icon="📦" listKey="yuba_guide" externalLink="https://yubabikes.com/support" externalLabel="Yuba Support" isMgr={isMgr} /></P>
        <P id="velotric"><BrandGuidePage title="Velotric Guide" icon="🔵" listKey="velotric_guide" externalLink="https://www.velotricbike.com/pages/support" externalLabel="Velotric Support" isMgr={isMgr} /></P>
        <P id="ebikeguide">
          <div style={S.page}>
            <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>📖 eBike Guide</div>
            <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 18 }}>General ebike knowledge for staff — editable by management</div>
            <EditableSteps listKey="ebikeguide" defaultSections={DEFAULT_EBIKE_GUIDE} isMgr={isMgr} />
          </div>
        </P>
        {isMgr && <P id="assign"><AssignPage user={user} users={users} tasks={tasks} onAdd={addTask} onToggle={toggleTask} onDelete={deleteTask} onReassign={reassignTask} /></P>}
        {isMgr && <P id="inbox"><InboxPage user={user} messages={messages} users={users} onRead={readMsg} onReply={replyMsg} /></P>}
        {isMgr && <P id="parts"><PartsPage user={user} parts={parts} onAdd={addPart} onToggle={togglePart} onDelete={deletePart} /></P>}
        {isMgr && <P id="bikes"><BikesPage user={user} bikes={bikes} onAdd={addBike} onToggle={toggleBike} onDelete={deleteBike} /></P>}
        {isMgr && <P id="broadcast"><BroadcastPage user={user} announcements={announcements} onAdd={addAnnounce} onDelete={deleteAnnounce} /></P>}
        {isOwner && <P id="users"><UsersPage users={users} onAdd={addUser} onToggle={toggleUser} onUpdate={updateUser} onDelete={deleteUser} /></P>}
      </main>
      <style>{`
        :root{--bg:#0f1117;--bg2:#181c25;--bg3:#1e2330;--border:rgba(255,255,255,0.07);--border2:rgba(255,255,255,0.13);--accent:#3b82f6;--accent2:#60a5fa;--green:#22c55e;--amber:#f59e0b;--red:#ef4444;--purple:#a855f7;--text:#f1f5f9;--text2:#94a3b8;--text3:#4b5563;--font:'DM Sans',sans-serif;--mono:'DM Mono',monospace;--r:12px;--rs:8px;}
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:var(--bg);color:var(--text);font-family:var(--font);min-height:100vh;}
        ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:var(--border2);border-radius:10px;}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>
    </div>
  )
}
