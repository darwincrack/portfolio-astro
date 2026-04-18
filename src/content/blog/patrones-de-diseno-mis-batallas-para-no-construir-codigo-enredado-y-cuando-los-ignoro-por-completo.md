---
title: "Patrones de Diseño: Mis batallas para no construir código enredado (y cuándo los ignoro por completo)"
pubDate: 2026-04-18T13:59:33.220Z
description: "Exploro mi relación con los patrones de diseño en programación, cuándo realmente aportan valor para un código robusto y cuándo terminan siendo una complicación innecesaria."
image:
  url: "https://picsum.photos/seed/patrones-de-diseno-mis-batallas-para-no-construir-codigo-enredado-y-cuando-los-ignoro-por-completo/1200/630"
  alt: "Patrones de Diseño: Mis batallas para no construir código enredado (y cuándo los ignoro por completo)"
tags:
  - evergreen
  - programacion
---

La primera vez que me topé con los Patrones de Diseño, pensé que era otra de esas cosas que los académicos inventaban para que los mortales como yo nos sintiéramos menos listos. Palabras rimbombantes como *Abstract Factory*, *Visitor*, *Decorator*… me sonaban a jeroglíficos. Era un vocabulario que sentía muy lejano a mi realidad de intentar que un script hiciera lo que yo quería.

Pero luego, trabajando en proyectos, uno empieza a ver patrones de verdad. No los GoF, sino los *malos*. El mismo bloque de código que se duplica una y otra vez con ligeras variaciones. La función `if/else if/else` que crece sin control. Las clases que acoplan a veinte componentes distintos, haciendo que un cambio mínimo desate un infierno de *side effects*. Es la frustración de ver tu código volverse una bola de espagueti lo que, al menos a mí, me empujó a buscar mejores maneras de hacer las cosas.

Ahí fue cuando alguien, con más sabiduría que yo, me dijo: "Mira, estas cosas ya tienen nombre, y soluciones que otros ya han probado y validado". Y, de repente, los Patrones de Diseño dejaron de ser abstracciones teóricas y se convirtieron en herramientas.

## La trampa de la "Patternitis": el peor error que puedes cometer

Mi mayor error al principio fue intentar meter patrones por doquier. Me había obsesionado con ellos. `Singleton` para todo lo que *pensaba* que solo debería tener una instancia. `Factory` para crear un solo objeto simple. `Strategy` cuando un simple `if` bastaba. Esto no es diseñar, es sobre-ingeniería pura y dura, y solo añade complejidad donde no la hay. Terminas con más capas de abstracción de las necesarias, código más difícil de leer y, créeme, más problemas para depurar a las 3 AM.

Mi regla de oro es simple: **resuelve el problema actual, no el que *quizás* tengas en el futuro**. Los patrones no son una imposición; son una respuesta a problemas recurrentes. Si el problema no ha aparecido, no fuerces el patrón. La simplicidad debe ser tu primer objetivo.

## Mis herramientas favoritas (y cuándo las saco de la caja)

### Strategy: El comodín para la flexibilidad

Este patrón es un salvavidas cuando tienes diferentes algoritmos o comportamientos para el mismo problema, y quieres cambiar entre ellos en tiempo de ejecución. ¿Múltiples formas de calcular un precio? ¿Diferentes métodos de autenticación? ¿Distintas maneras de procesar datos de una API externa? Strategy es tu amigo. Te permite añadir nuevas estrategias sin modificar el código existente, manteniendo el diseño limpio y abierto a la extensión. En el ámbito de los agentes de IA, lo uso muchísimo cuando mi agente necesita elegir entre varias herramientas o modos de acción según el contexto. Define la interfaz de la acción, y luego implementa diferentes "estrategias" para cada herramienta.

### Observer: El chivato inteligente (y poco intrusivo)

Cuando algo cambia en una parte de tu sistema y varios componentes necesitan reaccionar a ese cambio sin estar directamente acoplados al que lo genera, Observer es la solución. Piensa en sistemas de logging, actualizaciones de UI, o incluso la gestión de eventos internos en un sistema complejo. El componente que cambia su estado notifica a sus "observadores" interesados, y ellos actúan. Esto ayuda a mantener una buena [Cohesión y Acoplamiento: Mi brújula para no construir monstruos de código (y por qué tus agentes de IA los necesitan)](/blog/cohesion-y-acoplamiento-mi-brujula-para-no-construir-monstruos-de-codigo-y-por-que-tus-agentes-de-ia-los-necesitan).

### Facade: Tu simplificador de APIs complejas

¿Alguna vez te has enfrentado a una librería externa con una API que es un auténtico laberinto? ¿Un subsistema interno que requiere una secuencia de llamadas específicas para hacer algo útil? Facade te permite crear una interfaz de alto nivel que simplifica esa complejidad. Proporciona una vista unificada y más fácil de usar, ocultando la intrincada lógica subyacente. Me ha salvado de muchas integraciones dolorosas y ha hecho que mi código cliente sea mucho más legible.

## El que me da escalofríos: Singleton

Lo confieso, lo he usado. Y me arrepiento casi cada vez que lo hago. La idea de tener una única instancia global de algo (un logger, una configuración, una conexión a base de datos) suena atractiva en teoría. Pero luego llega el testeo, la dificultad para controlar el estado global, y los efectos secundarios inesperados que pueden surgir cuando cualquier parte del código puede modificar esa única instancia. Introduce un acoplamiento fuerte y puede hacer que depurar a las 3 AM sea una auténtica pesadilla. Yo prefiero la inyección de dependencias, pasar las instancias explícitamente, o simplemente usar módulos con estado inmutable si el lenguaje lo permite. Menos "magia", más control.

## ¿Y cómo los aplico en el diseño de sistemas con IA?

Cuando diseño un agente de IA, no pienso en "crearé un `AgentFactory`". Pienso en los problemas que quiero resolver:

*   **Flexibilidad en la toma de decisiones:** ¿Cómo mi agente elige la mejor herramienta o el mejor modelo para una tarea concreta? Ahí el patrón Strategy (o una combinación con Command) es oro puro. Cada herramienta o modelo es una "estrategia" posible.
*   **Gestión del estado y transiciones:** ¿Cómo evito que mi agente "alucine" y mantengo un estado coherente entre interacciones complejas? [Máquinas de Estados: Mi antídoto contra el código espagueti (y por qué tus agentes de IA las necesitan más de lo que crees)](/blog/maquinas-de-estados-mi-antidoto-contra-el-codigo-espagueti-y-por-que-tus-agentes-de-ia-los-necesitan-mas-de-lo-que-crees) a menudo se implementan usando patrones como State o Strategy, permitiendo transiciones limpias y un comportamiento predecible.
*   **Separación de preocupaciones:** Los patrones me obligan a pensar en [La Abstracción: Mi Superpoder Secreto contra el Caos en el Código (y en la IA)](/blog/la-abstraccion-mi-superpoder-secreto-contra-el-caos-en-el-codigo-y-en-la-ia)). Me ayudan a definir interfaces claras, separar lógicas complejas de la toma de decisiones, y hacer que los componentes sean más intercambiables y testeables.

## Mi consejo final

No te agobies intentando memorizar todos los patrones ni fuerces su uso. En su lugar, concéntrate en entender los problemas que resuelven. Cuando te encuentres con una parte de tu código que te resulte incómoda, difícil de mantener, o que se repite constantemente, es el momento de preguntarte si existe un patrón que pueda guiarte hacia una solución más elegante y robusta. Empieza simple. Refactoriza hacia un patrón solo si el problema lo exige. Es una herramienta poderosa, sí, pero como cualquier herramienta, es más útil cuando se sabe cuándo y cómo empuñarla.
