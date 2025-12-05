"use client";

import { motion } from "motion/react";
import {
	Zap,
	Grid3X3,
	Sparkles,
	Monitor,
	Layers,
	Settings,
} from "lucide-react";
import { highlights } from "@/lib/data";

const iconMap = {
	Zap,
	Grid3X3,
	Sparkles,
	Monitor,
	Layers,
	Settings,
};

export function Highlights() {
	return (
		<section className="bg-muted/20 px-4 py-20 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-7xl">
				<div className="mb-16 text-center">
					<h2 className="mb-4 text-balance font-bold text-4xl text-foreground sm:text-5xl">
						Why Choose MangoWC
					</h2>
					<p className="mx-auto max-w-2xl text-balance text-foreground/70 text-lg">
						A modern Wayland compositor that combines dwl's speed with advanced
						features for the perfect desktop experience
					</p>
				</div>

				<motion.div
					className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-100px" }}
					variants={{
						hidden: { opacity: 0 },
						visible: {
							opacity: 1,
							transition: {
								staggerChildren: 0.1,
							},
						},
					}}
				>
					{highlights.map((highlight, index) => {
						const IconComponent =
							iconMap[highlight.icon as keyof typeof iconMap];
						return (
							<motion.div
								key={highlight.title}
								variants={{
									hidden: { opacity: 0, y: 20 },
									visible: { opacity: 1, y: 0 },
								}}
								transition={{ duration: 0.5 }}
								className="rounded-lg border border-border bg-background p-6 transition-colors hover:border-primary"
							>
								<div className="flex items-center gap-3 mb-3">
									<IconComponent className="h-5 w-5 text-primary flex-shrink-0" />
									<h3 className="font-bold text-foreground text-lg">
										{highlight.title}
									</h3>
								</div>
								<p className="text-foreground/80 leading-relaxed">
									{highlight.description}
								</p>
							</motion.div>
						);
					})}
				</motion.div>
			</div>
		</section>
	);
}
