---
title: "Observabilidad: Por qué mirar solo logs es como pilotar a ciegas (y cómo evito estrellarme)"
pubDate: 2026-04-06T14:09:14.846Z
description: "Mis batallas para entender qué *realmente* pasa en mis sistemas. Los logs no bastan; te cuento por qué apuesto por la tríada de logs, métricas y trazas desde el día cero."
image:
  url: "https://picsum.photos/seed/observabilidad-por-que-mirar-solo-logs-es-como-pilotar-a-ciegas-y-como-evito-estrellarme/1200/630"
  alt: "Observabilidad: Por qué mirar solo logs es como pilotar a ciegas (y cómo evito estrellarme)"
tags:
  - evergreen
  - programacion
  - devops
  - ia
---

Cuántas veces me he encontrado a las 3 de la mañana, con la cafeína haciendo estragos, mirando una pantalla llena de logs que, honestamente, no me decían NADA útil. Una línea suelta aquí, otra por allá, un error genérico que podría significar diez cosas diferentes. He estado en ese infierno más veces de las que quiero admitir, y fue ahí donde me di cuenta de una verdad incómoda: confiar solo en los logs es como intentar pilotar un avión mirando únicamente por un ojo de buey.

### El agujero negro de la información: por qué los logs no bastan

Mis logs siempre han sido la primera línea de defensa, el registro de lo que *sucedió*. Son cruciales para una autopsia, para saber si una función se llamó, si una transacción falló en un punto específico. Pero tienen límites severos. Cuando tienes un sistema distribuido, con microservicios, lambdas, y quizá hasta algún agente de IA haciendo de las suyas, un error en un log no te dice *el viaje completo* de esa petición. No te dice si fue un pico de tráfico, si la base de datos se saturó, o si un servicio downstream respondió lento.

Fue en proyectos donde los sistemas crecieron y se entrelazaron que la frustración se convirtió en una obsesión por algo más. Necesitaba ver el bosque, no solo los árboles. Y ahí es donde entra en juego la famosa tríada de la observabilidad: Logs, Métricas y Trazas.

### La santísima trinidad del "sé lo que está pasando"

**1. Logs: El diario de abordo.**

Sí, ya sé que he criticado los logs, pero son imprescindibles. Son el *qué* ha pasado, el evento discreto. Un buen log me dirá que la función `procesar_pedido()` se ejecutó, y si hubo un error, me dará el _stack trace_ completo. Mi recomendación aquí es simple: ¡estructúralos! Usa JSON. Así son legibles por máquinas y puedes buscarlos, filtrarlos y agregarlos de forma decente. Si no puedes buscar un log por `correlation_id` o `user_id`, estás perdiendo el tiempo. Ya lo he vivido, y es un infierno de `grep` en la línea de comandos que no se lo deseo a nadie.

**2. Métricas: El pulso del sistema.**

Las métricas son el *cuánto* y el *cómo de rápido*. No me dicen un evento específico, sino tendencias, agregados. Me dicen que mi latencia promedio ha subido de 100ms a 500ms, que el uso de CPU está al 90%, o que la cola de mensajes tiene 10.000 elementos pendientes. Las métricas son el
