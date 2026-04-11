---
title: "Árboles de Decisión: Mi primer amor en el ML (y por qué no los he abandonado del todo)"
pubDate: 2026-04-11T13:52:52.063Z
description: "Una mirada personal a los árboles de decisión, su simplicidad, sus pros y contras, y cómo siguen siendo útiles en mi día a día, más allá de los modelos complejos."
image:
  url: "https://picsum.photos/seed/arboles-de-decision-mi-primer-amor-en-el-ml-y-por-que-no-los-he-abandonado-del-todo/1200/630"
  alt: "Árboles de Decisión: Mi primer amor en el ML (y por qué no los he abandonado del todo)"
tags:
  - evergreen
  - ia
---

Recuerdo la primera vez que me topé con los árboles de decisión. Acostumbrado a la complejidad aparente de las redes neuronales o la abstracción matemática de las SVM, los árboles de decisión me parecieron casi... ingénuos. Una serie de preguntas 'si/entonces', un diagrama de flujo de toda la vida. ¿De verdad esto era *Machine Learning*?

Me sorprendió. Y mucho. Porque esa simplicidad era precisamente su superpoder. Podías seguir el camino, ver la lógica detrás de cada predicción. Era como tener la caja negra abierta de par en par. Para mí, que valoro mucho la [XAI: por qué el 'dice que es un gato' no me basta](/blog/xai-por-que-el-dice-que-es-un-gato-no-me-basta-y-como-investigo-yo-lo-que-realmente-piensa-mi-modelo/), esto fue una revelación.

### El atractivo de la transparencia

Siempre he sido un defensor de entender *por qué* algo funciona. Con un árbol de decisión, si quieres saber por qué un cliente fue clasificado como 'propenso a la baja', solo tienes que mirar la ruta: 'si gasta menos de X, y ha contactado al soporte más de Y veces, y su suscripción tiene menos de Z meses...' Es como leer una lista de reglas de negocio, pero descubiertas por los datos. Esto es oro, especialmente cuando tienes que justificar decisiones a un equipo no técnico o a la gerencia.

Mis primeras implementaciones, claro, fueron casi infantiles. Un `if/else` tras otro, hasta que entendí la elegancia del algoritmo ID3 o C4.5. Pero la esencia, la capacidad de *leer* el modelo, se mantuvo.

### Mi batalla contra el entusiasmo excesivo (y el overfitting)

El problema, como suele pasar con el primer amor, es que uno se ciega. Al principio, pensaba que los árboles de decisión eran la solución a todo. Luego me di de bruces con la realidad del [Overfitting y Underfitting](/blog/overfitting-y-underfitting-mis-batallas-con-el-equilibrio-en-machine-learning-y-por-que-no-es-solo-ajustar-un-parametro/). Un árbol de decisión sin restricciones es un artista del *overfitting*, memoriza el ruido como si fuera señal. Mi modelo funcionaba de maravilla con los datos de entrenamiento, y se estrellaba en cuanto veía un dato nuevo. Eso me frustró enormemente. Pasé muchas horas intentando podar árboles manualmente, ajustando `max_depth` y `min_samples_leaf` a tientas.

Ahí fue cuando la validación cruzada se volvió mi mejor amiga. No suelto un modelo sin que pase por un buen [examen sorpresa con validación cruzada](/blog/validacion-cruzada-por-que-mis-modelos-siempre-pasan-por-un-examen-sorpresa-y-por-que-los-tuyos-deberian-tambien/), y esto es especialmente crítico con algoritmos como los árboles de decisión.

### La madurez: cuando aprendes a usarlos bien

Con el tiempo, entendí que el verdadero poder de los árboles de decisión no siempre residía en un único árbol gigante, sino en la **combinación** de muchos de ellos. Los *Random Forests*, por ejemplo, son colecciones de árboles de decisión que votan por la respuesta final. Esto mitiga la inestabilidad de un solo árbol y reduce drásticamente el overfitting, manteniendo gran parte de la interpretabilidad (aunque ya no es tan trivial seguir una única ruta).

También aprendí a valorar su velocidad. Para muchos problemas tabulares, un *Random Forest* o un *Gradient Boosting* (que también usa árboles como base) pueden ser sorprendentemente efectivos y rápidos de entrenar, a menudo superando a modelos más 'glamurosos' que requieren mucha más computación y *fine-tuning*.

### ¿Cuándo sigo echando mano de ellos?

Aunque ahora trabajo con arquitecturas de IA mucho más complejas, los árboles de decisión siguen teniendo su hueco en mi arsenal:

*   **Problemas pequeños y medianos:** Cuando necesito una solución rápida y con buen rendimiento en datos tabulares.
*   **Interpretabilidad es clave:** Siempre que tengo que explicar el 'porqué' del modelo a stakeholders no técnicos. Un árbol visual es mucho más intuitivo que un centenar de pesos en una red neuronal.
*   **Feature Importance:** Los árboles de decisión y sus ensambles son excelentes para identificar qué características son las más relevantes en un dataset, lo cual es útil incluso si luego uso otro modelo.
*   **Baseline:** Para establecer una línea base de rendimiento. Si mi supermodelo Transformer no supera a un buen Random Forest, tengo un problema.

No, no son la solución mágica para cada problema de IA, y no van a generar texto coherente ni a reconocer imágenes con la sofisticación de un modelo profundo. Pero su honestidad, su relativa sencillez y su versatilidad, especialmente en datos tabulares, hacen que los árboles de decisión sigan siendo una herramienta robusta y fiable en mi caja de herramientas. Y sí, les tengo un cariño especial.
