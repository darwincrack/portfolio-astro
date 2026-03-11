---
title: "Clasificación vs. Regresión: No es un concurso de popularidad, es saber qué problema resuelves"
pubDate: 2026-03-11T22:33:51.155Z
description: "A menudo se confunden, pero Clasificación y Regresión resuelven problemas distintos en ML. Te explico mis batallas y cuándo elegir uno sobre el otro."
image:
  url: "https://picsum.photos/seed/clasificacion-vs-regresion-no-es-un-concurso-de-popularidad-es-saber-que-problema-resuelves/1200/630"
  alt: "Clasificación vs. Regresión: No es un concurso de popularidad, es saber qué problema resuelves"
tags:
  - evergreen
  - ia
  - machine learning
---

Me sigue sorprendiendo cuánta gente, incluso con algo de experiencia en Machine Learning, no tiene *cristalino* cuándo usar clasificación y cuándo regresión. Parece básico, ¿verdad? Pero he visto proyectos enteros irse al traste, o al menos complicarse innecesariamente, por un mal planteamiento inicial. Para mí, no es un debate de cuál es “mejor” o más “cool”; es una cuestión de entender qué demonios estás intentando resolver con tus datos.

### La Clasificación: Cuando la respuesta es una etiqueta

Piénsalo así: la clasificación es para cuando quieres que tu modelo ponga algo en una **categoría discreta**. Es como tener un montón de cajones y tu modelo decide a qué cajón va cada nuevo elemento. ¿Es spam o no es spam? ¿Esta imagen es un perro, un gato o un unicornio (si tu dataset lo permite)? ¿Un cliente va a comprar o no va a comprar? La respuesta es un *sí/no*, un *A/B/C*.

Mis batallas aquí suelen venir con las métricas. No basta con la precisión a secas. Para mí, el `recall`, la `precisión` y la puntuación `F1` son el pan de cada día, especialmente cuando hay clases desbalanceadas. Y si quieres entender de verdad el rendimiento de tu clasificador en distintos umbrales, la curva ROC y el AUC son tus mejores amigos. Si no estás familiarizado con esto, te recomiendo echar un ojo a [Métricas de Evaluación Esenciales para Modelos de Machine Learning](/blog/metricas-de-evaluacion-esenciales-para-modelos-de-machine-learning-mide-su-rendimiento-con-precision).

### La Regresión: Cuando necesitas un número

Por otro lado, la regresión es para cuando la respuesta que buscas es un **valor continuo**, un número. Piensa en el precio de una casa, la temperatura de mañana, la cantidad de lluvia que va a caer, o el rendimiento futuro de una inversión. Aquí no hablamos de cajones, sino de una recta (o una curva, o un hiperplano) que se ajusta a tus datos para predecir un valor dentro de un rango.

Las métricas también cambian radicalmente. Olvídate de la precisión del clasificador; aquí mi foco está en el Error Absoluto Medio (MAE), el Error Cuadrático Medio (MSE) o su raíz cuadrada (RMSE). Me gusta más el MAE porque es más intuitivo; te dice, en promedio, cuánto te equivocas en la misma unidad que tu variable objetivo. El MSE penaliza más los errores grandes, lo cual puede ser bueno o malo dependiendo de tu problema.

### Mi Batalla Principal: El error de querer clasificar cuando deberías predecir (y viceversa)

Aquí es donde veo a mucha gente patinar. Imaginemos que tienes datos de clientes y quieres predecir cuánto van a gastar en el próximo mes. Un error común es intentar *clasificarlos* en “gasto bajo”, “gasto medio” y “gasto alto”. ¿Por qué lo hacen? Quizás porque les parece más fácil de interpretar para el negocio.

Pero, ¿qué pierdes con esto? Pierdes **gran cantidad de información**. Si un cliente va a gastar 99€ (categoría “bajo”) y otro 101€ (categoría “medio”), tu clasificador los tratará como mundos diferentes, cuando en realidad están muy cerca. Un modelo de regresión, en cambio, te diría los 99 y los 101, conservando esa granularidad. Luego, *después* de la predicción, puedes categorizarlos si el negocio lo necesita, pero la predicción subyacente es más rica.

Yo he defendido hasta la saciedad que, si la variable original es continua y la magnitud del valor importa, **primero regresión**. Luego, si el negocio exige categorías, las puedes derivar de la salida de la regresión. Esto te da flexibilidad y evita perder matices cruciales. Rara vez me funciona lo contrario: intentar predecir una categoría y luego intentar inferir un valor continuo a partir de ahí.

### Cuándo yo elijo uno u otro (mi regla de oro)

Mi regla es sencilla:

*   **Si la pregunta fundamental de tu problema es “¿A qué _tipo_ pertenece?” o “¿Cuál _es_ su estado (entre opciones finitas)?”**, entonces casi seguro es un problema de **clasificación**.
*   **Si la pregunta es “¿_Cuánto_?” o “¿_Qué valor_ tomará?”**, entonces es un problema de **regresión**.

Es crucial pensarlo bien desde el diseño del problema. ¿Necesitas un *diagnóstico* (clasificación) o un *pronóstico* (regresión)? A veces el problema tiene un componente de ambos, pero casi siempre hay una variable objetivo principal que define el camino.

Por supuesto, el tipo de problema también influye en cómo preparas tus datos. La [Ingeniería de Características](/blog/ingenieria-de-caracteristicas-feature-engineering-el-arte-de-optimizar-datos-para-machine-learning) es vital para ambos, pero las transformaciones pueden ser distintas. Y, sea cual sea tu elección, no te olvides de la [Validación Cruzada](/blog/validacion-cruzada-la-clave-para-modelos-de-machine-learning-robustos-y-confiables) para asegurarte de que tu modelo generaliza bien y no te está engañando con un rendimiento artificialmente bueno.

Al final del día, el mejor modelo de Machine Learning empieza por entender de forma clara qué es lo que de verdad quieres predecir. No dejes que la moda o la complejidad te desvíen de ese punto de partida tan fundamental.
