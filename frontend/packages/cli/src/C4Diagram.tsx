import styles from './C4Diagram.module.css'

const nodes = [
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
]

const relationships = [
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
]

export function C4Diagram() {
  return (
    <div className={styles.wrapper}>
      <aside className={styles.leftPane}>
        <div>
          <p className={styles.eyebrow}>C4 workspace</p>
          <h2 className={styles.heading}>System Context</h2>
          <p className={styles.copy}>
            Prototype tab for architecture diagrams. The next step is loading a
            C4 model file and rendering context, container, component, and
            deployment views from the same workspace.
          </p>
        </div>

        <div className={styles.metaList}>
          <div>
            <span>Model source</span>
            <strong>c4.json or Structurizr DSL</strong>
          </div>
          <div>
            <span>Views</span>
            <strong>Context, Container, Component</strong>
          </div>
          <div>
            <span>Status</span>
            <strong>Prototype renderer</strong>
          </div>
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
          {relationships.map((relationship) => (
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
                x={(relationship.x1 + relationship.x2) / 2}
                y={(relationship.y1 + relationship.y2) / 2 - 2}
              >
                {relationship.label}
              </text>
            </g>
          ))}
        </svg>

        {nodes.map((node) => (
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
