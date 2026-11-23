import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type Transition,
  type Variants,
} from 'motion/react'
import { createContext, useContext, useEffect, type CSSProperties, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type TextKind = 'slide' | 'wipe'
export type ArtKind = 'wheel' | 'wipe'

// In-out curves to compare; the wheel can also use a spring.
export const CURVES = {
  expo: [0.87, 0, 0.13, 1],
  quint: [0.83, 0, 0.17, 1],
  quart: [0.76, 0, 0.24, 1],
} as const
export type TextCurve = keyof typeof CURVES
export type WheelCurve = TextCurve | 'spring'
export const CurveCtx = createContext<{ text: TextCurve; wheel: WheelCurve }>({ text: 'expo', wheel: 'spring' })
export const CurveProvider = CurveCtx.Provider

export const WIPE = 0.9
const SLIDE = 0.8
const WHEEL = 1.2

// Wipe: the bar grows from the left, holds while the content swaps, then retracts to the left.
const swapAtMidpoint: Transition = { delay: WIPE / 2, duration: 0 }
const ink: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: swapAtMidpoint },
  exit: { opacity: 0, transition: swapAtMidpoint },
}
const LINE_SWEEP = ['0% 100%', '100% 100%', '100% 100%', '0% 100%']
const BOX_SWEEP = [0, 1, 1, 0]
function wipeBars(ease: (typeof CURVES)[TextCurve]) {
  const transition: Transition = { duration: WIPE, times: [0, 0.45, 0.55, 1], ease: [ease, 'linear', ease] }
  return {
    line: { center: { backgroundSize: LINE_SWEEP, transition }, exit: { backgroundSize: LINE_SWEEP, transition } } as Variants,
    box: { center: { scaleX: BOX_SWEEP, transition }, exit: { scaleX: BOX_SWEEP, transition } } as Variants,
  }
}
const BARS = Object.fromEntries(Object.entries(CURVES).map(([k, ease]) => [k, wipeBars(ease)])) as Record<
  TextCurve,
  ReturnType<typeof wipeBars>
>

// Read through context (provided outside AnimatePresence) so content that is already exiting still picks up
// the transition for the navigation that removed it.
// `swap`: the content is replaced (black wipe bar) rather than only appearing or disappearing (white).
type SlotState = { kind: TextKind; dir: number; distance: number; swap: boolean }
const SlotCtx = createContext<SlotState | null>(null)

/** A text region that transitions whenever `contentKey` changes; identical keys stay put. */
export function Slot({ state, contentKey, className, children }: {
  state: SlotState
  contentKey: string | false
  className?: string
  children?: ReactNode
}) {
  return (
    <SlotCtx.Provider value={state}>
      <AnimatePresence initial={false}>
        {contentKey !== false && (
          <SlotRoot key={contentKey} className={className}>
            {children}
          </SlotRoot>
        )}
      </AnimatePresence>
    </SlotCtx.Provider>
  )
}

function SlotRoot({ className, children }: { className?: string; children?: ReactNode }) {
  const { kind, dir, distance } = useContext(SlotCtx)!
  const t: Transition = { duration: SLIDE, ease: CURVES[useContext(CurveCtx).text] }
  // Slide: the new box comes in one grid column over (from the right when moving down the nav).
  const variants: Variants =
    kind === 'slide'
      ? { enter: { x: dir * distance, opacity: 0 }, center: { x: 0, opacity: 1, transition: t }, exit: { x: -dir * distance, opacity: 0, transition: t } }
      : { enter: {}, center: {}, exit: { transition: { when: 'afterChildren' } } }
  return (
    <motion.div className={className} variants={variants} initial="enter" animate="center" exit="exit">
      {children}
    </motion.div>
  )
}

/**
 * Text that wipes: a bar per line (an inline background on a transparent copy of the text, so each
 * bar matches its line's extent) covers the text, the content swaps, and the bar retracts.
 */
export function Ink({ className, children }: { className?: string; children: ReactNode }) {
  const slot = useContext(SlotCtx)
  const wipe = slot?.kind === 'wipe'
  const color = slot?.swap ? '#000' : '#fff'
  const bars = BARS[useContext(CurveCtx).text]
  return (
    <div className={cn('relative', className)}>
      <motion.p variants={wipe ? ink : undefined}>{children}</motion.p>
      <div aria-hidden className="pointer-events-none absolute inset-0 text-transparent select-none [&_*]:text-transparent [&_[data-highlight]]:hidden">
        <motion.span
          className="box-decoration-clone bg-no-repeat"
          style={{ backgroundImage: `linear-gradient(${color}, ${color})`, backgroundSize: '0% 100%' }}
          variants={wipe ? bars.line : undefined}
        >
          {children}
        </motion.span>
      </div>
    </div>
  )
}

/** Non-text content that wipes with a single box. */
export function InkBox({ className, style, children }: { className?: string; style?: CSSProperties; children: ReactNode }) {
  const slot = useContext(SlotCtx)
  const wipe = slot?.kind === 'wipe'
  const bars = BARS[useContext(CurveCtx).text]
  return (
    <div className={cn('relative', className)} style={style}>
      <motion.div className="size-full" variants={wipe ? ink : undefined}>{children}</motion.div>
      <motion.div
        className={cn('pointer-events-none absolute inset-0 origin-left', slot?.swap ? 'bg-black' : 'bg-white')}
        style={{ scaleX: 0 }}
        variants={wipe ? bars.box : undefined}
      />
    </div>
  )
}

type ArtState = { kind: ArtKind; dir: number }
const ArtCtx = createContext<ArtState>({ kind: 'wipe', dir: 1 })

/**
 * The bottom-left art. "wheel": every page's art sits on a wheel centred on the frame's bottom-left corner
 * (only a quarter is ever visible) that turns 90° per page. "wipe": a box over the art region, white
 * (unlike other swaps) because a black one that size overwhelms the page.
 */
export function ArtStage({ state, artKey, artTop, children }: {
  state: ArtState
  artKey: string
  artTop: number
  children: ReactNode
}) {
  return (
    <ArtCtx.Provider value={state}>
      <AnimatePresence initial={false}>
        <ArtRoot key={artKey} artTop={artTop}>
          {children}
        </ArtRoot>
      </AnimatePresence>
    </ArtCtx.Provider>
  )
}

const wheelTransition = (curve: WheelCurve): Transition =>
  curve === 'spring' ? { type: 'spring', visualDuration: WHEEL, bounce: 0.12 } : { duration: WHEEL, ease: CURVES[curve] }

function ArtRoot({ artTop, children }: { artTop: number; children: ReactNode }) {
  const { kind, dir } = useContext(ArtCtx)
  const curves = useContext(CurveCtx)
  const wheel = kind === 'wheel'
  const t = wheelTransition(curves.wheel)
  const turn: Variants = wheel
    ? { enter: { rotate: -90 * dir }, center: { rotate: 0, transition: t }, exit: { rotate: 90 * dir, transition: t } }
    : { enter: {}, center: {}, exit: { transition: { when: 'afterChildren' } } }
  // Outgoing art fades only over the last third of its quarter turn (60° → 90°), whatever the curve.
  // Incoming art travels from -90° to 0° on the same wheel, so it never enters the fade range.
  const rotate = useMotionValue(0)
  const direction = useMotionValue(dir)
  useEffect(() => direction.set(dir), [direction, dir])
  const opacity = useTransform(() => 1 - Math.min(1, Math.max(0, (rotate.get() * direction.get() - 60) / 30)))
  const bars = BARS[curves.text]
  return (
    // Darken keeps the art group's white halftone ground from covering text while it's isolated by the
    // rotation transform; at rest it composites the same as the per-layer blend modes in Figma.
    <motion.div
      className="absolute inset-0 origin-bottom-left mix-blend-darken"
      style={{ rotate, opacity }}
      variants={turn}
      initial="enter"
      animate="center"
      exit="exit"
    >
      <motion.div className="absolute inset-0" variants={wheel ? undefined : ink}>
        {children}
      </motion.div>
      <motion.div
        className="absolute left-0 origin-left bg-white w-[calc(var(--grid-margin)+2*(var(--grid-col)+var(--grid-gutter)))]"
        style={{ top: artTop, bottom: 0, scaleX: 0 }}
        variants={wheel ? undefined : bars.box}
      />
    </motion.div>
  )
}

const TRAIL_ANGLE = 15
const TRAIL_DELAY = 0.1

/**
 * An art layer that trails the wheel by `index` steps: it rides each turn `index × TRAIL_ANGLE` behind and
 * catches up `index × TRAIL_DELAY` later, so stacked layers swing in one after another. Static outside the wheel.
 * Shares the art box (and so the wheel's pivot); being transformed, it needs any blend mode on itself.
 */
export function WheelTrail({ index, className, children }: { index: number; className?: string; children: ReactNode }) {
  const { kind, dir } = useContext(ArtCtx)
  const t = wheelTransition(useContext(CurveCtx).wheel)
  const lag = -TRAIL_ANGLE * index * dir
  const variants: Variants | undefined =
    kind === 'wheel' && index > 0
      ? {
          enter: { rotate: lag },
          center: { rotate: 0, transition: { ...t, delay: TRAIL_DELAY * index } },
          exit: { rotate: lag, transition: t },
        }
      : undefined
  return (
    <motion.div className={cn('absolute inset-0 origin-bottom-left', className)} variants={variants}>
      {children}
    </motion.div>
  )
}

/**
 * Highlight behind a phrase in the page's --accent colour (Figma 66:785: 39px tall from the line top, starting half a gutter
 * before the text) that wipes in from the left 3.5s after mount to draw the eye, then stays.
 */
export function Highlight({ children }: { children: ReactNode }) {
  const ease = CURVES[useContext(CurveCtx).text]
  const reduced = useReducedMotion()
  // Driven imperatively: a parent AnimatePresence with initial={false} would otherwise skip the entrance.
  const scaleX = useMotionValue(reduced ? 1 : 0)
  useEffect(() => {
    if (reduced) return
    const controls = animate(scaleX, 1, { delay: 3.5, duration: 0.7, ease })
    return () => controls.stop()
  }, [scaleX, ease, reduced])
  return (
    <span className="relative">
      <motion.span
        data-highlight
        className="absolute top-0 right-0 -left-[calc(var(--grid-gutter,20px)/2)] h-[39px] origin-left bg-(--accent) transition-colors duration-500"
        style={{ scaleX }}
      />
      {/* Positioned so it paints above the highlight, which Figma layers underneath the text. */}
      <span className="relative">{children}</span>
    </span>
  )
}
