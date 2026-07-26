import { Component, type ReactNode } from 'react'
import { RotateCw } from 'lucide-react'
import { Button, ButtonLink } from '@/components/ui/Button'

/**
 * Catches anything a route throws while rendering.
 *
 * Without this, one bad render unmounts the whole tree and the page goes blank
 * — you get the background colour and nothing else, and only a refresh brings
 * it back. Students hit that and assume the site is broken. Now they get a
 * button that says so and fixes it.
 *
 * A failed lazy chunk is the other common cause (patchy connection, or a deploy
 * landing mid-session and invalidating the old filenames). Reloading genuinely
 * is the right fix for that one, so it's the primary action.
 */
export class RouteErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error) {
    // Keep it in the console for anyone debugging from a real device.
    console.error('Route failed to render:', error)
  }

  render() {
    if (!this.state.error) return this.props.children

    const stale = /dynamically imported module|Importing a module script failed|Failed to fetch/i.test(
      this.state.error.message,
    )

    return (
      <div className="mx-auto grid min-h-[60vh] max-w-lg place-items-center px-4 text-center sm:px-6">
        <div>
          <p className="eyebrow">Something broke</p>
          <h1 className="mt-3 text-3xl">This page didn’t load</h1>
          <p className="text-muted mt-3 text-[15px] leading-relaxed">
            {stale
              ? 'The site updated while you had it open, so part of it went stale. A reload picks up the new version.'
              : 'That’s on us, not you. A reload usually clears it — if it keeps happening, the library will still have what you came for.'}
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-2">
            <Button variant="primary" size="md" onClick={() => window.location.reload()}>
              <RotateCw className="size-4" />
              Reload the page
            </Button>
            <ButtonLink to="/library" variant="secondary" size="md">
              Go to the library
            </ButtonLink>
          </div>
        </div>
      </div>
    )
  }
}
