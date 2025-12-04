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

interface ScrollerLayoutProps {
	orientation: "horizontal" | "vertical";
}

// ============================================================================
// 2. SCROLLER LAYOUT
// ============================================================================
export function ScrollerLayout({ orientation }: ScrollerLayoutProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const trackRef = useRef<HTMLDivElement>(null);
	const leftRef = useRef<HTMLDivElement>(null);
	const centerRef = useRef<HTMLDivElement>(null);
	const rightRef = useRef<HTMLDivElement>(null);

	const [animationPhase, setAnimationPhase] = useState(0);
	const [loopKey, setLoopKey] = useState(0);

	// Setup Transitions
	useEffect(() => {
		// Items
		[leftRef, centerRef, rightRef].forEach((ref) => {
			if (ref.current) {
				ref.current.style.transition = "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
			}
		});
		// Track
		if (trackRef.current) {
			// Changed from specific properties to 'all' to handle orientation switches gracefully
			trackRef.current.style.transition =
				"all 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
			trackRef.current.style.willChange = "width, height, transform";
		}
	}, []);

	// Main Logic
	useEffect(() => {
		const update = () => {
			const container = containerRef.current;
			const track = trackRef.current;
			if (!container || !track) return;

			const width = container.clientWidth;
			const height = container.clientHeight;

			const isVert = orientation === "vertical";
			// Dimension used for spacing (Width for Horizontal, Height for Vertical)
			const dim = isVert ? height : width;

			// Responsive Gap Calculation
			const GAP = Math.min(20, dim * 0.05);
			const halfScreen = 50; // Percentage
			const phase = animationPhase;

			// Track Logic (Absolute Positioning Fix)
			const isExpandedTrack = phase >= 3 && phase <= 5;
			const trackMultiplier = isExpandedTrack ? 1.5 : 1.0;

			// Reset styles to avoid conflicts when switching orientation
			track.style.width = "";
			track.style.height = "";
			track.style.transform = "";

			if (isVert) {
				track.style.width = "100%";
				track.style.height = `${height * trackMultiplier}px`;
			} else {
				track.style.width = `${width * trackMultiplier}px`;
				track.style.height = "100%";
			}
			track.style.position = "absolute";
			track.style.top = "0";
			track.style.left = "0";

			// Transform Logic
			let scrollTargetPercent = 0;
			if (phase === 3 || phase === 4 || phase === 5) {
				scrollTargetPercent = 50;
			}
			const scrollOffset = (dim * scrollTargetPercent) / 100;

			if (isVert) {
				track.style.transform = `translateY(-${scrollOffset}px)`;
			} else {
				track.style.transform = `translateX(-${scrollOffset}px)`;
			}

			// Window Logic
			const set = (
				el: HTMLDivElement | null,
				offsetPercent: number, // xPercent or yPercent
				sizePercent: number, // widthPercent or heightPercent
				visible = true,
				active = false,
			) => {
				if (!el) return;
				const rawPos = (dim * offsetPercent) / 100;
				const rawSize = (dim * sizePercent) / 100;

				const isVisuallyFirst = offsetPercent === scrollTargetPercent;
				const isVisuallyLast =
					offsetPercent + sizePercent === scrollTargetPercent + 100;

				const actualPos = isVisuallyFirst ? rawPos : rawPos + GAP / 2;
				let actualSize = rawSize;
				if (!isVisuallyFirst) actualSize -= GAP / 2;
				if (!isVisuallyLast) actualSize -= GAP / 2;

				actualSize = Math.max(actualSize, 0);

				el.style.position = "absolute";
				el.style.opacity = visible ? "1" : "0";
				el.style.transform = visible ? "scale(1)" : "scale(0.9)";
				el.className = cn(CARD_BASE, active ? CARD_ACTIVE : CARD_INACTIVE);

				if (isVert) {
					el.style.left = "0px";
					el.style.width = "100%";
					el.style.top = `${actualPos}px`;
					el.style.height = `${actualSize}px`;
				} else {
					el.style.top = "0px";
					el.style.height = "100%";
					el.style.left = `${actualPos}px`;
					el.style.width = `${actualSize}px`;
				}
			};

			// Phase States (Same logic, mapped to Vertical/Horizontal via `set`)
			if (phase === 0) {
				set(leftRef.current, 0, halfScreen, false, false);
				set(centerRef.current, 100, halfScreen, false, false);
				set(rightRef.current, 200, halfScreen, false, false);
			} else if (phase === 1) {
				set(leftRef.current, 25, halfScreen, true, true);
				set(centerRef.current, 100, halfScreen, false, false);
				set(rightRef.current, 200, halfScreen, false, false);
			} else if (phase === 2) {
				set(leftRef.current, 0, halfScreen, true, false);
				set(centerRef.current, 50, halfScreen, true, true);
				set(rightRef.current, 200, halfScreen, false, false);
			} else if (phase === 3) {
				set(leftRef.current, 0, halfScreen, true, false);
				set(centerRef.current, 50, halfScreen, true, false);
				set(rightRef.current, 100, halfScreen, true, true);
			} else if (phase === 4) {
				set(leftRef.current, 0, halfScreen, true, false);
				set(centerRef.current, 100, halfScreen, true, false);
				set(rightRef.current, 50, halfScreen, true, true);
			} else if (phase === 5) {
				set(rightRef.current, 50, 100, true, true);
				set(centerRef.current, 150, halfScreen, true, false);
				set(leftRef.current, -50, halfScreen, true, false);
			} else if (phase === 6) {
				set(rightRef.current, 50, halfScreen, false, false);
				set(centerRef.current, 50, halfScreen, true, true);
				set(leftRef.current, 0, halfScreen, true, false);
			} else if (phase === 7) {
				set(leftRef.current, 25, halfScreen, true, true);
				set(centerRef.current, 50, halfScreen, false, false);
				set(rightRef.current, 50, halfScreen, false, false);
			} else if (phase === 8) {
				set(leftRef.current, 25, halfScreen, false, false);
				set(centerRef.current, 50, halfScreen, false, false);
				set(rightRef.current, 50, halfScreen, false, false);
			}
		};

		update();
		const ro = new ResizeObserver(update);
		ro.observe(containerRef.current as Element);
		return () => ro.disconnect();
	}, [animationPhase, orientation]);

	// Loop Timing
	useEffect(() => {
		const timeouts = TIMINGS.map((t) =>
			setTimeout(() => setAnimationPhase(t.phase), t.delay),
		);
		const loop = setTimeout(
			() => setLoopKey((prev) => prev + 1),
			TOTAL_DURATION,
		);
		return () => {
			timeouts.forEach(clearTimeout);
			clearTimeout(loop);
		};
	}, [loopKey]);

	return (
		<div ref={containerRef} className="relative h-full w-full overflow-hidden">
			<div ref={trackRef} className="absolute top-0 left-0 h-full w-full">
				<div ref={leftRef} className="absolute opacity-0">
					1
				</div>
				<div ref={centerRef} className="absolute opacity-0">
					2
				</div>
				<div ref={rightRef} className="absolute opacity-0">
					3
				</div>
			</div>
		</div>
	);
}
