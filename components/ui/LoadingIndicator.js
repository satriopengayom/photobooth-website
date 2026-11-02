export default function LoadingIndicator({ text = 'Memuat...', size = 'md' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-4'
  }
  
  const sizeClass = sizes[size] || sizes.md
  
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizeClass} border-blue-600 border-t-transparent rounded-full animate-spin`}></div>
      {text && <p className="text-gray-600 text-sm">{text}</p>}
    </div>
  )
}
