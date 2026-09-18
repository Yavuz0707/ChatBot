// Tek mesaj baloncuğu — kullanıcı veya asistan
export default function MessageBubble({ role, content, imagePreview, imageName, savedUsername }) {
  const isUser = role === 'user'
  const now = new Date()
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

  const initials = isUser
    ? (savedUsername
        ? savedUsername.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : 'SN')
    : 'AI'

  // Basit markdown → HTML dönüştürücü (bold, code, satır sonu)
  const formatContent = (text) => {
    return text
      .replace(/```[\w]*\n?([\s\S]*?)```/g, '<pre class="bg-inverse-surface text-inverse-on-surface p-3 overflow-x-auto text-xs font-mono mt-2 mb-2 rounded-sm">$1</pre>')
      .replace(/`([^`]+)`/g, '<code class="bg-surface-container px-1 py-0.5 font-mono font-bold text-xs">$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/^### (.+)$/gm, '<h3 class="font-headline font-bold text-xs uppercase tracking-wide mt-2 mb-1">$1</h3>')
      .replace(/^## (.+)$/gm, '<h3 class="font-headline font-bold text-sm uppercase tracking-wide mt-2 mb-1">$1</h3>')
      .replace(/^# (.+)$/gm, '<h2 class="font-headline font-bold uppercase tracking-wide mt-2 mb-1">$1</h2>')
      .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
      .replace(/\n/g, '<br/>')
  }

  return (
    <div className="flex gap-4 items-start group">
      {/* Avatar */}
      <div
        className={`w-9 h-9 flex items-center justify-center font-headline font-bold text-xs flex-shrink-0 ${
          isUser
            ? 'bg-primary text-on-primary'
            : 'bg-primary-container text-on-primary-container'
        }`}
        style={{ boxShadow: '2px 2px 0px 0px #1a1a1a' }}
      >
        {isUser ? initials : 'AI'}
      </div>

      <div className="flex-1 space-y-2 min-w-0">
        {/* Metadata satırı */}
        <div className="flex items-center gap-2">
          <span className="font-headline font-bold text-xs uppercase tracking-wide text-on-surface">
            {isUser ? (savedUsername || 'Kullanıcı') : 'Gemini 2.0 Flash'}
          </span>
          <span className="text-[10px] font-mono text-on-surface-variant">{timeStr}</span>
          {isUser && (
            <span className="text-[9px] font-headline font-bold px-1.5 bg-surface-container text-on-surface-variant uppercase">
              Yazar
            </span>
          )}
          {!isUser && (
            <span className="text-[9px] font-headline font-bold px-1.5 bg-primary-container text-on-primary-container uppercase">
              Vision 2.0
            </span>
          )}
        </div>

        {/* Mesaj Balonu */}
        <div
          className={`p-4 space-y-3 ${
            isUser ? 'bg-surface-container-lowest max-w-2xl' : 'bg-surface-container-lowest max-w-4xl'
          }`}
          style={{ boxShadow: '2px 2px 0px 0px #d0cbc3' }}
        >
          {/* Görsel Eki (Kullanıcı mesajında) */}
          {imagePreview && (
            <div className="p-2.5 bg-surface-container flex items-center gap-3 w-fit">
              <div className="w-10 h-10 bg-surface-dim overflow-hidden flex-shrink-0">
                <img
                  src={imagePreview}
                  alt={imageName || 'Yüklenen görsel'}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-xs font-headline font-bold text-on-surface">{imageName}</p>
                <p className="text-[10px] font-mono text-on-surface-variant">Görsel Ek • Çözümlendi</p>
              </div>
            </div>
          )}

          {/* Mesaj İçeriği */}
          {isUser ? (
            <p className="text-sm font-body text-on-surface leading-relaxed whitespace-pre-wrap">
              {content}
            </p>
          ) : (
            <div
              className="text-sm font-body text-on-surface leading-relaxed prose-bauhaus"
              dangerouslySetInnerHTML={{ __html: formatContent(content) }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
