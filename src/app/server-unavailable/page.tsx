export const dynamic = "force-static"

export default function ServerUnavailablePage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm text-center">

                {/* Animation */}
                <div className="mx-auto mb-6 flex items-center justify-center gap-4">
                    <div className="h-10 w-10 rounded-md bg-zinc-200 animate-pulse" />
                    <div className="h-1 w-6 bg-zinc-400" />
                    <div className="h-10 w-10 rounded-md bg-zinc-300 animate-pulse delay-200" />
                </div>


                <h1 className="text-xl font-semibold text-zinc-900">
                    Service Temporarily Unavailable
                </h1>

                <p className="mt-3 text-sm text-zinc-600">
                    We’re having trouble connecting to our servers.
                </p>

                <p className="mt-1 text-sm text-zinc-600">
                    Our systems are being checked and should be back shortly.
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
