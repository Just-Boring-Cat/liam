import {
  ERDRenderer,
  ErdRendererProvider,
  getCookie,
  getCookieJson,
  VersionProvider,
  versionSchema,
} from '@liam-hq/erd-core'
import { type Schema, schemaSchema } from '@liam-hq/schema'
import { ResultAsync } from 'neverthrow'
import { useEffect, useState } from 'react'
import * as v from 'valibot'
import styles from './App.module.css'
import { C4Diagram } from './C4Diagram'

const emptySchema: Schema = {
  tables: {},
}

function loadSchemaContent() {
  return ResultAsync.fromPromise(
    fetch('./schema.json').then(async (response) => {
      if (!response.ok) {
        return await Promise.reject(
          new Error(`Failed to fetch schema: ${response.statusText}`),
        )
      }
      return await response.json()
    }),
    (error) => (error instanceof Error ? error : new Error(String(error))),
  ).map((data) => {
    const result = v.safeParse(schemaSchema, data)
    if (result.success) {
      return result.output
    }
    console.info(result.issues)
    return undefined
  })
}

const versionData = {
  version: import.meta.env.VITE_CLI_VERSION_VERSION,
  gitHash: import.meta.env.VITE_CLI_VERSION_GIT_HASH,
  envName: import.meta.env.VITE_CLI_VERSION_ENV_NAME,
  isReleasedGitHash:
    import.meta.env.VITE_CLI_VERSION_IS_RELEASED_GIT_HASH === '1',
  date: import.meta.env.VITE_CLI_VERSION_DATE,
  displayedOn: 'cli',
}
const version = v.parse(versionSchema, versionData)

function getSidebarSettingsFromCookie(): {
  isOpen: boolean
  panelSizes: number[]
} {
  const sidebarState = getCookie('sidebar:state')
  const panelLayout = getCookieJson<number[]>('panels:layout')

  const isOpen = sidebarState === 'true'
  const panelSizes =
    Array.isArray(panelLayout) && panelLayout.length >= 2
      ? panelLayout
      : [20, 80]

  return {
    isOpen,
    panelSizes,
  }
}

function App() {
  const searchParams = new URLSearchParams(window.location.search)
  const initialDiagram = searchParams.get('diagram') === 'c4' ? 'c4' : 'erd'
  const initialTheme = searchParams.get('theme') === 'light' ? 'light' : 'dark'
  const [schema, setSchema] = useState<Schema>(emptySchema)
  const [activeDiagram, setActiveDiagram] = useState<'erd' | 'c4'>(
    initialDiagram,
  )
  const [theme, setTheme] = useState<'dark' | 'light'>(initialTheme)
  const { isOpen: defaultSidebarOpen, panelSizes } =
    getSidebarSettingsFromCookie()

  useEffect(() => {
    loadSchemaContent().match(
      (val) => setSchema(val ?? emptySchema),
      (error) => {
        console.error('Error loading schema content:', error)
        setSchema(emptySchema)
      },
    )
  }, [])

  return (
    <VersionProvider version={version}>
      <div className={styles.workspace} data-theme={theme}>
        <header className={styles.header}>
          <div className={styles.titleGroup}>
            <span className={styles.brandMark}>L</span>
            <div>
              <h1 className={styles.title}>Liam Diagrams</h1>
              <p className={styles.subtitle}>ERD and C4 workspace prototype</p>
            </div>
          </div>

          <nav className={styles.diagramTabs} aria-label="Diagram type">
            <button
              type="button"
              className={styles.tabButton}
              data-active={activeDiagram === 'erd'}
              onClick={() => setActiveDiagram('erd')}
            >
              ERD
            </button>
            <button
              type="button"
              className={styles.tabButton}
              data-active={activeDiagram === 'c4'}
              onClick={() => setActiveDiagram('c4')}
            >
              C4
            </button>
          </nav>

          <label className={styles.themeToggle}>
            <span>Light</span>
            <input
              type="checkbox"
              checked={theme === 'dark'}
              onChange={(event) =>
                setTheme(event.target.checked ? 'dark' : 'light')
              }
            />
            <span>Dark</span>
          </label>
        </header>

        <main className={styles.diagramSurface}>
          <section
            className={styles.diagramPanel}
            data-active={activeDiagram === 'erd'}
            aria-hidden={activeDiagram !== 'erd'}
          >
            <ErdRendererProvider schema={{ current: schema }}>
              <ERDRenderer
                defaultSidebarOpen={defaultSidebarOpen}
                defaultPanelSizes={panelSizes}
              />
            </ErdRendererProvider>
          </section>
          <section
            className={styles.diagramPanel}
            data-active={activeDiagram === 'c4'}
            aria-hidden={activeDiagram !== 'c4'}
          >
            <C4Diagram />
          </section>
        </main>
      </div>
    </VersionProvider>
  )
}

export default App
