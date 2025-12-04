"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
	CARD_ACTIVE,
	CARD_BASE,
	CARD_INACTIVE,
	TIMINGS,
	TOTAL_DURATION,
} from "./constants";

interface TileLayoutProps {
	orientation: "horizontal" | "vertical";
}

// ============================================================================
// 1. TILING LAYOUT
// ============================================================================
export function TileLayout({ orientation }: TileLayoutProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const r1 = useRef<HTMLDivElement>(null);
	const r2 = useRef<HTMLDivElement>(null);
	const r3 = useRef<HTMLDivElement>(null);

	const [phase, setPhase] = useState(0);
	const [loopKey, setLoopKey] = useState(0);

	// Setup Transitions
	useEffect(() => {
		[r1, r2, r3].forEach((ref) => {
			if (ref.current) {
				ref.current.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
			}
		});
	}, []);

	// Main Logic
	useEffect(() => {
		const update = () => {
			if (!containerRef.current) return;
			const width = containerRef.current.clientWidth;
			const height = containerRef.current.clientHeight;
			const gap = 16;

			// Horizontal Calculations (Master Left, Stack Right)
			const h_halfW = (width - gap) / 2;
			const h_halfH = (height - gap) / 2;
			const h_rightX = h_halfW + gap;
			const h_bottomY = h_halfH + gap;

			// Vertical Calculations (Master Top, Stack Bottom)
			const v_halfW = (width - gap) / 2;
			const v_halfH = (height - gap) / 2;
			const v_rightX = v_halfW + gap;
			const v_bottomY = v_halfH + gap;

			const set = (
				el: HTMLDivElement | null,
				x: number,
				y: number,
				w: number,
				h: number,
				visible: boolean,
				active: boolean,
			) => {
				if (!el) return;
				el.style.left = `${x}px`;
				el.style.top = `${y}px`;
				el.style.width = `${w}px`;
				el.style.height = `${h}px`;

				el.style.opacity = visible ? "1" : "0";
				el.style.transform = visible ? "scale(1)" : "scale(0.9)";
				el.className = cn(CARD_BASE, active ? CARD_ACTIVE : CARD_INACTIVE);
			};

			const isVert = orientation === "vertical";

			// Layout Phases
			if (phase === 0) {
				// Init: Full screen master
				set(r1.current, 0, 0, width, height, false, false);
				// Pre-position others
				if (isVert) {
					set(r2.current, 0, v_bottomY, width, v_halfH, false, false);
					set(r3.current, v_rightX, v_bottomY, v_halfW, v_halfH, false, false);
				} else {
					set(r2.current, h_rightX, 0, h_halfW, height, false, false);
					set(r3.current, h_rightX, h_bottomY, h_halfW, h_halfH, false, false);
				}
			} else if (phase === 1) {
				// Spawn 1 (Master)
				set(r1.current, 0, 0, width, height, true, true);
				if (isVert) {
					set(r2.current, 0, v_bottomY, width, v_halfH, false, false);
					set(r3.current, v_rightX, v_bottomY, v_halfW, v_halfH, false, false);
				} else {
					set(r2.current, h_rightX, 0, h_halfW, height, false, false);
					set(r3.current, h_rightX, h_bottomY, h_halfW, h_halfH, false, false);
				}
			} else if (phase === 2) {
				// Spawn 2 (Split)
				if (isVert) {
					// Master Top, Stack Bottom (Full Width)
					set(r1.current, 0, 0, width, v_halfH, true, false);
					set(r2.current, 0, v_bottomY, width, v_halfH, true, true);
					set(r3.current, v_rightX, v_bottomY, v_halfW, v_halfH, false, false);
				} else {
					// Master Left, Stack Right (Full Height)
					set(r1.current, 0, 0, h_halfW, height, true, false);
					set(r2.current, h_rightX, 0, h_halfW, height, true, true);
					set(r3.current, h_rightX, h_bottomY, h_halfW, h_halfH, false, false);
				}
			} else if (phase === 3) {
				// Spawn 3 (Split Stack)
				if (isVert) {
					// Master Top, Stack Bottom Split (Left/Right)
					set(r1.current, 0, 0, width, v_halfH, true, false);
					set(r2.current, 0, v_bottomY, v_halfW, v_halfH, true, false);
					set(r3.current, v_rightX, v_bottomY, v_halfW, v_halfH, true, true);
				} else {
					// Master Left, Stack Right Split (Top/Bottom)
					set(r1.current, 0, 0, h_halfW, height, true, false);
					set(r2.current, h_rightX, 0, h_halfW, h_halfH, true, false);
					set(r3.current, h_rightX, h_bottomY, h_halfW, h_halfH, true, true);
				}
			} else if (phase === 4) {
				// Swap
				if (isVert) {
					set(r1.current, v_rightX, v_bottomY, v_halfW, v_halfH, true, false);
					set(r2.current, 0, v_bottomY, v_halfW, v_halfH, true, false);
					set(r3.current, 0, 0, width, v_halfH, true, true);
				} else {
					set(r1.current, h_rightX, h_bottomY, h_halfW, h_halfH, true, false);
					set(r2.current, h_rightX, 0, h_halfW, h_halfH, true, false);
					set(r3.current, 0, 0, h_halfW, height, true, true);
				}
			} else if (phase === 5) {
				// Re-Swap (Back to normal)
				if (isVert) {
					set(r1.current, 0, 0, width, v_halfH, true, true);
					set(r2.current, 0, v_bottomY, v_halfW, v_halfH, true, false);
					set(r3.current, v_rightX, v_bottomY, v_halfW, v_halfH, true, false);
				} else {
					set(r1.current, 0, 0, h_halfW, height, true, true);
					set(r2.current, h_rightX, 0, h_halfW, h_halfH, true, false);
					set(r3.current, h_rightX, h_bottomY, h_halfW, h_halfH, true, false);
				}
			} else if (phase === 6) {
				// Despawn 3
				if (isVert) {
					set(r1.current, 0, 0, width, v_halfH, true, true);
					set(r2.current, 0, v_bottomY, width, v_halfH, true, false);
					set(r3.current, v_rightX, v_bottomY, v_halfW, v_halfH, false, false);
				} else {
					set(r1.current, 0, 0, h_halfW, height, true, true);
					set(r2.current, h_rightX, 0, h_halfW, height, true, false);
					set(r3.current, h_rightX, h_bottomY, h_halfW, h_halfH, false, false);
				}
			} else if (phase === 7) {
				// Despawn 2
				if (isVert) {
					set(r1.current, 0, 0, width, height, true, true);
					set(r2.current, 0, v_bottomY, width, v_halfH, false, false);
					set(r3.current, v_rightX, v_bottomY, v_halfW, v_halfH, false, false);
				} else {
					set(r1.current, 0, 0, width, height, true, true);
					set(r2.current, h_rightX, 0, h_halfW, height, false, false);
					set(r3.current, h_rightX, h_bottomY, h_halfW, h_halfH, false, false);
				}
			} else if (phase === 8) {
				// Despawn 1
				set(r1.current, 0, 0, width, height, false, false);
				if (isVert) {
					set(r2.current, 0, v_bottomY, width, v_halfH, false, false);
					set(r3.current, v_rightX, v_bottomY, v_halfW, v_halfH, false, false);
				} else {
					set(r2.current, h_rightX, 0, h_halfW, height, false, false);
					set(r3.current, h_rightX, h_bottomY, h_halfW, h_halfH, false, false);
				}
			}
		};

		update();
		const ro = new ResizeObserver(update);
		ro.observe(containerRef.current as Element);
		return () => ro.disconnect();
	}, [phase, orientation]); // Re-run when orientation changes

	// Loop Timing
	useEffect(() => {
		const timeouts = TIMINGS.map((t) =>
			setTimeout(() => setPhase(t.phase), t.delay),
		);
		const loop = setTimeout(() => setLoopKey((k) => k + 1), TOTAL_DURATION);
		return () => {
			timeouts.forEach(clearTimeout);
			clearTimeout(loop);
		};
	}, [loopKey]);

	return (
		<div
			ref={containerRef}
			className="relative h-full w-full overflow-hidden p-4"
		>
			<div ref={r1} className="absolute opacity-0">
				1
			</div>
			<div ref={r2} className="absolute opacity-0">
				2
			</div>
			<div ref={r3} className="absolute opacity-0">
				3
			</div>
		</div>
	);
}
