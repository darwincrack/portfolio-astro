---
title: "Cohesión y Acoplamiento: Mi brújula para no construir monstruos de código (y por qué tus agentes de IA los necesitan)"
pubDate: 2026-04-15T22:50:10.969Z
description: "Cohesión y acoplamiento son claves en desarrollo. Te cuento cómo los uso para construir software robusto y modular, aplicando sus principios incluso en agentes de IA."
image:
  url: "https://picsum.photos/seed/cohesion-y-acoplamiento-mi-brujula-para-no-construir-monstruos-de-codigo-y-por-que-tus-agentes-de-ia-los-necesitan/1200/630"
  alt: "Cohesión y Acoplamiento: Mi brújula para no construir monstruos de código (y por qué tus agentes de IA los necesitan)"
tags:
  - evergreen
  - programacion
  - ia
  - agentes
---

Recuerdo la primera vez que un compañero me habló de "cohesión" y "acoplamiento". Yo venía de un proyecto donde cualquier cambio en una función rompía misteriosamente otras diez en módulos que, *a priori*, no tenían nada que ver. Un infierno de _debugging_ a las 3 AM, como siempre. Ese día me di cuenta de que no bastaba con que el código funcionara; tenía que ser **comprensible y mantenible**. Y ahí es donde estos dos conceptos, que parecen sacados de un manual aburrido, se convirtieron en mi brújula.

Para mí, el **acoplamiento** es la dependencia. Cuánto sabe un módulo (o una función, o una clase) sobre otro. Un acoplamiento *alto* significa que si toco el módulo A, es muy probable que tenga que tocar el módulo B, C y D porque A está demasiado entrelazado con ellos. Es como una telaraña: mueves un hilo y toda la estructura tiembla. En mi experiencia, esto es la receta para el desastre, el caldo de cultivo de los *bugs* que aparecen de la nada. Cuando veo que un cambio pequeño requiere tocar archivos en cinco carpetas diferentes, se me encienden todas las alarmas.

La **cohesión**, por otro lado, es la unidad de propósito. ¿Qué tan relacionadas están las responsabilidades dentro de un mismo módulo? Una cohesión *alta* significa que todas las partes de un módulo trabajan juntas para un objetivo común y bien definido. Un módulo que solo hace una cosa, y la hace bien. Un ejemplo clásico es una clase que solo se encarga de persistir datos, no de validarlos ni de mostrarlos. Cada método de esa clase contribuye directamente a la persistencia.

## ¿Por qué me importan estos viejos conceptos hoy?

Estos principios no son reliquias del software monolítico de hace 20 años. Son más relevantes que nunca, especialmente cuando construyes sistemas complejos, y sí, eso incluye los **agentes de IA**.

Imagina un agente de IA. No es solo un LLM. Tiene un módulo de percepción, otro de razonamiento, otro de planificación de acciones, y uno más para interactuar con herramientas externas.

Si tu módulo de razonamiento está acoplado fuertemente al formato específico de salida de una herramienta externa, ¿qué pasa cuando esa herramienta cambia o quieres usar otra? Toca reescribir medio agente. Eso me ha pasado y es una pesadilla. Prefiero tener un módulo de adaptador o _wrapper_ para cada herramienta, de modo que el módulo de razonamiento solo sepa que "puede llamar a una herramienta que hace X", sin importarle los detalles de implementación de X. Así, cambio el adaptador y el resto del agente sigue funcionando. Es la diferencia entre un agente modular y uno que es un blob de lógica interconectada. Si te interesa cómo pensar en sistemas que no sean un pegote de código, te recomiendo leer sobre [Modularidad y Composición](/blog/modularidad-y-composicion-por-que-mis-sistemas-y-agentes-de-ia-no-son-un-monolito-pegado-con-cinta-aislante).

Y la cohesión, para mí, es crucial para la **claridad**. Cuando miro el código de un módulo, quiero entender *para qué sirve* en diez segundos. Si un módulo se llama `Utils` y dentro tiene funciones para parsear fechas, hacer llamadas HTTP y calcular el factorial de un número, tiene una cohesión pésima. Es un vertedero. Prefiero mil veces un `date_parser.py`, un `http_client.py` y un `math_helpers.py`. Me ayuda a dormir por las noches y evita que mis compañeros me odien cuando tienen que tocar mi código.

## Mi regla de oro: el cambio debe doler poco

Cuando diseño, mi objetivo es que un cambio en una funcionalidad solo afecte a una o muy pocas partes del sistema. Si tengo que tocar 10 archivos para cambiar la forma en que un agente procesa una observación, mi diseño es malo. Y en un sistema de IA donde los requisitos cambian constantemente y los modelos evolucionan, esto es vital.

Una baja cohesión y un alto acoplamiento son el camino directo a sistemas rígidos, frágiles e inmanejables. Te lo digo por experiencia. He estado ahí, y prefiero evitarlo a toda costa. Mis compañeros me lo agradecen, y yo me ahorro la úlcera. Es un concepto viejo, sí, pero es de esos fundamentos que, una vez que los interiorizas, te hacen mucho mejor desarrollador. Te invito a que la próxima vez que escribas código, o diseñes tu próximo agente de IA, te pares a pensar: ¿cuán coeso es este módulo? ¿Cuánto acoplamiento estoy introduciendo aquí? Te aseguro que te ahorrarás muchos dolores de cabeza.
