---
title: "Feature Engineering: Mi obsesión oculta (y por qué tus modelos la necesitan más de lo que crees)"
pubDate: 2026-03-24T22:39:24.484Z
description: "Mi visión sobre el Feature Engineering: la parte de ML que a menudo se ignora, pero que es mi arma secreta para que los modelos realmente funcionen."
image:
  url: "https://picsum.photos/seed/feature-engineering-mi-obsesion-oculta-y-por-que-tus-modelos-la-necesitan-mas-de-lo-que-crees/1200/630"
  alt: "Feature Engineering: Mi obsesión oculta (y por qué tus modelos la necesitan más de lo que crees)"
tags:
  - evergreen
  - ia
---

He visto arquitecturas de Machine Learning que parecían naves espaciales, sistemas distribuidos con pipelines complejísimos y los modelos más avanzados del momento. ¿El resultado? A menudo, fallar estrepitosamente en producción. Y te digo por qué: el problema casi nunca fue el modelo, sino el motor que lo alimenta: los **datos**, y más concretamente, las **features**.

Durante años, me frustraba ver cómo la gente se lanzaba a probar el último modelo de moda, tuneando hiperparámetros con una fe ciega, esperando milagros. Mientras tanto, la mitad del tiempo yo estaba con un café en la mano, un IDE abierto y una hoja de cálculo, *jugando* con los datos. Transformando una columna, combinando dos, agregando información. Eso, para mí, es el *Feature Engineering*, y es la diferencia entre un modelo que *funciona* y uno que *parece* que funciona.

### Lo que realmente es el Feature Engineering (y lo que no es)

Para mí, el Feature Engineering no es solo escalar tus datos o hacer un One-Hot Encoding. Eso es limpieza y preprocesamiento básico. Es el arte de tomar datos brutos y transformarlos en **señales significativas** que un modelo pueda entender y usar para aprender. Es el momento en que como desarrollador, como *humano*, aportas tu conocimiento del dominio al algoritmo.

Algunos ejemplos de cosas que hago (y que casi siempre marcan la diferencia):

*   **Transformaciones numéricas:** No siempre un `log()` o `sqrt()` es la solución, pero muchas veces, especialmente con distribuciones sesgadas, es magia pura. A veces, incluso, crear features polinomiales es la forma de capturar relaciones no lineales que el modelo por sí solo no vería.
*   **Fechas como información:** Un `timestamp` no le dice nada a un modelo. ¿Es lunes? ¿Es fin de semana? ¿Es festivo? ¿Qué hora del día es? ¿Qué estación? Extraer estas características es **fundamental** para series temporales o cualquier problema con componente temporal. Lo he dicho antes, cuando el A/B testing es lento, a veces me apoyo en técnicas como los [Bandidos Multi-Brazo](/blog/bandidos-multi-brazo-mi-arma-secreta-cuando-el-ab-testing-es-demasiado-lento/), y para que funcionen bien, las features de tiempo son vitales.
*   **Interacciones y ratios:** Multiplicar dos features puede crear una nueva feature increíblemente potente. `ingresos / gastos` es un buen ejemplo para un modelo financiero. Buscar estas interacciones es como buscar un tesoro.
*   **Agregaciones:** Calcular la media, la desviación estándar o el conteo de eventos en una ventana de tiempo o por una categoría es oro para muchos modelos tabulares. Pienso en la actividad de un usuario en la última hora, el último día, o el promedio de compras en los últimos 7 días.

### Mi proceso: desorden, intuición y mucho café

Yo no sigo una receta fija. Mi proceso suele ser desordenado, iterativo y muy basado en la intuición inicial, para luego validarla. Empieza por entender el problema, hablar con los expertos de dominio si los hay, y *mirar los datos*. Visualizar, hacer estadísticas descriptivas, buscar correlaciones. ¿Hay outliers? ¿Tienen sentido? ¿Cómo podría una característica combinarse con otra para decir algo nuevo?

Es aquí donde **realmente** dedico la mayor parte de mi tiempo. Mucho antes de pensar en el *grid search* de Scikit-learn, estoy creando y probando features. Sé que suena menos sexy que entrenar una red neuronal de mil capas, pero en mi experiencia, un conjunto de features bien diseñado con un modelo simple suele superar a un modelo complejo con features mediocres.

Además, es el punto donde más fácil es introducir sesgos. Me ha pasado de ver un modelo robusto que enmascara un sesgo creado por features mal construidas o con fugas de información. Por eso, siempre tengo en mente cómo mis transformaciones pueden estar introduciendo nuevos problemas, un tema que ya he explorado en [El sesgo implícito en tus datos](/blog/el-sesgo-implicito-en-tus-datos-mi-pesadilla-mas-recurrente-y-como-intento-no-pasarla-por-alto/).

### El gran porqué: Facilita todo lo demás

Cuando tienes buenas features, todo se vuelve más fácil. La [Función de Pérdida](/blog/funciones-de-perdida-el-verdadero-cerebro-detras-de-tus-modelos-de-ia-y-por-que-no-le-prestas-atencion/) tiene un camino más claro para optimizar. El modelo converge más rápido. La interpretabilidad mejora; es más fácil entender por qué el modelo tomó una decisión si las características que usa son significativas. Y sí, reduce esas batallas de [Debugging Modelos de Machine Learning a las 3 AM](/blog/debugging-modelos-de-machine-learning-mis-batallas-a-las-3-am-y-lo-que-la-intuicion-no-te-dice/) porque las features tienen sentido.

Si solo te llevas una cosa de este artículo, que sea esta: invierte tiempo en tus features. Deja de obsesionarte solo con el modelo y la arquitectura. Tu modelo es tan bueno como las señales que le das, y tú, como desarrollador, eres el mejor traductor entre el mundo real y el algoritmo. Créeme, tus modelos (y tu yo del futuro) te lo agradecerán.
