---
title: "Recursión: Cuándo es una genialidad y cuándo es un suicidio asistido (y por qué me genera urticaria)"
pubDate: 2026-04-19T13:58:12.903Z
description: "Mi experiencia con la recursión en el código: cuándo la uso para resolver problemas elegantes y cuándo la evito como la peste por sus riesgos ocultos y dolores de cabeza."
image:
  url: "https://picsum.photos/seed/recursion-cuando-es-una-genialidad-y-cuando-es-un-suicidio-asistido-y-por-que-me-genera-urticaria/1200/630"
  alt: "Recursión: Cuándo es una genialidad y cuándo es un suicidio asistido (y por qué me genera urticaria)"
tags:
  - evergreen
  - programacion
---

La primera vez que me enfrenté a un problema que *parecía* pedir a gritos una solución recursiva, me sentí como un genio. Una solución limpia, elegante, casi poética. El código era corto, se leía bien... hasta que no funcionó. O mejor dicho, funcionó para entradas pequeñas y explotó sin avisar para entradas ligeramente más grandes. Ahí conocí el temido "Stack Overflow", no el sitio web, sino el error en tiempo de ejecución que te mira con desprecio a las 3 de la mañana.

Para mí, la recursión es como un cuchillo suizo: increíblemente útil en las manos adecuadas para la tarea correcta, pero si intentas clavar un clavo con él, te vas a hacer daño y la herramienta no servirá de mucho.

### Mi romance y desengaño con el "loop elegante"

En esencia, la recursión es cuando una función se llama a sí misma para resolver una versión más pequeña del problema original, hasta llegar a un caso base que ya conoce la respuesta. Suena sencillo, ¿verdad? Y lo es. Los ejemplos clásicos de factorial o Fibonacci son engañosos porque son muy simples.

**¿Cuándo la saco a pasear?**

Mi regla de oro: la recursión brilla cuando la estructura del problema es inherentemente recursiva. Piensa en:
*   **Recorrer árboles o grafos:** DFS (Depth-First Search) es un claro ejemplo donde la recursión te da una solución increíblemente concisa. Me gusta usarla para parsear estructuras de datos anidadas o directorios.
*   **Estructuras de datos recursivas:** Manejar una lista enlazada, un árbol binario o un árbol B es mucho más natural con funciones que se llaman a sí mismas.
*   **Algoritmos de divide y vencerás:** Merge sort, quick sort... la recursión expresa muy bien esa idea de dividir el problema en partes más pequeñas hasta que son triviales.

Cuando el problema encaja así de bien, la recursión te permite escribir código que es casi una traducción directa de la definición matemática o lógica del problema. Es fácil de razonar (si tu cerebro está cableado para ello).

### El lado oscuro de la recursión: por qué a veces huyo de ella

Aquí es donde mi pragmatismo toma el control. La elegancia de la recursión a menudo viene con un coste que no siempre estamos dispuestos a pagar, especialmente en entornos de producción:

1.  **Stack Overflow:** Como mencioné, si tu profundidad de recursión es muy grande, la pila de llamadas (call stack) se desborda y tu programa muere. Esto es especialmente cierto en lenguajes como Python, que tienen límites de recursión relativamente bajos (por defecto, 1000). Es una bomba de relojería si no controlas el tamaño de tu entrada.
2.  **Rendimiento:** Cada llamada a una función tiene un *overhead*: se crea un nuevo stack frame, se guardan variables locales, etc. En muchos casos, un bucle iterativo (`for` o `while`) será más rápido y usará menos memoria.
3.  **Depuración:** Imagínate un error en un bucle que se llama 1000 veces. Ahora, imagínatelo en una recursión de 1000 llamadas anidadas. La traza de pila puede ser una pesadilla. En mi experiencia, cuando una función recursiva tiene [efectos secundarios complejos](/blog/funciones-puras-y-efectos-secundarios-por-que-me-obsesionan-y-te-ahorran-debugging-a-las-3-am/), el debugging se convierte en un infierno.
4.  **Legibilidad (para otros):** Aunque a mí me parezca elegante, para un compañero menos familiarizado con el concepto, un bucle explícito puede ser mucho más claro. Y el código es para leerlo, no solo para escribirlo.

### Mis reglas para no morir en el intento (o cuándo es mejor no intentarlo)

Así que, ¿cómo decido? Aquí mis filtros personales:

*   **¿Existe un límite superior claro y pequeño para la profundidad?** Si sé que la recursión no excederá unas pocas decenas o cientos de llamadas, estoy más abierto a usarla. Si la profundidad depende de la entrada del usuario y puede ser arbitrariamente grande, me decanto por una solución iterativa.
*   **¿La solución iterativa es significativamente más compleja?** Si convertir la recursión a iteración implica gestionar manualmente una pila (sí, básicamente reescribir la pila de llamadas del intérprete), entonces la recursión sigue siendo mi opción. Pero esto es raro.
*   **¿Es un problema que se beneficia de la programación dinámica?** Muchos problemas que parecen recursivos pueden optimizarse con memoización o tabulación. Aquí, la recursión con memoización (por ejemplo, con `functools.lru_cache` en Python) puede ser una buena mezcla de elegancia y eficiencia. Me gusta pensar en la [Programación Dinámica](/blog/programacion-dinamica-mi-martillo-favorito-para-problemas-que-parecen-imposibles-y-como-la-aplico-a-la-ia/) como una forma de domar la recursión para que no repita cálculos innecesarios.
*   **¿El lenguaje tiene optimización de cola (Tail Call Optimization - TCO)?** Lenguajes como Scala o Haskell lo tienen, lo que convierte la recursión de cola en un bucle optimizado, eliminando el riesgo de stack overflow para ese caso. Python no lo tiene, así que tengo que ser extra cauto.

### En resumen, soy un escéptico cauteloso

No soy un purista de la recursión ni un detractor absoluto. Soy un pragmático que ha tenido que [manejar errores](/blog/manejo-de-errores-mi-filosofia-para-no-perder-la-cabeza-y-dormir-por-las-noches/) y depurar código ajeno y propio durante años. La recursión es una herramienta potente y, en los casos correctos, produce un código bello y fácil de entender. Pero la mayoría de las veces, para problemas de la vida real donde el rendimiento y la robustez son críticos, prefiero la claridad y la predictibilidad de un bucle iterativo.

Así que, la próxima vez que te encuentres frente a un problema y la recursión te esté guiñando el ojo, piensa un par de veces si realmente es la mejor opción. No te dejes seducir solo por la elegancia; considera las consecuencias prácticas. Tu yo de las 3 de la mañana te lo agradecerá.
