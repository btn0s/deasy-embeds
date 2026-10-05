import { PaperWorkflowPrototype } from '../../prototypes/workflow-motion/PaperWorkflowPrototype'
import { useInteractionFlowDial } from './BrandThemeDial'
import { DataSourceDemo } from './DataSourceDemo'

export function InteractionFlow() {
  const variant = useInteractionFlowDial()

  return (
    <section className="wrap interaction-flow" data-flow={variant} id="platform">
      <div className="interaction-flow__stage" key={variant}>
        {variant === 'paper-table' ? (
          <div className="interaction-flow__pane interaction-flow__pane--paper-table">
            <PaperWorkflowPrototype embedded mode="table" />
          </div>
        ) : (
          <DataSourceDemo embedded />
        )}
      </div>
    </section>
  )
}
