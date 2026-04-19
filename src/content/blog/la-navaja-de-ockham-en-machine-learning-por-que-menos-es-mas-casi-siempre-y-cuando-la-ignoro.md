---
title: "La Navaja de Ockham en Machine Learning: ¿Por qué menos es más (casi siempre) y cuándo la ignoro?"
pubDate: 2026-04-19T22:42:56.421Z
description: "Mi filosofía personal sobre la complejidad de los modelos de ML. Prefiero la simplicidad, pero hay momentos donde necesitas un martillo para una nuez."
image:
  url: "https://picsum.photos/seed/la-navaja-de-ockham-en-machine-learning-por-que-menos-es-mas-casi-siempre-y-cuando-la-ignoro/1200/630"
  alt: "La Navaja de Ockham en Machine Learning: ¿Por qué menos es más (casi siempre) y cuándo la ignoro?"
tags:
  - evergreen
  - ia
---

Recuerdo mi primer proyecto serio de Machine Learning para detectar transacciones fraudulentas. Me sentía tentado a desplegar el arsenal completo: redes neuronales profundas, ensambles complejos, toda la parafernalia. Pero en ese momento, una voz en mi cabeza, la que había aprendido a base de depurar sistemas a las 3 de la mañana, me susurró: “Empieza simple, colega”. Y esa voz, que se apoyaba en la famosa Navaja de Ockham, me ha salvado más de una vez en mi carrera.

### La Navaja de Ockham en mi mundo del ML

Para los que no la conozcan, la Navaja de Ockham es un principio filosófico que, para simplificar, dice algo así como: "entre dos teorías con las mismas predicciones, la más simple es probablemente la correcta". En Machine Learning, yo lo interpreto como: **entre dos modelos que rinden de forma similar, el más simple es casi siempre el que deberías elegir.**

¿Por qué? Porque la simplicidad no es solo elegancia; es pragmatismo puro y duro en el día a día de un desarrollador de ML. Para mí, la simplicidad se traduce directamente en:

1.  **Interpretabilidad**: Un modelo simple es más fácil de entender. Cuando un cliente te pregunta por qué su préstamo fue rechazado o por qué una transacción se marcó como fraude, es mucho más sencillo desgranar un modelo lineal o un árbol de decisión que un Transformer con millones de parámetros. Esto no solo facilita la comunicación, sino que es oro puro cuando toca depurar. Antes de pensar en [XAI: por qué el 'dice que es un gato' no me basta](/blog/xai-por-que-el-dice-que-es-un-gato-no-me-basta-y-como-investigo-yo-lo-que-realmente-piensa-mi-modelo), intenta construir un modelo que no necesite un doctorado para ser entendido.
2.  **Mantenimiento**: Un modelo con menos piezas móviles, menos hiperparámetros y una lógica más transparente es una gozada de mantener. Las actualizaciones son más directas, los bugs se localizan más rápido y la curva de aprendizaje para un nuevo miembro del equipo es mucho menor.
3.  **Robustez y generalización**: Es contraintuitivo, lo sé, pero los modelos simples a menudo generalizan mejor en datasets pequeños o ruidosos. Hay menos oportunidades para que el modelo aprenda patrones espurios o memorice el ruido, lo que es un clásico del [Overfitting y Underfitting: Mis batallas con el equilibrio en Machine Learning](/blog/overfitting-y-underfitting-mis-batallas-con-el-equilibrio-en-machine-learning-y-por-que-no-es-solo-ajustar-un-parametro). He visto modelos complejos fallar estrepitosamente en producción mientras que una regresión logística seguía haciendo su trabajo discretamente.
4.  **Recursos**: Menos cómputo para entrenar, menos memoria para desplegar, inferencia más rápida. Esto se traduce en ahorro de costes y una huella de carbono más pequeña, algo que no siempre tenemos en cuenta pero deberíamos.

### Cuándo le doy la espalda a la Navaja (y con qué dolor)

Ahora bien, no soy un purista. La vida real del desarrollo de IA te obliga a ser pragmático. Hay momentos, y los he vivido, en los que la Navaja de Ockham simplemente no corta lo suficiente. Esos momentos suelen ser:

*   **Problemas inherentemente complejos**: El procesamiento de lenguaje natural de última generación, la visión por computador avanzada o ciertos dominios de aprendizaje por refuerzo. Aquí, los modelos profundos o complejos no son un capricho, son un requisito por la naturaleza intrincada de los datos y las relaciones que deben aprender. Intentar usar un modelo simple sería como querer clavar un clavo con un tenedor.
*   **Cuando la simplicidad no alcanza el rendimiento requerido**: He tenido proyectos donde el modelo simple, por más que lo exprimiera con *feature engineering* y *tuning* (sí, hago *hyperparameter tuning* incluso en los simples), no daba la métrica mínima necesaria. Solo entonces, y solo entonces, empiezo a escalar la complejidad. Pero siempre con justificación, nunca por moda.
*   **Cuando la interpretabilidad es secundaria a la precisión (pero con asterisco)**: Hay nichos donde la precisión es tan crítica, que el "porqué" pasa a un segundo plano. Pienso en algunos sistemas de recomendación muy específicos o detección de patrones anómalos donde un falso negativo es catastrófico. Pero incluso en estos casos, mi obsesión por la [Observabilidad: Por qué mirar solo logs es como pilotar a ciegas](/blog/observabilidad-por-que-mirar-solo-logs-es-como-pilotar-a-ciegas-y-como-evito-estrellarme) sigue siendo mi chaleco salvavidas para entender el *qué* está pasando.

### Mi proceso: empezar pequeño, crecer con argumentos

Mi regla de oro es: **empieza con el modelo más simple que crees que podría funcionar**. Luego, y solo si tienes una razón *demostrada* (una métrica que no alcanza, un sesgo que no corriges, un rendimiento que necesitas), añade complejidad. Cada capa de abstracción, cada aumento de parámetros, debe justificarse con datos y un *porqué* sólido.

No es una regla inquebrantable, sino una heurística que me ha ahorrado innumerables horas de depuración, quebraderos de cabeza y recursos. Así que, la próxima vez que te enfrentes a un problema de ML, antes de lanzarte a por la última arquitectura de moda, pregúntate: ¿Qué diría la Navaja de Ockham?
