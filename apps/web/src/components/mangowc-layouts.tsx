"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ScrollerLayout } from "./layouts/scroller-layout";
import { TileLayout } from "./layouts/tile-layout";

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export function MangowcLayouts() {
	const [activeLayout, setActiveLayout] = useState<"tiling" | "scroller">(
		"tiling",
	);
	const [orientation, setOrientation] = useState<"horizontal" | "vertical">(
		"horizontal",
	);

	return (
		<div className="mx-auto w-full max-w-4xl space-y-4 p-4">
			<div className="flex flex-col items-end gap-2 sm:flex-row sm:justify-end">
				{/* Layout Selector */}
				<div className="inline-flex rounded-full border border-border bg-muted p-1">
					<button
						type="button"
						onClick={() => setActiveLayout("tiling")}
						className={cn(
							"cursor-pointer rounded-full px-4 py-1.5 font-medium text-sm transition-all",
							activeLayout === "tiling"
								? "bg-background text-foreground shadow-sm"
								: "text-muted-foreground hover:text-foreground",
						)}
					>
						Tiling
					</button>
					<button
						type="button"
						onClick={() => setActiveLayout("scroller")}
						className={cn(
							"cursor-pointer rounded-full px-4 py-1.5 font-medium text-sm transition-all",
							activeLayout === "scroller"
								? "bg-background text-foreground shadow-sm"
								: "text-muted-foreground hover:text-foreground",
						)}
					>
						Scroller
					</button>
				</div>

				{/* Orientation Selector */}
				<div className="inline-flex rounded-full border border-border bg-muted p-1">
					<button
						type="button"
						onClick={() => setOrientation("horizontal")}
						className={cn(
							"cursor-pointer rounded-full px-4 py-1.5 font-medium text-sm transition-all",
							orientation === "horizontal"
								? "bg-background text-foreground shadow-sm"
								: "text-muted-foreground hover:text-foreground",
						)}
					>
						Horizontal
					</button>
					<button
						type="button"
						onClick={() => setOrientation("vertical")}
						className={cn(
							"cursor-pointer rounded-full px-4 py-1.5 font-medium text-sm transition-all",
							orientation === "vertical"
								? "bg-background text-foreground shadow-sm"
								: "text-muted-foreground hover:text-foreground",
						)}
					>
						Vertical
					</button>
				</div>
			</div>

			<div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl border border-border bg-background/50 shadow-sm">
				{activeLayout === "tiling" && <TileLayout orientation={orientation} />}
				{activeLayout === "scroller" && (
					<ScrollerLayout orientation={orientation} />
				)}
			</div>
		</div>
	);
}
