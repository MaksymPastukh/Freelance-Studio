import {Dashboard} from "./components/dashboard.js";
import {NotPageFound} from "./components/404.js";
import {Login} from "./components/login.js";
import {SignUp} from "./components/sign-up.js";

export class Router {
  constructor() {
    // Получаем элементы
    this.titilePageElement = document.getElementById('title')
    this.contentPageElement = document.getElementById('content')
    this.adminlteStyleElement = document.getElementById('adminlte_style')


    this.initEvent()

    // Набор страниц со свойствами
    this.routes = [
      {
        route: '/',
        title: 'Dashboard',
        filePathTemplate: '/templates/dashboard.html',
        useLayout: '/templates/layout.html',
        load: () => {
          new Dashboard()
        }
      },
      {
        route: '/404',
        title: 'No page found',
        filePathTemplate: '/templates/404.html',
        useLayout: false,
        load: () => {
          new NotPageFound()
        }
      },
      {
        route: '/login',
        title: 'Login',
        filePathTemplate: '/templates/login.html',
        useLayout: false,
        load: () => {
          document.body.classList.add('login-page')
          new Login()
        },
        unload: () => {
          document.body.classList.remove('login-page')
        },
        styles: ['icheck-bootstrap.min.css']
      },
      {
        route: '/sign-up',
        title: 'Sign In',
        filePathTemplate: '/templates/sign-up.html',
        useLayout: false,
        load: () => {
          document.body.classList.add('register-page')
          new SignUp()
        },
        unload: () => {
          document.body.classList.remove('register-page')
        },
        styles: ['icheck-bootstrap.min.css']
      },
    ]
  }

  initEvent() {
    // Добавляем событие на загрузку контента при открытии страницы
    window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this))
    // Добавляем событие на отлов изменения url при переходе на другою страницу
    window.addEventListener('popstate', this.activateRoute.bind(this))
    document.addEventListener('click', this.openNewRoute.bind(this))

  }

  async openNewRoute(e) {
    let element = null
    if (e.target.nodeName === 'A') {
      element = e.target
    } else if (e.target.parentNode.nodeName === 'A') {
      element = e.target.parentNode
    }

    if (element) {
      e.preventDefault()

      const url = element.href.replace(window.location.origin, '')
      if (!url || url === '/#' || url.startsWith('javascript:void(0)')) {
        return
      }

      const currentRoute = window.location.pathname
      history.pushState({}, '', url)
      await this.activateRoute(null, currentRoute)
    }
  }


  async activateRoute(e, oldRoute = null) {
    // Проверка на предыдущую страницу
    if(oldRoute) {
      // Находим значения страницы с которой мы уходим
      const currentRoute = this.routes.find(item => item.route === oldRoute)
        // Очищаем не нужные свойства

      if (currentRoute.styles && currentRoute.styles.length > 0) {
        currentRoute.styles.forEach(style => {
          document.querySelector(`link[href='/css/${style}']`).remove()
        })
      }

      //Делаем проверку на то что в newRoute есть функция .unload и newRoute.unload есть function. Подгружаем функционал на страницу на которой мы находимся
      if (currentRoute.unload && typeof currentRoute.load === 'function') {
        // Вызываем функцию load
        currentRoute.unload()
      }


    }

    // Определяем url какой открыл пользователь
    const urlRoute = window.location.pathname
    // Находим нужный роут
    const newRoute = this.routes.find(item => item.route === urlRoute)

    // Проверяем если newRoute существует то мы делаем одно действие
    // Если в newRoute пусто то мы перенаправляем на страницу 404
    if (newRoute) {
      // Проверяем если newRoute.styles есть данные, то мы обрабатываем эти данные в цикле и добавляем на страницу
      if (newRoute.styles && newRoute.styles.length > 0) {
        newRoute.styles.forEach(style => {
          const link = document.createElement('link')
          link.rel = 'stylesheet'
          link.href = '/css/' + style
          // Добавляем стили в head
          document.head.insertBefore(link, this.adminlteStyleElement)
        })
      }


      // Делаем проверку на то что в newRoute есть данные title и выполняем действия
      if (newRoute.title) {
        // Присваиваем название страницы в title. В зависимости от той страницы на которой мы находимся
        this.titilePageElement.innerText = `${newRoute.title} | Freelance Studio`
      }
      //Делаем проверку на то что в newRoute есть данные filePathTemplate. Подгружаем контент на страницу на которой мы находимся
      if (newRoute.filePathTemplate) {


        // Переменная в которой храним значения контейнера
        let contentBlock = this.contentPageElement

        // Проверяем есть ли у нашей страницы использование layout
        if (newRoute.useLayout) {
          // Если же layout существует то мы должны отрендерить layout а уже в layout вставить остальной контент
          // Отрисовка Layout
          this.contentPageElement.innerHTML = await fetch(newRoute.useLayout)
            .then(response => response.text())
          // Меняем контейнер для получения элементов при наличии layout
          contentBlock = document.getElementById('content-layout')
          // Добавляем классы к body для адаптации сайт-бара
          document.body.classList.add('sidebar-mini')
          document.body.classList.add('layout-fixed')
        } else {
          // Удаляем классы к body если на странице нету layout
          document.body.classList.remove('sidebar-mini')
          document.body.classList.remove('layout-fixed')
        }
        // Если layout нету то мы вставляем на страницу контент без layout
        // Присваиваем полученный контент.
        contentBlock.innerHTML = await fetch(newRoute.filePathTemplate)
          .then(response => response.text())
      }
      //Делаем проверку на то что в newRoute есть функция .load и newRoute.load есть function. Подгружаем функционал на страницу на которой мы находимся
      if (newRoute.load && typeof newRoute.load === 'function') {
        // Вызываем функцию load
        newRoute.load()
      }

    } else {
      history.pushState({}, '', '/404')
      await this.activateRoute()
    }
  }
}

