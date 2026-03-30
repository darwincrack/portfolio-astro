---
title: "Regularización en ML: No es magia, es disciplina (y por qué siempre la tengo en mente)"
pubDate: 2026-03-30T22:44:58.407Z
description: "Mis modelos de Machine Learning no sobreajustan porque aplico regularización de forma estratégica. Comparto mi visión personal sobre L1, L2 y Dropout, y cuándo usar cada una."
image:
  url: "https://picsum.photos/seed/regularizacion-en-ml-no-es-magia-es-disciplina-y-por-que-siempre-la-tengo-en-mente/1200/630"
  alt: "Regularización en ML: No es magia, es disciplina (y por qué siempre la tengo en mente)"
tags:
  - evergreen
  - ia
---

Recuerdo un proyecto hace unos años donde mi modelo rendía de maravilla en los datos de entrenamiento. Un 98% de precisión, una F1 score casi perfecta. Me sentía un genio. Luego lo puse a prueba con datos nuevos y… un desastre. La precisión se desplomó al 60%. Había sobreajustado de forma brutal, y la rabia de ver tanto trabajo irse por el desagüe me acompañó durante días.

Esa experiencia me grabó a fuego una lección: **la regularización no es una opción, es una disciplina**. Mis modelos de Machine Learning tienen que generalizar, no memorizar. Y para conseguirlo, hay que ser proactivo. No se trata de aplicar la primera técnica que encuentres, sino de entender por qué funciona y cuándo te conviene más una u otra.

## L1 y L2: Mis herramientas para domar modelos lineales (y algo más)

Cuando pienso en modelos lineales (regresiones, clasificadores básicos), L1 (Lasso) y L2 (Ridge) son mis primeros aliados. Ambas añaden una penalización a la función de coste durante el entrenamiento, pero lo hacen de forma diferente.

*   **L2 (Ridge):** Esta es mi opción por defecto la mayoría de las veces. Penaliza la **magnitud** de los coeficientes. ¿Qué consigo con esto? Coeficientes más pequeños, que reducen la complejidad del modelo y lo hacen menos sensible a pequeños cambios en los datos de entrada. El modelo se vuelve más robusto. Yo lo veo como forzar a mi modelo a ser más humilde, a no creerse demasiado importante con ningún _feature_ en particular.

*   **L1 (Lasso):** Aquí es donde la cosa se pone interesante si tienes un montón de _features_ y sospechas que muchos son ruido. L1 penaliza la **suma absoluta** de los coeficientes y tiene una propiedad mágica: puede llevar coeficientes a cero. Esto significa que no solo reduce su magnitud, sino que directamente _elimina_ algunos _features_ del modelo. En mi experiencia, esto es genial para la selección automática de características. Si estoy trabajando con un dataset con cientos de columnas y quiero una señal clara de cuáles importan de verdad, Lasso es mi amigo. Es como decirle al modelo: "si no estás *seguro* de que esta característica ayuda, mejor ignórala por completo". Para un análisis más profundo de cómo las características impactan tu modelo, a veces hay que ir más allá de la magnitud de los coeficientes. Ya he despotricado sobre la importancia del [Feature Engineering](/blog/feature-engineering-mi-obsesion-oculta-y-por-que-tus-modelos-la-necesitan-mas-de-lo-que-crees/), y la regularización L1 es un buen compañero para ese proceso.

**Mi veredicto:** Si no hay una razón clara para la selección de _features_, empiezo con L2. Si el número de _features_ es una locura y quiero simplificar el modelo o hacer un pre-filtrado, me inclino por L1.

## Dropout: Mi truco sucio para redes neuronales

Las redes neuronales son potentes, sí, pero también son unas campeonas en el sobreajuste. Tienen tantos parámetros que pueden memorizar casi cualquier cosa. Aquí es donde entra Dropout, y es una técnica que me encanta por su simplicidad y efectividad.

¿Cómo funciona? Durante el entrenamiento, Dropout “apaga” aleatoriamente un porcentaje de neuronas en una capa. Esto lo hace en cada iteración. ¿El efecto? Fuerza a la red a no depender demasiado de ninguna neurona o conjunto de neuronas específico. Es como obligar a los estudiantes a estudiar en grupo, pero asegurándose de que de vez en cuando falte alguien para que los demás aprendan a defenderse solos. La red se vuelve más robusta, menos propensa a los co-adaptaciones excesivas entre neuronas.

**Cuándo lo uso:** Siempre que entreno redes neuronales complejas. La proporción de neuronas a “apagar” (típicamente entre 0.2 y 0.5) es un hiperparámetro que me gusta tunear, aunque casi siempre empiezo con 0.3 o 0.4. Y sí, la [optimización de hiperparámetros](/blog/optimizacion-de-hiperparametros-por-que-dejarla-al-azar-es-un-error-y-como-la-ataco-yo/) es clave aquí. No es un valor que se elija a la ligera.

## La regularización no es una bala de plata

Es fundamental entender que la regularización no va a solucionar todos tus problemas de sobreajuste. Es una pieza más del puzzle. Si tus datos son malos, si tienes mucho ruido, o si tu modelo es inherentemente demasiado complejo para la cantidad de datos que tienes, la regularización te ayudará, pero no hará milagros. A veces, la métrica de evaluación que eliges puede incluso engañarte si tu modelo está sobreajustando. He escrito sobre eso en [Mis batallas con las métricas de evaluación: por qué la precisión no lo es todo (y cuándo me enfado si la usas mal)](/blog/mis-batallas-con-las-metricas-de-evaluacion-por-que-la-precision-no-lo-es-todo-y-cuando-me-enfado-si-la-usas-mal/).

Mi consejo es simple: ten la regularización siempre en mente desde el principio. No la dejes para cuando ya tengas problemas graves. Es una medida preventiva, no un curalotodo. Y como muchas cosas en ingeniería, la clave está en el equilibrio: demasiada regularización puede llevar a un **subajuste**, donde tu modelo es demasiado simple y no aprende lo suficiente de los datos. Hay que experimentar, probar y entender lo que cada técnica hace. Es el precio de la disciplina, pero créeme, te ahorrará muchas noches de debugging a las 3 AM.
