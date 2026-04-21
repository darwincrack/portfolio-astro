---
title: "Orquestación de Agentes de IA: Por qué encadenar prompts no es una estrategia (y cuándo necesitas un director)"
pubDate: 2026-04-21T22:46:25.604Z
description: "Mi experiencia construyendo sistemas complejos con IA: la clave no es encadenar prompts sin más, sino una orquestación inteligente. Hablaremos de patrones y por qué esto importa para evitar el caos."
image:
  url: "https://picsum.photos/seed/orquestacion-de-agentes-de-ia-por-que-encadenar-prompts-no-es-una-estrategia-y-cuando-necesitas-un-director/1200/630"
  alt: "Orquestación de Agentes de IA: Por qué encadenar prompts no es una estrategia (y cuándo necesitas un director)"
tags:
  - evergreen
  - ia
---

La primera vez que intenté que varios agentes de IA colaboraran para una tarea compleja, pensé: "Esto de pasar la salida de uno al siguiente tiene que ser suficiente". Qué ingenuo. Pronto me di cuenta de que el famoso 'chained prompting' no es una estrategia, es una receta para el caos y las alucinaciones a gran escala. No basta con que cada agente tenga un prompt bien diseñado; necesitas un director.

### El problema del 'teléfono escacharrado' con agentes

Imagina que tienes tres agentes: uno investiga un tema, otro lo resume, y un tercero redacta un email. Si simplemente le das la salida del Agente A al Agente B, y la de este al Agente C, lo que obtienes es un *teléfono escacharrado* moderno. Cada paso introduce ruido, pierde contexto y puede malinterpretar la intención original. Lo que empezó como una investigación pulcra, acaba siendo un email con "hechos" inventados.

En mi experiencia, esto ocurre por varias razones:

1.  **Pérdida de contexto:** El Agente B solo ve la salida 'final' del Agente A, no la intención original ni todo el historial de su "pensamiento". Es como darle solo el final de una novela a alguien y pedirle que escriba el siguiente capítulo.
2.  **Acumulación de errores:** Los errores se propagan y amplifican. Una pequeña imprecisión en el paso 1 se convierte en una "verdad" rotunda en el paso 3.
3.  **Falta de dirección:** Ningún agente tiene una visión global del objetivo final. Cada uno optimiza su pequeña parte, pero el resultado conjunto es subóptimo o, peor aún, incorrecto.

Esta es la diferencia entre un simple flujo de datos y una verdadera [Modularidad y Composición](/blog/modularidad-y-composicion-por-que-mis-sistemas-y-agentes-de-ia-no-son-un-monolito-pegado-con-cinta-aislante/).

### Por qué un director es tu mejor amigo (y el de tus agentes)

Un director, en este contexto, es una capa lógica (que implementas tú, el desarrollador) que supervisa y coordina a los agentes individuales. No es un agente más, es el sistema operativo de tu ecosistema de agentes. Su trabajo es:

*   **Gestionar el estado global:** Sabe en qué punto del proceso estamos, qué se ha hecho, qué falta por hacer y cuál es el objetivo final. Para esto, a menudo, recurro a [Máquinas de Estados](/blog/maquinas-de-estados-mi-antidoto-contra-el-codigo-espagueti-y-por-que-tus-agentes-de-ia-las-necesitan-mas-de-lo-que-crees/), son un salvavidas.
*   **Asignar tareas específicas:** Decide qué agente es el más adecuado para cada sub-tarea en cada momento.
*   **Validar y arbitrar:** Evalúa las salidas de los agentes, las compara con el objetivo o con criterios de calidad, y decide si son válidas o si necesita pedir una revisión, o incluso consultar a otro agente para una segunda opinión. Aquí es donde empieza a ser útil la [XAI](/blog/xai-por-que-el-dice-que-es-un-gato-no-me-basta-y-como-investigo-yo-lo-que-realmente-piensa-mi-modelo/).
*   **Mantener el contexto:** Se asegura de que cada agente reciba el contexto relevante para su tarea específica, sin abrumarlo con información innecesaria ni dejarlo a ciegas.
*   **Manejar errores y reintentos:** Cuando un agente falla, el director puede decidir cómo manejarlo: reintentar, escalar, o buscar una alternativa.

### Mi enfoque personal para la orquestación

Cuando me enfrento a un problema complejo que requiere varios agentes, yo sigo este patrón:

1.  **Descomposición:** Rompo el problema grande en tareas más pequeñas y bien definidas. Cada tarea se mapea a un agente especializado o a una función específica.
2.  **Definición de roles:** Cada agente tiene un rol claro y un conjunto de "herramientas" (funciones o llamadas a API) que puede usar. Evito que los agentes sean "generalistas" si no es estrictamente necesario. La [Agencia en IA](/blog/agencia-en-ia-cuando-tu-agente-es-solo-un-robot-de-un-solo-truco-y-por-que-me-enfada/) no es solo soltar un LLM a hacer cosas.
3.  **Un "cerebro" central:** Implemento el director como mi código *tradicional* (Python, TypeScript, lo que sea). Este cerebro contiene la lógica de negocio, el flujo de control, la gestión del estado y las decisiones sobre qué agente debe actuar en cada momento.
4.  **Interacciones controladas:** Los agentes no se hablan directamente entre sí. Se comunican *a través* del director. El director es el único que pasa información de uno a otro, asegurándose de que el contexto sea el adecuado y la información esté limpia.

Este enfoque añade una capa de complejidad inicial, sí. Pero te aseguro que te ahorra horas de debugging a las 3 AM tratando de entender por qué tu Agente C está "alucinando" sobre el color del cielo en un informe financiero. Un sistema orquestado es más robusto, predecible y, a la larga, mucho más fácil de mantener y evolucionar. No dejes que tus agentes corran salvajes; dales un buen director.
