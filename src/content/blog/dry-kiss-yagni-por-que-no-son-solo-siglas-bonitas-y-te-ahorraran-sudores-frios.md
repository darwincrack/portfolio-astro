---
title: "DRY, KISS, YAGNI: por qué no son solo siglas bonitas (y te ahorrarán sudores fríos)"
pubDate: 2026-05-16T22:54:55.852Z
description: "DRY, KISS, YAGNI no son solo acrónimos de programación. Son principios que me han salvado de código spaghetti y noches de debugging. Aquí te cuento cómo los aplico."
image:
  url: "https://picsum.photos/seed/dry-kiss-yagni-por-que-no-son-solo-siglas-bonitas-y-te-ahorraran-sudores-frios/1200/630"
  alt: "DRY, KISS, YAGNI: por qué no son solo siglas bonitas (y te ahorrarán sudores fríos)"
tags:
  - evergreen
  - programacion
  - principios-de-diseno
---

Principios de programación. La verdad, cuando empecé, me parecían un rollo. Acrónimos de tres letras que sonaban a mantra de gurú. DRY, KISS, YAGNI. Me daba igual. Yo solo quería que mi código funcionara. Y funcionaba. Hasta que dejó de hacerlo. O, peor aún, hasta que otro compañero, o mi yo futuro, tuvo que entender qué demonios había escrito. Ahí es donde estas 'siglas bonitas' pasaron de ser ruido de fondo a la banda sonora de mis mejores noches de sueño (y mis peores pesadillas sin ellas).

## DRY: No Te Repitas (Por Favor)

Este es el más obvio y el que más he violado, para mi vergüenza. Una vez, en un proyecto, teníamos un bloque de lógica para validar entradas. Estaba en tres sitios distintos del código, casi idéntico. Cuando cambiaron un requisito, tuve que tocarlo en los tres sitios. ¿Adivina qué? Me olvidé de uno. Se me pasó por alto. Resultado: un bug tonto que nos costó un buen rato de depuración. El principio DRY no es solo una cuestión de estética; es una cuestión de **reducir puntos de fallo**. Si tienes la misma lógica en diez sitios, son diez oportunidades de error y diez sitios que mantener.

Yo lo veo así: si veo que estoy copiando y pegando tres líneas de código, ya me salta una alarma. Si son cinco, paro y refactorizo. Prefiero escribir una función un poco más genérica o un método en una clase que abstraiga esa lógica, aunque me lleve cinco minutos más. Es una inversión de tiempo que me ha pagado dividendos en forma de noches tranquilas.

## KISS: Mantenlo Simple, Estúpido (Pero Sin lo de Estúpido)

Aquí es donde muchos se me caen. La gente adora la complejidad. Parece que si no es complejo, no es 'ingeniería'. Menuda tontería. El principio KISS es mi favorito y el que más me cuesta explicar a los juniors. No es 'hazlo rudimentario', es 'hazlo tan simple como sea posible para resolver el problema *actual*'.

He visto sistemas con patrones de diseño por todas partes, abstracciones en capas y capas, inyección de dependencias hasta para la tostadora. ¿El resultado? Un laberinto incomprensible donde un cambio trivial requiere horas de arqueología. Mi experiencia es que un problema bien entendido, que a menudo no es tan complejo como inicialmente pensamos, se resuelve con una solución sencilla. Si no puedes explicar tu código en tres frases, es probable que no sea KISS. Para mí, la prueba de fuego de KISS es si puedo volver a un trozo de código mío de hace seis meses y entenderlo sin sudar la gota gorda. Si tengo que recordar por qué hice aquella abstracción 'elegante' que nunca se usó, no era KISS.

De hecho, la simplicidad es clave para la mantenibilidad y la escalabilidad de verdad. La complejidad gratuita es un pasivo enorme. Un buen lugar para empezar a pensar en esto es cómo aplicamos principios como los de [SOLID en el código de IA](/blog/solid-en-el-codigo-de-ia-obsesion-o-supervivencia-para-tu-agente), que buscan la modularidad y la sencillez en el diseño de componentes. Y en mi experiencia, muchos [patrones de diseño](/blog/patrones-de-diseno-mis-batallas-para-no-construir-codigo-enredado-y-cuando-los-ignoro-por-completo) bien aplicados son una forma de lograr KISS, no de romperlo.

## YAGNI: No Lo Vas a Necesitar (Todavía)

Este principio me ha salvado de la trampa del 'futuro'. Todos lo hemos hecho: 'Ah, pero si un día necesitamos que esto sea configurable por API, con una base de datos distribuida y soporte para GraphQL, mejor lo construyo así desde el principio'. ¡Error! La mayoría de las veces, ese 'futuro' nunca llega, o llega de una forma totalmente diferente a la que imaginaste. Acabas con un código inflado, difícil de entender y de mantener, para un problema que *no existe*.

Mi filosofía con YAGNI es radical: **construyo lo mínimo indispensable para resolver la necesidad presente**. Si el futuro llega y el requisito cambia, lo adaptamos entonces. Sí, a veces implica refactorizar. Pero refactorizar un código simple para añadir una nueva funcionalidad es muchísimo más fácil y barato que desmantelar una arquitectura sobredimensionada y llena de suposiciones erróneas.

Me he quemado tantas veces por "preparar el terreno" que ahora soy un escéptico empedernido. Mi tiempo es oro, y no lo gasto en fantasías. Si no me lo piden, si no es una necesidad *actual* y *verificada*, no lo construyo. Punto.

## ¿Absolutismo o Pragmatismo?

Ahora bien, no soy un fanático. Estos principios son guías, no leyes divinas. Hay momentos en los que *sabes* que una abstracción va a ser necesaria mañana, o que repetir un pequeño fragmento de código una vez no es el fin del mundo para una entrega ajustada. El truco está en ser **consciente** de por qué rompes una regla, y tener un plan para arreglarlo si la deuda técnica crece.

El equilibrio es la clave. Lo que sí sé es que, sin estos tres pilares, mis proyectos acabarían siendo un amasijo de código incomprensible. Me he salvado de tantos sudores fríos y noches en vela solo por tenerlos presentes que no concibo escribir código sin ellos.
