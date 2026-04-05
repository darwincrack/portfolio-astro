---
title: "Modularidad y Composición: Por qué mis sistemas (y agentes de IA) no son un monolito pegado con cinta aislante"
pubDate: 2026-04-05T22:39:25.003Z
description: "Mis reflexiones sobre por qué la modularidad y la composición son claves para construir software robusto, especialmente cuando se trabaja con la complejidad de los agentes de IA."
image:
  url: "https://picsum.photos/seed/modularidad-y-composicion-por-que-mis-sistemas-y-agentes-de-ia-no-son-un-monolito-pegado-con-cinta-aislante/1200/630"
  alt: "Modularidad y Composición: Por qué mis sistemas (y agentes de IA) no son un monolito pegado con cinta aislante"
tags:
  - evergreen
  - programacion
  - ia
  - agentes
---

Recuerdo la primera vez que heredé un proyecto que era una única clase gigante o, peor aún, una función monstruosa que hacía absolutamente de todo. Debuggear aquello era como intentar desentrañar un nudo marinero en la oscuridad. Desde entonces, me obsesioné con la modularidad y la composición. Y te digo algo: esta obsesión se ha vuelto mi salvavidas ahora que juego con agentes de IA.

No concibo un sistema robusto, ya sea una API REST o un agente complejo, sin pensar en cómo sus partes interactúan de forma independiente pero coordinada. Para mí, la modularidad no es solo dividir el código en archivos; es diseñar componentes que hagan una cosa y la hagan bien, con interfaces claras. La composición es cómo esos componentes se unen para crear una funcionalidad mayor.

### ¿Por qué me importa tanto?

En programación general, las razones son obvias si has pasado algunas noches en vela:

1.  **Facilita el testing**: Si una parte hace una cosa, es trivial escribir un test unitario para ella. Si tu código es un espagueti, olvídate de testear sin montar medio universo.
2.  **Menos errores, más sueño**: Los cambios en un módulo tienen menos probabilidades de romper otra cosa a kilómetros de distancia. Mis dolores de cabeza a las 3 AM suelen venir de efectos colaterales inesperados, no de bugs en una función aislada.
3.  **Reutilización**: Un módulo bien diseñado lo puedes usar en otro proyecto, o en otra parte del mismo proyecto. Es de sentido común.
4.  **Legibilidad y mantenimiento**: Cuando vuelvo a un proyecto meses después, o cuando un colega tiene que entenderlo, los módulos bien definidos son un mapa, no un laberinto. Aquí entran en juego principios como [La Abstracción: Mi Superpoder Secreto contra el Caos en el Código (y en la IA)](/blog/la-abstraccion-mi-superpoder-secreto-contra-el-caos-en-el-codigo-y-en-la-ia/).

### Modularidad en el Salvaje Oeste de los Agentes de IA

Cuando empecé a construir agentes de IA que hacían algo más que responder a un prompt, me di cuenta de que el caos se magnifica exponencialmente si no aplicas estos principios. Un agente no es solo un LLM; es una orquestación de herramientas, memoria, un planificador, un ejecutor y, a menudo, varios modelos.

Imagina un agente que necesita:

*   Acceder a una base de datos vectorial para recuperar información.
*   Llamar a una API externa para obtener datos en tiempo real.
*   Razonar sobre esos datos para tomar una decisión.
*   Actualizar su memoria interna.

Si todo eso está en una única función o clase `SuperAgenteQueLoHaceTodo`, ya te puedes imaginar el desastre. Me estremezco solo de pensarlo.

Mi enfoque es ver cada capacidad como un módulo:

*   Un **módulo de "herramientas"**: Cada herramienta (acceso a DB, API externa) es una función o clase con una interfaz clara. Si necesito cambiar la API, solo toco ese módulo.
*   Un **módulo de "memoria"**: Un componente que gestiona cómo el agente recuerda y recupera información. Esto es crucial, y ya he hablado de [Bases de Datos Vectoriales: Mi 'cerebro externo' para la IA (cuando un LLM no basta con su memoria)](/blog/bases-de-datos-vectoriales-mi-cerebro-externo-para-la-ia-cuando-un-llm-no-basta-con-su-memoria/).
*   Un **módulo de "planificación"**: Aquí es donde el agente decide qué hacer. A menudo, utilizo [Máquinas de Estados: Mi antídoto contra el código espagueti (y por qué tus agentes de IA las necesitan más de lo que crees)](/blog/maquinas-de-estados-mi-antidoto-contra-el-codigo-espagueti-y-por-que-tus-agentes-de-ia-las-necesitan-mas-de-lo-que-crees/) para esto, ya que me dan una estructura rígida pero efectiva para secuencias de acciones.
*   Un **módulo de "razonamiento"**: Quizás un pequeño LLM o un conjunto de reglas que interpreta las observaciones y formula nuevas hipótesis.

Estos módulos se componen entre sí. El planificador invoca las herramientas; las herramientas alimentan al razonador; el razonador actualiza la memoria. Cada parte es intercambiable hasta cierto punto. ¿Necesito cambiar de base de datos vectorial? No tengo que reescribir el agente entero, solo la implementación del módulo de memoria. ¿Quiero probar un nuevo modelo para razonar? Solo cambio ese componente.

### Mis trucos para no caer en la trampa

1.  **Define contratos claros**: Cada módulo debe tener una "API" interna bien definida. Qué inputs espera, qué outputs produce. Esto me lo tomo muy en serio.
2.  **Minimiza las dependencias**: Un módulo ideal depende de muy pocos otros módulos. Si un módulo A depende de B, C, D, E y F, no es tan modular como parece.
3.  **Principio de Responsabilidad Única (SRP)**: Una clase o función debe tener una sola razón para cambiar. Si puedo justificar cambiarla por dos motivos diferentes, algo no va bien. Esto aplica tanto a tu `UserRepository` como a tu `PlanningAgent`.
4.  **No te pases de la raya**: A veces, el exceso de abstracción es peor que el defecto. Encuentra el equilibrio. Si dividir algo en un micro-módulo lo hace más difícil de entender y manejar, déjalo junto. Es una balanza, no una regla absoluta.

Al final del día, mi experiencia me dice que la modularidad y la composición no son lujos académicos; son herramientas de supervivencia. Especialmente en el mundo de la IA, donde la complejidad puede salirse de control en un abrir y cerrar de ojos, tener tus componentes bien separados y acoplados de forma laxa es la diferencia entre un proyecto manejable y uno que te hará querer cambiar de profesión.
