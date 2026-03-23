---
title: "Funciones Puras y Efectos Secundarios: Por qué me obsesionan (y te ahorran debugging a las 3 AM)"
pubDate: 2026-03-23T14:14:38.327Z
description: "Mi cruzada por entender y aplicar funciones puras. Te cuento por qué son clave para escribir código robusto, fácil de testear y depurar, y cómo las uso en mi día a día."
image:
  url: "https://picsum.photos/seed/funciones-puras-y-efectos-secundarios-por-que-me-obsesionan-y-te-ahorran-debugging-a-las-3-am/1200/630"
  alt: "Funciones Puras y Efectos Secundarios: Por qué me obsesionan (y te ahorran debugging a las 3 AM)"
tags:
  - evergreen
  - programacion
  - clean-code
---

La primera vez que me encontré con un bug que solo aparecía en producción, de forma intermitente, y que era imposible de replicar en mi entorno local, supe que había algo fundamental que no estaba entendiendo del todo. Pasé horas, o mejor dicho, madrugadas enteras, persiguiendo un fantasma. Al final, el culpable era un efecto secundario inesperado: una función que modificaba un objeto global sin que nadie se diera cuenta, o una llamada a una API externa que fallaba solo bajo ciertas condiciones de red. Ahí empezó mi obsesión con las **funciones puras** y la gestión consciente de los **efectos secundarios**.

## ¿Qué es una función pura? (y por qué me enamoró)

Para mí, una función pura es la estrella del rock del código predecible. Simple:
1.  Siempre devuelve el mismo resultado para los mismos argumentos de entrada. No importa cuántas veces la llames con los mismos `(a, b)`, siempre dará `c`.
2.  No produce **efectos secundarios**. Esto significa que no modifica el estado de nada fuera de su ámbito, no hace peticiones a la base de datos, no imprime en consola, no escribe en un archivo. Nada.

Es como una máquina perfecta y aislada. Le das algo, te devuelve algo. Fin de la historia.

En mi experiencia, el valor de esto es brutal. Cuando debuggeo, si tengo una parte del código que sé que está construida con funciones puras, puedo descartar un montón de posibles causas. Sé que no hay sorpresas, no hay estados ocultos modificándose por ahí. Simplemente funciona o no funciona con sus inputs. Punto. Esto me ha salvado de muchas noches en vela.

## La pesadilla de los efectos secundarios (y cómo los abordo)

Un efecto secundario es cualquier cosa que una función hace más allá de devolver un valor. Leer o escribir en una base de datos, modificar una variable global, interactuar con el sistema de archivos, hacer una petición HTTP, o incluso simplemente imprimir algo en consola, son efectos secundarios.

No me malinterpretes, no digo que sean malos *per se*. Son inevitables en casi cualquier aplicación real. Necesitamos interactuar con el mundo exterior. Mi problema es cuando esos efectos secundarios son **ocultos**, **descontrolados** o **mezclados** sin orden en cada esquina del código. Ahí es donde empieza el caos.

Cuando los efectos secundarios están esparcidos por doquier, cada función se convierte en una caja negra impredecible. ¿Qué pasa si llamo a `procesar_datos()`? ¿Guardará algo en la BD? ¿Enviará un email? ¿Modificará mi lista de usuarios? La incertidumbre mata la confianza en el código.

Mi estrategia es sencilla: **aislarlos**. Intento que la mayor parte de mi lógica de negocio viva en funciones puras. Cálculos, transformaciones de datos, validaciones complejas... todo eso lo meto en funciones que solo reciben entradas y devuelven salidas.

Luego, los efectos secundarios, los agrupo y los separo explícitamente. Tendré funciones o módulos específicos para "interactuar con la base de datos", "enviar notificaciones", "llamar a la API de terceros". Así, cuando necesito un efecto secundario, sé exactamente dónde está y qué esperar. Esto, combinado con una buena [Inyección de Dependencias](/blog/inyeccion-de-dependencias-no-es-solo-un-patron-es-mi-salvavidas-y-por-que-deberias-adoptarlo/), me permite pasarle "módulos de efectos secundarios" (como un cliente de DB o un logger) a mis funciones de lógica, haciendo que la función en sí siga siendo casi pura, aunque su *dependencia* realice el efecto.

## Testear: de la tortura a la paz mental

Aquí es donde las funciones puras brillan con luz propia. Testearlas es una maravilla. ¿Quieres probar `sumar(a, b)`? Le pasas `(2, 3)` y esperas `5`. Siempre. No necesitas configurar una base de datos, no necesitas mocks complejos para dependencias externas. Es solo entrada y salida.

Contrastas esto con testear una función llena de efectos secundarios. De repente, necesitas un entorno de base de datos de prueba, simular respuestas de API, asegurarte de que los archivos no se sobrescriban. Es un dolor de cabeza constante y, francamente, por eso muchos tests de integración son lentos y frágiles.

Cuando el corazón de mi aplicación está hecho de funciones puras, mis tests unitarios son rápidos, fiables y me dan una confianza tremenda. Los efectos secundarios los testeo aparte, con tests de integración o end-to-end, pero sabiendo que la lógica interna ya está probada a fondo. Si me interesa saber cómo [testear IA](/blog/testear-ia-no-es-testear-una-rest-api-mis-batallas-y-la-receta-que-funciona/), la misma filosofía aplica: separa la lógica de los side effects.

## ¿Cuándo romper la pureza? (La vida real no es perfecta)

Soy pragmático. Sé que no puedo vivir en un mundo de puras funciones matemáticas. En algún momento, algo tiene que cambiar el estado del mundo. Leer la entrada de un usuario, escribir en una base de datos, generar un UUID... son intrínsecamente impuros.

Mi regla de oro es: **minimizar y contener**. Si una función *necesita* un efecto secundario, lo limito a esa función y lo hago lo más obvio posible. Evito que una función "pura" por fuera, esconda un efecto secundario por dentro. Si modifica algo global, lo documentaré a fuego o, mejor aún, lo haré explícito pasándolo como argumento o devolviéndolo. Me he encontrado muchas veces deseando que la inmutabilidad fuera el estándar por defecto, como ya he comentado en mi cruzada contra [el estado mutable](/blog/el-estado-mutable-me-da-migrana-mi-cruzada-por-la-inmutabilidad-en-el-codigo/).

Al final, se trata de una elección consciente. No de eliminar los efectos secundarios, sino de gestionarlos. De darles un lugar, de hacerlos visibles, de entender cuándo y cómo se producen. Así, cuando el código falle, sé dónde mirar primero. Y eso, creedme, vale oro a las 3 de la mañana.
