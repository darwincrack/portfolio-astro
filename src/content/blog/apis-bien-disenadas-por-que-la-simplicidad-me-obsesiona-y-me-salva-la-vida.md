---
title: "APIs bien diseñadas: Por qué la simplicidad me obsesiona (y me salva la vida)"
pubDate: 2026-03-22T22:33:44.974Z
description: "Diseñar APIs no es solo crear endpoints. En mi experiencia, la simplicidad y la coherencia salvan proyectos. Comparto mi enfoque y por qué evito la complejidad innecesaria."
image:
  url: "https://picsum.photos/seed/apis-bien-disenadas-por-que-la-simplicidad-me-obsesiona-y-me-salva-la-vida/1200/630"
  alt: "APIs bien diseñadas: Por qué la simplicidad me obsesiona (y me salva la vida)"
tags:
  - evergreen
  - ia
---

Recuerdo una vez, hace años, debuggeando una integración con una API externa a las 3 de la mañana. Cada endpoint tenía una forma diferente de manejar errores, los tipos de datos cambiaban entre GET y POST para el mismo recurso, y la paginación era una lotería. Acabé echando un par de días solo en entender cómo usarla, en vez de en lo que realmente importaba: la lógica de negocio. Esa madrugada, juré que mis APIs nunca serían así.

Para mí, diseñar una API no es solo exponer datos y funciones; es **diseñar una interfaz de usuario para desarrolladores**. Y como toda interfaz, si no es intuitiva, consistente y clara, fracasará. Mi filosofía se reduce a esto: la simplicidad es el rey. No la simplicidad que ignora la complejidad inherente, sino la que la encapsula y presenta de forma digerible.

## Lo que evito (con toda mi alma)

### Sobre-ingeniería y la 'moda' del momento

Sí, GraphQL es potente, y gRPC es rápido. Pero **odio cuando se eligen por moda o por el mero hecho de usarlos**. La mayoría de los proyectos no necesitan la flexibilidad de GraphQL si el cliente no es una UI dinámica que necesita datos muy específicos. Y la RPC para microservicios internos suele ser overkill si REST bien hecho funciona perfectamente. Me he topado con demasiados equipos intentando meter un martillo de gRPC en un clavo de REST, complicando la vida con herramientas, contratos de `proto` y una curva de aprendizaje innecesaria para algo que una buena API REST habría resuelto con dos endpoints y un JSON. Yo casi siempre empiezo con REST y solo me complico si el problema realmente lo exige.

### Inconsistencia, mi némesis

Si pido `GET /api/productos` y me devuelve un `array` de objetos, espero que `GET /api/usuarios` haga algo similar. Si un error se comunica con un código HTTP 400 y un JSON `{"code": "INVALID_INPUT", "message": "..."}`, todos los demás errores deberían seguir ese patrón. Lo mismo con la paginación, la autenticación, la búsqueda. La falta de consistencia genera fricción, bugs y noches en vela intentando descifrar por qué *este* endpoint en particular no sigue las reglas. Es un dolor de cabeza que puedo evitar. Pienso mucho en la [aplicación de los principios SOLID](/blog/solid-principles-por-que-me-obsesionan-y-no-no-es-dogma-ciego/) al diseñar la interfaz de mi API, buscando esa coherencia.

### Respuestas ambiguas o excesivamente complejas

He visto APIs que devuelven 200 OK con un `body` diciendo que ha habido un error, o que incluyen 50 campos de los cuales solo se usan 3. Si algo falla, que falle con un código HTTP claro (4xx para errores del cliente, 5xx para errores del servidor). Y que el `body` de la respuesta sea lo más conciso y útil posible.

## Lo que abrazo (y me salva la vida)

### Claridad y nombres descriptivos

Los recursos deben tener nombres claros y preferiblemente sustantivos en plural (`/productos`, `/usuarios`). Las acciones, cuando no son los verbos HTTP estándar (GET, POST, PUT, DELETE), deben ser igualmente claras. Evito nombres crípticos a toda costa. El código se lee más de lo que se escribe, y una API se consume más de lo que se implementa. La claridad paga dividendos.

### Documentación viva y usable

Para mí, la documentación de una API no es un *deliverable* que se hace al final y se olvida. Es una extensión de la propia API. Uso OpenAPI/Swagger o Postman Collections porque me permiten generar y mantener la documentación junto al código. Así, un cambio en un endpoint implica un cambio en la documentación que se puede validar automáticamente. Cuando necesito [refactorizar algo en mis proyectos](/blog/refactorizar-no-es-reescribir-por-que-lo-hago-y-cuando-me-salvo-el-cuello-o-lo-arruino/), la documentación es mi primer punto de partida para no romper a los consumidores.

### Versionado (con cabeza)

Las APIs evolucionan, es inevitable. Mi preferencia es versionar vía URL (`/v1/productos`, `/v2/productos`). Me parece la forma más transparente y fácil de manejar para los consumidores, aunque implique algo más de trabajo en el *routing*. A veces, para cambios menores, uso `Accept` headers, pero solo si estoy muy seguro de que no va a romper nada importante y el cambio es muy sutil. La idea es que los clientes puedan decidir cuándo migrar a una nueva versión, no obligarles.

### Gestión de errores predecible

Como mencioné, quiero que mis errores sean tan predecibles como mis respuestas exitosas. Un formato JSON estándar para todos los errores, con campos como `type` (un código de error interno), `title` (un resumen legible), `detail` (más información) y `instance` (un ID de trazabilidad) es mi estándar de facto. Así, el cliente puede construir su lógica de manejo de errores sabiendo qué esperar.

Al final del día, mi objetivo es que cualquiera que use mis APIs sienta que está trabajando con un sistema bien pensado, no con un laberinto de excepciones y caprichos. La simplicidad y la coherencia no son signos de falta de ambición, sino de un profundo entendimiento de cómo se construye software usable y mantenible a largo plazo. Me ha salvado de muchos quebraderos de cabeza y, sinceramente, de muchas madrugadas frente al monitor.
