---
title: "Métricas de Evaluación: Por qué tu accuracy no me dice nada (y cuándo me fío de un F1-score)"
pubDate: 2026-05-07T15:26:58.506Z
description: "La elección de métricas en ML es crucial. Te cuento por qué la accuracy puede engañar y cómo yo elijo la métrica correcta para saber si mi modelo es realmente bueno."
image:
  url: "https://picsum.photos/seed/metricas-de-evaluacion-por-que-tu-accuracy-no-me-dice-nada-y-cuando-me-fio-de-un-f1-score/1200/630"
  alt: "Métricas de Evaluación: Por qué tu accuracy no me dice nada (y cuándo me fío de un F1-score)"
tags:
  - evergreen
  - ia
---

Recuerdo un proyecto hace años. Estábamos construyendo un clasificador para detectar un tipo de fraude muy específico en transacciones bancarias. El equipo, novato en Machine Learning, vino con una sonrisa de oreja a oreja: "¡Hemos alcanzado un 99.5% de accuracy! ¡Esto es una barbaridad!". Yo les miré, asentí, y pedí ver la matriz de confusión.

El silencio que siguió a mi petición fue ensordecedor. La tabla reveló la cruda verdad: de miles de transacciones, solo unas pocas docenas eran fraude. El modelo era "preciso" porque simplemente clasificaba casi todo como "no fraude". Fallaba estrepitosamente en detectar *casi todos* los fraudes reales. Esa accuracy del 99.5% era, para el propósito del negocio, completamente inútil. Ahí está el peligro de la **accuracy**: es una métrica sencilla, intuitiva, pero a menudo una mentirosa.

## El problema de las clases desbalanceadas

El ejemplo del fraude bancario es un clásico. Si tienes un dataset donde el 99% de las muestras pertenecen a una clase y el 1% a otra (como el fraude, o una enfermedad rara), un modelo tonto que predice siempre la clase mayoritaria tendrá un 99% de accuracy. ¡Suena genial! Pero si lo que te importa es encontrar ese 1% raro, ese modelo no sirve para nada. Yo siempre digo que la accuracy es un buen punto de partida para problemas *balanceados* y donde los errores de falsos positivos y falsos negativos tienen un coste similar. Si no es así, hay que ir más allá.

## Mis herramientas para la verdad: Precision, Recall y F1-Score

Cuando la accuracy me mira con esos ojos de inocencia que no tiene, yo saco mis gafas de ingeniero y voy directo a **Precision** y **Recall**. Son mis herramientas favoritas para entender dónde está fallando o brillando un clasificador binario:

*   **Precision (Precisión)**: De todos los positivos que tu modelo predijo, ¿cuántos eran realmente positivos? Para mí, la precisión es crucial cuando el coste de un falso positivo es alto. Imagina un sistema que notifica una intrusión de seguridad. No quieres que te dé una falsa alarma cada cinco minutos; eso agota a los operadores. Quieres que, cuando diga "intrusión", sea *realmente* una intrusión.

*   **Recall (Exhaustividad/Sensibilidad)**: De todos los positivos reales que existen, ¿cuántos logró detectar tu modelo? El recall es vital cuando el coste de un falso negativo es alto. En el caso del fraude o de una enfermedad grave, no quieres perderte ni uno solo. Prefiero tener algunas falsas alarmas (baja precisión) si con eso me aseguro de capturar la mayoría de los casos importantes (alto recall).

Aquí es donde entra el dilema. A menudo, subir uno implica bajar el otro. Es una balanza, y la decisión de dónde inclinarla depende del problema. De hecho, uno de los errores más grandes que veo es cuando se empieza a construir el modelo sin tener claro qué tipo de error es más costoso. Por eso insisto tanto en [Formular Problemas para IA: Por qué "resolverlo con IA" no es una estrategia (y cómo lo hago yo)](/blog/formular-problemas-para-ia-por-que-resolverlo-con-ia-no-es-una-estrategia-y-como-lo-hago-yo). Entender bien el problema es el 80% de la solución.

Para cuando necesito un equilibrio entre ambos, ahí está el **F1-Score**. Es la media armónica de precisión y recall, lo que significa que penaliza más si uno de los dos valores es muy bajo. Para mí, es una métrica mucho más robusta que la accuracy en la mayoría de los problemas de clasificación desbalanceados.

## Mirando el panorama completo: Curvas ROC y AUC

Hay veces que no me basta con un solo número. Quiero ver cómo se comporta el modelo a lo largo de *todos* los posibles umbrales de decisión. Para eso, las **Curvas ROC (Receiver Operating Characteristic)** y el **Área bajo la Curva (AUC)** son oro puro. La curva ROC muestra la tasa de verdaderos positivos (recall) frente a la tasa de falsos positivos en distintos umbrales. Un AUC cercano a 1 indica un modelo que separa muy bien las clases, sin importar dónde cortes el umbral. Me da una visión más completa y me ayuda a comparar modelos de una forma más justa, especialmente cuando elijo un punto de corte específico para mi aplicación.

## ¿Y si no es clasificación?

No todo es clasificación, claro. Para **regresión**, donde predecimos valores numéricos, mis preferencias varían según el contexto:

*   **Error Cuadrático Medio (MSE)**: Penaliza fuertemente los errores grandes. Si los valores atípicos son especialmente problemáticos, el MSE te lo va a gritar.
*   **Error Absoluto Medio (MAE)**: Es más robusto a los valores atípicos, ya que trata todos los errores por igual, sin elevarlos al cuadrado. Si los errores en general son importantes, pero no quieres que un par de predicciones muy erróneas distorsionen el resultado, el MAE es tu amigo.
*   **R-squared (Coeficiente de Determinación)**: Te dice qué proporción de la varianza de la variable dependiente es predecible a partir de las variables independientes. Me da una idea de qué tan bien explica mi modelo la variabilidad en los datos.

Al final del día, la elección de la métrica es una decisión de ingeniería que tiene que ir de la mano con los objetivos del negocio. Nunca te cases con una sola métrica, y mucho menos con la accuracy por defecto. Mi consejo es simple: entiende qué tipo de errores son inaceptables para tu problema, y elige la métrica que mejor refleje ese coste. La validación cruzada te ayudará a obtener una estimación más fiable del rendimiento real de tu modelo, pero eso es tema para otro día. Bueno, ya lo tenemos cubierto en [Validación Cruzada: Por qué mis modelos siempre pasan por un 'examen sorpresa' (y por qué los tuyos deberían también)](/blog/validacion-cruzada-por-que-mis-modelos-siempre-pasan-por-un-examen-sorpresa-y-por-que-los-tuyos-deberian-tambien).

En mi experiencia, una buena elección de métrica te ahorra muchos disgustos y te permite construir sistemas de IA que *realmente* aportan valor, no solo números bonitos.
