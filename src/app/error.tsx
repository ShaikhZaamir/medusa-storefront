"use client";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
                <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm text-center">
                    <h1 className="text-xl font-semibold text-zinc-900">
                        Server Unavailable
                    </h1>

                    <p className="mt-2 text-sm text-zinc-600">
                        We can’t connect to the server right now.
                        Please try again later or contact support if the problem continues.
                    </p>

                    <button
                        onClick={() => reset()}
                        className="mt-5 w-full rounded-xl bg-zinc-900 px-4 py-2 text-white text-sm hover:bg-zinc-800"
                    >
                        Try Again
                    </button>
                </div>
            </body>
        </html>
    );
}
