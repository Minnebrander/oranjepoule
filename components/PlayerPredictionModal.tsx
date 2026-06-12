
type Props = {
  speler: {
    username: string
    scores: Record<string, any>
    knockout: Record<number, string>
    extra: Record<string, any>
  }

  onClose: () => void
}

export default function PlayerPredictionModal({
  speler,
  onClose,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
      <div className="bg-gray-900 border border-gray-700 rounded-3xl p-5 w-[calc(100vw-2rem)] max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {speler.username}
          </h2>

          <button
            onClick={onClose}
            className="text-2xl"
          >
            ×
          </button>
        </div>

        <pre className="text-xs overflow-auto">
          {JSON.stringify(speler, null, 2)}
        </pre>
      </div>
    </div>
  )
}