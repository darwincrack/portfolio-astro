---
title: "El infierno del 'esto funcionaba ayer': Mi cruzada por el versionado de modelos y experimentos en ML"
pubDate: 2026-03-31T14:25:37.395Z
description: "La reproducibility en Machine Learning es una batalla constante. Comparto por qué el versionado de modelos y experimentos es crítico y cómo afronto el caos para evitar pesadillas."
image:
  url: "https://picsum.photos/seed/el-infierno-del-esto-funcionaba-ayer-mi-cruzada-por-el-versionado-de-modelos-y-experimentos-en-ml/1200/630"
  alt: "El infierno del 'esto funcionaba ayer': Mi cruzada por el versionado de modelos y experimentos en ML"
tags:
  - evergreen
  - ia
  - programacion
---

Si hay una frase que me hace temblar cada vez que la escucho en un proyecto de Machine Learning, es esa: "pero si ayer funcionaba". Porque, en mi experiencia, cuando esa frase aparece, lo que viene detrás es una auténtica pesadilla de debugging y una pérdida de tiempo brutal. No es como el software tradicional, donde un git blame y una buena batería de tests suelen darte una pista clara. En ML, el diablo está en muchos más detalles.

## El Caos Oculto de la Reproducibilidad

Cuando desarrollas software "normal", versionas tu código. Punto. Si algo se rompe, sabes dónde buscar. En ML, tu "código" no es solo el script Python que defines. Es el código, sí; pero también **los datos** con los que entrenaste, **los hiperparámetros** que usaste, la **versión exacta de las librerías** de TensorFlow o PyTorch, la **semilla aleatoria** de tu experimento, y, por supuesto, **el modelo final** que escupiste.

He perdido horas, y no exagero, tratando de replicar un resultado que "ayer era perfecto" solo para descubrir que un _commit_ de datos distinto se había colado, o que un compañero había "ajustado un poquito" un hiperparámetro y no lo habíamos registrado en ningún sitio. Es una locura.

## Mi Estrategia: Versionarlo TODO (o casi)

Después de varias quemaduras de este tipo, mi filosofía es clara: **todo lo que influya en el comportamiento de un modelo debe ser versionado o, al menos, trazado de forma rigurosa**.

1.  **Datos, siempre**: El punto de partida es el dataset. Lo he dicho antes y lo repito: [versionar datos es una guerra fría](/blog/versionar-datos-en-machine-learning-la-guerra-fria-de-la-reproducibilidad-y-como-la-gano-yo), pero es una guerra que hay que ganar. Si los datos cambian, tu modelo cambiará. Y si no sabes cuándo ni cómo cambiaron, estás perdido.
2.  **Tracking de Experimentos: El Diario de Batalla**: Aquí es donde registro cada intento. Para mí, esto significa guardar:
    *   **Parámetros**: Cada hiperparámetro, por pequeño que sea. Learning rate, tamaño de batch, la arquitectura de la red (si no está en el código), todo.
    *   **Métricas**: Todas las métricas de evaluación que sean relevantes (no solo el accuracy, por favor, ya he [contado mis batallas con eso](/blog/mis-batallas-con-las-metricas-de-evaluacion-por-que-la-precision-no-lo-es-todo-y-cuando-me-enfado-si-la-usas-mal)).
    *   **Artefactos**: El modelo entrenado en sí (los pesos, el _checkpoint_). No solo el código que lo genera.
    *   **Entorno**: Qué versiones de Python, NumPy, Pandas, Scikit-learn, etc., usé. Esto es crítico para [evitar el "funciona en mi máquina"](/blog/el-funciona-en-mi-maquina-en-machine-learning-mi-cruzada-por-la-reproducibilidad).
    Para esto, herramientas como MLflow o Weights & Biases son salvavidas. No tienes que usarlas todas desde el día uno, pero tener un sistema (aunque sea un `excel` al principio) es mejor que nada.
3.  **El Registro de Modelos: Quién es Quién en Producción**: Una vez tengo un modelo entrenado y listo para desplegar, lo subo a un registro de modelos. Esto me permite:
    *   Saber qué versión exacta del modelo está en producción.
    *   Conocer el _lineage_: con qué datos se entrenó, qué experimento lo generó.
    *   Gestionar transiciones de estados: _staging_, _production_, _archived_.
    Esto es una parte fundamental de [mi estrategia para mantener modelos en producción](/blog/modelos-en-produccion-por-que-no-puedes-soltarlos-y-olvidarte-mi-estrategia-de-version-y-monitorizacion). Sin esto, te aseguro que la factura del caos se cobra tarde o temprano.

## Por Qué No Es Un Lujo

Al principio, puede parecer un engorro. Una capa extra de burocracia que ralentiza. Pero te prometo que, en mi experiencia, el tiempo invertido en configurar un buen sistema de versionado y trazabilidad se recupera con creces. Me ha salvado de refactorizar el mismo modelo tres veces por no saber cuál era el bueno, de discusiones interminables sobre "qué versión usaste para esa demo" y, lo más importante, me ha permitido dormir por las noches sabiendo que si algo explota, tengo un rastro de pan rallado para volver atrás.

No esperes a que el desastre te golpee. Empieza pequeño: anota tus experimentos en un `README` si no tienes más. Pero por favor, no dejes que el "ayer funcionaba" se convierta en tu pesadilla recurrente.
