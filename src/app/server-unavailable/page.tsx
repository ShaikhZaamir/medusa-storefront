export const dynamic = "force-static"

export default function ServerUnavailablePage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm text-center">
                <h1 className="text-xl font-semibold text-zinc-900">
                    Service Temporarily Unavailable
                </h1>

                <p className="mt-3 text-sm text-zinc-600">
                    We’re unable to connect to our servers right now.
                </p>

                <p className="mt-2 text-sm text-zinc-600">
                    This is usually temporary. Please try again in a few minutes.
                </p>

                <a
                    href="/"
                    className="mt-5 inline-block w-full rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                >
                    Go to Home
                </a>
            </div>
        </div>
    )
}
