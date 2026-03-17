---
title: "Mis batallas con la causalidad en IA: Deja de creer que tus modelos entienden el *porqué*"
pubDate: 2026-03-17T22:41:08.541Z
description: "La correlación es fácil, la causalidad un infierno. Descubre por qué tus modelos de IA necesitan entender el 'porqué' y mis estrategias para buscar causas reales."
image:
  url: "https://picsum.photos/seed/mis-batallas-con-la-causalidad-en-ia-deja-de-creer-que-tus-modelos-entienden-el-porque/1200/630"
  alt: "Mis batallas con la causalidad en IA: Deja de creer que tus modelos entienden el *porqué*"
tags:
  - evergreen
  - ia
---

Mira, si hay algo que me saca de quicio, es ver cómo la gente confunde correlación con causalidad, especialmente cuando hablamos de modelos de Machine Learning. Mis modelos son excelentes encontrando patrones, pero a menudo me devuelven una correlación espectacular que, si la interpreto mal, me lleva directo al desastre. Y he caído más veces de las que me gustaría admitir, a las 3 de la mañana, viendo cómo una métrica se disparaba por una causa que no tenía nada que ver con lo que yo pensaba.

### El problema de base: Mis modelos son estadísticos, no filósofos

Mis redes neuronales, mis regresiones logísticas, mis árboles de decisión... son máquinas de encontrar relaciones. Ven que el consumo de helado sube en verano y, ¡oh sorpresa!, también suben los ahogamientos. Si les pregunto qué hacer para evitar ahogamientos, me dirán que prohíba el helado. Y no, no es que sean estúpidos; es que su lógica se basa en *cuántas veces* A y B ocurren juntos, no en *por qué* B sucede después de A, o si hay una C (el calor, en este caso) que causa ambas cosas. Es una diferencia sutil pero brutal para tomar decisiones.

Este es el tipo de sesgo que nos puede arruinar un proyecto. Si quieres leer más sobre ello, te recomiendo mi artículo [El sesgo implícito en tus datos: mi pesadilla más recurrente](/blog/el-sesgo-implicito-en-tus-datos-mi-pesadilla-mas-recurrente-y-como-intento-no-pasarla-por-alto/).

### ¿Por qué me obsesiona la causalidad?

Me obsesiona porque si un modelo no entiende las causas reales, **su capacidad predictiva es frágil y su capacidad prescriptiva es peligrosa**. Puedes tener un modelo que prediga las ventas con una precisión brutal, pero si no sabes *por qué* se producen esas ventas, cualquier cambio en el entorno lo puede desbaratar. Imagina lanzar una campaña de marketing basada en una correlación que no es causal. Tirarías el dinero, y lo que es peor, podrías desviar recursos de lo que *realmente* funciona.

Cuando construyo un agente de IA, no solo quiero que *haga* cosas, quiero que *razone* sobre lo que hace. Y el razonamiento causal es clave. ¿De qué sirve que un agente me recomiende una acción si no tiene ni idea de por qué esa acción va a producir el resultado deseado? Acabaré con un agente que parece inteligente, pero que es un castillo de naipes. De ahí mi énfasis en que el [El Bucle de Razonamiento del Agente de IA](/blog/el-bucle-de-razonamiento-del-agente-de-ia-por-que-no-es-solo-un-while-true-y-cuando-se-rompe) no se rompa por una lógica endeble.

### Mis estrategias para arañar la causalidad

La causalidad es dura, no hay varita mágica. Pero no me rindo. Estas son mis líneas de defensa:

1.  **Experimentos controlados (A/B testing a tope):** Es la vía dorada. Si quiero saber si mi nueva funcionalidad *causa* un aumento de engagement, lo mejor es un A/B test. Divido a la audiencia, aplico la funcionalidad a un grupo, la mantengo igual en el otro, y veo si hay una diferencia estadísticamente significativa. Simple, potente y, aunque a veces lento, irrefutable. Si no tienes la opción de experimentar, el resto son parches, lo siento, pero es la realidad.

2.  **Modelos causales gráficos (DAGs):** Cuando no puedo hacer un experimento (que es la mayoría de las veces en datos históricos), me lío con los gráficos acíclicos dirigidos (DAGs, por sus siglas en inglés). Dibujo las relaciones causales que *creo* que existen entre mis variables, basándome en mi conocimiento del dominio. Esto me ayuda a identificar confusores y a diseñar análisis estadísticos que intenten *controlar* por esas variables. Es un ejercicio de humildad y de asumir que mi modelo del mundo es imperfecto, pero es un paso enorme más allá de la correlación pura. Herramientas como `DoWhy` en Python me han salvado la vida aquí, permitiéndome codificar mi entendimiento causal y luego probar diferentes métodos de inferencia causal.

3.  **Variables instrumentales y regresión de discontinuidad:** Son técnicas estadísticas más avanzadas para cuando el A/B testing es imposible y los DAGs no son suficientes para desentrañar el lío. Me permiten inferir causalidad en situaciones donde hay factores que *influencian* el tratamiento (la variable que me interesa), pero no el resultado directamente, salvo a través de ese tratamiento. Son complejas, exigen una comprensión profunda de los datos y, francamente, no las aplico a la ligera. Pero son herramientas poderosas en mi arsenal.

4.  **Menos modelos complejos, más *interpretables*:** A veces, mi obsesión por la métrica más alta me lleva a modelos tan complejos que son cajas negras. Prefiero sacrificar un 0.5% de precisión por un modelo que, al menos, puedo intentar interpretar y donde las relaciones que predice *parecen* tener sentido causal. Si no puedo explicar el porqué de una predicción, es una bandera roja gigante para mí. [Explicabilidad en IA (XAI)](/blog/explicabilidad-en-ia-xai-desentranando-el-por-que-de-las-decisiones-de-la-inteligencia-artificial) es un campo en el que invierto mucho tiempo por esto mismo.

La causalidad no es un tema de moda, es un pilar fundamental para construir sistemas de IA robustos y, sobre todo, *confiables*. Mis modelos son mis herramientas, pero la responsabilidad de entender el mundo, el *porqué* de las cosas, sigue siendo mía. Y la verdad, me gusta que sea así.
