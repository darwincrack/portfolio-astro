---
title: "Mis batallas con las métricas de evaluación: por qué la precisión no lo es todo (y cuándo me enfado si la usas mal)"
pubDate: 2026-03-27T14:09:43.872Z
description: "La elección de métricas en Machine Learning es clave. Hablo de mis batallas con la precisión, el recall y la F1-score, y por qué entenderlas te ahorrará problemas."
image:
  url: "https://picsum.photos/seed/mis-batallas-con-las-metricas-de-evaluacion-por-que-la-precision-no-lo-es-todo-y-cuando-me-enfado-si-la-usas-mal/1200/630"
  alt: "Mis batallas con las métricas de evaluación: por qué la precisión no lo es todo (y cuándo me enfado si la usas mal)"
tags:
  - evergreen
  - ia
---

Cuando alguien me dice que su modelo tiene un 98% de precisión, mi primera reacción no es aplaudir. Es levantar la ceja y preguntar: "¿98% de qué, exactamente? ¿Y en qué contexto?". He visto demasiadas veces cómo una métrica mal elegida o, peor aún, mal interpretada, ha llevado a equipos enteros por un camino de decisiones desastrosas. Las métricas de evaluación no son solo números; son la brújula que te dice si tu modelo va hacia el puerto correcto o directo a un iceberg. Y créeme, he chocado con unos cuantos.

### La trampa del 98%

Imagínate esto: un modelo para detectar fraude en transacciones bancarias. Lo pruebas y te da un impresionante 98% de precisión. ¡Fantástico, ¿no?! Pues no, la mayoría de las veces es un **NO** rotundo. ¿Por qué? Porque el 99.9% de las transacciones no son fraudulentas. Si tu modelo simplemente predice que *ninguna* transacción es fraudulenta, ya tienes una precisión del 99.9%. Tu 98% no solo es peor, sino que es activamente peligroso, porque estás dejando pasar casi todo el fraude real.

Este es el problema con la _accuracy_ (precisión a secas, o exactitud en algunos sitios) cuando tienes datasets desbalanceados. Es una métrica tentadora, fácil de entender, pero en escenarios críticos es, en mi opinión, casi inútil. Te da una falsa sensación de seguridad que puede costar muy cara.

### Mis armas secretas: Recall y Precision (y cuándo las uso)

En lugar de una cifra única y engañosa, prefiero mirar el problema desde dos ángulos que para mí son la base de casi cualquier evaluación de clasificación:

*   **Recall (Sensibilidad o Exhaustividad): Cuando no puedes permitirte perder un positivo real.**

    El recall responde a la pregunta: "De todos los casos positivos *reales* que existen, ¿cuántos fue capaz de detectar mi modelo?". Es crucial cuando el coste de un falso negativo es alto. Piénsalo en un diagnóstico médico de una enfermedad grave: si hay enfermedad, quieres que el modelo la detecte casi siempre. Prefiero una alarma falsa que dejar pasar un cáncer. En sistemas de seguridad, para detectar intrusos, también busco un recall alto. Quiero atrapar a *todos* los ladrones, aunque eso signifique revisar alguna falsa alarma.

*   **Precision (Valor Predictivo Positivo): Cuando no puedes permitirte falsos positivos.**

    La precision, en cambio, te dice: "De todos los casos que mi modelo predijo como positivos, ¿cuántos fueron realmente positivos?". Aquí, el coste de un falso positivo es lo que me preocupa. Si estoy construyendo un sistema de recomendación de productos, no quiero recomendarte algo inútil y molestarte. O si es un filtro de spam, no quiero marcar un email importante como spam. En la detección de fraude, si cada transacción marcada como fraudulenta requiere una investigación humana costosa, querrás que tu modelo tenga una precision alta para no saturar al equipo con falsas alarmas. No me importa tanto que se escape algo (si tengo otras capas de seguridad), como asegurarme de que lo que digo que es fraude, lo sea de verdad.

### El equilibrio: F1-Score

Cuando necesito un buen equilibrio entre recall y precision, o cuando ambas son importantes y no puedo privilegiar una sobre la otra sin un motivo claro, recurro a la F1-score. Es la media armónica de ambas y me da una visión más balanceada del rendimiento del modelo, especialmente en esos datasets desbalanceados donde la accuracy falla estrepitosamente. Es la métrica a la que suelo recurrir por defecto si no hay un caso de negocio que incline la balanza explícitamente hacia recall o precision.

### Mi proceso de elección de métricas

No hay una métrica única para todo. Mi mantra es: **el problema de negocio define la métrica.** Antes de siquiera pensar en entrenar un modelo, me siento con el equipo de negocio y hago las preguntas difíciles:

1.  ¿Cuál es el coste (económico, reputacional, humano) de un falso positivo?
2.  ¿Cuál es el coste de un falso negativo?
3.  ¿Qué impacto tiene en la experiencia del usuario o en la operación si el modelo se equivoca en una u otra dirección?

La respuesta a estas preguntas es lo que me dicta si debo optimizar para recall, para precision, o para un balance como la F1-score. Es un ejercicio de comprensión profunda del dominio, no de matemáticas de IA. Y es algo que también me guío al elegir el tipo de modelo y su complejidad, como ya comenté en [Interpretación vs. Rendimiento en IA: Mi guerra interna (y la tuya) al elegir un modelo](/blog/interpretacion-vs-rendimiento-en-ia-mi-guerra-interna-y-la-tuya-al-elegir-un-modelo).

También es fundamental recordar que las métricas de evaluación no son las funciones de pérdida que se utilizan durante el entrenamiento del modelo. Aunque están relacionadas, tienen propósitos distintos. Las funciones de pérdida son el "cerebro" que guía el aprendizaje, mientras que las métricas son los "ojos" que me permiten juzgar si el cerebro hizo bien su trabajo. Si te interesa ahondar en el tema, te recomiendo leer sobre [Funciones de Pérdida: El Verdadero Cerebro Detrás de Tus Modelos de IA (y por qué no le prestas atención)](/blog/funciones-de-perdida-el-verdadero-cerebro-detras-de-tus-modelos-de-ia-y-por-que-no-le-prestas-atencion).

### Más allá de estas

Claro, existen otras métricas como el área bajo la curva ROC (ROC AUC), que es excelente para evaluar el rendimiento general del clasificador en diferentes umbrales, o el PR AUC (Precision-Recall AUC) para datasets muy desbalanceados. Pero la base, el punto de partida para entender qué está haciendo tu modelo y si sirve para el problema, siempre vuelve a precision y recall.

### En resumen: tu problema de negocio es la métrica maestra

Nunca te dejes seducir por un número de precisión alto sin entender a fondo su contexto. El arte de la evaluación en Machine Learning no está en memorizar fórmulas, sino en traducir las necesidades del negocio en la métrica adecuada. La próxima vez que alguien te hable de un 98% de accuracy, ya sabes qué preguntar. Y no te enfades si te toca explicarlo; yo ya lo he hecho demasiadas veces.
