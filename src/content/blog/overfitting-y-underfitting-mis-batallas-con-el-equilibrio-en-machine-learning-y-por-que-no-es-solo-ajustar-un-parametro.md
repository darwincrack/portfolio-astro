---
title: "Overfitting y Underfitting: Mis batallas con el equilibrio en Machine Learning (y por qué no es solo ajustar un parámetro)"
pubDate: 2026-04-02T14:20:36.979Z
description: "Hablando claro de overfitting y underfitting. Mi visión personal sobre cómo detectarlos, entender sus causas y mantener mis modelos en el punto justo de equilibrio."
image:
  url: "https://picsum.photos/seed/overfitting-y-underfitting-mis-batallas-con-el-equilibrio-en-machine-learning-y-por-que-no-es-solo-ajustar-un-parametro/1200/630"
  alt: "Overfitting y Underfitting: Mis batallas con el equilibrio en Machine Learning (y por qué no es solo ajustar un parámetro)"
tags:
  - evergreen
  - ia
  - ml
---

Recuerdo la primera vez que un modelo que había entrenado rindió espectacularmente en mi entorno de desarrollo, con métricas de ensueño. Luego, al pasarlo a datos nuevos, ¡catástrofe! Los resultados eran peores que tirar una moneda. Ahí fue cuando el concepto de *overfitting* dejó de ser una teoría de los libros para convertirse en mi dolor de cabeza personal.

### Overfitting: Cuando tu modelo es demasiado listo para su propio bien

Para mí, el *overfitting* es el modelo que se sabe la lección de memoria. Entendió tan a fondo los ejemplos que le di (los datos de entrenamiento), que no es capaz de generalizar cuando le pongo un problema nuevo. Es como si le pidieras a un estudiante que se aprenda de memoria las respuestas de un examen; sacará un 10 en ese examen, pero en uno con preguntas ligeramente diferentes, fallará estrepitosamente.

Lo he visto mil veces: curvas de entrenamiento que bajan sin parar, una precisión del 99% en tu conjunto de entrenamiento, y luego un 60% en el de validación. Eso es una señal clara. Pero no me quedo solo con los números. Me gusta investigar **dónde** está fallando. ¿Hay patrones en los errores? ¿Se equivoca en clases minoritarias? Esa introspección es clave antes de empezar a tocar cosas.

### Underfitting: El modelo que no estudió suficiente

Por otro lado, el *underfitting* es el modelo que no entendió nada. O, para ser más precisos, entendió demasiado poco. Su hipótesis es tan simple que ni siquiera es capaz de capturar las relaciones básicas en los datos de entrenamiento. En mis proyectos, esto se manifiesta como un rendimiento pobre tanto en el entrenamiento como en la validación.

Es la pereza hecha modelo. Un clasificador lineal para un problema inherentemente no lineal, o un árbol de decisión con profundidad limitada para un dataset complejo. El modelo no tiene la capacidad de aprender la complejidad necesaria. Cuando veo esto, mi mente se va directamente a pensar si la [Feature Engineering](/blog/feature-engineering-mi-obsesion-oculta-y-por-que-tus-modelos-la-necesitan-mas-de-lo-que-crees/) ha sido suficiente, o si el modelo que elegí es demasiado simple para la tarea.

### Mis trucos para el equilibrio: Más allá de los parámetros

La batalla contra el overfitting y el underfitting no es solo una cuestión técnica; es una mentalidad. No hay una fórmula mágica, es un tira y afloja constante:

1.  **Validación Robusta, siempre:** Nunca me fío de un solo número. Siempre uso validación cruzada. Además, un buen conjunto de validación que represente bien la realidad es mi mejor amigo para detectar estos problemas a tiempo. Es la base para poder fiarte de tus [métricas de evaluación](/blog/mis-batallas-con-las-metricas-de-evaluacion-por-que-la-precision-no-lo-es-todo-y-cuando-me-enfado-si-la-usas-mal/).
2.  **Visualización:** Las curvas de aprendizaje son oro. Ver cómo se comportan las métricas en entrenamiento y validación a medida que el modelo aprende me da una pista visual instantánea del equilibrio. Si la brecha entre ellas se abre demasiado, sospecho de overfitting. Si ambas están estancadas en un valor bajo, underfitting.
3.  **No te lances a la solución:** Mi primera reacción no es cambiar el modelo o ajustar hiperparámetros. Primero, intento entender la **causa raíz**. ¿Tengo suficientes datos para la complejidad de mi problema? ¿Son mis _features_ realmente informativas? ¿Hay ruido excesivo en los datos?
4.  **Menos es más, a veces:** Para el overfitting, a menudo, reducir la complejidad del modelo, simplificar las _features_ o aplicar [regularización](/blog/regularizacion-en-ml-no-es-magia-es-disciplina-y-por-que-siempre-la-tengo-en-mente/) son mis primeras líneas de defensa. Para el underfitting, necesito darle al modelo más potencia, más _features_, o probar una arquitectura más compleja.
5.  **El contexto es rey:** Sé que suena a tópico, pero el conocimiento del dominio del problema es mi arma secreta. Me ayuda a entender qué patrones son *reales* y cuáles son solo ruido en los datos. Esto me guía a la hora de saber si un modelo está
