import Image from 'next/image'

export const ChromeExtensionEmptyState = () => {
  return (
    <div className="text-center py-12">
      <Image
        src="/images/emptystate.png"
        alt="Chrome Extension coming soon"
        width={120}
        height={120}
        className="mx-auto mb-4"
      />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Chrome Extension Coming Soon
      </h3>
      <p className="text-sm text-gray-500">
        Our extension is currently in development and will be available soon.
      </p>
    </div>
  )
} 