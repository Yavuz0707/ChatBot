import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'
import ThinkingBubble from './ThinkingBubble'

// Mesaj akışı — otomatik scroll, kullanıcı ve asistan baloncukları
export default function ConversationFeed({ messages, isLoading, savedUsername }) {
  const feedRef = useRef(null)

  // Yeni mesaj gelince en alta scroll et
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const isEmpty = messages.length === 0 && !isLoading

  return (
    <div
      ref={feedRef}
      id="messageFeed"
      className="flex-1 overflow-y-auto px-5 py-7 space-y-7"
    >
      {isEmpty ? (
        /* Boş durum */
        <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center space-y-4">
          <div className="p-8 bg-surface-container-lowest border-2 border-outline-variant max-w-md mx-auto space-y-3"
            style={{ boxShadow: '3px 3px 0px 0px #1a1a1a' }}
          >
            <span className="material-symbols-outlined text-5xl text-primary-container">chat_bubble</span>
            <h2 className="font-headline font-bold text-sm uppercase tracking-wide text-on-surface">
              Sohbete Başla
            </h2>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Sol panelden kullanıcı adınızı girin, ardından mesaj yazın veya görsel yükleyin.
              Web arama, hava durumu ve finans sorgularını da destekliyorum.
            </p>
            <div className="grid grid-cols-3 gap-2 pt-2">
              {[
                { icon: 'search', label: 'Web Arama' },
                { icon: 'cloud', label: 'Hava Durumu' },
                { icon: 'trending_up', label: 'Finans' },
              ].map(({ icon, label }) => (
                <div key={label} className="p-2 bg-surface-container text-center">
                  <span className="material-symbols-outlined text-[22px] text-primary">{icon}</span>
                  <p className="text-[9px] font-headline font-bold uppercase text-on-surface-variant mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          {messages.map((msg, idx) => (
            <MessageBubble
              key={idx}
              role={msg.role}
              content={msg.content}
              imagePreview={msg.imagePreview}
              imageName={msg.imageName}
              savedUsername={savedUsername}
            />
          ))}
          {isLoading && <ThinkingBubble />}
        </>
      )}
    </div>
  )
}
