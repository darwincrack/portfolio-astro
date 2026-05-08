---
title: "¿Control de versiones para datos y modelos? Sí, y si no lo haces, estás jugando con fuego (y con mi tiempo)."
pubDate: 2026-05-08T14:48:44.904Z
description: "Mis argumentos para versionar cada dataset y cada modelo que construyo. Ignorarlo es una receta para el caos y el desperdicio de horas de debugging inútiles."
image:
  url: "https://picsum.photos/seed/control-de-versiones-para-datos-y-modelos-si-y-si-no-lo-haces-estas-jugando-con-fuego-y-con-mi-tiempo/1200/630"
  alt: "¿Control de versiones para datos y modelos? Sí, y si no lo haces, estás jugando con fuego (y con mi tiempo)."
tags:
  - evergreen
  - ia
---

Hace unos años, estaba en un proyecto de clasificación de imágenes. Teníamos un modelo que, en staging, daba resultados *fantásticos*. Lo pasamos a producción y, de repente, la precisión se desplomó. Horas, y digo **horas**, pasé revisando el código, los logs de entrenamiento, los hiperparámetros. No encontraba nada. Mis compañeros me miraban raro. La frustración era palpable. ¿El culpable? Un compañero había 'actualizado' el dataset de entrenamiento con unas pocas imágenes nuevas, y aunque las consideraba "insignificantes", no había un registro claro de qué versión del dataset se había usado para entrenar *ese* modelo específico. El caos. Después de aquello, me obsesioné. El control de versiones, no solo del código, sino de los datos y los modelos, se convirtió en mi religión.

## El caos de la irreproducibilidad

Es el problema número uno en cualquier proyecto de Machine Learning serio. ¿Cómo replicar un experimento? ¿Cómo saber si la mejora de métricas de hoy se debe a tu nuevo algoritmo o a un cambio sutil en los datos de entrada? Sin un sistema para versionar, es imposible. Tu modelo es una función de tres cosas: el código, los datos y los hiperparámetros. Si solo versionas el código, te estás engañando.

Yo lo veo así: un modelo en producción es una promesa. Una promesa de que, dadas ciertas entradas, se comportará de cierta manera. Si no puedo rastrear *exactamente* el estado de los datos y el código que lo generaron, esa promesa no vale nada. Y cuando algo sale mal, que saldrá, el debugging se convierte en un viaje al infierno. He visto proyectos donde el dataset de entrenamiento se almacena en un Google Drive sin ningún tipo de control, "por si acaso". Esa no es una estrategia, es una ruleta rusa.

## Versionando tus datos: La base de la cordura

Para mí, versionar datos es tan crítico como versionar el código. Un dataset es un artefacto vivo. Recibe correcciones, se expande, se limpia. Si no tienes un historial de esos cambios, cuando un modelo empiece a comportarse de forma extraña, no podrás saber si el problema está en tu código, en la nueva iteración de los datos, o en un **data drift** inesperado.

Mi herramienta favorita para esto, y no me cansaré de recomendarla, es **DVC (Data Version Control)**. Se integra con Git, lo cual es genial porque ya tengo mi flujo de trabajo en Git. Me permite versionar grandes archivos de datos, directorios enteros, sin inflar mi repositorio Git con gigabytes innecesarios. Lo que hace DVC es almacenar metadatos de los archivos (hashes, referencias) en Git, y los datos en sí mismos en un almacenamiento remoto (S3, GCS, local, etc.). Esto significa que cada vez que 'commit-eas' una versión de tu código, también estás 'commit-eando' la versión *exacta* de los datos con la que ese código debería trabajar. Si un día tu modelo empieza a fallar, puedes hacer un `git checkout` a una versión anterior del código, y DVC se encargará de recuperar la versión *correcta* de los datos para ese momento. Es pura magia para la reproducibilidad.

Sé que suena a trabajo extra, pero en mi experiencia, el tiempo que inviertes en configurar DVC al principio lo recuperas mil veces cuando te evitas una madrugada debuggeando por un dataset misteriosamente cambiado. Y hablando de trabajo extra que salva vidas, la gestión de modelos es otro punto crítico.

## Versionando tus modelos: El rastro de tus experimentos

Una vez que tienes los datos bajo control, el siguiente paso lógico es versionar los modelos resultantes. Un modelo entrenado no es solo un archivo `.pkl` o `.h5`. Es el resultado de un código específico, unos datos específicos y, muy importante, un conjunto de [hiperparámetros específicos](/blog/hyperparameter-tuning-por-que-no-es-solo-probar-cosas-al-azar-y-como-evito-quemar-mi-gpu-a-lo-tonto/). Si no puedes rastrear esta trinidad, estás volando a ciegas.

Para esto, he probado varias cosas. Desde soluciones caseras (que no recomiendo para nada; siempre acaban fallando) hasta plataformas más robustas. Actualmente, **MLflow** es mi elección para el registro y seguimiento de modelos. Me permite registrar los artefactos del modelo, los parámetros usados en el entrenamiento, las métricas de rendimiento (que, por cierto, también versiono para poder comparar versiones), y hasta las dependencias del entorno.

¿Por qué es esto importante?
*   **Despliegue confiable**: Cuando tienes que poner un modelo en producción, necesitas estar seguro de que es *el modelo correcto*, el que pasó todas las pruebas.
*   **Rollback**: Si el modelo en producción se comporta mal, poder volver a una versión anterior *conocida* en cuestión de minutos es oro.
*   **Comparación de experimentos**: Cuando estoy iterando y probando diferentes arquitecturas o ajustes, necesito saber qué modelo funcionó mejor y con qué configuración exacta. Es mi [manifiesto del testing](/blog/mi-manifiesto-del-testing-por-que-no-suelto-codigo-sin-ponerlo-a-prueba-especialmente-en-ia) aplicado a modelos.

Sin un buen sistema de versionado de modelos, es casi imposible saber si esa mejora de un 0.5% en tu F1-score es legítima o si simplemente estás comparando peras con manzanas por usar datos ligeramente diferentes o una versión antigua de una librería. Es ahí donde el [MLOps entra en juego como tu chaleco salvavidas](/blog/mlops-no-es-un-lujo-es-tu-chaleco-salvavidas-por-que-la-gestion-de-modelos-me-quita-el-sueno-y-como-lo-controlo), y el versionado es una de sus pilares fundamentales.

## Deja de jugar a la lotería

Versionar datos y modelos no es un lujo para startups de Silicon Valley. Es una buena práctica fundamental. Es la diferencia entre un equipo que puede iterar rápidamente y depurar problemas de forma eficiente, y uno que se ahoga en la confusión cada vez que se toca algo. Si te preguntas si vale la pena la inversión inicial, la respuesta es un rotundo sí. Tu cordura y la de tu equipo te lo agradecerán.
