# T3: Sudoku con WebAssembly

Este proyecto implementa un solver de Sudoku 9x9 utilizando un algoritmo de backtracking en C, el cual es compilado a WebAssembly mediante Emscripten e integrado en una aplicación web con JavaScript.

## Instalación de Emscripten

``` bash
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
./emsdk install latest
./emsdk activate latest
source ./emsdk_env.sh
```

## Compilación con Emscripten

``` bash
emcc sudoku.c -o sudoku.js \
  -s EXPORTED_FUNCTIONS="['_set_cell','_get_cell','_solve','_validate_grid']" \
  -s EXPORTED_RUNTIME_METHODS="['cwrap']" \
  -s NO_EXIT_RUNTIME=1
```

## Cómo ejecutar el proyecto en local

``` bash
python3 -m http.server 8000
```

Abrir en navegador: http://127.0.0.1:8000/


## Funcionamiento

1.  Usuario ingresa valores
2.  JS carga datos en Wasm
3.  C resuelve Sudoku
4.  JS muestra resultado


## Fuente del código en C

El código en C fue obtenido de:

-   https://gist.github.com/mamins1376/2066828739627d15c112dd4ec582db46

Se mantuvo la implementación para resolver el problema, y se modificó la forma de entregar el tablero inicial, de forma que se evita la interacción del usuario por consola para adaptar mejor al navegador. Además, se definieron y exportaron las funciones solve(), get_cell() y set_cell() para su integración con el navegador.


## Uso de IA

Durante el desarrollo del proyecto se utilizó inteligencia artificial como herramienta de apoyo para facilitar distintas etapas del trabajo. Nos ayudó a:

-   Comprender el funcionamiento de WebAssembly y su integración con JavaScript, especialmente el uso de cwrap y el ciclo de inicialización del módulo.
-   Investigar cómo compilar código C utilizando Emscripten, incluyendo flags necesarios para exportar funciones y configurar correctamente el runtime.
-   Analizar y adaptar un solver de Sudoku en C basado en backtracking, identificando qué partes del código debían exponerse para su uso desde JavaScript.
-   Detectar posibles errores en la comunicación entre frontend y módulo Wasm, como problemas de inicialización o uso incorrecto de funciones exportadas.
-   Apoyar el desarrollo del frontend, incluyendo la lectura del tablero, validación de inputs y visualización de la solución.
-   Sugerir mejoras del proyecto.

Es importante destacar que todas las sugerencias fueron revisadas y ajustadas manualmente, asegurando que el funcionamiento final del sistema fuera comprendido y validado.


## Autoevaluación

La IA nos permitió avanzar de forma más rápida en aspectos técnicos complejos, particularmente en la integración entre C, WebAssembly y JavaScript. Sin embargo, su uso también presentó desafíos que requirieron una revisión constante.

En cuanto al desarrollo del trabajo, aprendimos a utilizar estas herramientras nuevas como Emscripten que no conociamos. La IA fue de gran ayuda para ello. Al principio no entendiamos muy bien la configuración de Emscripten y la exportación de funciones desde C pero luego ya entre IA y buscar por internet ya aprendimos y evitamos cometer ciertos errores. A modo de crítica pudimos haber invertido más tiempo en leer la documentación de forma más minuciosa sobre Emscripten con tal de conocerlo más a fondo y ver de que es capaz al completo.
