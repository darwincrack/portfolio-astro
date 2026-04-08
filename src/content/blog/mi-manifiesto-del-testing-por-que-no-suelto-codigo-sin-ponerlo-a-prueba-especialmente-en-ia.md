---
title: "Mi Manifiesto del Testing: Por qué no suelto código sin ponerlo a prueba (especialmente en IA)"
pubDate: 2026-04-08T22:50:58.004Z
description: "Como desarrollador, aprendí a golpes que testear no es un lujo. Mi estrategia para probar código y modelos de IA, y evitar el infierno de los errores en producción."
image:
  url: "https://picsum.photos/seed/mi-manifiesto-del-testing-por-que-no-suelto-codigo-sin-ponerlo-a-prueba-especialmente-en-ia/1200/630"
  alt: "Mi Manifiesto del Testing: Por qué no suelto código sin ponerlo a prueba (especialmente en IA)"
tags:
  - evergreen
  - programacion
  - ia
  - testing
---

Mira, si hay algo que he aprendido en todos estos años de picar código, es que la única cosa que te salva de las llamadas a las 3 de la mañana es una batería de tests. Y te lo digo en serio, cuando metes IA en la ecuación, esto se multiplica por diez. No es solo que tu código compile, es que tu modelo haga lo que *dices* que hace. Y eso, amigo, es un infierno diferente.

La primera vez que un modelo que yo mismo había entrenado empezó a devolver resultados disparatados en producción sin que nadie supiera por qué, juré que no me volvería a pasar. Tenía tests unitarios para mis funciones de preprocesamiento, sí. Y sí, el modelo cargaba correctamente. ¿Pero el dato que le llegaba? ¿El rendimiento en casos de borde? Ahí, cero. Por eso, mis colegas, mi filosofía de testing va mucho más allá de las obvias pruebas unitarias.

### Más allá de la unidad: el dato es el rey (y también un cabrón)

Para mí, el primer punto de defensa es el dato. Tus modelos son tan buenos como los datos que los alimentan. De verdad, he pasado demasiadas horas debuggeando un comportamiento extraño solo para descubrir que algún pipeline de datos había introducido NaNs o que una columna esencial tenía un formato distinto al esperado. Por eso, ahora, mis pipelines de ingesta tienen **tests de validación de datos** a piñón. Chequeo tipos, rangos, distribuciones, valores atípicos. Cualquier anomalía me tiene que saltar antes de que ese dato toque mi modelo. Es una batalla constante, pero me ha salvado el cuello más veces de las que puedo contar.

### ¿El modelo sigue siendo el modelo que entrené?

Una vez que el dato está 'limpio', toca el modelo. Aquí es donde la cosa se pone interesante. Los tests unitarios te dirán si tu función `predict()` se ejecuta sin errores, pero no si la predicción es *correcta*. Yo siempre monto **tests de regresión de modelo**. Guardo un pequeño conjunto de datos representativo con las salidas esperadas y me aseguro de que mi modelo en producción siga alcanzando un umbral de rendimiento aceptable en ese subconjunto. Si el modelo nuevo (o la versión que despliego) rinde peor, tengo una alerta. Esto me da una tranquilidad enorme, especialmente cuando hago cambios que *creo* que no afectan la performance. Spoiler: a veces lo hacen.

Además de la performance, me obsesiona la robustez. ¿Qué pasa si le meto un texto vacío a mi LLM? ¿Un valor numérico fuera de rango? Mis **tests de casos de borde** son brutales. Intento romper el modelo a propósito. Si un agente de IA me da una respuesta estúpida con una entrada un poco ambigua, sé que tengo un problema. A veces, para entender *por qué* mi modelo da una respuesta concreta, me apoyo mucho en herramientas de [XAI: por qué el 'dice que es un gato' no me basta](/blog/xai-por-que-el-dice-que-es-un-gato-no-me-basta-y-como-investigo-yo-lo-que-realmente-piensa-mi-modelo/). Es clave no solo saber que falla, sino entender la causa.

### La integración: El sistema completo cuenta la historia

Finalmente, de nada sirve tener componentes individuales impecables si no se hablan bien. Mis **tests de integración** son el último baluarte. Estos tests simulan el flujo completo: desde la petición inicial a la API, pasando por el preprocesamiento, la inferencia del modelo y la respuesta final. Esto es vital para sistemas más complejos, especialmente los que involucran varios microservicios o agentes encadenados. Me aseguro de que la orquestación funcione, que los formatos de entrada y salida entre componentes sean los esperados. Si algo se rompe aquí, sé que hay un problema en la cadena de montaje.

Recuerdo una vez que un equipo junior subió una versión nueva de un microservicio que cambiaba un nombre de campo en el JSON de salida. Los tests unitarios pasaron, los del modelo pasaron... pero la integración se fue al garete porque el servicio aguas abajo esperaba el campo con el nombre viejo. Esos tests de integración me han ahorrado muchas horas de caza de brujas en producción.

### Mi recomendación: Haz del testing un hábito, no una tarea

No se trata de escribir tests por escribir, sino de entender dónde están tus puntos débiles y protegerlos. Para mí, el testing es una parte innegociable del desarrollo. Me ayuda a diseñar mejor mi código, a pensar en los fallos antes de que ocurran y, sinceramente, a dormir mejor por las noches. Si no testeas, no estás construyendo un sistema robusto, estás construyendo una caja negra con un botón de 'sorpresa'. Y en mi experiencia, las sorpresas suelen ser malas.

Y si ya estás pensando en cómo asegurar tus modelos una vez que están en producción, te recomiendo echar un ojo a mis reflexiones sobre [Modelos en Producción: Por qué no puedes soltarlos y olvidarte](/blog/modelos-en-produccion-por-que-no-puedes-soltarlos-y-olvidarte-mi-estrategia-de-version-y-monitorizacion/). El testing es el primer paso, pero la vigilancia constante es la clave para la longevidad.
