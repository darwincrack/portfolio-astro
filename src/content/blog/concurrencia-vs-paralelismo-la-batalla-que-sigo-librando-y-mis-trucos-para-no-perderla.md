---
title: "Concurrencia vs. Paralelismo: La batalla que sigo librando (y mis trucos para no perderla)"
pubDate: 2026-03-08T13:37:27.305Z
description: "Entender cuándo usar concurrencia y cuándo paralelismo es clave para escribir código eficiente. Comparto mis errores, mis victorias y mis reglas personales para decidir el camino."
image:
  url: "https://picsum.photos/seed/concurrencia-vs-paralelismo-la-batalla-que-sigo-librando-y-mis-trucos-para-no-perderla/1200/630"
  alt: "Concurrencia vs. Paralelismo: La batalla que sigo librando (y mis trucos para no perderla)"
tags:
  - evergreen
  - programacion
  - concurrencia
  - paralelismo
---

Recuerdo perfectamente la primera vez que intenté optimizar una tarea que tardaba demasiado. Mi pensamiento inicial fue: "esto es lento, hay que hacerlo en paralelo". Error. Acabé con un festival de *deadlocks*, *race conditions* y resultados inconsistentes que me hicieron querer tirar el ordenador por la ventana. Esa fue mi dolorosa introducción a la diferencia entre concurrencia y paralelismo. Y, sinceramente, es una distinción que muchos desarrolladores (yo incluido, al principio) confunden.

### Lo que de verdad importa de la concurrencia

Para mí, la **concurrencia** es una cuestión de *gestión*. Se trata de manejar múltiples tareas al mismo tiempo, dándonos la ilusión de que todas progresan simultáneamente, incluso si solo tienes un procesador. Piensa en un camarero en un restaurante: atiende la mesa 1, luego toma nota en la mesa 2, luego sirve la bebida de la mesa 1, luego atiende una queja de la mesa 3. Está haciendo muchas cosas, pero solo una a la vez. No es más rápido en el sentido de que la tarea individual se complete antes, sino que el *sistema* en su conjunto parece más responsivo y puede manejar más solicitudes. Es una herramienta para organizar el código y las operaciones de E/S, no para acelerar el cálculo puro.

Yo la uso **siempre** que mi programa tiene que esperar algo. Peticiones de red, acceso a disco, interacción de usuario. Si tengo que parar y esperar, es un candidato para concurrencia. Dejar que mi programa haga otra cosa útil mientras tanto me parece de cajón. Es la base de cualquier servidor web que se precie o de una UI que no se congela.

### El poder bruto del paralelismo

El **paralelismo**, por otro lado, es una cuestión de *ejecución simultánea*. Aquí sí estamos hablando de hacer varias cosas a la vez, literalmente, porque tienes múltiples núcleos de CPU o incluso varias máquinas trabajando en el mismo problema. Volviendo al ejemplo del restaurante, es como si tuvieras varios camareros atendiendo mesas diferentes al mismo tiempo. La tarea _individual_ puede no ser más rápida, pero el *trabajo total* que se puede procesar en el mismo intervalo de tiempo se multiplica.

Yo busco el paralelismo cuando tengo un cálculo **intensivo en CPU** que se puede dividir en partes independientes. Imagina procesar un _dataset_ gigante, aplicar el mismo filtro a millones de imágenes, o entrenar diferentes versiones de un modelo. Ahí, sí, tirar de todos los núcleos disponibles tiene sentido. Pero ojo, la clave es esa independencia. Si las tareas dependen unas de otras, la sobrecarga de coordinación y sincronización puede anular cualquier ganancia, o peor, introducir errores.

### Mis reglas no escritas (y las batallas que me han enseñado)

1.  **Empieza por concurrencia, no por paralelismo.** Es casi siempre mi punto de partida si busco responsividad o manejo de E/S. Las herramientas como `async/await` en Python, C# o JavaScript, o las _goroutines_ en Go, me facilitan la vida enormemente. La concurrencia suele ser más fácil de razonar y depurar que el paralelismo. He pasado noches enteras intentando cazar una *race condition* que solo se manifestaba bajo cargas específicas. No se lo deseo a nadie. Si quieres saber más sobre cómo debuggear cosas difíciles, quizás te interese mi artículo sobre [Debugging Modelos de Machine Learning: Mis batallas a las 3 AM](/blog/debugging-modelos-de-machine-learning-mis-batallas-a-las-3-am/).

2.  **Paralelismo solo para CPU-bound y divisible.** Si tu tarea no es intensiva en CPU, el paralelismo no te va a dar una mejora significativa. Si no puedes dividirla fácilmente sin introducir dependencias complejas, piénsalo dos veces. El costo de la comunicación entre hilos o procesos puede ser prohibitivo. Además, hay que pensar en el coste computacional y de recursos. Un `for` simple es más fácil de razonar que un `ThreadPoolExecutor` con locks si no hay un beneficio claro.

3.  **Cuidado con el estado compartido.** Esta es mi regla de oro. Si tus tareas concurrentes o paralelas van a modificar un mismo dato, las cosas se ponen feas muy rápido. Los *locks*, *semáforos* y otras primitivas de sincronización son necesarias, pero añaden complejidad y puntos de fallo. En mi cruzada personal, intento usar datos inmutables siempre que puedo. De hecho, tengo un post al respecto: [El estado mutable me da migraña: mi cruzada por la inmutabilidad en el código](/blog/el-estado-mutable-me-da-migrana-mi-cruzada-por-la-inmutabilidad-en-el-codigo/). Reduce drásticamente los dolores de cabeza en entornos concurrentes y paralelos.

4.  **Mide, no asumas.** Esto es fundamental. Antes de lanzarte a una implementación compleja de concurrencia o paralelismo, mide el rendimiento de tu código actual. Luego, mide la nueva implementación. La `Big O Notation` es un buen punto de partida para entender la complejidad, pero la implementación real puede tener sorpresas. Te recomiendo revisar mi post sobre [Big O Notation: Lo que tu algoritmo cuesta](/blog/big-o-notation-lo-que-tu-algoritmo-cuesta-y-por-que-deberias-saberlo/) para tener una base sólida. No te fíes de la intuición; los *benchmarks* son tus amigos. A veces, la versión `single-threaded` es sorprendentemente rápida y la complejidad adicional no compensa.

### Reflexiones finales

La concurrencia y el paralelismo no son enemigos, son herramientas diferentes para problemas diferentes. Entender sus matices me ha ahorrado muchísimas horas de frustración. Mi consejo es claro: aborda la concurrencia para la capacidad de respuesta y la gestión de E/S, y reserva el paralelismo para la potencia bruta de cálculo en problemas inherentemente dividibles. Y, por favor, mide siempre tus resultados y ten muchísimo respeto por el estado compartido. Tus futuras 3 AM te lo agradecerán. Sigo batallando con ellos, sí, pero ahora con un arsenal de conocimientos que me permiten ganar más a menudo.
