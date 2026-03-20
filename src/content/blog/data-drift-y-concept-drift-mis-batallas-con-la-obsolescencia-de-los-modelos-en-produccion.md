---
title: "Data Drift y Concept Drift: Mis batallas con la obsolescencia de los modelos en producción"
pubDate: 2026-03-20T13:59:16.991Z
description: "Mis modelos funcionaban de maravilla, hasta que dejaron de hacerlo. Así es como lidio con la degradación silenciosa y la obsolescencia de la IA en producción."
image:
  url: "https://picsum.photos/seed/data-drift-y-concept-drift-mis-batallas-con-la-obsolescencia-de-los-modelos-en-produccion/1200/630"
  alt: "Data Drift y Concept Drift: Mis batallas con la obsolescencia de los modelos en producción"
tags:
  - evergreen
  - ia
  - machine-learning
  - mlops
---

La primera vez que un modelo de IA me dio un susto en producción fue con un sistema de recomendación. Había pasado las pruebas con éxito, la validación cruzada era impecable y el rendimiento en el *sandbox* era espectacular. Lo lanzamos y, durante unas semanas, todo fue genial. Luego, lentamente, los resultados empezaron a ser... extraños. Menos clics, recomendaciones menos relevantes, quejas de usuarios. Al principio pensamos que era un bug en el frontend o un problema de AB testing, pero no. El modelo, silenciosamente, se había vuelto inútil.

Ahí fue donde aprendí, a golpes, sobre el **Data Drift** y el **Concept Drift**. Para mí, no son solo términos académicos; son la pesadilla recurrente de cualquiera que ponga IA en producción.

## ¿Qué demonios es el *Drift*?

Imagínate que entrenas a tu modelo para reconocer manzanas rojas en fotos. Le das miles de imágenes, todas con manzanas de supermercado, pulcras, bien iluminadas. Lo pones a funcionar y funciona de maravilla. Ahora, ¿qué pasa si, de repente, la gente empieza a subir fotos de manzanas mordidas, en el suelo del huerto, con barro y poca luz?

Esto es, simplificado, el **Data Drift**. La distribución de los datos de entrada al modelo (esas fotos de manzanas) cambia significativamente respecto a la distribución de los datos con los que fue entrenado. Tu modelo no está viendo lo que espera ver y, por tanto, sus predicciones dejan de ser fiables.

El **Concept Drift** es más sutil y, a mi juicio, más peligroso. El problema aquí no es que la entrada cambie, sino que la *relación entre la entrada y la salida* cambia. Volviendo al ejemplo: ahora, tus usuarios, por alguna razón cultural o de marketing, empiezan a considerar que las manzanas verdes son "rojas". El concepto de "manzana roja" se ha desplazado. El mundo real ha redefinido el significado de tu etiqueta, pero tu modelo sigue operando con la vieja definición. Tu modelo está viendo lo mismo, pero lo que *significa* eso ha cambiado.

En mi experiencia, el Data Drift suele ser más fácil de detectar. Los cambios en la distribución de características son más evidentes si sabes qué buscar. El Concept Drift te da más dolor de cabeza porque, en la superficie, todo parece igual, pero el rendimiento se desmorona.

## ¿Por qué esto me quita el sueño?

Porque significa que un modelo que funcionaba perfectamente hace seis meses, puede estar costándote dinero, frustrando usuarios o tomando decisiones erróneas ahora mismo sin que te des cuenta inmediatamente. Es una forma de obsolescencia silenciosa. He visto proyectos enteros tambalearse porque un modelo crítico dejó de ser relevante sin previo aviso.

Es una de las principales razones por las que no puedes [soltar tus modelos en producción y olvidarte de ellos](/blog/modelos-en-produccion-por-que-no-puedes-soltarlos-y-olvidarte-mi-estrategia-de-version-y-monitorizacion/). La monitorización constante no es un lujo; es una necesidad.

## Mis armas para la batalla

¿Cómo ataco este problema? No hay una bala de plata, te lo aseguro. Es una combinación de vigilancia y estrategias de retrain.

### 1. Monitorización inteligente

No me conformo con monitorizar solo las métricas de negocio o la precisión del modelo (aunque son críticas). También monitorizo las distribuciones de las características de entrada. Uso herramientas que me alertan si la media, desviación estándar, o la distribución de alguna variable categórica se desvía de forma significativa de su línea base. Esto me da una alerta temprana de Data Drift.

Para el Concept Drift, la cosa se complica. Aquí necesito métricas que me indiquen si el rendimiento del modelo se está degradando. Esto implica tener una "verdad" (ground truth) de alguna forma, aunque sea con un pequeño retraso. Si mi modelo de clasificación de spam empieza a dejar pasar spam que antes detectaba, es una señal. También presto atención a la [identificación del sesgo implícito en mis datos](/blog/el-sesgo-implicito-en-tus-datos-mi-pesadilla-mas-recurrente-y-como-intento-no-pasar-por-alto/) ya que un cambio en la distribución de características que impacte en grupos minoritarios puede ser un síntoma de drift.

### 2. Retraining Proactivo y Reactivo

Una vez que detecto drift (o antes de que sea un problema grave), necesito actuar.

*   **Retraining programado**: Muchos modelos los entreno de nuevo con una frecuencia fija (cada semana, cada mes) usando los datos más recientes. Esto ayuda a mitigar el Data Drift de forma proactiva. Para tareas que evolucionan rápido, esto es esencial.
*   **Retraining basado en eventos**: Si la monitorización me lanza una alerta de drift significativa o el rendimiento cae por debajo de un umbral, se dispara un proceso de retrain de emergencia. Esto es reactivo, sí, pero vital para contener el daño.
*   **A/B Testing continuo**: Cuando retraino, rara vez despliego el nuevo modelo sin un período de A/B testing para asegurarme de que el nuevo modelo es realmente mejor y no ha introducido nuevos problemas. No me fío de los números en el papel; necesito verlo en acción.

### 3. Mantenerse al tanto de los cambios del mundo real

A veces, el drift no es un fallo del modelo, sino un reflejo de que el mundo real ha cambiado. Nuevos productos, campañas de marketing, cambios en el comportamiento del usuario o incluso eventos globales. Entender el contexto del negocio es tan importante como entender la matemática del modelo.

## La batalla es continua

La verdad es que no hay un botón mágico para evitar el drift. Es una característica inherente a cualquier sistema de IA que interactúe con un entorno dinámico. Es una parte ineludible de la vida de un modelo en producción. Mi enfoque es asumir que el drift va a ocurrir y construir los mecanismos para detectarlo y gestionarlo de la forma más rápida y efectiva posible. Es una batalla constante, pero es una que, con las herramientas y la mentalidad adecuadas, se puede ganar cada día.
