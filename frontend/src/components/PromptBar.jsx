import { useState, useRef, useCallback } from 'react'

// Alt sabitlenmiş mesaj giriş çubuğu
export default function PromptBar({ onSend, activeFile, onFileSelect, onClearFile, isLoading, username }) {
  const [text, setText] = useState('')
  const fileInputRef = useRef(null)
  const inputRef = useRef(null)

  const handleSubmit = useCallback(() => {
    if (isLoading) return
    if (!text.trim() && !activeFile) return
    onSend(text.trim())
    setText('')
  }, [text, activeFile, isLoading, onSend])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) onFileSelect(file)
  }

  const handleDragOver = (e) => e.preventDefault()

  return (
    <div
      className="p-5 bg-surface-container-low/95 border-t-2 border-outline-variant sticky bottom-0 z-30"
      style={{ backdropFilter: 'blur(12px)' }}
    >
      <div className="max-w-4xl mx-auto space-y-2">

        {/* Eklenti Pill (Görsel seçiliyse) */}
        {activeFile && (
          <div id="promptAttachmentBar" className="flex items-center gap-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-surface-container-lowest text-xs font-headline font-bold text-on-surface"
              style={{ boxShadow: '2px 2px 0px 0px #d0cbc3' }}
            >
              <span className="material-symbols-outlined text-[15px] text-tertiary">attach_file</span>
              <span className="truncate max-w-[180px]">{activeFile.file.name}</span>
              <button
                onClick={onClearFile}
                className="hover:text-secondary flex items-center transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            </div>
          </div>
        )}

        {/* Ana Giriş Konsolu */}
        <div
          className="bg-surface-container-lowest p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
          style={{ boxShadow: '3px 3px 0px 0px #1a1a1a' }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {/* Sol İkonlar */}
          <div className="flex items-center gap-1 pl-2">
            <button
              type="button"
              title="Görsel Yükle"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">add_a_photo</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => { if (e.target.files[0]) onFileSelect(e.target.files[0]) }}
            />
            <button
              type="button"
              title="Sesli Komut (Yakında)"
              className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors opacity-50 cursor-not-allowed"
              disabled
            >
              <span className="material-symbols-outlined text-[20px]">mic</span>
            </button>
          </div>

          {/* Metin Alanı */}
          <div className="flex-1 min-w-0">
            <input
              ref={inputRef}
              id="mainChatInput"
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder={
                !username
                  ? 'Önce kullanıcı adınızı kaydedin...'
                  : activeFile
                  ? 'Görsel hakkında soru yazın veya boş bırakın...'
                  : 'Bir şeyler yazın... (Görselleri buraya sürükleyebilirsiniz)'
              }
              className="w-full bg-transparent px-3 py-2 text-sm font-body text-on-surface focus:outline-none placeholder:text-on-surface-variant/50 disabled:opacity-50"
            />
          </div>

          {/* Sağ — Gönder Butonu */}
          <div className="flex items-center justify-end gap-2 pr-1">
            <div className="hidden md:flex items-center gap-1 text-[10px] font-mono text-on-surface-variant px-2">
              <span>Enter ↵</span>
            </div>
            <button
              id="sendMessageBtn"
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || (!text.trim() && !activeFile)}
              className="px-4 py-2.5 bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary transition-all font-headline font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ boxShadow: '2px 2px 0px 0px #1a1a1a' }}
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined text-[16px] animate-spin">autorenew</span>
                  <span>Bekle</span>
                </>
              ) : (
                <>
                  <span>Gönder</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Alt Dipnot */}
        <div className="flex items-center justify-between text-[10px] font-headline text-on-surface-variant px-1 pt-1">
          <span>Yapay zeka asistanı hata yapabilir. Önemli kararları kontrol ediniz.</span>
          <span className="font-mono">v2.4.0 • UTF-8</span>
        </div>
      </div>
    </div>
  )
}
