import React from 'react'

export default function PricingHeroSection() {
    return (
        <main className="[--color-primary:var(--color-indigo-500)]">
            <section className="overflow-hidden relative">
                <div className="pt-20 pb-8 md:pt-36 md:pb-12">
                    <div className="relative z-10 mx-auto max-w-5xl px-6">
                        <div className="relative text-center">
                            <h1 className="mx-auto max-w-2xl text-balance text-4xl font-bold md:text-5xl">No match, no charge</h1>

                            <p className="text-muted-foreground mx-auto my-6 max-w-2xl text-balance text-xl">Every plan runs on credits. A credit is deducted only after both sales accept the introduction.</p>

                            <div className="flex flex-col items-center justify-center gap-3">
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
} 