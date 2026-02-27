---
title: "Prompt Engineering: Por qué no es solo 'hablar' con una IA, y mi batalla para dominarlo"
pubDate: 2026-02-27T13:57:43.054Z
description: "La ingeniería de prompts va más allá de un buen texto. Comparto mi frustración y las estrategias que uso para hacer que los LLMs hagan lo que quiero, sin volverme loco."
image:
  url: "https://picsum.photos/seed/prompt-engineering-por-que-no-es-solo-hablar-con-una-ia-y-mi-batalla-para-dominarlo/1200/630"
  alt: "Prompt Engineering: Por qué no es solo 'hablar' con una IA, y mi batalla para dominarlo"
tags:
  - evergreen
  - ia
  - programacion
  - agentes
---

Recuerdo perfectamente la primera vez que pensé que esto de los LLMs iba a ser magia pura. Le lanzaba un par de frases a un modelo, me devolvía algo decente y listo. Pero esa luna de miel duró menos que un sprint mal planificado. En cuanto empecé a querer cosas **específicas**, coherentes, y repetibles de estas máquinas, el espejismo se rompió y me topé con la dura realidad del _prompt engineering_.

No, no es solo “saber hablarle a la IA”. Si fuera tan simple, no pasaríamos horas retocando una coma, cambiando una palabra o reestructurando un párrafo entero solo para que el modelo haga lo que *creemos* que le estamos pidiendo. Para mí, esto es más parecido a **programar un sistema con un manual incompleto y que cambia de humor cada día**.

## Mi frustración inicial: La caja negra parlanchina

El gran problema, como lo veo yo, es la **no-determinismo**. Le das el mismo prompt diez veces y obtienes diez respuestas ligeramente distintas. Si a eso le sumas que los LLMs no “entienden” en el sentido humano (solo predicen la siguiente palabra con base en patrones masivos), te encuentras en un terreno donde la intuición es una guía peligrosa. Intentar depurar un comportamiento inesperado de un LLM es como intentar debuggear una mente colmena con telepatía: no hay `print()` que valga.

Yo he perdido mañanas enteras intentando que un modelo generara JSON válidos de forma consistente, o que siguiera un tono específico sin caer en la grandilocuencia genérica. Al principio, era pura prueba y error, una agonía. Me sentía como un arqueólogo intentando descifrar jeroglíficos con la esperanza de que el faraón se dignara a seguir mis instrucciones.

## Mi enfoque: Trata los prompts como código (o casi)

Con el tiempo, y después de varios ataques de cabezonería, desarrollé una filosofía que me funciona: **trato los prompts con la misma disciplina que trato mi código**. Esto significa:

### 1. Versionar y documentar

Sí, versiono mis prompts importantes. Una simple carpeta con archivos Markdown o YAML en un repositorio Git. Cada vez que descubro un tweak que mejora la salida o soluciona un bug de comportamiento, lo guardo y anoto _por qué_ hice ese cambio. Esto me ha salvado de repetir errores y me permite volver a versiones anteriores si algo se rompe con una nueva iteración del modelo. Parece obvio, pero al principio, no lo hacía nadie.

### 2. Modularizar (cuando se puede)

¿Tienes un prompt muy largo que hace muchas cosas? Intento dividirlo. Por ejemplo, en lugar de un prompt monolítico para “resume y extrae entidades y luego genera un email”, prefiero: un prompt para el resumen, otro para la extracción de entidades y un tercero que combine los resultados para generar el email. Esto no es solo para la limpieza, es que a menudo, **si le pides demasiadas cosas a la vez, el modelo tiende a dispersarse o a priorizar una parte sobre otra**. Esta es la base de lo que en su día me llevó a pensar en arquitecturas de agentes más complejas, como las que explico en [Agentes de IA: Más allá del prompt chaining (mi visión de una arquitectura robusta)](/blog/agentes-de-ia-mas-alla-del-prompt-chaining-mi-vision-de-una-arquitectura-robusta).

### 3. **Mensajes del sistema (System Messages) son tus amigos**

Siempre que puedo, uso el `system` role para definir el contexto, el rol del modelo y las restricciones globales. Es como el `Dockerfile` de tu prompt. Le digo: “Eres un experto en ciberseguridad que explica conceptos complejos de forma concisa y práctica. Nunca uses jerga técnica sin explicarla.” Esto ayuda a establecer un marco antes de que la conversación real con el `user` empiece, y he notado que reduce las salidas "genéricas" de forma drástica.

### 4. Ejemplos (Few-Shot) con cabeza

Darle ejemplos de entrada y salida esperada (few-shot prompting) funciona, y mucho. Pero hay una trampa: no copies y pegues ejemplos a lo loco. Mis ejemplos son **concisos, representativos y cubren los casos límite** que me preocupan. No es solo mostrarle cómo quieres que lo haga, es también enseñarle cómo *no* quieres que lo haga implícitamente, mostrando el resultado correcto para entradas problemáticas.

### 5. Saber cuándo el prompt no es suficiente

Aquí es donde entra la autocrítica. Si después de iterar y re-iterar, mi prompt sigue fallando o requiere una cantidad absurda de "magia" en el texto, me pregunto: **¿Estoy pidiéndole al modelo algo para lo que no está diseñado?** O, ¿es que hay una mejor herramienta?

En mi experiencia, forzar un LLM a ser una base de datos de conocimiento precisa o a realizar razonamientos complejos sobre datos externos, suele ser una receta para el desastre. A veces, la respuesta no es un prompt más largo o más inteligente, sino:

*   **RAG (Retrieval Augmented Generation)**: para incorporar conocimiento externo y específico.
*   **Fine-tuning**: si necesito que el modelo adapte su estilo o conocimiento a un dominio muy particular y tengo los datos para ello. Esto es un camino que no se toma a la ligera, como explico en [Fine-tuning de LLMs: ¿Cuándo de verdad merece la pena el dolor de cabeza?](/blog/fine-tuning-de-llms-cuando-de-verdad-merece-la-pena-el-dolor-de-cabeza).
*   **Herramientas externas**: usar funciones o APIs para delegar tareas que el LLM no hace bien (cálculos matemáticos, búsquedas exactas, etc.).

## Al final, es una lucha constante

La ingeniería de prompts no es un arte místico ni una ciencia exacta, es un campo de batalla en evolución constante. Los modelos cambian, sus sesgos y sus capacidades fluctúan. Lo que funcionaba ayer, puede que hoy sea mediocre. Me toca seguir iterando, compartiendo mis descubrimientos (y mis quejas) con otros desarrolladores, y aprendiendo de los errores (míos y de la IA).

No busco la perfección, busco la **robustez y la previsibilidad** en un mundo donde la IA aún es un adolescente brillante pero impredecible. Y sí, aunque me duela la cabeza a veces, la verdad es que sigo fascinado con las posibilidades.
