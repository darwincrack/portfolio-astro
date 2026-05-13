---
title: "Tokenización: Por qué no es solo cortar y pegar palabras (y por qué me ha roto más de un modelo de IA)"
pubDate: 2026-05-13T23:11:31.003Z
description: "La tokenización es crucial en IA, pero a menudo se subestima. Comparto mi experiencia con sus trampas, cómo afecta los costes y el rendimiento de mis modelos."
image:
  url: "https://picsum.photos/seed/tokenizacion-por-que-no-es-solo-cortar-y-pegar-palabras-y-por-que-me-ha-roto-mas-de-un-modelo-de-ia/1200/630"
  alt: "Tokenización: Por qué no es solo cortar y pegar palabras (y por qué me ha roto más de un modelo de IA)"
tags:
  - evergreen
  - ia
  - programacion
---

Me ha pasado más de una vez: un modelo de lenguaje que en local funcionaba como un reloj suizo, al subirlo a producción empezaba a decir disparates o, directamente, a lanzar un `token limit exceeded` que me hacía sudar frío a las 3 de la mañana. ¿El culpable? Una tokenización mal entendida o, peor aún, ignorada.

Mucha gente piensa en la tokenización como un simple `split()` por espacios, un "cortar y pegar" palabras. Pero en el mundo de la IA, especialmente con los modelos de lenguaje modernos, eso es un error muy costoso, tanto en rendimiento como en dinero.

### El "qué" no es tan simple como parece

En esencia, la tokenización es el proceso de dividir el texto en unidades más pequeñas, los **tokens**, que el modelo puede entender y procesar. Cada token se convierte en un ID numérico que luego se transforma en un [Embedding: Por qué no son solo números aleatorios (y por qué mi IA los necesita para entender el mundo)](/blog/embeddings-por-que-no-son-solo-numeros-aleatorios-y-por-que-mi-ia-los-necesita-para-entender-el-mundo/). Hasta ahí, todo bien. El problema es que el "cómo" es clave.

Los tokenizadores modernos, como los basados en BPE (Byte-Pair Encoding), WordPiece o SentencePiece, no dividen solo por palabras completas. Trabajan con **subpalabras**. ¿Por qué? Para manejar palabras nuevas (que no vieron durante el entrenamiento) y para reducir el tamaño del vocabulario. Por ejemplo, "descentralización" podría dividirse en `des` + `central` + `ización`. Esto es inteligente, sí, pero tiene su lado oscuro.

### Mis principales dolores de cabeza con la tokenización

1.  **Contexto y Coste:** Cada modelo tiene un límite de tokens que puede procesar en una sola llamada (la famosa "ventana de contexto"). Si tu tokenizador es ineficiente, un texto corto puede generar muchísimos tokens, agotando tu ventana rápidamente. Esto no solo limita la capacidad de tu agente de IA para [Planificación en Agentes de IA: Por qué tu 'robot' necesita pensar más allá del siguiente prompt](/blog/planificacion-en-agentes-de-ia-por-que-tu-robot-necesita-pensar-mas-alla-del-siguiente-prompt-y-como-lo-consigue/), sino que también dispara los costes de las APIs, que facturan por token. He visto cómo se queman presupuestos enteros por no optimizar esto.

2.  **Palabras fuera de vocabulario (OOV):** Aunque los tokenizadores de subpalabra reducen las OOV, no las eliminan. Si una subpalabra o caracter es completamente desconocido, el tokenizador lo mapeará a un token genérico como `<unk>` (unknown). Imagina que tu modelo recibe "`&amp;nbsp;`" o un emoji específico muy raro y lo tokeniza como `<unk>`. El modelo pierde información valiosísima o, peor, entiende algo completamente distinto. Es como hablar con alguien y que cada dos por tres diga "blablablá" donde debería haber un dato crucial.

3.  **Diferencias entre modelos:** No todos los modelos usan el mismo tokenizador, ni el mismo vocabulario. Usar el tokenizador de un modelo A para preprocesar texto para un modelo B es una receta para el desastre. Me he llevado sustos gordos por asumir que un `tokenizer.from_pretrained()` era universalmente compatible.

4.  **Sensibilidad lingüística:** La tokenización no es igual para todos los idiomas. Un tokenizador diseñado para inglés puede destrozar un texto en japonés o alemán, donde las estructuras de palabras y los caracteres son completamente diferentes. Esto me ha llevado a invertir tiempo en probar tokenizadores multilingües o específicos para el idioma objetivo.

### ¿Qué hago yo para no volverte loco?

*   **Siempre, _siempre_, reviso el tokenizador de mi modelo.** Entiendo cómo se comporta con textos que tienen caracteres especiales, URLs, emojis, o lenguajes que no son el principal para el que fue entrenado. Un vistazo rápido a la documentación del modelo y a ejemplos de tokenización con `tokenizer.encode()` y `tokenizer.decode()` es oro.

*   **Estimo el uso de tokens.** Antes de lanzar un sistema, hago pruebas con textos representativos para ver cuántos tokens generan y si caben en la ventana de contexto. Esto me ayuda a diseñar prompts eficientes y a prever costes.

*   **Considero la [Eficiencia Computacional en IA: Mi batalla para hacer que cada FLOP cuente](/blog/eficiencia-computacional-en-ia-mi-batalla-para-hacer-que-cada-flop-cuente-y-por-que-deberias-lucharla-tu-tambien/).** Un buen tokenizador contribuye a ello, al mantener la entrada compacta y significativa.

*   **No asumo nada.** Si estoy trabajando con un modelo preentrenado, uso *su* tokenizador. No intento inventar la rueda, a menos que tenga una razón muy poderosa para entrenar uno nuevo (y entonces sé que me meto en un buen lío).

La tokenización puede parecer un detalle técnico aburrido, pero es la base sobre la que se construye la comprensión del lenguaje de cualquier modelo. Ignorarla es pedir a gritos problemas de rendimiento, costes descontrolados y, en mi experiencia, alguna que otra noche sin dormir. Es un pilar fundamental que todo desarrollador de IA debería entender y respetar.
