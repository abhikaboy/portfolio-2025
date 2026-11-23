import { ShaderEffect, type Shader } from '@figma/expressive-components'
import type { ReactNode } from 'react'
import { manifest, render, setup } from '@/lib/custom-effects/halftone'
import { cn } from '@/lib/utils'

// The runtime restarts an effect whenever its shader array changes identity, so keep one per dot size.
const chains = new Map<number, Shader[]>()
function halftone(dotSize: number) {
  let chain = chains.get(dotSize)
  if (!chain) {
    chain = [
      {
        setup,
        render,
        manifest,
        params: {
          rotation: 0,
          colorMode: 0,
          dotScale: 1,
          centerPos: { x: 50, y: 50 },
          dotSize,
          halftoneType: 0,
          clipToAlpha: false,
          softness: 0,
        },
      },
    ]
    chains.set(dotSize, chain)
  }
  return chain
}

/**
 * Figma's "Halftone" shader effect over media. The wrapper carries layout because ShaderEffect
 * drops its className when WebGPU/HTML-in-Canvas is unavailable and renders bare children.
 */
export function Halftone({
  dotSize,
  className,
  children,
}: {
  dotSize: number
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn('absolute', className)}>
      <ShaderEffect shaders={halftone(dotSize)} className="size-full">
        {children}
      </ShaderEffect>
    </div>
  )
}

export const mediaClass = 'pointer-events-none absolute inset-0 size-full max-w-none object-cover'
