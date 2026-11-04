'use client'

export default function ThumbnailStrip({ photos, selectedSlot = null }) {
  const filledSlots = photos.filter(photo => photo.blob !== null).length
  const totalSlots = photos.length

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900">Progress Foto</h3>
        <div className="text-sm font-medium text-blue-600">
          {filledSlots} dari {totalSlots}
        </div>
      </div>

      {/* Thumbnail Grid */}
      <div className="grid grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <div
            key={index}
            className={`relative rounded-xl border-2 overflow-hidden aspect-square ${
              selectedSlot === photo.slot
                ? 'border-blue-500 ring-2 ring-blue-200'
                : 'border-gray-200'
            } ${
              photo.blob ? 'bg-gray-100' : 'bg-gray-50'
            }`}
          >
            {/* Slot Number */}
            <div className="absolute top-2 left-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-semibold text-gray-800">
              {photo.slot + 1}
            </div>

            {/* Photo Thumbnail */}
            {photo.blob ? (
              <img
                src={URL.createObjectURL(photo.blob)}
                alt={`Foto ${photo.slot + 1}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            )}

            {/* Checkmark for captured photos */}
            {photo.blob && (
              <div className="absolute bottom-2 right-2 bg-green-500 text-white p-1 rounded-full">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Progress Indicator */}
      <div className="mt-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{Math.round((filledSlots / totalSlots) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${(filledSlots / totalSlots) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}
