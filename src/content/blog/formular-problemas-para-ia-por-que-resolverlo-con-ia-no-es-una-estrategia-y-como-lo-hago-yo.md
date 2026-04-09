---
title: "Formular Problemas para IA: Por qué \"resolverlo con IA\" no es una estrategia (y cómo lo hago yo)"
pubDate: 2026-04-09T22:51:04.830Z
description: "En mi experiencia, la mitad del éxito en IA es formular bien el problema. Comparto cómo evito los 'martillos buscando clavos' y enfoco proyectos de IA."
image:
  url: "https://picsum.photos/seed/formular-problemas-para-ia-por-que-resolverlo-con-ia-no-es-una-estrategia-y-como-lo-hago-yo/1200/630"
  alt: "Formular Problemas para IA: Por qué \"resolverlo con IA\" no es una estrategia (y cómo lo hago yo)"
tags:
  - evergreen
  - ia
---

La primera vez que me pidieron "meterle IA" a un problema de logística fue un desastre. La premisa era vaga: "queremos optimizar las rutas con IA". Al final, tras semanas de prototipos y frustraciones, descubrimos que lo que *realmente* querían era una mejor visualización de los camiones en tiempo real y alertas cuando un conductor se desviaba más de 15 minutos. ¿IA? Ni rastro. Un buen mapa y un sistema de notificaciones hubieran bastado desde el día uno. Esa experiencia me grabó a fuego una lección: **el mayor error en IA es empezar por la solución.**

Siempre lo digo: si no puedes articular el problema sin usar la palabra "inteligencia artificial", probablemente no tienes un problema, tienes un capricho tecnológico. Esto no es solo una cuestión de costes o complejidad; es un tema de expectativas, de valor real.

### La manía del martillo y el clavo "inteligente"

Nos hemos enamorado tanto de la promesa de la IA que, a menudo, la vemos como un martillo mágico para cualquier clavo que se nos ponga delante. Pero un martillo no te sirve si lo que necesitas es un destornillador, o si el "clavo" es en realidad un tornillo decorativo que no debe tocarse.

Mi enfoque, que he perfeccionado a base de golpes, es brutalmente simple: **ignora la IA al principio.** Totalmente.

1.  **¿Cuál es el dolor real?** ¿Qué proceso es lento? ¿Qué decisión se toma mal? ¿Dónde se pierde dinero, tiempo o calidad? Y, lo más importante, **¿por qué?** A veces, el problema no es que un modelo no sea suficientemente "inteligente", sino que la data de entrada es basura o el proceso humano subyacente está roto.
2.  **¿Cómo se resuelve _hoy_?** O si no se resuelve, ¿por qué no? Entender el *status quo* es vital. Me gusta ver cómo lo hace un humano, incluso si lo hace mal. Eso me da pistas sobre heurísticas, excepciones y la información que realmente se usa.
3.  **¿Cuál es el objetivo medible?** Esto es crítico. No me sirve "queremos que sea mejor". Necesito "queremos reducir el tiempo de respuesta del cliente en un 20%" o "disminuir los errores de inventario en un 15%". Sin métricas claras, ¿cómo sabré si mi "solución IA" realmente ha resuelto algo? Esto conecta mucho con mis [batallas con las métricas de evaluación](/blog/mis-batallas-con-las-metricas-de-evaluacion-por-que-la-precision-no-lo-es-todo-y-cuando-me-enfado-si-la-usas-mal/).

### El paso crucial: Traducir el problema de negocio a un problema de ML (si aplica)

Una vez que tengo claro el dolor, el *status quo* y los objetivos, entonces y solo entonces, empiezo a pensar si la IA tiene algo que decir. Aquí es donde traduzco un problema de negocio a uno técnico de Machine Learning.

Me pregunto:

*   **¿Es un problema de _predicción_?** ¿Estoy intentando adivinar un valor futuro (regresión), una categoría (clasificación) o una probabilidad?
*   **¿Es un problema de _reconocimiento_ o _detección_?** ¿Identificar algo en una imagen, texto o audio?
*   **¿Es un problema de _generación_?** ¿Crear texto, imágenes, código?
*   **¿Es un problema de _optimización_?** ¿Encontrar la mejor secuencia de acciones o asignación de recursos? Aquí, los algoritmos tradicionales o heurísticos suelen ser mis primeros sospechosos, antes de saltar a RL.
*   **¿Necesita el modelo aprender de datos?** Parece obvio, pero a veces el problema se resuelve con reglas lógicas o una base de datos.
*   **¿Qué tipo de datos tengo?** ¿Son estructurados, no estructurados? ¿Tengo suficientes? ¿Son de calidad? (Siempre vuelvo a la calidad del dato. Siempre.) Aquí, tener una buena base en [probabilidad y estadística](/blog/probabilidad-y-estadistica-por-que-ignorar-lo-basico-te-costara-caro-en-ia-y-como-lo-aprendí/) es fundamental para entender si los datos que tienes son realmente útiles.

Un ejemplo: "Reducir la rotación de clientes" (problema de negocio) se traduce a "Predecir qué clientes tienen alta probabilidad de irse en los próximos 3 meses" (problema de ML, clasificación binaria). Y luego, "¿Qué acciones podemos tomar basándonos en esa predicción para retenerlos?". El modelo solo es parte de la solución, no la solución completa.

### Cuando la IA es un desvío inútil

Recomiendo fuertemente evitar la IA si:

*   **El problema se resuelve fácilmente con reglas o lógica simple.** No uses un LLM para formatear una fecha. No uses visión por computador para leer un código de barras si un lector láser lo hace mejor y más barato.
*   **No tienes datos (o los que tienes son una broma de mal gusto).** Un modelo de ML sin datos es un unicornio sin cuerno: bonito en la imaginación, inútil en la realidad.
*   **La interpretabilidad es absolutamente crítica y no puedes justificar la decisión de un modelo complejo.** A veces, un modelo más simple y "transparente" es la elección correcta, aunque sea ligeramente menos preciso.
*   **El costo de un error del modelo es catastrófico y no tienes mecanismos de seguridad.** Piensa en coches autónomos.

Para mí, la modularidad y la abstracción son principios que aplico incluso al formular el problema. Descomponerlo en partes más pequeñas y manejables, incluso si solo una fracción requiere ML, hace que todo sea más robusto. Si te interesa, ya escribí sobre cómo aplico [modularidad y composición](/blog/modularidad-y-composicion-por-que-mis-sistemas-y-agentes-de-ia-no-son-un-monolito-pegado-con-cinta-aislante/) en mis sistemas y agentes.

Al final, mi meta es la misma que la tuya: construir cosas que funcionen, que resuelvan un problema real y que no me den dolores de cabeza a las 3 de la mañana. Y eso empieza mucho antes de escribir la primera línea de código, empieza por el planteamiento del problema. Pensar es gratis, re-implementar una solución equivocada, no.
