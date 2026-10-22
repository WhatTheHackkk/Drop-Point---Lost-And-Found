'use client'

import { useMemo, useState } from 'react'
import {
  Bell,
  Check,
  ChevronDown,
  Flag,
  ImagePlus,
  MapPin,
  MessageCircle,
  Moon,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
  X,
} from 'lucide-react'

type ItemStatus = 'lost' | 'found' | 'resolved'
type Category = 'Electronics' | 'Books' | 'IDs' | 'Accessories' | 'Clothing'

type Item = {
  id: number
  title: string
  category: Category
  status: ItemStatus
  age: string
  person: string
  initials: string
  image: string
  handoff?: string
}

const categories = ['All', 'Electronics', 'Books', 'IDs', 'Accessories', 'Clothing'] as const

const initialItems: Item[] = [
  {
    id: 1,
    title: 'Blue Sony WH-1000XM5 headphones',
    category: 'Electronics',
    status: 'lost',
    age: '2 hours ago',
    person: 'Aarav Mehta',
    initials: 'AM',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 2,
    title: 'Black leather wallet with student ID',
    category: 'Accessories',
    status: 'found',
    age: '4 hours ago',
    person: 'Nisha Rao',
    initials: 'NR',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=85',
    handoff: 'Left at CS Dept Office',
  },
  {
    id: 3,
    title: 'Calculus II textbook, annotated',
    category: 'Books',
    status: 'lost',
    age: 'Yesterday',
    person: 'Kabir Shah',
    initials: 'KS',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 4,
    title: 'Silver Casio scientific calculator',
    category: 'Electronics',
    status: 'resolved',
    age: '2 days ago',
    person: 'Maya Iyer',
    initials: 'MI',
    image: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=900&q=85',
  },
]

function StatusBadge({ status }: { status: ItemStatus }) {
  const label = status === 'lost' ? 'LOST' : status === 'found' ? 'FOUND' : 'RESOLVED'
  return <span className={`status-badge status-${status}`}>{label}</span>
}

function ItemCard({ item, onResolve }: { item: Item; onResolve: (id: number) => void }) {
  const isResolved = item.status === 'resolved'
  return (
    <article className={`item-card ${isResolved ? 'item-card-resolved' : ''}`}>
      <div className="item-image-wrap">
        <img src={item.image} alt={item.title} className="item-image" />
        <StatusBadge status={item.status} />
        <span className="time-chip">{item.age}</span>
      </div>
      <div className="item-body">
        <div className="item-heading">
          <div>
            <p className="eyebrow">{item.category}</p>
            <h2>{item.title}</h2>
          </div>
          <button className="more-button" aria-label="More options"><ChevronDown /></button>
        </div>
        {item.handoff && <div className="handoff"><MapPin /><span><strong>Handoff:</strong> {item.handoff}</span></div>}
        <div className="item-user"><span className="avatar">{item.initials}</span><span>{item.status === 'found' ? 'Found by' : 'Posted by'} <strong>{item.person}</strong></span></div>
        <div className="item-actions">
          <button className="whatsapp-button" disabled={isResolved}><MessageCircle data-icon="inline-start" /> Contact via WhatsApp</button>
          <div className="secondary-actions">
            <button onClick={() => onResolve(item.id)} disabled={isResolved}><Check /> Mark as Resolved</button>
            <button disabled={isResolved}><Flag /> Report Post</button>
          </div>
        </div>
      </div>
    </article>
  )
}

function ReportModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (item: Item) => void }) {
  const [kind, setKind] = useState<'lost' | 'found'>('lost')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<Category>('Electronics')
  const [handoff, setHandoff] = useState('')
  const [description, setDescription] = useState('')
  const [name, setName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    onSubmit({ id: Date.now(), title: title || 'Untitled item', category, status: kind, age: 'Just now', person: name || 'You', initials: (name || 'YO').slice(0, 2).toUpperCase(), image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=85', handoff: kind === 'found' ? handoff || 'Handoff details not added' : undefined })
  }
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="report-modal" role="dialog" aria-modal="true" aria-labelledby="report-title">
        <div className="modal-header"><div><p className="eyebrow">Make a post</p><h2 id="report-title">Report an item</h2></div><button className="close-button" onClick={onClose} aria-label="Close report form"><X /></button></div>
        <form onSubmit={submit} className="report-form">
          <div className="kind-toggle"><button type="button" className={kind === 'lost' ? 'selected' : ''} onClick={() => setKind('lost')}>I lost something</button><button type="button" className={kind === 'found' ? 'selected' : ''} onClick={() => setKind('found')}>I found something</button></div>
          <label>Item title<input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Blue water bottle" /></label>
          <label>Category<select value={category} onChange={(e) => setCategory(e.target.value as Category)}>{categories.slice(1).map((value) => <option key={value}>{value}</option>)}</select></label>
          {kind === 'found' && <label>Handoff details<textarea value={handoff} onChange={(e) => setHandoff(e.target.value)} placeholder="Where is the item now? e.g. Left at Library desk" /></label>}
          <label>Description<textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add any useful details, colour, brand, or where you last saw it..." /></label>
          <div className="two-fields"><label>Your name<input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" /></label><label>WhatsApp number<input required value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+91 98765 43210" /></label></div>
          <label className="upload-label">Photo <span>(optional)</span><div className="upload-dropzone"><ImagePlus /><span>Drop a photo here or <strong>browse</strong></span><small>JPG or PNG up to 10MB</small></div></label>
          <div className="privacy-alert"><ShieldCheck /><span><strong>PRIVACY NOTICE</strong> Blur sensitive numbers on College IDs or Aadhaar before uploading. Show only the name and photo.</span></div>
          <div className="modal-footer"><button type="button" className="ghost-button" onClick={onClose}>Cancel</button><button className="submit-button" type="submit">Publish report <Sparkles /></button></div>
        </form>
      </section>
    </div>
  )
}

function NotifyDialog({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('')
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="notify-dialog" role="dialog" aria-modal="true" aria-labelledby="notify-title"><div className="notify-icon"><Bell /></div><h2 id="notify-title">Get search alerts</h2><p>We&apos;ll email you when someone posts an item matching your search.</p><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoFocus /><button className="submit-button" onClick={onClose}>Notify me <Bell /></button><button className="text-button" onClick={onClose}>Not now</button></section></div>
}

export default function Page() {
  const [items, setItems] = useState(initialItems)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>('All')
  const [activeTab, setActiveTab] = useState<'Active' | 'Resolved'>('Active')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [notifyOpen, setNotifyOpen] = useState(false)
  const [dark, setDark] = useState(true)

  const filteredItems = useMemo(() => items.filter((item) => (activeTab === 'Resolved' ? item.status === 'resolved' : item.status !== 'resolved')).filter((item) => activeCategory === 'All' || item.category === activeCategory).filter((item) => `${item.title} ${item.category} ${item.person}`.toLowerCase().includes(searchQuery.toLowerCase())), [items, activeCategory, activeTab, searchQuery])
  const addItem = (item: Item) => { setItems((current) => [item, ...current]); setIsModalOpen(false); setActiveTab('Active'); setActiveCategory('All'); setSearchQuery('') }
  const resolveItem = (id: number) => setItems((current) => current.map((item) => item.id === id ? { ...item, status: 'resolved' } : item))

  return <div className={dark ? 'app-shell dark-mode' : 'app-shell light-mode'}>
    <header className="topbar"><div className="topbar-inner"><a className="brand" href="#top"><span className="brand-mark"><MapPin /></span><span>DropPoint</span></a><div className="header-actions"><button className="icon-button" onClick={() => setDark((value) => !value)} aria-label="Toggle theme">{dark ? <Sun /> : <Moon />}</button><button className="report-button" onClick={() => setIsModalOpen(true)}><span>Report item</span><span className="plus">+</span></button></div></div></header>
    <main id="top" className="content"><section className="hero"><div><p className="kicker"><span className="live-dot" /> Campus community board</p><h1>Find what&apos;s <em>yours.</em></h1><p className="hero-copy">A trusted place to return lost things and reconnect with what matters.</p></div><div className="hero-stat"><strong>{items.filter((item) => item.status !== 'resolved').length}</strong><span>active posts<br />on campus</span></div></section>
      <div className="tabs"><button className={activeTab === 'Active' ? 'active' : ''} onClick={() => setActiveTab('Active')}>Active <span>{items.filter((item) => item.status !== 'resolved').length}</span></button><button className={activeTab === 'Resolved' ? 'active' : ''} onClick={() => setActiveTab('Resolved')}>Resolved <span>{items.filter((item) => item.status === 'resolved').length}</span></button></div>
      <section className="feed-tools"><div className="search-wrap"><Search /><input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search for keys, ID card, calculator..." /><kbd>⌘ K</kbd></div><div className="category-scroll">{categories.map((category) => <button key={category} onClick={() => setActiveCategory(category)} className={activeCategory === category ? 'category active' : 'category'}>{category}</button>)}</div></section>
      {filteredItems.length > 0 ? <section className="items-grid">{filteredItems.map((item) => <ItemCard key={item.id} item={item} onResolve={resolveItem} />)}</section> : <section className="empty-state"><div className="empty-icon"><Search /></div><h2>No matches found</h2><p>We couldn&apos;t find anything for <strong>&quot;{searchQuery}&quot;</strong>. Get notified when something turns up.</p><button className="notify-button" onClick={() => setNotifyOpen(true)}><Bell /> Notify me</button></section>}
    </main>
    <footer className="footer"><span>DropPoint <span className="muted">· made for your campus</span></span><span className="footer-link"><ShieldCheck /> Community-first & private</span></footer>
    {isModalOpen && <ReportModal onClose={() => setIsModalOpen(false)} onSubmit={addItem} />}{notifyOpen && <NotifyDialog onClose={() => setNotifyOpen(false)} />}
  </div>
}
