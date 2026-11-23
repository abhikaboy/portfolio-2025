import {
  animate,
  AnimatePresence,
  motion,
  useAnimationFrame,
  useIsPresent,
  useMotionValue,
  useSpring,
  type AnimationPlaybackControls,
  type Transition,
} from 'motion/react'
import { useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import designedImg from '@/assets/figma/designed.png'
import experiencedImg from '@/assets/figma/experienced.png'
import heroPoster from '@/assets/figma/hero-poster.png'
import heroVideo from '@/assets/figma/hero-boomerang.mp4'
import projectsImg from '@/assets/figma/projects.png'
import writtenImg from '@/assets/figma/written.png'
import { Halftone, mediaClass } from '@/components/halftone'
import { cn } from '@/lib/utils'
import { CURVES, CurveCtx, Highlight, Ink, InkBox, WheelTrail } from '@/transitions'

export const NAV = ['created', 'experienced', 'written', 'designed'] as const
export type Route = '' | (typeof NAV)[number]

type Bar = { x: number; y: number; w: number; h: number }
/** `muted` rows are the grey "Project:" lines under a job (Figma 71:795–71:802). */
export type Row = { title: string; text: string; href?: string; muted?: boolean }

export type Page = {
  heading?: string
  /** `bar` makes rows selectable (arrow keys / click); `media` shows the selected row's image slot below it. */
  list?: { gap: number; center?: boolean; rows: Row[]; bar?: Bar; media?: boolean }
  /** The big statement, regular/bold/regular like Figma's; its first phrase is highlighted. */
  statement?: ReactNode
  /** Statement highlight colour, matched to the page's halftone art. */
  accent?: string
  /** Positioned in Figma frame coordinates (1117px tall); `artTop` is the highest visible art pixel. */
  art: ReactNode
  artTop: number
}

const STREAM_DOCS = 'https://www.mongodb.com/docs/atlas/atlas-stream-processing'

const DESCRIPTION =
  'This is the description for the application and the copy is around this long with justified test to showcase what it might look like although it might be longer'

// hero-boomerang.mp4 is hero.mp4, a 4s hold on its last frame, then its reverse (browsers can't play backwards
// smoothly), rendered with:
// ffmpeg -i hero.mp4 -filter_complex "[0:v]split[a][b];[a]tpad=stop_mode=clone:stop_duration=4[f];[b]reverse,trim=start_frame=1,setpts=PTS-STARTPTS[r];[f][r]concat=n=2:v=1:a=0[v]" -map "[v]" -c:v libx264 -crf 18 -preset slow -movflags +faststart hero-boomerang.mp4
/** Plays forward, holds, plays back, holds 4s, repeats; play() on an ended video restarts it. */
function HeroVideo() {
  const timer = useRef<number>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])
  return (
    <video
      className={mediaClass}
      src={heroVideo}
      poster={heroPoster}
      autoPlay
      muted
      playsInline
      onEnded={(e) => {
        const video = e.currentTarget
        timer.current = window.setTimeout(() => void video.play(), 4000)
      }}
    />
  )
}

// Figma 41:645 — the hero variant with the video fill.
const hero: Page = {
  statement: (
    <>
      <span className="text-[#2b2b2b]">
        <Highlight>i’m beak</Highlight>, i’m a
      </span>{' '}
      <span className="font-bold">designer and engineer</span>{' '}
      <span className="text-[#2b2b2b]">based in NYC that crafts products, experiences, and vibes.</span>
    </>
  ),
  accent: '#ff0000', // Figma 66:785, the flower's red
  artTop: 401,
  // Right edge sits on the end of grid column 2 (x=854 at 1728).
  art: (
    <Halftone dotSize={11} className="top-[401px] left-[calc(var(--grid-margin)+2*var(--grid-col)+var(--grid-gutter)-1147px)] h-[624px] w-[1147px]">
      <div className="relative h-[624px] w-[1147px]">
        <HeroVideo />
      </div>
    </Halftone>
  ),
}

// Figma 41:711
const created: Page = {
  heading: 'Projects',
  list: {
    gap: 36,
    media: true,
    bar: { x: -31, y: -1, w: 132, h: 19 },
    rows: [
      { title: 'Streamlight', text: DESCRIPTION },
      { title: 'Kindred', text: DESCRIPTION },
      { title: 'PlateMate', text: DESCRIPTION },
      { title: 'Platnm', text: DESCRIPTION },
      { title: 'Relay', text: DESCRIPTION },
    ],
  },
  artTop: 333,
  art: (
    <Halftone dotSize={16} className="left-[-180px] top-[333px] h-[813px] w-[1083px] mix-blend-darken">
      <div className="relative h-[813px] w-[1083px]">
        <img alt="" className={mediaClass} src={projectsImg} />
      </div>
    </Halftone>
  ),
}

// Each leaf trails the one in front on the wheel; `layer` (blend, opacity) goes on the trail wrapper.
const leaf = (index: number, layer: string, className: string, rotate: string) => (
  <WheelTrail index={index} className={layer}>
    <div className={`absolute flex items-center justify-center ${className}`}>
      <Halftone dotSize={16} className={`relative size-[1009.414px] flex-none ${rotate}`}>
        <div className="relative size-[1009.414px]">
          <img alt="" className={mediaClass} src={experiencedImg} />
        </div>
      </Halftone>
    </div>
  </WheelTrail>
)

// Figma 41:656
const experienced: Page = {
  heading: 'Experiences',
  statement: (
    <>
      <span className="text-[#2b2b2b]">
        <Highlight>i’m beak</Highlight>, i’m currently on
      </span>{' '}
      <span className="font-bold">MongoDB’s stream processing team</span>{' '}
      <span className="text-[#2b2b2b]">building database and real-time streaming infrastructure.</span>
    </>
  ),
  accent: '#00ff00', // the leaves' halftone green
  list: {
    gap: 12,
    center: true,
    rows: [
      { title: 'Software Engineer II', text: 'MongoDB', href: 'https://www.mongodb.com' },
      // Figma shows $cachedLookup on both MongoDB rows; $throttle belongs to this one.
      { title: 'Project:', text: '$throttle', href: `${STREAM_DOCS}/sp-agg-throttle/`, muted: true },
      { title: 'Software Engineer Co-op', text: 'Klaviyo', href: 'https://www.klaviyo.com' },
      { title: 'Project:', text: 'Social Sign On, OAuth 2.1, MCP Auth', muted: true },
      { title: 'Software Engineer Intern', text: 'MongoDB', href: 'https://www.mongodb.com' },
      { title: 'Project:', text: '$cachedLookup', href: `${STREAM_DOCS}/sp-agg-cachedlookup/`, muted: true },
      { title: 'Founder', text: 'Kindred', href: 'https://kindredtodo.com' },
    ],
  },
  artTop: 175,
  art: (
    <>
      {leaf(0, '', 'left-[-467px] top-[188px] size-[1145.568px]', 'rotate-[-8.37deg]')}
      {leaf(1, 'mix-blend-multiply opacity-50', 'left-[-265.73px] top-[175.27px] size-[1249.263px]', 'rotate-[16.06deg]')}
      {leaf(2, 'mix-blend-multiply opacity-20', 'left-[-162px] top-[285px] size-[1420.735px]', 'rotate-[50.59deg]')}
    </>
  ),
}

// Figma 41:681
const written: Page = {
  heading: 'Written',
  list: { gap: 0, bar: { x: -31, y: -1, w: 85, h: 19 }, rows: [{ title: 'Ooika', text: DESCRIPTION }] },
  artTop: 360,
  art: (
    <Halftone dotSize={17} className="left-[-129px] top-[360px] h-[846px] w-[1196px]">
      <div className="relative h-[846px] w-[1196px]">
        <img alt="" className={mediaClass} src={writtenImg} />
      </div>
    </Halftone>
  ),
}

// Figma 41:695
const designed: Page = {
  heading: 'Designed',
  list: {
    gap: 32,
    bar: { x: -20, y: 0, w: 153, h: 17 },
    media: true,
    rows: [{ title: 'Phinista Posters', text: DESCRIPTION }],
  },
  artTop: 209,
  art: (
    <>
      <Halftone dotSize={12} className="left-[-206px] top-[209px] size-[937px]">
        <div className="relative size-[937px]">
          <img alt="" className={mediaClass} src={designedImg} />
        </div>
      </Halftone>
      <Halftone dotSize={12} className="left-[191px] top-[599px] size-[937px] mix-blend-darken">
        <div className="relative size-[937px]">
          <img alt="" className={mediaClass} src={designedImg} />
        </div>
      </Halftone>
    </>
  ),
}

export const PAGES: Record<Route, Page> = { '': hero, created, experienced, written, designed }

const NAV_ITEMS: { route: Route; label: string }[] = [
  { route: '', label: 'home' },
  ...NAV.map((route) => ({ route, label: route })),
]
// Nav highlight bar (white, mix-blend-difference) top within the nav, per Figma "Frame 6": +4px on the
// first two rows, +2px below. "home" is new (not in Figma) and takes the first row's +4px.
const NAV_BAR_TOP: Record<Route, number> = { '': 12, created: 43, experienced: 74, written: 103, designed: 134 }

/** The highlight bar marks the current page and slides to whichever item is hovered or focused. */
export function Nav({ active }: { active: Route }) {
  const [hover, setHover] = useState<Route | null>(null)
  return (
    <nav className="relative" onMouseLeave={() => setHover(null)} onBlur={() => setHover(null)}>
      <div className="flex w-[127px] flex-col items-start gap-[8px] overflow-clip rounded-[16px] bg-[rgba(255,255,255,0.1)] py-[8px] text-[20px] leading-[23px] whitespace-nowrap text-black">
        {NAV_ITEMS.map(({ route, label }) => (
          <a
            key={label}
            href={`#/${route}`}
            aria-current={route === active ? 'page' : undefined}
            onMouseEnter={() => setHover(route)}
            onFocus={() => setHover(route)}
          >
            {label}
          </a>
        ))}
      </div>
      <div
        className="pointer-events-none absolute top-0 left-[7px] h-[19px] w-[132px] bg-white mix-blend-difference transition-transform duration-300 ease-out motion-reduce:transition-none"
        style={{ transform: `translateY(${NAV_BAR_TOP[hover ?? active]}px)` }}
      />
    </nav>
  )
}

// Figma rounds Aeonik's 1.16em "auto" line height to whole px (23/28/56); Chrome would give 24/28/56.
// All 20px text uses -2% tracking (Figma's other frames still show -4%; -2% is the agreed value).
export const body = 'text-[20px] leading-[23px] tracking-[-0.02em] text-[#2b2b2b] text-justify'

export const statement = 'text-[48px] leading-[56px] tracking-[-0.04em] text-black'

// Placeholder bio copy.
export const HERO_COPY = [
  'I just graduated from Northeastern, where I studied computer science and design. I believe the best work comes from combining the rigor of science with the care of design.',
  'Today I’m a software engineer at MongoDB, where I get to dig into database internals and streaming systems. Outside of work I’m always building something of my own, most recently Kindred.',
]

// Figma "Frame 7": 1247×411 with the built-in dot pattern fill (dashed border and 24px radius removed).
export function Placeholder() {
  return (
    <svg width={1247} height={411} className="block shrink-0" aria-hidden>
      <defs>
        {/* Whole dots only: without a border, Figma's 11.5/1.5 phase leaves cut-off dots along the edges. */}
        <pattern id="dot-grid" width={24} height={24} patternUnits="userSpaceOnUse">
          <rect x={10} y={10} width={4} height={4} fill="#ebebeb" />
        </pattern>
      </defs>
      <rect width={1247} height={411} fill="url(#dot-grid)" />
    </svg>
  )
}

// Description lists get looser leading than Figma's 23px auto; single-line lists (experienced) keep it.
const DESCRIPTION_LEADING = 28

// Figma's from-font underline, on the visible copy only so it can't show over a wipe bar.
const projectUnderline = '[&>p]:underline [&>p]:decoration-from-font [&>p]:[text-underline-position:from-font]'

/** Offset of `el` from the top of `ancestor`, in its own (unzoomed) CSS px. */
function offsetWithin(el: HTMLElement, ancestor: HTMLElement) {
  let top = 0
  for (let n: HTMLElement | null = el; n && n !== ancestor; n = n.offsetParent as HTMLElement | null) top += n.offsetTop
  return top
}

function scrollParent(el: HTMLElement | null) {
  for (let n = el?.parentElement; n; n = n.parentElement) if (/auto|scroll/.test(getComputedStyle(n).overflowY)) return n
  return null
}

export function List({ list, stacked }: { list: NonNullable<Page['list']>; stacked?: boolean }) {
  const described = !list.center
  const selectable = !!list.bar
  const [selected, setSelected] = useState(0)
  const present = useIsPresent()
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const mediaRefs = useRef<(HTMLDivElement | null)[]>([])
  const ease = CURVES[useContext(CurveCtx).text]
  // Image slots open/close and the column scrolls on this one curve, so they stay in step.
  const reflow: Transition = { duration: 0.6, ease }
  const scrolling = useRef<AnimationPlaybackControls>(null)
  useEffect(() => () => scrolling.current?.stop(), [])

  // The bar is placed against the title's glyphs, which sit half the extra leading lower in a taller line.
  const shift = described ? (DESCRIPTION_LEADING - 23) / 2 : 0
  // The indicator springs toward the selected row's live position, so it tracks rows that are still reflowing.
  const target = useMotionValue(0)
  const barTop = useSpring(target, { stiffness: 500, damping: 45 })
  useAnimationFrame(() => {
    const row = itemRefs.current[selected]
    if (!row || !list.bar) return
    const top = row.offsetTop + list.bar.y + shift
    if (target.get() === 0 && barTop.get() === 0) barTop.jump(top)
    target.set(top)
  })

  const select = (i: number) => {
    if (i === selected || i < 0 || i >= list.rows.length) return
    const row = itemRefs.current[i]
    const scroller = scrollParent(row)
    if (row && scroller) {
      // Bring the row to the top of the column, measured where it will settle once the open slots above collapse.
      // A native smooth scroll runs on its own curve, so a row below the collapsing slot would bob down then up.
      const collapsing = mediaRefs.current.slice(0, i).reduce((h, m) => h + (m?.offsetHeight ?? 0), 0)
      scrolling.current?.stop()
      scrolling.current = animate(scroller.scrollTop, offsetWithin(row, scroller) - collapsing - 20, {
        ...reflow,
        onUpdate: (top) => (scroller.scrollTop = top),
      })
    }
    setSelected(i)
  }

  useEffect(() => {
    if (!selectable || !present) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
      e.preventDefault()
      select(selected + (e.key === 'ArrowDown' ? 1 : -1))
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  })

  const bar = list.bar && { left: list.bar.x, top: barTop, width: list.bar.w, height: list.bar.h }
  return (
    <div className={`relative flex flex-col items-start ${stacked ? 'w-full' : 'grid-w-2'}`} style={{ gap: list.gap }}>
      {/* White underlay so the difference bar still inverts while a slide isolates the list in its own layer. */}
      {bar && <motion.div className="absolute bg-white" style={bar} />}
      {list.rows.map((row, i) => (
        <div key={i} ref={(el) => void (itemRefs.current[i] = el)} className="w-full">
          <div
            className={cn(
              body,
              'flex w-full',
              described && 'leading-[28px]',
              selectable && 'cursor-pointer',
              row.muted && 'text-[#b1b1b1]',
              stacked ? 'flex-col gap-[4px]' : ['gap-(--grid-gutter)', list.center && !row.muted ? 'items-center' : 'items-start'],
            )}
            onClick={selectable ? () => select(i) : undefined}
          >
            <Ink className={stacked ? 'max-w-[385px]' : 'grid-w-1 shrink-0'}>{row.title}</Ink>
            {row.href ? (
              <div className={stacked ? 'max-w-[385px]' : 'grid-w-1 shrink-0'}>
                <a
                  href={row.href}
                  target="_blank"
                  rel="noreferrer"
                  className={cn('inline-block', row.muted ? 'hover:text-[#2b2b2b]' : 'underline-offset-[3px] hover:underline')}
                >
                  <Ink className={cn(row.muted && projectUnderline)}>{row.text}</Ink>
                </a>
              </div>
            ) : (
              <Ink className={stacked ? 'max-w-[385px]' : 'grid-w-1 shrink-0'}>{row.text}</Ink>
            )}
          </div>
          {/* Only the selected work shows its image slot; it opens/closes in place so the rows below reflow. */}
          <AnimatePresence initial={false}>
            {list.media && i === selected && (
              <motion.div
                ref={(el) => void (mediaRefs.current[i] = el)}
                className="overflow-hidden"
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={reflow}
              >
                <div style={{ paddingTop: list.gap }}>
                  <InkBox className="shrink-0">
                    <Placeholder />
                  </InkBox>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
      {bar && (
        <motion.div className="pointer-events-none absolute" style={bar}>
          <InkBox className="size-full">
            <div className="size-full bg-white mix-blend-difference" />
          </InkBox>
        </motion.div>
      )}
    </div>
  )
}
