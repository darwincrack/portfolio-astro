---
title: "Versionar Datos en Machine Learning: La Guerra Fría de la Reproducibilidad (y cómo la gano yo)"
pubDate: 2026-03-12T14:01:02.590Z
description: "Gestionar versiones de datasets en ML es un campo de batalla silencioso. Comparto mis estrategias para domar el caos de los datos y asegurar la reproducibilidad de mis modelos."
image:
  url: "https://picsum.photos/seed/versionar-datos-en-machine-learning-la-guerra-fria-de-la-reproducibilidad-y-como-la-gano-yo/1200/630"
  alt: "Versionar Datos en Machine Learning: La Guerra Fría de la Reproducibilidad (y cómo la gano yo)"
tags:
  - evergreen
  - ia
  - ml
  - devops
---

La primera vez que un cliente me preguntó "¿con qué datos entrenaste el modelo que corre ahora?" y no supe responder con total certeza, se me heló la sangre. Podía decir la versión del código, la de los hiperparámetros, pero los *datos*... Los datos eran un directorio en S3 que alguien, en algún momento, pudo haber sobrescrito o movido. Aquel día prometí que nunca más pasaría. Así empezó mi particular guerra fría con el versionado de datos en Machine Learning.

### ¿Por qué nos cuesta tanto versionar datos?

Con el código, lo tenemos claro: `git commit`, `git push`. Es nuestra segunda naturaleza. Pero con los datos, la cosa cambia. Los datasets suelen ser _grandes_, muy grandes. Git no está diseñado para eso, y si intentas meter un CSV de 10 GB en tu repo, vas a tener problemas, y pronto. Además, los datos no son código. No los editas línea a línea, no haces merges de ramas con conflictos en un CSV. Los datos son, casi siempre, archivos binarios o colecciones de ellos que cambian _en su totalidad_ o se añaden nuevos.

Este problema, que al principio parece menor, es un caldo de cultivo para el desastre. ¿Quieres replicar un experimento? ¿Auditar por qué un modelo de hace tres meses funcionaba mejor que el actual? ¿Desplegar una versión antigua de un modelo con los datos _exactos_ con los que se entrenó? Sin versionado de datos, es un dolor de cabeza. Créeme, he estado en ese infierno varias veces. Esto se conecta directamente con mi cruzada por la [reproducibilidad en ML](/blog/el-funciona-en-mi-maquina-en-machine-learning-mi-cruzada-por-la-reproducibilidad/).

### Mi estrategia: Disciplina y las herramientas adecuadas (no siempre las más complejas)

He probado varias aproximaciones. Desde simplemente copiar directorios con nombres como `data_v1`, `data_v2_final_final`, hasta soluciones más sofisticadas. Esto es lo que me funciona a mí, y por qué:

1.  **DVC (Data Version Control) para proyectos serios:** Para mí, DVC es el equivalente a Git para datos. No guarda los datos en tu repositorio Git (gracias a dios), sino que guarda _punteros_ a tus datos reales, que residen en un storage remoto (S3, GCS, Azure Blob Storage, incluso Google Drive). Lo que me gusta de DVC es que **integra la metadata del dataset directamente con el commit de Git de tu código**. Es decir, cuando haces un `git commit` de tu código, el `.dvc` file que representa tu dataset también se versiona. Así, sabes exactamente qué código se usó con qué versión de los datos.

    *Mi consejo:* DVC tiene una curva de aprendizaje, sí. No lo implementaría en un proyecto de juguete de fin de semana. Pero para cualquier cosa que tenga que ir a producción, o donde la reproducibilidad sea un requisito, es un salvavidas. Hace años que la adopté y no me arrepiento.

2.  **Metadata + S3/GCS para lo más simple (o cuando DVC es _too much_):** A veces, DVC se siente como un martillo para una tuerca pequeña. Para proyectos más pequeños o etapas muy tempranas, me conformo con una convención estricta: todos mis datasets van a un bucket S3/GCS, y siempre, _siempre_, tienen un prefijo o un path que incluye una fecha y una versión semántica (`raw/2023-10-26_v1/`, `processed/customer_data_v1.2.csv`). Luego, en mi código, la ruta a ese dataset no es hardcodeada, sino que se define en un config file (o variables de entorno) que _sí_ se versiona en Git.

    También me aseguro de que, al cargar los datos, el _checksum_ (MD5, SHA256) del archivo se registre en algún log o artefacto del experimento. No es tan robusto como DVC, pero es un buen punto de partida para [monitorear tus modelos en producción](/blog/modelos-en-produccion-por-que-no-puedes-soltarlos-y-olvidarte-mi-estrategia-de-version-y-monitorizacion/) y entender qué está pasando con los datos que consumen.

### Lo que evito y por qué

*   **Nunca jamás copiar directorios a mano y depender de nombres:** `data_final_final_ahora_si.csv` es mi némesis. Es inmanejable. Te perderás. Confía en mí.
*   **No mezclar datos y código en el mismo repo Git sin herramientas como Git LFS (y aun así con cautela):** Git LFS puede manejar archivos grandes, pero si tus datasets cambian muy a menudo o son extremadamente grandes, igual acabas llenando tu espacio de almacenamiento y ralentizando todo.

El versionado de datos no es sexy. No es el algoritmo más novedoso ni la arquitectura de agente más compleja. Pero es, en mi experiencia, uno de esos pilares silenciosos que marcan la diferencia entre un proyecto ML que puedes mantener y evolucionar, y uno que te dará pesadillas cuando necesites responder preguntas sobre el pasado. Gánale la guerra al caos de los datos; tu yo futuro te lo agradecerá.
