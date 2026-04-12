---
title: "Concurrencia vs. Paralelismo: Por qué a veces lo 'rápido' sale caro (y cuándo yo me abstengo)"
pubDate: 2026-04-12T13:58:05.720Z
description: "La concurrencia y el paralelismo prometen velocidad, pero a menudo traen dolores de cabeza. Comparto mi experiencia sobre cuándo vale la pena invertir y cuándo es mejor ignorarlos."
image:
  url: "https://picsum.photos/seed/concurrencia-vs-paralelismo-por-que-a-veces-lo-rapido-sale-caro-y-cuando-yo-me-abstengo/1200/630"
  alt: "Concurrencia vs. Paralelismo: Por qué a veces lo 'rápido' sale caro (y cuándo yo me abstengo)"
tags:
  - evergreen
  - programacion
  - optimizacion
---

Recuerdo un proyecto en mis inicios donde la obsesión por la 'velocidad' me llevó a complicar el código hasta límites ridículos. Estaba intentando hacer todo concurrente, pensando que más hilos o procesos eran la solución mágica. Resultado: un sistema imposible de debuggear, lleno de *deadlocks* y *race conditions* que solo yo, a las 3 de la mañana, intentaba descifrar. La mejora de rendimiento, si es que hubo alguna significativa, no compensó ni de lejos las horas perdidas y el estrés.

Para mí, la diferencia entre **concurrencia** y **paralelismo** es práctica, no teórica. La concurrencia es cómo organizas el trabajo para que parezca que varias cosas suceden a la vez, aunque a lo mejor solo tengas un trabajador haciendo malabares. El paralelismo es cuando tienes varios trabajadores reales haciendo cosas al mismo tiempo. Piensa en un chef (concurrencia) que corta verduras, revisa el horno y atiende la sartén casi simultáneamente. Y en una cocina con varios chefs (paralelismo) cada uno en su estación.

## El precio de la velocidad

Y ese es el quid de la cuestión: *tener más trabajadores es caro*. No solo en recursos de máquina, sino en complejidad de código. De repente, tienes que preocuparte por:

*   **Compartir estado**: ¿Quién tiene acceso a qué dato? ¿Cuándo se modifica? Los *locks*, *mutexes*, y *semáforos* son tus nuevos 'amigos' (que en realidad son un dolor de muelas si no los usas con cuidado).
*   **Sincronización**: Que una tarea no pise a otra, que esperen el resultado correcto.
*   **Debugging**: Rastrear errores en un flujo lineal ya es un arte; en un flujo no determinista es una pesadilla. Me he salvado de muchas noches en vela gracias a [mi filosofía para no perder la cabeza con el manejo de errores](/blog/manejo-de-errores-mi-filosofia-para-no-perder-la-cabeza-y-dormir-por-las-noches/), pero la concurrencia es otra liga.

## Cuándo me tiro de cabeza (y por qué)

A pesar de los desafíos, hay escenarios donde la concurrencia y el paralelismo son, **sin excusas**, indispensables.

1.  **Operaciones I/O Bound**: Esto es pan comido para la concurrencia. Si tu código pasa la mayor parte del tiempo esperando una respuesta de red, una base de datos o un disco, ¿por qué no usar ese tiempo muerto para hacer otra cosa? Aquí es donde `async/await` en Python (o JavaScript, o C#) brilla. Tus hilos no están bloqueados; simplemente 'ceden' el control hasta que el dato llega. Esto no es paralelismo real, pero para el usuario, el efecto es el mismo: la aplicación sigue respondiendo.
2.  **Carga computacional intensa (CPU Bound)**: Aquí sí, necesitamos paralelismo de verdad. Si tengo que procesar un dataset enorme, entrenar un modelo de IA complejo (aunque esto lo delego a librerías optimizadas en C++ o CUDA), o realizar simulaciones matemáticas, entonces sí, quiero usar todos los núcleos de mi procesador. En Python, el módulo `multiprocessing` es mi goto. **Cuidado**: Los modelos de ML suelen estar optimizados para GPUs, por lo que intentar paralelizar con CPU a mano puede ser un esfuerzo inútil si la librería ya lo hace mejor o si tienes acceso a hardware especializado.
3.  **Agentes de IA y sistemas reactivos**: Mis agentes de IA a menudo tienen que monitorizar varios sensores, procesar entradas, tomar decisiones y ejecutar acciones casi simultáneamente. No puedo permitirme que uno bloquee a los demás. Una máquina de estados bien diseñada, apoyada en concurrencia (como `asyncio`), es fundamental aquí. [Si quieres entender por qué mis agentes de IA necesitan máquinas de estados](/blog/maquinas-de-estados-mi-antidoto-contra-el-codigo-espagueti-y-por-que-tus-agentes-de-ia-las-necesitan-mas-de-lo-que-crees/), echa un ojo a ese post.

## Cuándo no me molesto (y te recomiendo que tampoco lo hagas)

Mi regla de oro es: **no optimices prematuramente**. Si tu función tarda 100ms y el 99% del tiempo de ejecución está en otra parte, no la hagas concurrente. Es un desperdicio de esfuerzo y una inyección de complejidad innecesaria. El código concurrente es inherentemente más difícil de leer, de entender y de mantener.

*   **Aplicaciones pequeñas o scripts de un solo uso**: Ni me lo planteo. Simplicidad por encima de todo.
*   **Problemas donde la mayoría del tiempo es de procesamiento ligero y secuencial**: El *overhead* de la concurrencia (crear hilos/procesos, sincronización, cambio de contexto) puede ser mayor que el beneficio.
*   **Cuando el problema no está bien definido**: La modularidad ayuda mucho a aislar partes del sistema, pero si ni siquiera tienes claro qué necesita ser rápido, no te metas en berenjenales. Hablé de esto en [Modularidad y Composición: Por qué mis sistemas no son un monolito pegado con cinta aislada](/blog/modularidad-y-composicion-por-que-mis-sistemas-y-agentes-de-ia-no-son-un-monolito-pegado-con-cinta-aislante/). Un sistema monolítico bien estructurado y secuencial es, con frecuencia, más que suficiente y mucho más fácil de manejar.

## Mi filosofía

Primero, haz que funcione. Luego, si *demuestras* que hay un cuello de botella evidente y que ese cuello de botella puede ser aliviado por la concurrencia o el paralelismo, entonces y solo entonces, considera implementarlo. Y hazlo con la mínima complejidad posible. La velocidad está bien, pero la mantenibilidad y la robustez del código valen su peso en oro. Me he quemado muchas veces para saber que no es una bala de plata.
