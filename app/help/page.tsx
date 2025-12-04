export default function HelpPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Help Center</h1>
      <div className="max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
            <ul className="space-y-2 text-gray-600">
              <li>• How to create your first agent</li>
              <li>• Understanding the marketplace</li>
              <li>• Setting up your profile</li>
            </ul>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Account Management</h2>
            <ul className="space-y-2 text-gray-600">
              <li>• Updating your profile</li>
              <li>• Managing subscriptions</li>
              <li>• Security settings</li>
            </ul>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Support</h2>
            <ul className="space-y-2 text-gray-600">
              <li>• Contact support team</li>
              <li>• Report a bug</li>
              <li>• Request a feature</li>
            </ul>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Documentation</h2>
            <ul className="space-y-2 text-gray-600">
              <li>• API documentation</li>
              <li>• Integration guides</li>
              <li>• Best practices</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
