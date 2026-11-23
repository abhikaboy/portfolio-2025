import { motion, MotionConfig } from 'motion/react'
import { useEffect, useRef, useState, type CSSProperties, type WheelEvent } from 'react'
import { cn } from '@/lib/utils'
import { body, HERO_COPY, List, Nav, NAV, PAGES, statement, type Page, type Route } from '@/pages'
import { ArtStage, CURVES, CurveProvider, Ink, Slot, WIPE, type ArtKind, type TextCurve, type TextKind, type WheelCurve } from '@/transitions'

// Figma frame size (MacBook Pro 16" preset).
const FRAME_W = 1728
const FRAME_H = 1117
// Width of the art strip shown on small screens: everything left of grid column 3 at 1728.
const ART_W = 874
const ORDER: Route[] = ['', ...NAV]

function useRoute(): Route {
  const read = () => {
    const r = location.hash.replace(/^#\/?/, '')
    return (NAV as readonly string[]).includes(r) ? (r as Route) : ''
  }
  const [route, setRoute] = useState(read)
  useEffect(() => {
    const onHash = () => setRoute(read())
    addEventListener('hashchange', onHash)
    return () => removeEventListener('hashchange', onHash)
  }, [])
  return route
}

function useViewport() {
  const [size, setSize] = useState({ w: innerWidth, h: innerHeight })
  useEffect(() => {
    const onResize = () => setSize({ w: innerWidth, h: innerHeight })
    addEventListener('resize', onResize)
    return () => removeEventListener('resize', onResize)
  }, [])
  return size
}

// Transition styles, picked after comparing the alternatives.
type Settings = { text: TextKind; art: ArtKind; homeArt: ArtKind; textCurve: TextCurve; wheelCurve: WheelCurve }
const SETTINGS: Settings = { text: 'slide', art: 'wheel', homeArt: 'wipe', textCurve: 'expo', wheelCurve: 'spring' }

export default function App() {
  const route = useRoute()
  const { w, h } = useViewport()
  // The route we're transitioning from, updated in render so both sides of a transition see the same plan.
  const [plan, setPlan] = useState({ from: route, to: route })
  if (plan.to !== route) setPlan({ from: plan.to, to: route })

  return (
    <MotionConfig reducedMotion="user">
      <CurveProvider value={{ text: SETTINGS.textCurve, wheel: SETTINGS.wheelCurve }}>
      {w >= 1024 ? (
        <Desktop route={route} from={plan.from} settings={SETTINGS} w={w} h={h} />
      ) : (
        <Mobile route={route} page={PAGES[route]} w={w} />
      )}
      </CurveProvider>
    </MotionConfig>
  )
}

const beak = 'text-[20px] leading-[23px] tracking-[-0.02em] text-black'

const hideScrollbar = '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden'

type SlotName = 'copy' | 'aside' | 'heading' | 'list' | 'statement'
const statementY = (r: Route) => (r === '' ? PAGES[''].artTop - 842 : 0)
const has = (r: Route, slot: SlotName) =>
  slot === 'copy' ? r === '' : slot === 'aside' ? r === '' || r === 'created' : !!PAGES[r][slot]

/**
 * The Figma frame in design px on its 4-column grid: 1:1 at or above 1728×1117, uniformly scaled down
 * below it. The page never scrolls; wheel input anywhere drives the content column.
 */
function Desktop({ route, from, settings, w, h }: { route: Route; from: Route; settings: Settings; w: number; h: number }) {
  const page = PAGES[route]
  const zoom = Math.min(1, w / FRAME_W, h / FRAME_H)
  const frameW = w / zoom
  const scroller = useRef<HTMLDivElement>(null)
  useEffect(() => {
    scroller.current?.scrollTo(0, 0)
  }, [route])
  const onWheel = (e: WheelEvent) => {
    const el = scroller.current
    if (el && !el.contains(e.target as Node)) el.scrollTop += e.deltaY / zoom
  }

  const home = from === '' || route === ''
  const dir = Math.sign(ORDER.indexOf(route) - ORDER.indexOf(from)) || 1
  // Slides travel one grid column + gutter.
  const distance = (frameW - 2 * 64 - 3 * 20) / 4 + 20
  const slot = (name: SlotName) => {
    const swap = has(from, name) && has(route, name)
    return { kind: (settings.text === 'slide' && !home && swap ? 'slide' : 'wipe') as TextKind, dir, distance, swap }
  }

  return (
    <main
      className="figma-grid relative overflow-hidden bg-white"
      style={{ zoom, width: frameW, height: h / zoom, '--accent': page.accent } as CSSProperties}
      onWheel={onWheel}
    >
      <Slot state={slot('copy')} contentKey={route === '' && 'copy'}>
        <Ink className={cn('absolute top-[43px] grid-x-2 grid-w-1', body)}>{HERO_COPY[0]}</Ink>
        {/* Figma 41:647 sits at x=464, 5px left of column 2; snapped to the grid. */}
        <Ink className={cn('absolute top-[182px] grid-x-2 grid-w-1', body)}>{HERO_COPY[1]}</Ink>
      </Slot>

      <Slot state={slot('aside')} contentKey={route === '' ? 'beak' : route === 'created' && 'hint'}>
        {route === '' ? (
          <a href="#/" className="absolute top-[48px] grid-x-4 grid-w-1">
            <Ink className={beak}>beak</Ink>
          </a>
        ) : (
          <NavigateHint />
        )}
      </Slot>

      <Slot state={slot('heading')} contentKey={page.heading ?? false}>
        <Ink className={cn('absolute top-[43px] grid-x-3 grid-w-1', body)}>{page.heading}</Ink>
        {/* Figma 41:712/41:713 stack two identical "Projects" layers; kept for a 1:1 render. */}
        {route === 'created' && (
          <div aria-hidden>
            <Ink className={cn('absolute top-[43px] grid-x-3 grid-w-1', body)}>{page.heading}</Ink>
          </div>
        )}
      </Slot>

      <div className="absolute top-[32px] grid-x-1">
        <Nav active={route} />
      </div>

      {/* Starts two gutters left of column 3 so the selected-item bars (which hang left of the list) aren't clipped. */}
      <div
        ref={scroller}
        className={`absolute top-[121px] right-0 bottom-0 grid-x-3 -ml-[calc(2*var(--grid-gutter))] overflow-x-hidden overflow-y-auto [overflow-anchor:none] ${hideScrollbar}`}
      >
        <Slot
          state={slot('list')}
          contentKey={!!page.list && route}
          className="absolute top-[20px] left-[calc(2*var(--grid-gutter))] pb-[64px]"
        >
          {page.list && <List list={page.list} />}
        </Slot>
      </div>

      {/* Lower part of the frame, pinned to the viewport bottom so it never collides with the top. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[1117px]">
        {/* Home tops its statement with its art, others sit at 842px. Between two statements it only slides (one key,
            so no wipe; the copy swaps as it starts); otherwise it holds the outgoing one's spot and jumps while hidden. */}
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={{ y: statementY(page.statement ? route : from) }}
          transition={has(from, 'statement') && has(route, 'statement') ? { duration: WIPE, ease: CURVES[settings.textCurve] } : { duration: 0 }}
        >
          <Slot
            state={slot('statement')}
            contentKey={!!page.statement && 'statement'}
            className="pointer-events-auto absolute top-[842px] grid-x-3 grid-w-2"
          >
            <Ink className={statement}>{page.statement}</Ink>
          </Slot>
        </motion.div>
        <ArtStage state={{ kind: home ? settings.homeArt : settings.art, dir }} artKey={route} artTop={page.artTop}>
          {page.art}
        </ArtStage>
      </div>
    </main>
  )
}

// Figma 41:714 + the two rotated Outfit "→" glyphs (41:739, 41:740), laid out from the start of column 4.
function NavigateHint() {
  const arrow = 'font-[Outfit] text-[20px] leading-[25px] tracking-[-0.02em] whitespace-nowrap text-black'
  return (
    <div className="absolute top-0 grid-x-4">
      <Ink className={`absolute top-[43px] left-[15px] whitespace-pre ${body}`}>
        <span>{'up and      down '}</span>
        <span className="text-[#c2c2c2]">to navigate</span>
      </Ink>
      <div className="absolute top-[48px] left-[-8px] flex h-[14px] w-[25px] items-center justify-center">
        <Ink className={`flex-none -rotate-90 ${arrow}`}>→</Ink>
      </div>
      <div className="absolute top-[50px] left-[79px] flex h-[14px] w-[25px] items-center justify-center">
        <Ink className={`flex-none rotate-90 ${arrow}`}>→</Ink>
      </div>
    </div>
  )
}

/** Stacked layout under 1024px: same type styles, header fixed, content scrolls. */
function Mobile({ route, page, w }: { route: Route; page: Page; w: number }) {
  const artZoom = w / ART_W
  // The nav scrolls away with the page; the scroller outlives routes (so the nav's bar can slide), so reset it here.
  const scroller = useRef<HTMLDivElement>(null)
  useEffect(() => {
    scroller.current?.scrollTo(0, 0)
  }, [route])
  return (
    <div
      ref={scroller}
      className={`h-dvh overflow-x-hidden overflow-y-auto [overflow-anchor:none] bg-white ${hideScrollbar}`}
      style={{ '--accent': page.accent } as CSSProperties}
    >
      <header className="px-[24px] pt-[24px]">
        <Nav active={route} />
      </header>
      <main key={route} className="relative">
        <div className="flex flex-col gap-[40px] px-[24px] pt-[32px] pb-[48px]">
          {page.heading && <h1 className={`font-normal ${body}`}>{page.heading}</h1>}
          {page.list && <List list={page.list} stacked />}
          {page.statement && <p className={statement}>{page.statement}</p>}
        </div>
        {/* The art region of the Figma frame (left column, artTop → bottom), scaled to the screen width. */}
        <div className="pointer-events-none relative overflow-hidden" style={{ height: (FRAME_H - page.artTop) * artZoom }}>
          <div className="figma-grid absolute bottom-0 left-0" style={{ zoom: artZoom, width: FRAME_W, height: FRAME_H }}>
            {page.art}
          </div>
        </div>
        {route === '' && (
          <div className="flex flex-col gap-[40px] px-[24px] pt-[32px] pb-[48px]">
            {HERO_COPY.map((t) => <p key={t} className={cn('max-w-[385px]', body)}>{t}</p>)}
          </div>
        )}
      </main>
    </div>
  )
}
