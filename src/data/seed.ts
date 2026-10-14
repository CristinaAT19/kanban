import type { BoardState, Subtask, Task } from '../types'

function subtasks(taskId: string, items: [title: string, done: boolean][]): Subtask[] {
  return items.map(([title, done], i) => ({ id: `${taskId}-s${i + 1}`, title, done }))
}

const tasks: Task[] = [
  {
    id: 'TRA-14',
    title: 'Definir paleta y tipografías del sitio',
    description: 'Proponer dos alternativas de color y una pareja tipográfica para titulares y texto.',
    status: 'todo',
    priority: 'high',
    tag: 'design',
    due: '2026-10-18',
    subtasks: subtasks('TRA-14', [
      ['Revisar referencias visuales', true],
      ['Proponer la paleta de color', false],
      ['Elegir las tipografías', false],
      ['Comprobar el contraste', false],
    ]),
  },
  {
    id: 'TRA-15',
    title: 'Redactar los textos de la página de inicio',
    description: '',
    status: 'todo',
    priority: 'medium',
    tag: 'content',
    due: '2026-10-21',
    subtasks: [],
  },
  {
    id: 'TRA-17',
    title: 'Configurar el formulario de contacto',
    description: '',
    status: 'todo',
    priority: 'low',
    tag: 'dev',
    due: '2026-10-24',
    subtasks: subtasks('TRA-17', [
      ['Maquetar los campos', false],
      ['Validar los datos', false],
      ['Enviar el correo de confirmación', false],
    ]),
  },
  {
    id: 'TRA-11',
    title: 'Maquetar la cabecera y la navegación responsive',
    description:
      'La cabecera debe colapsar en un menú desplegable por debajo de 768 px y poder recorrerse con el teclado.',
    status: 'doing',
    priority: 'high',
    tag: 'dev',
    due: '2026-10-16',
    subtasks: subtasks('TRA-11', [
      ['Estructura HTML semántica', true],
      ['Estilos de escritorio', true],
      ['Menú desplegable en móvil', true],
      ['Navegación con teclado', false],
      ['Probar en distintos navegadores', false],
    ]),
  },
  {
    id: 'TRA-12',
    title: 'Ilustraciones para la sección de servicios',
    description: '',
    status: 'doing',
    priority: 'medium',
    tag: 'design',
    due: '2026-10-17',
    subtasks: [],
  },
  {
    id: 'TRA-09',
    title: 'El menú móvil no se cierra al navegar',
    description: '',
    status: 'review',
    priority: 'high',
    tag: 'bug',
    due: '2026-10-14',
    subtasks: [],
  },
  {
    id: 'TRA-08',
    title: 'Optimizar las imágenes de la galería',
    description: '',
    status: 'review',
    priority: 'medium',
    tag: 'dev',
    due: '2026-10-15',
    subtasks: subtasks('TRA-08', [
      ['Convertir las imágenes a WebP', true],
      ['Añadir carga diferida', true],
    ]),
  },
  {
    id: 'TRA-03',
    title: 'Wireframes de las páginas principales',
    description: '',
    status: 'done',
    priority: 'high',
    tag: 'design',
    due: null,
    subtasks: subtasks('TRA-03', [
      ['Inicio', true],
      ['Servicios', true],
      ['Galería', true],
      ['Contacto', true],
    ]),
  },
  {
    id: 'TRA-05',
    title: 'Inicializar el proyecto y el repositorio',
    description: '',
    status: 'done',
    priority: 'low',
    tag: 'dev',
    due: null,
    subtasks: [],
  },
]

export function createSeed(): BoardState {
  const state: BoardState = {
    tasks: {},
    columns: { todo: [], doing: [], review: [], done: [] },
    nextNumber: 18,
  }
  for (const task of tasks) {
    state.tasks[task.id] = structuredClone(task)
    state.columns[task.status].push(task.id)
  }
  return state
}
