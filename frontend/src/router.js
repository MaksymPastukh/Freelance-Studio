export class Router {
  constructor() {
    this.initEvent()

    // Набор страниц со свойствами
    this.routes = [{
      route: '/'
    }]
  }

  initEvent() {
    // Добавляем событие на загрузку контента при открытии страницы
    window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this))
    // Добавляем событие на отлов изменения url при переходе на другою страницу
    window.addEventListener('popstate', this.activateRoute.bind(this) )
  }

  activateRoute() {

  }
}

