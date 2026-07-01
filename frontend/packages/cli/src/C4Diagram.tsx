import { useEffect, useState } from 'react'
import styles from './C4Diagram.module.css'

type C4Node = {
  id: string
  kind: string
  title: string
  description: string
  x: number
  y: number
}

type C4Relationship = {
  id: string
  label: string
  x1: number
  y1: number
  x2: number
  y2: number
  labelX?: number
  labelY?: number
}

type C4Model = {
  eyebrow: string
  title: string
  description: string
  meta: Array<{
    label: string
    value: string
  }>
  nodes: C4Node[]
  relationships: C4Relationship[]
}

const fallbackModel: C4Model = {
  eyebrow: 'C4 workspace',
  title: 'System Context',
  description:
    'Prototype tab for architecture diagrams. Add a c4.json file beside schema.json to render project-specific architecture views.',
  meta: [
    { label: 'Model source', value: 'c4.json' },
    { label: 'Views', value: 'Context, Container, Component' },
    { label: 'Status', value: 'Prototype renderer' },
  ],
  nodes: [
    {
      id: 'person',
      kind: 'Person',
      title: 'User',
      description: 'A stakeholder using the product.',
      x: 17,
      y: 42,
    },
    {
      id: 'system',
      kind: 'Software System',
      title: 'Product Platform',
      description: 'The product boundary being documented.',
      x: 36,
      y: 18,
    },
    {
      id: 'web',
      kind: 'Container',
      title: 'Web App',
      description: 'Browser UI for workflows and review.',
      x: 62,
      y: 15,
    },
    {
      id: 'api',
      kind: 'Container',
      title: 'API',
      description: 'Server-side business capabilities.',
      x: 62,
      y: 44,
    },
    {
      id: 'db',
      kind: 'Database',
      title: 'Database',
      description: 'Persistent application state.',
      x: 62,
      y: 73,
    },
  ],
  relationships: [
    {
      id: 'person-system',
      x1: 28,
      y1: 48,
      x2: 36,
      y2: 29,
      label: 'Uses',
    },
    {
      id: 'system-web',
      x1: 52,
      y1: 29,
      x2: 62,
      y2: 26,
      label: 'Presents',
    },
    {
      id: 'web-api',
      x1: 75,
      y1: 31,
      x2: 75,
      y2: 44,
      label: 'Calls',
    },
    {
      id: 'api-db',
      x1: 75,
      y1: 60,
      x2: 75,
      y2: 73,
      label: 'Reads/writes',
    },
  ],
}

async function loadC4Model() {
  const response = await fetch('./c4.json')
  if (!response.ok) {
    return fallbackModel
  }

  const model = (await response.json()) as C4Model
  if (!Array.isArray(model.nodes) || !Array.isArray(model.relationships)) {
    return fallbackModel
  }

  return model
}

export function C4Diagram() {
  const [model, setModel] = useState<C4Model>(fallbackModel)

  useEffect(() => {
    loadC4Model()
      .then(setModel)
      .catch((error: unknown) => {
        console.error('Error loading C4 model:', error)
        setModel(fallbackModel)
      })
  }, [])

  return (
    <div className={styles.wrapper}>
      <aside className={styles.leftPane}>
        <div>
          <p className={styles.eyebrow}>{model.eyebrow}</p>
          <h2 className={styles.heading}>{model.title}</h2>
          <p className={styles.copy}>{model.description}</p>
        </div>

        <div className={styles.metaList}>
          {model.meta.map((item) => (
            <div key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </aside>

      <section className={styles.canvas} aria-label="C4 diagram canvas">
        <svg
          aria-label="C4 relationship lines"
          className={styles.relationships}
          role="img"
          viewBox="0 0 100 100"
        >
          <defs>
            <marker
              id="arrow"
              markerHeight="8"
              markerWidth="8"
              orient="auto"
              refX="7"
              refY="4"
            >
              <path d="M0,0 L8,4 L0,8 z" className={styles.arrowHead} />
            </marker>
          </defs>
          {model.relationships.map((relationship) => (
            <g key={relationship.id}>
              <line
                className={styles.relationshipLine}
                x1={relationship.x1}
                y1={relationship.y1}
                x2={relationship.x2}
                y2={relationship.y2}
                markerEnd="url(#arrow)"
              />
              <text
                className={styles.relationshipLabel}
                x={
                  relationship.labelX ?? (relationship.x1 + relationship.x2) / 2
                }
                y={
                  relationship.labelY ??
                  (relationship.y1 + relationship.y2) / 2 - 2
                }
              >
                {relationship.label}
              </text>
            </g>
          ))}
        </svg>

        {model.nodes.map((node) => (
          <article
            className={styles.node}
            key={node.id}
            data-kind={node.kind}
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
            }}
          >
            <span className={styles.nodeKind}>{node.kind}</span>
            <h3>{node.title}</h3>
            <p>{node.description}</p>
          </article>
        ))}
      </section>
    </div>
  )
}
