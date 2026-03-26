---
title: "Agencia en IA: Cuando tu 'agente' es solo un robot de un solo truco (y por qué me enfada)"
pubDate: 2026-03-26T14:23:30.236Z
description: "Analizo qué significa realmente la agencia en IA, más allá de los prompts bonitos. Comparto mi frustración con 'agentes' que no lo son y cómo distingo a los de verdad."
image:
  url: "https://picsum.photos/seed/agencia-en-ia-cuando-tu-agente-es-solo-un-robot-de-un-solo-truco-y-por-que-me-enfada/1200/630"
  alt: "Agencia en IA: Cuando tu 'agente' es solo un robot de un solo truco (y por qué me enfada)"
tags:
  - evergreen
  - ia
  - agentes
---

Mira, estoy cansado. Cansado de que cada pieza de código que encadena un par de prompts y llama a una API se autodenomine 'agente de IA'. No, no es un agente. Es un script glorificado con una capa de lenguaje natural. Y sí, esto me enfada un poco, porque diluye lo que la verdadera agencia en IA significa y lo que realmente podemos construir con ella.

Para mí, la agencia es más que un bucle `while True` llamando a un LLM. Es la capacidad de un sistema para *percibir* su entorno, *razonar* sobre él, *tomar decisiones* autónomas para lograr un objetivo, y *actuar* en consecuencia. Y lo más importante: que sea capaz de *adaptarse* y *aprender* de los resultados de esas acciones. Es el ciclo completo, no solo una parte.

Muchos de los llamados 'agentes' que veo por ahí son, honestamente, poco más que pipelines de ejecución predefinidos. Reciben una entrada, pasan por una secuencia fija de pasos (prompt 1, llamar herramienta A, prompt 2, devolver resultado), y punto. ¿Hay percepción? A menudo, solo la del prompt inicial. ¿Razonamiento adaptativo? Casi nunca, más bien un `if/else` disfrazado. ¿Aprendizaje? Si no hay un mecanismo de retroalimentación explícito, olvídate.

## ¿Por qué me importa esta distinción?

Porque cuando vendemos algo como un 'agente' sin que cumpla con los mínimos de autonomía y adaptación, estamos creando expectativas irreales. Y, peor aún, estamos perdiendo de vista el potencial real de lo que un agente *de verdad* puede hacer.

Cuando trabajo en un problema y pienso en si un agente es la solución adecuada, no me pregunto si puedo encadenar prompts. Me pregunto:

1.  **¿El entorno es dinámico y parcialmente observable?** Si es estático y todo lo sé de antemano, un script me sirve.
2.  **¿El objetivo requiere una secuencia de acciones no predecible a priori?** Es decir, ¿necesita *planificar* o *replanificar* sobre la marcha?
3.  **¿Hay espacio para la exploración y el aprendizaje?** ¿Puede el sistema mejorar con la experiencia? Esto me lleva directamente a temas como el [Aprendizaje por Refuerzo](/blog/aprendizaje-por-refuerzo-mis-batallas-con-el-paradigma-y-cuando-a-pesar-de-todo-me-ha-salvado/), que es donde la agencia real brilla.

Un agente, en mi libro, debería ser capaz de operar en un entorno complejo, sin necesidad de que yo le dé la mano a cada paso. Pienso en un sistema que gestiona una campaña de marketing: monitoriza métricas, ajusta presupuestos, cambia mensajes A/B, incluso propone nuevas segmentaciones. No es solo un 'generador de anuncios'; es un ente que *toma decisiones* y *busca optimizar* un objetivo de negocio. Para esto, necesita una robusta [gestión del estado](/blog/la-gestion-del-estado-en-agentes-de-ia-por-que-me-quita-el-sueno-y-como-la-afronto/) y, vitalmente, [ciclos de retroalimentación](/blog/ciclos-de-retroalimentacion-el-alma-de-un-agente-de-ia-que-realmente-aprende-y-como-los-monto-yo/) para entender qué funciona y qué no.

## Cuando un 'agente' es más ruido que otra cosa

He visto muchos casos donde se construye un 'agente' para tareas que un simple script bien programado o un microservicio resolvería mejor, más rápido y de forma más predecible. Si la tarea es: "recoge datos de X, aplica función Y, guarda en Z", no me vengas con 'agentes'. Eso es automatización, no agencia. La complejidad de un agente solo se justifica cuando la autonomía, la adaptación y la incertidumbre del entorno son factores clave.

Al final del día, mi consejo es sencillo: sé honesto con lo que estás construyendo. Si es un orquestador de prompts, llámalo así. Si es un sistema que realmente *decide*, *aprende* y *actúa* con un grado de autonomía que va más allá de un `if` y un `for` bien puestos, entonces sí, quizás tengas un agente entre manos. Pero la mayoría de las veces, lo que veo es solo la sombra de ese ideal.
