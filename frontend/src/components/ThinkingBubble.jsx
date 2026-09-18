// Bounce animasyonlu "Yapay zeka düşünüyor..." göstergesi
export default function ThinkingBubble() {
  return (
    <div className="flex gap-4 items-start">
      {/* AI Avatar — animasyonlu ping */}
      <div
        className="w-9 h-9 bg-primary-container text-on-primary-container flex items-center justify-center font-headline font-black text-xs flex-shrink-0 relative"
        style={{ boxShadow: '2px 2px 0px 0px #1a1a1a' }}
      >
        AI
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary-fixed-dim rounded-full animate-ping" />
      </div>

      <div className="flex-1 space-y-2">
        {/* Metadata */}
        <div className="flex items-center gap-2">
          <span className="font-headline font-bold text-xs uppercase tracking-wide text-on-surface">
            Gemini 2.0 Flash
          </span>
          <span className="text-[10px] font-mono text-on-surface-variant">Akış Hazırlanıyor...</span>
        </div>

        {/* Düşünme Balonu */}
        <div
          className="bg-surface-container-lowest p-4 inline-flex items-center gap-3"
          style={{ boxShadow: '2px 2px 0px 0px #d0cbc3' }}
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-primary rounded-full animate-bounce animation-delay-300" />
            <span className="w-2 h-2 bg-primary rounded-full animate-bounce animation-delay-150" />
            <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
          </div>
          <span className="text-xs font-headline font-bold uppercase tracking-wider text-on-surface-variant">
            Yapay zeka düşünüyor...
          </span>
        </div>
      </div>
    </div>
  )
}
