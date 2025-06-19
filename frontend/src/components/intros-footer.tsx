import { Logo } from '@/components/logo'

export const IntrosFooter = () => {
    return (
        <footer className="bg-white border-t border-gray-200 py-6 mt-8">
            <div className="mx-auto max-w-6xl px-6">
                {/* Grid container matching the content width */}
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12 lg:col-span-8 lg:col-start-3">
                        <div className="flex flex-wrap justify-center items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    <Logo className="h-4 w-auto" />
                                    <span className="text-sm font-bold font-[family-name:var(--font-nunito)]">Waly</span>
                                </div>
                                <span className="text-gray-500 text-xs">
                                    © {new Date().getFullYear()} Waly, All rights reserved
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
} 