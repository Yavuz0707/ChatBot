// Sol navigasyon sidebar — kullanıcı profili, oturum geçmişi, ayarlar
export default function Sidebar({ isOpen, onToggle, username, onUsernameChange, onSaveUsername, savedUsername, onClearChat }) {
  const initials = savedUsername
    ? savedUsername.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'AI'

  if (!isOpen) return null

  return (
    <aside
      className="fixed left-0 top-0 h-full w-72 bg-inverse-surface text-inverse-on-surface z-50 flex flex-col justify-between border-r-2 border-primary"
      style={{ boxShadow: '4px 0px 0px 0px #1a1a1a' }}
    >
      <div className="flex flex-col flex-1 min-h-0">
        {/* Header */}
        <div className="p-4 border-b-2 border-white/10 flex items-center justify-between bg-primary">
          <div className="flex items-center gap-2">
            <span className="text-xs font-headline font-bold uppercase tracking-wider text-primary-container">
              Kullanıcı Paneli
            </span>
            <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase bg-surface-container-lowest text-primary">
              PRO v2
            </span>
          </div>
          <button
            onClick={onToggle}
            aria-label="Sidebar'ı kapat"
            className="text-inverse-on-surface hover:text-primary-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">menu_open</span>
          </button>
        </div>

        {/* Bağlantı Durumu */}
        <div className="p-4 border-b-2 border-white/10 bg-white/5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-headline font-bold uppercase tracking-wider text-surface-dim">
              Bağlantı Durumu
            </span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-primary-container text-on-primary-container text-[9px] font-headline font-bold uppercase">
              <span className="inline-block w-2 h-2 rounded-full bg-primary animate-ping" />
              <span>Çevrimiçi</span>
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-headline font-bold tracking-tight text-surface-bright">CANLI O-12</span>
            <span className="text-[10px] text-surface-dim font-mono">18ms latency</span>
          </div>
        </div>

        {/* Kullanıcı Bilgisi */}
        <div className="p-4 border-b-2 border-white/10">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 bg-primary-container text-on-primary-container flex items-center justify-center font-headline font-bold text-sm border border-primary"
              style={{ boxShadow: '2px 2px 0px 0px #1a1a1a' }}
            >
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold font-headline uppercase tracking-wider text-surface-dim">
                Aktif Kimlik
              </p>
              <p className="text-xs font-bold font-headline truncate uppercase text-surface-bright">
                {savedUsername || 'Misafir Kullanıcı'}
              </p>
              <p className="text-[11px] text-surface-dim truncate">
                {savedUsername ? `@${savedUsername.toLowerCase().replace(/\s+/g, '_')}` : 'Giriş yapılmadı'}
              </p>
            </div>
            <span className="material-symbols-outlined text-[18px] text-primary-container">verified_user</span>
          </div>
          {!savedUsername && (
            <form
              className="mt-3 space-y-2"
              onSubmit={(event) => {
                event.preventDefault()
                onSaveUsername(username)
              }}
            >
              <label htmlFor="username" className="sr-only">Kullanıcı adınız</label>
              <input
                id="username"
                value={username}
                onChange={(event) => onUsernameChange(event.target.value)}
                placeholder="Kullanıcı adınız"
                autoComplete="name"
                className="w-full px-2.5 py-2 bg-white/10 border border-white/20 text-xs text-surface-bright placeholder:text-surface-dim outline-none focus:border-primary-container"
              />
              <button
                type="submit"
                className="w-full px-3 py-2 bg-primary-container text-on-primary-container border-2 border-primary font-headline font-bold text-[10px] uppercase tracking-wider hover:bg-surface-bright hover:text-primary transition-colors"
              >
                Adımı Kaydet
              </button>
            </form>
          )}
        </div>

        {/* Yeni Sohbet */}
        <div className="p-4">
          <button
            onClick={onClearChat}
            className="w-full flex items-center justify-between px-3.5 py-2.5 bg-primary-container text-on-primary-container hover:bg-surface-bright hover:text-primary transition-all border-2 border-primary font-headline font-bold text-xs uppercase tracking-wider"
            style={{ boxShadow: '3px 3px 0px 0px #1a1a1a' }}
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">add</span>
              Yeni Sohbet
            </span>
            <span className="text-[10px] px-1.5 py-0.5 bg-primary text-on-primary font-mono font-bold">
              ⌘K
            </span>
          </button>
        </div>

        {/* Geçmiş Oturumlar başlığı */}
        <div className="px-4 pb-2">
          <span className="text-[10px] font-headline font-bold uppercase tracking-wider text-surface-dim">
            Geçmiş Oturumlar
          </span>
        </div>

        {/* Navigasyon Listesi */}
        <nav className="flex-1 overflow-y-auto px-3 space-y-1.5">
          {['Görsel Kod Analizi', 'React Refactoring', 'Proje Dokümantasyonu', 'API Mimarisi'].map((item) => (
            <a
              key={item}
              href="#"
              className="flex items-center justify-between px-3 py-2 text-xs text-surface-dim hover:text-surface-bright hover:bg-white/10 border border-transparent hover:border-white/10 transition-all group"
            >
              <span className="truncate">{item}</span>
              <span className="material-symbols-outlined text-[14px] opacity-0 group-hover:opacity-100 text-primary-container">
                arrow_forward
              </span>
            </a>
          ))}
        </nav>
      </div>

      {/* Alt Panel */}
      <div className="p-4 border-t-2 border-white/10 bg-black/20 space-y-3">
        <div className="p-2.5 bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-headline font-bold uppercase tracking-wider">
            <span className="text-surface-dim">Bağlam Belleği</span>
            <span className="font-mono text-primary-container">12.4k / 128k</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 overflow-hidden">
            <div className="h-full bg-primary-container w-[10%]" />
          </div>
        </div>

        {/* Ayarlar & Tema */}
        <div className="flex items-center justify-between pt-1">
          <a href="#" className="flex items-center gap-2 text-xs text-surface-dim hover:text-surface-bright transition-colors">
            <span className="material-symbols-outlined text-[18px]">settings</span>
            <span className="font-headline uppercase text-[11px] font-bold">Ayarlar</span>
          </a>
          <button
            aria-label="Tema Değiştir"
            className="p-1.5 text-surface-dim hover:text-primary-container hover:bg-white/10 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">dark_mode</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
