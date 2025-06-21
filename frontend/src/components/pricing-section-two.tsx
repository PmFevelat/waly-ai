import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function Pricing() {
    return (
        <div className="relative -mt-4 py-0">
            <div className="mx-auto max-w-5xl px-6">
                <div className="@container relative">
                    <Card className="@4xl:max-w-full relative mx-auto max-w-sm">
                        <div className="@4xl:grid-cols-3 grid">
                            <div>
                                <CardHeader className="p-8">
                                    <CardTitle className="font-medium">Starter</CardTitle>
                                    <span className="mb-0.5 mt-2 block text-2xl font-semibold">$0 / mo</span>
                                    <CardDescription className="text-sm">5 intro credits / month</CardDescription>
                                </CardHeader>
                                <div className="border-y px-8 py-4">
                                    <Button
                                        asChild
                                        className="w-full"
                                        variant="neutral">
                                        <Link href="#">Get Started</Link>
                                    </Button>
                                </div>

                                <ul
                                    role="list"
                                    className="space-y-3 p-8">
                                    {['Credits only used after double opt-in', 'AI-powered matching', 'Email support', 'No card required'].map((item, index) => (
                                        <li
                                            key={index}
                                            className="flex items-center gap-2">
                                            <Check
                                                className="text-primary size-3"
                                                strokeWidth={3.5}
                                            />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                                                    <div className="ring-foreground/10 bg-background rounded-(--radius) @3xl:mx-0 @3xl:-my-6 -mx-1 border-transparent shadow ring-1 transform scale-105">
                            <div className="@3xl:py-6 @3xl:px-0 relative px-1">
                                    <CardHeader className="p-8">
                                        <CardTitle className="font-medium">Growth</CardTitle>
                                        <span className="mb-0.5 mt-2 block text-2xl font-semibold">$39 / mo</span>
                                        <CardDescription className="text-sm">25 intro credits / month</CardDescription>
                                    </CardHeader>
                                    <div className="@3xl:mx-0 -mx-1 border-y px-8 py-4">
                                        <Button
                                            asChild
                                            className="w-full">
                                            <Link href="#">Get Started</Link>
                                        </Button>
                                    </div>

                                    <ul
                                        role="list"
                                        className="space-y-3 p-8">
                                        {['50% unused credits roll over', 'Credits only used after double opt-in', 'AI-powered matching', 'Priority chat support', 'Cancel anytime'].map((item, index) => (
                                            <li
                                                key={index}
                                                className="flex items-center gap-2">
                                                <Check
                                                    className="text-primary size-3"
                                                    strokeWidth={3.5}
                                                />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div>
                                <CardHeader className="p-8">
                                    <CardTitle className="font-medium">Scale</CardTitle>
                                    <span className="mb-0.5 mt-2 block text-2xl font-semibold">$89 / mo</span>
                                    <CardDescription className="text-sm">75 intro credits / month</CardDescription>
                                </CardHeader>
                                <div className="border-y px-8 py-4">
                                    <Button
                                        asChild
                                        className="w-full"
                                        variant="neutral">
                                        <Link href="#">Get Started</Link>
                                    </Button>
                                </div>

                                <ul
                                    role="list"
                                    className="space-y-3 p-8">
                                    {['Unlimited credit rollover', 'Credits only used after double opt-in', 'AI-powered matching', 'Dedicated Customer Success Manager', 'Cancel anytime'].map((item, index) => (
                                        <li
                                            key={index}
                                            className="flex items-center gap-2">
                                            <Check
                                                className="text-primary size-3"
                                                strokeWidth={3.5}
                                            />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
