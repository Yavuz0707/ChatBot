import { useState, useEffect, useRef } from 'react'
import Sidebar from './components/Sidebar'
import ToolPanel from './components/ToolPanel'
import ConversationFeed from './components/ConversationFeed'
import PromptBar from './components/PromptBar'

export default function App() {
  const [username, setUsername] = useState('')
  const [savedUsername, setSavedUsername] = useState('')
  const [messages, setMessages] = useState([])
  const [activeFile, setActiveFile] = useState(null)    // { file: File, previewUrl: string }
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Kullanıcı adı kaydedilince geçmişi yükle
  const handleSaveUsername = async (name) => {
    if (!name.trim()) return
    setSavedUsername(name.trim())
    setMessages([])
    await fetchHistory(name.trim())
  }

  const fetchHistory = async (name) => {
    try {
      const res = await fetch(`/api/history/${encodeURIComponent(name)}`)
      if (!res.ok) return
      const data = await res.json()
      if (data.history && data.history.length > 0) {
        setMessages(data.history.map(m => ({ role: m.role, content: m.content })))
      }
    } catch (err) {
      console.error('Geçmiş yüklenemedi:', err)
    }
  }

  const handleSendMessage = async (text) => {
    if (!savedUsername) {
      alert('Lütfen önce kullanıcı adınızı girin ve kaydedin.')
      return
    }
    if (!text.trim() && !activeFile) return

    const userMsg = {
      role: 'user',
      content: text || 'Görsel yüklendi ve analiz ediliyor.',
      imagePreview: activeFile ? activeFile.previewUrl : null,
      imageName: activeFile ? activeFile.file.name : null,
    }
    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)

    try {
      let botReply = ''

      if (activeFile) {
        const formData = new FormData()
        formData.append('username', savedUsername)
        formData.append('message', text || 'Bu görseli detaylıca açıkla.')
        formData.append('file', activeFile.file)

        const res = await fetch('/api/chat/image', { method: 'POST', body: formData })
        if (res.status === 429) {
          const d = await res.json()
          throw new Error('KOTA: ' + d.detail)
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        botReply = data.reply
        setActiveFile(null)
      } else {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: savedUsername, message: text }),
        })
        if (res.status === 429) {
          const d = await res.json()
          throw new Error('KOTA: ' + d.detail)
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        botReply = data.reply
      }

      setMessages(prev => [...prev, { role: 'assistant', content: botReply }])
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: `❌ Bağlantı hatası: ${err.message}. Backend'in çalıştığından emin olun.` },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearChat = () => {
    if (window.confirm('Mevcut oturum geçmişi temizlensin mi?')) {
      setMessages([])
    }
  }

  const handleFileSelect = (file) => {
    if (!file) { setActiveFile(null); return }
    const previewUrl = URL.createObjectURL(file)
    setActiveFile({ file, previewUrl })
  }

  return (
    <div className="flex h-screen bg-surface text-on-surface overflow-hidden font-body">
      {/* Sol Navigasyon Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(o => !o)}
        username={username}
        onUsernameChange={setUsername}
        onSaveUsername={handleSaveUsername}
        savedUsername={savedUsername}
        onClearChat={handleClearChat}
      />

      {/* Ana İçerik */}
      <div
        className="flex flex-col flex-1 min-w-0 transition-all duration-200"
        style={{ marginLeft: sidebarOpen ? '18rem' : '0' }}
      >
        {/* Üst Header */}
        <header className="h-14 bg-surface border-b-2 border-primary flex items-center justify-between px-5 flex-shrink-0 z-30">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-1.5 text-on-surface-variant hover:text-on-surface transition-colors mr-1"
                aria-label="Sidebar aç"
              >
                <span className="material-symbols-outlined text-[20px]">menu</span>
              </button>
            )}
            <span className="inline-block w-2.5 h-2.5 bg-secondary rounded-full animate-pulse" />
            <span className="font-headline font-bold text-xs uppercase tracking-widest text-on-surface">
              AI Asistanı
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-headline font-bold uppercase tracking-wider text-on-surface-variant">
              {savedUsername ? `@${savedUsername.toLowerCase().replace(/\s+/g, '_')}` : 'Oturum Açılmadı'}
            </span>
            <div className="w-8 h-8 bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </div>
          </div>
        </header>

        {/* İçerik Alanı */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Tool Panel (Sağ kenar) */}
          <ToolPanel
            username={username}
            savedUsername={savedUsername}
            onUsernameChange={setUsername}
            onSaveUsername={handleSaveUsername}
            activeFile={activeFile}
            onFileSelect={handleFileSelect}
            onClearFile={() => setActiveFile(null)}
          />

          {/* Sohbet Alanı */}
          <section className="flex flex-col flex-1 min-w-0 bg-surface relative">
            {/* Sohbet Alt Başlığı */}
            <div className="px-5 py-3 bg-surface-container-lowest border-b border-outline-variant flex items-center justify-between gap-3 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-container text-on-primary-container flex items-center justify-center font-headline font-bold text-sm">
                  AI
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-headline font-bold text-sm uppercase tracking-wide text-on-surface">
                      Çok Kullanıcılı Yapay Zeka Asistanı
                    </h1>
                    <span className="px-2 py-0.5 text-[9px] font-headline font-bold uppercase bg-tertiary-container text-on-tertiary-container">
                      Multimodal
                    </span>
                  </div>
                  <p className="text-[10px] text-on-surface-variant font-mono">
                    Aktif Model: Gemini 2.0 Flash
                  </p>
                </div>
              </div>
            </div>

            {/* Mesaj Akışı */}
            <ConversationFeed
              messages={messages}
              isLoading={isLoading}
              savedUsername={savedUsername}
            />

            {/* Alt Mesaj Çubuğu */}
            <PromptBar
              onSend={handleSendMessage}
              activeFile={activeFile}
              onFileSelect={handleFileSelect}
              onClearFile={() => setActiveFile(null)}
              isLoading={isLoading}
              username={savedUsername}
            />
          </section>
        </div>
      </div>
    </div>
  )
}
