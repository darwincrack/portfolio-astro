---
title: "Big O Notation: Lo que tu algoritmo cuesta (y por qué deberías saberlo)"
pubDate: 2026-03-06T22:36:40.277Z
description: "Entender Big O Notation no es solo para entrevistas. Es la clave para escribir código eficiente y predecir su rendimiento real. Te cuento por qué me obsesiona y cuándo la aplico en mi día a día."
image:
  url: "https://picsum.photos/seed/big-o-notation-lo-que-tu-algoritmo-cuesta-y-por-que-deberias-saberlo/1200/630"
  alt: "Big O Notation: Lo que tu algoritmo cuesta (y por qué deberías saberlo)"
tags:
  - evergreen
  - programacion
---

Recuerdo una vez, en un proyecto, donde un proceso que debería tardar segundos, se iba a minutos. Revisé el código, todo parecía 'correcto' lógicamente, pero la máquina sudaba la gota gorda. Pasé horas perfilando, mirando usos de CPU, hasta que caí en la cuenta: el problema no era lo que el código hacía, sino *cómo* lo hacía en función del tamaño de los datos. Ahí estaba, mirándome fijamente: un **O(n²)** camuflado, convirtiendo un dataset modesto en una pesadilla. Desde ese día, mi respeto por la Big O Notation subió varios escalones. No es solo teoría de algoritmos, es una herramienta de diagnóstico y diseño fundamental.

### ¿Qué demonios es Big O y por qué no es una teoría aburrida?

La notación Big O, para mí, es la forma más honesta de hablar sobre el rendimiento de un algoritmo. No te dice que tu función tardará exactamente `12.3` milisegundos, porque eso depende de tu hardware, del lenguaje, de la fase lunar. Lo que sí te dice es cómo el tiempo o el espacio que consume tu algoritmo **crece a medida que tus datos de entrada crecen**. Hablamos de una aproximación asintótica, es decir, qué pasa cuando 'n' (el tamaño de la entrada) se vuelve realmente grande.

Para ponerlo claro, si escribes un programa que funciona bien con 100 elementos, la Big O te ayuda a saber si colapsará con 100.000, o si seguirá siendo igual de eficiente. Yo lo veo como el termómetro de escalabilidad de mi código. Y en mi experiencia, no hay nada más frustrante que un sistema que 'funciona' hasta que le metes datos de verdad.

### Mi ranking de complejidades y por qué te importan de verdad

Hay unas cuantas que veo una y otra vez. Aquí te dejo las más comunes y mi forma de verlas:

*   **O(1) - Constante**: Esto es el nirvana. No importa cuántos datos tengas, la operación tarda lo mismo. Acceder a un elemento en un `dict` por su clave, por ejemplo. Si puedes diseñar algo en O(1), hazlo sin pensarlo.

*   **O(log n) - Logarítmica**: Muy buena. Piensa en una búsqueda binaria. Si duplicas el tamaño de los datos, solo necesitas un paso más. Es eficiencia que se siente casi constante. Rara de ver, pero una joya cuando aparece.

*   **O(n) - Lineal**: Mi caballo de batalla. Recorrer una lista de principio a fin, sumar todos sus elementos. Si duplicas los datos, duplicas el tiempo. Es lo esperable y a menudo lo mejor que puedes conseguir. El 90% de las veces, si mi algoritmo es O(n), estoy contento.

*   **O(n log n) - Loglineal**: El estándar de oro para algoritmos de ordenación eficientes, como Merge Sort o Quick Sort. Un poco más lento que O(n), pero mucho mejor que las siguientes.

*   **O(n²) - Cuadrática**: Aquí es donde empiezan los problemas. Un bucle anidado que recorre una lista por cada elemento de la misma lista. Si tus datos son pequeños, puedes vivir con ello. Pero con 10.000 elementos, son 100.000.000 operaciones. ¡Ay! Es la culpable de muchas de mis batallas de debugging a las 3 AM (y a veces, la he descubierto gracias a una base sólida en Big O, como cuento en [Debugging Modelos de Machine Learning: Mis batallas a las 3 AM](/blog/debugging-modelos-de-machine-learning-mis-batallas-a-las-3-am-y-lo-que-la-intuicion-no-te-dice/)).

*   **O(2ⁿ) y O(n!) - Exponencial y Factorial**: Corre. No hay otra forma de decirlo. Esto es inviable para casi cualquier tamaño de 'n' que no sea trivial. Si te encuentras aquí, necesitas un cambio de estrategia radical, seguramente un enfoque heurístico o dinámico.

### Cuándo aplico esto en mi día a día (y por qué no es solo para entrevistas)

La gente a veces piensa que Big O es solo para impresionar en una entrevista de trabajo, o para los académicos. Yo discrepo. En mi experiencia, la aplico constantemente:

1.  **Antes de escribir una línea de código**: Cuando tengo que elegir entre estructuras de datos o algoritmos. Si sé que mi lista de usuarios va a crecer a millones, no voy a usar un `list.index()` para buscar, usaré un `dict` o un `set` para búsquedas O(1). Es una parte crucial de mi proceso de diseño, como parte de los [SOLID Principles](/blog/solid-principles-por-que-me-obsesionan-y-no-no-es-dogma-ciego/) para asegurar un código robusto.

2.  **Cuando mi aplicación se arrastra**: Si el rendimiento es un problema, antes de lanzarme a optimizar cosas triviales, intento estimar la complejidad de las partes críticas. A menudo, el cuello de botella es una operación con una complejidad inesperadamente alta.

3.  **Diseño de APIs y sistemas distribuidos**: Entender cómo una operación en un microservicio escala es vital. Un servicio O(n²) puede tirar abajo todo un clúster si recibe demasiadas peticiones, aunque la latencia individual parezca baja.

4.  **En el mundo de la IA/ML**: Aunque a veces te centras en el modelo en sí, la preparación de datos, el preprocesamiento, la inferencia... todo tiene implicaciones de Big O. Un simple bucle para procesar características puede arruinar tu tiempo de entrenamiento si no lo piensas bien.

### Mi cruzada personal: Evitar el exceso y la ignorancia

Veo dos extremos que me dan dolor de cabeza. Por un lado, quien ignora por completo Big O y escribe código que no escala ni para el café. Por otro, quien se obsesiona con micro-optimizaciones, intentando pasar de O(N) a O(N - 5) cuando N nunca va a ser más de 100. Ni uno ni lo otro. El contexto es clave.

Mi regla es simple: entiende la complejidad de tu algoritmo más crítico. Asegúrate de que, a medida que tus datos crezcan, la cosa no se desmadre. No se trata de eliminar cada O(n), sino de ser consciente de dónde están tus puntos débiles y elegir la herramienta adecuada para cada escenario. Al final, un buen desarrollador no solo hace que el código funcione, sino que lo hace funcionar *bien*, y la Big O Notation es una de esas brújulas que te guían por el camino correcto.
